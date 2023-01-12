/**
 * Show a green icon when the current page is in the OA dataset or has an author manuscript available for NLP
 */

// watch for any href changes
// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
let oldHref = '';

window.onload = function () {
    // set the icon state
    // getMessage({ message: 'get', payload: ['ext_toggle'] })
    //     .then(([ext_toggle]) => {
    //         return getMessage({ message: 'icon', payload: ext_toggle != 'off' })
    //     });

    const citationElement = document.querySelector(".fm-citation");
    const authorManuscript = citationElement && citationElement.innerText.includes('Author manuscript; available in PMC');
    const urlParts = document.location.href.split('/');
    const pmcid = urlParts[urlParts.length - 1] != '' ? urlParts[urlParts.length - 1] : urlParts[urlParts.length - 2];
    console.log('pmcid', pmcid)

    chrome.runtime.sendMessage({message: 'oa', author: authorManuscript, payload: pmcid});
};
