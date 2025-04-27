// Use a more sophisticated background script to handle anti-detection
(function() {
    // Define a function to inject a script directly into the page context
    function injectPageScript(tabId) {
        chrome.scripting.executeScript({
            target: {tabId: tabId, allFrames: true},
            files: ['page_script.js'],
            world: 'MAIN' // This runs the script in the page context
        }).catch(() => {
            // Silent error handling
        });
    }

    // Listen for tab navigation to supported sites
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url) {
            const supportedDomains = [
                'cnfans.com', '2024.cnfans.com', 'mulebuy.com', 
                'joyabuy.com', 'joyagoo.com', 'orientdig.com', 
                'oopbuy.com', 'hoobuy.com'
            ];
            
            // Check if the URL matches any supported domain
            const matches = supportedDomains.some(domain => 
                tab.url.includes(domain)
            );
            
            if (matches) {
                // Only inject if we're on a supported site
                injectPageScript(tabId);
            }
        }
    });

    // Handle extension clicking
    chrome.action.onClicked.addListener(function(tab) {
        const scriptOptions = {
            target: { tabId: tab.id },
            files: ['popup.js']
        };
        chrome.scripting.executeScript(scriptOptions)
            .catch(() => {
                // Silent error handling
            });
    });
})();
