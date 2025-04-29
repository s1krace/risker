// Use a more sophisticated background script to handle anti-detection
(function() {
    // Define a function to inject a script directly into the page context
    function ZxV(tId) {
        // Random delay before attempting injection
        setTimeout(() => {
            chrome.scripting.executeScript({
                target: {tabId: tId, allFrames: true},
                files: ['page_script.js'],
                world: 'MAIN'
            }).catch((err) => {
                // Randomly decide whether to log only unexpected errors
                if (Math.random() > 0.7 && err && err.message && !err.message.includes('Frame with ID 0 was removed') && !err.message.includes('No tab with id')) {
                    console.error('Script injection error:', err.message.slice(0, 30));
                }
                // Otherwise, silently ignore
            });
        }, Math.floor(Math.random() * 120) + 30);
    }

    // Listen for tab navigation to supported sites
    chrome.tabs.onUpdated.addListener((tId, cI, t) => {
        if (cI.status === 'complete' && t.url) {
            const sD = [
                'cnfans.com', '2024.cnfans.com', 'mulebuy.com',
                'orientdig.com',
                'oopbuy.com', 'hoobuy.com'
            ].sort(() => Math.random() - 0.5);
            
            // Check if the URL matches any supported domain
            const m = sD.some(d => t.url.includes(d));
            if (m) ZxV(tId);
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
