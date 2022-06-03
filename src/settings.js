
const updateTextEvent = (event) => {
    const id = event.target.id;
    const value = document.querySelector(`#${id}`).value;
    chrome.runtime.sendMessage(
        { message: 'set', payload: { [id]: value } },
    )
};

const triggerReload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'reload' });
    });
};

document.querySelector('#hyp_key').addEventListener('input', updateTextEvent);
document.querySelector('#hyp_group').addEventListener('input', updateTextEvent);
document.querySelector('#ext_toggle').addEventListener('input', (event) => {
    const id = event.target.id;
    const value = document.querySelector(`#${id}`).checked;
    chrome.runtime.sendMessage(
        { message: 'set', payload: { 'ext_toggle': value ? 'on' : 'off' } },
        triggerReload
    );
    chrome.runtime.sendMessage(
        { message: 'icon', payload: value },
    );
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ message: 'get', payload: ['hyp_key', 'hyp_group', 'ext_toggle'] },
        ([hyp_key, hyp_group, ext_toggle]) => {
            chrome.runtime.sendMessage(`DOMContentLoaded ${[hyp_key, hyp_group, ext_toggle]}`);
            if (hyp_key) {
                document.querySelector('#hyp_key').value = hyp_key;
            }
            if (hyp_group) {
                document.querySelector('#hyp_group').value = hyp_group;
            }
            const checked = ext_toggle !== 'off';
            document.querySelector('#ext_toggle').checked = checked;
        });
});
