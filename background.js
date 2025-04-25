chrome.action.onClicked.addListener(function(tab) {
    const scriptOptions = {
        target: { tabId: tab.id },
        files: ['popup.js']
    };
    chrome.scripting.executeScript(scriptOptions);
});