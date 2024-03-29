const BASE_URL = 'https://api.hypothes.is/api';

const styles = `
#civic-nli-insert {
    width: 100%;
    height: fit-content;
    border: 1px solid #f0f0f0;
    max-width: 800px;
    margin-bottom: 20px;
    font-size: 12px;
}

*::-webkit-scrollbar-thumb {
    border-radius: 20px;
}

#civic-nli-insert h3 {
    padding: 4px 8px;
    background-color: #fafafa;
    font-size: inherit;
}

#civic-nli-insert h4 {
    font-weight: 600;
}

#civic-nli-insert > .content {
    padding-left: 5px;
    width: 100%;
    height: fit-content(200px);
    max-height: 200px;
    overflow-y: scroll;
}

#civic-nli-insert li {
    display: inline-block;
    margin-bottom: 0.5em;
    margin-top: 0;
}

#civic-nli-insert blockquote {
    border-left: 2px solid #ccc;
    margin-left: 2rem;
    padding: 0.5em 10px;
    padding-bottom: 0;
    max-width: 700px;
    margin-bottom: 0;
}

#civic-nli-insert blockquote span.connector {
    color: #ccc;
}

#civic-nli-insert blockquote:before {
    color: #ccc;
    content: '\\201C';
    font-family: serif;
    font-size: 4em;
    line-height: 0.1rem;
    margin-right: 0.25rem;
    vertical-align: -1rem;
}

#civic-nli-insert blockquote p {
    display: inline;
}

#civic-nli-insert .blockquote-author {
    color: #8e8e8e;
    font-size: x-small;
    text-align: right;
}

#civic-nli-insert .annotation__header {
    display: flex;
}

#civic-nli-insert .annotation__source {
    font-size: x-small;
    float: right;
    margin-top: 5px;
}

#civic-nli-insert .tooltip {
    position: relative;
    display: inline-block;
    opacity: 1;
}

/* Tooltip text */
#civic-nli-insert .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
#civic-nli-insert .tooltip:hover .tooltiptext {
    visibility: visible;
}
`;

const parseEvidenceId = () => {
    const url = document.location.href;
    const match = /.*\/evidence\/(\d+)\b.*/.exec(url);
    return match ? match[1] : '';
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



    return `<li class="annotation">
            <div class="annotation__header">
                ${exampleTitle}
            </div>
            <blockquote>
                ${annotation['text'].join(' <span class="connector"> [...] </span> ')}
            </blockquote>
            <a class="annotation__source" target="_blank" rel="noopener" href="${annotation.sourceUri}">${annotation.sourceUri.replace(/\/\s*$/, '')}</a>
        </li>`;
};


// is search page
// const html = chrome.runtime.getURL("insert.html");
const css = chrome.runtime.getURL("insert.css");


const getMessage = (msg) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(msg, (response) => {
            resolve(response);
        });
    });
}

const setPageContent = async () => {

    const [ext_toggle] = await getMessage({ message: 'get', payload: ['ext_toggle'] });


    if (ext_toggle == 'off') {
        const wrapper = document.querySelector('#civic-nli-wrapper');
        if (wrapper) {
            wrapper.remove();
        }
        return false;
    }
    const evidenceId = parseEvidenceId();

    if (!evidenceId) {
        return false;
    }
    const parentElement = document.querySelector('cvc-evidence-summary');
    const response = await getMessage({ evidenceId });

    if (!response || !response.length) {
        console.warn('CIViC-NLI ext: Did not set insert. Missing hypothesis response data');
        return false;
    }
    if (!parentElement) {
        console.warn('CIViC-NLI ext: Did not set insert. Missing parent element');
        return false;
    }
    const node = document.querySelector('#civic-nli-wrapper');
    if (node == null) {
        parentElement.insertAdjacentHTML('afterbegin',
            `<div id="civic-nli-wrapper"></div>`
        );
    }
    document.querySelector('#civic-nli-wrapper').innerHTML = (
        `<style>
    ${styles}
</style>
<div id="civic-nli-insert">
    <h3>Select Source Quotations/Annotations</h3>
    <div class="content"></div>
</div>`);

    [
        ['Main Annotation Examples', (ann) => (ann.exampleId !== 'statement' && ann.status !== 'NEI'), 'These represent selected quotes from the paper which should be sufficient evidence for the core civic elements (disease, drug, gene, variant, significance). These selections should be sufficient to judge the paper does indeed say what is stated in the civic core elements. '],
        ['Statement Context', (ann) => (ann.exampleId === 'statement'), 'These selected quotes are any useful content that that is necessary to support the evidence summary text description that is not necessary in covering the core elements'],
        ['NEI Annotations', (ann) => (ann.exampleId !== 'statement' && ann.status === 'NEI'), 'These examples are considered to be insufficient to support the core elements of the civic evidence item either because they are missing information, are not specific enough, or they are unrelated to the current evidence item']
    ].forEach(([title, filterFunc, description]) => {
        const content = [];
        response.filter(filterFunc).forEach((annotation) => {
            content.push(annotationExampleElement(annotation))
        });
        if (content.length) {
            document.querySelector('#civic-nli-insert > .content').insertAdjacentHTML('beforeend',
                `<h4>${title}</h4>
                <p>${description}</p>
                <div class='examples'>${content.join('')}</div>`
            );
        }
    });
    return true;
}

// watch for any href changes
// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
let oldHref = '';

window.onload = function () {
    // set the icon state
    getMessage({ message: 'get', payload: ['ext_toggle'] })
        .then(([ext_toggle]) => {
            return getMessage({ message: 'icon', payload: ext_toggle != 'off' })
        });

    const bodyList = document.querySelector("body");
    setPageContent()

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {

                /* Changed ! your code here */
                setPageContent().then((result) => {
                    if (result) {
                        oldHref = document.location.href;
                    }
                })
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
};


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == 'reload') {
            setPageContent()
        }
        return true;
    }
);
