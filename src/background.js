try {
  importScripts('/pass.js');
} catch (e) {
  console.error(e);
}

const BASE_URL = 'https://api.hypothes.is/api/search';


const parseExample = (tagName) => {
  const match = /.*(\b|-)ex:?(\d+)(\b|-).*/i.exec(tagName);
  if (match) {
    return match[2];
  }
  if (tagName.toLowerCase().includes('-statement')) {
    return 'statement';
  }
  return '1';
};


const parseEvidenceId = (tagName) => {
  const match = /.*(\b|-)eid:?(\d+)(\b|-).*/i.exec(tagName);
  if (match) {
    return match[2];
  }
  return null;
};


const parseStatus = (tagName) => {
  if (tagName.toLowerCase().includes('status:nei')) {
    return 'NEI';
  }
  return 'default';
};


const parseSelectedText = (annotation) => {
  console.log('parseSelectedText', annotation)
  let pos;
  let text;
  for (const target of annotation['target'] || []) {
    for (const selector of target['selector'] || []) {
      if (selector.type === "TextQuoteSelector") {
        text = selector['exact'];
      } else if (selector.type == "TextPositionSelector") {
        pos = selector['start'];
      }
    }
  }
  return { pos, text };
};


/**
 *
 * If the start of a line in the comment describes a specific tag or set of tags it should be applied to then
 * this is parsed to split these comments by the tags otherwise the comment is added to all tags
 */
const parseCommentsByTags = (annotation) => {
  const commentText = annotation['text'] || '';
  const result = { 'NEI': [] };

  for (const line of commentText.split('\n')) {
    if (line.trim() !== '') {
      const match = /^(eid:?(\d+))?-?(status:)?NEI(:| - )(.*)/i.exec(line.trim());
      if (match) {
        const [, , eid, , , comment] = match;
        if (eid) {
          // evidence specific
          if (result[eid] === undefined) {
            result[eid] = [];
          }
          result[eid].push(comment)
        } else {
          result.NEI.push(comment)
        }
      }
    }
  }
  return result;
};


const groupAnnotations = (annotations) => {
  const selections = [];

  for (const annotation of annotations) {
    const comments = parseCommentsByTags(annotation);
    const match = /^acct:(.*)@hypothes.is$/.exec(annotation['user'])
    for (const tag of annotation['tags']) {
      const evidenceId = parseEvidenceId(tag);
      if (!evidenceId) {
        continue;
      }
      const { pos, text } = parseSelectedText(annotation);
      const status = parseStatus(tag);

      selections.push({
        evidenceId,
        user: match[1],
        exampleId: parseExample(tag),
        status,
        text,
        pos,
        sourceUri: annotation['uri'],
        comments: [
          ...(comments[evidenceId] || []),
          ...(comments[status] || [])
        ]
      });
    }
  }

  const grouped = {};

  selections.sort((s1, s2) => (s1['pos'] - s2['pos'])).forEach(({
    evidenceId, user, exampleId, status, text, sourceUri, comments
  }) => {
    const key = JSON.stringify({ evidenceId, user, exampleId, status });
    if (grouped[key] === undefined) {
      grouped[key] = { evidenceId, user, exampleId, status, text: [], sourceUri, comments: [] };
    }
    grouped[key].text.push(text);
    grouped[key].comments.push(...comments);
  });
  return Object.values(grouped);
};



const pageFetchAnnotations = async (tag) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${API_KEY}`);
  const url = new URL(BASE_URL);
  let total = null;
  const result = [];
  while (total === null || result.length < total) {
    const params = { group: GROUP_ID, tag, limit: 200, offset: result.length };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const opt = { method: 'GET', headers: headers, mode: 'cors' };
    const resp = await fetch(url, opt);
    const content = await resp.json();
    result.push(...content.rows);
    if (total === null) {
      total = content['total'];
    }
  }
  return result;
}



const fetchAnnotationsById = async (evidenceId) => {
  const annotationsById = {};
  for (const tagPrefix of ['eid', 'eid:']) {
    const rows = await pageFetchAnnotations(`${tagPrefix}${evidenceId}`);
    rows.forEach((row) => {
      annotationsById[row['id']] = row;
    })
  }
  return groupAnnotations(Object.values(annotationsById)).filter(a => a.evidenceId == evidenceId);
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.evidenceId) {
      fetchAnnotationsById(request.evidenceId).then(sendResponse);
      return true;
    }
  }
);
