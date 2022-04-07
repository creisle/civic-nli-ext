const origin = 'http://127.0.0.1:8000';
const BASE_URL = 'https://api.hypothes.is/api';

const DEFAULT_DELAY = 2500;
console.log('logger attached', { DEFAULT_DELAY, origin });

const parseEvidenceId = () => {
    const url = window.location.href;
    const match = /.*\/evidence\/(\d+)\/.*/.exec(url);
    return match[1];
};

const collapsibleElement = (label, innerHTML) => {
    return `<div class="wrap-collabsible">
        <input id="collapsible" class="toggle" type="checkbox">
            <label for="collapsible" class="lbl-toggle">${label}</label>
            <div class="collapsible-content">
                <div class="content-inner">
                    ${innerHTML}
                </div>
            </div>
        </div>`;
};


const annotationExampleElement = (annotation) => {
    let nliComment = (annotation.comments || []).map(comment => ` ${comment} `).join(' ')
    if (nliComment) {
        nliComment = `<div class="tooltip"> 💬 <div class="tooltiptext">${nliComment}</div></div>`;
    }
    const exampleTitle = annotation.exampleId === 'statement'
        ? ''
        : `<p>
            <em>Example:</em>
            ${annotation.status === 'NEI' ? '(NEI)' : ''}
            <span class="blockquote-author">${annotation.user} ex:${annotation.exampleId} </span>
            ${nliComment}
            </p>`;



    return  `<li class="annotation">
            <div class="annotation__header">
                ${exampleTitle}
            </div>
            <blockquote>
                ${annotation['text'].join(' <span class="connector"> [...] </span> ')}
            </blockquote>
            <a class="annotation__source" target="_blank" rel="noopener" href="${annotation.sourceUri}">${annotation.sourceUri.replace(/\/\s*$/, '')}</a>
        </li>`;
};


const waitForElm = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};


const evidenceId = parseEvidenceId();

// is search page
// const html = chrome.runtime.getURL("insert.html");
const css = chrome.runtime.getURL("insert.css");

waitForElm('evidence-summary').then((element) => {
    element.insertAdjacentHTML('afterbegin',
        `
    <link rel="stylesheet" href="${css}">
    <div id="civic-nli-insert">
    </div>
    `
    );


    // alert(`parsed evidence id ${evidenceId}`);
    console.log('sending message to background.js', { evidenceId })
    chrome.runtime.sendMessage({ evidenceId }, (response) => {
        console.log(response);
        [
            ['NLI Annotations', (ann) => (ann.exampleId !== 'statement' && ann.status !== 'NEI')],
            ['Statement Context', (ann) => (ann.exampleId === 'statement')],
        ].forEach(([title, filterFunc]) => {
            const content = [];
            response.filter(filterFunc).forEach((annotation) => {
                content.push(annotationExampleElement(annotation))
            });
            if (content.length) {
                document.querySelector('#civic-nli-insert').insertAdjacentHTML('beforeend',
                    `<h3>${title}</h3>` + content.join('')
                );
            }
        });
        // add the NEI collabsible block
        const content = [];
        response.filter((ann) => (ann.exampleId !== 'statement' && ann.status === 'NEI')).forEach((annotation) => {
            content.push(annotationExampleElement(annotation))
        });
        if (content.length) {
            document.querySelector('#civic-nli-insert').insertAdjacentHTML('beforeend',
                collapsibleElement(
                    'Show NEI annotations',
                    '<p>Examples that are labelled not enough information (NEI). These examples are insufficient to support the linked evidence statement alone either because they do not cover all the core elements, are not specific enough, or are unrelated</p>' + content.join('')
                )
            );
        }
    });
});
