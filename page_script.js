// This script can be injected into the page context for deeper integration
(function() {
    // Override functions that might be used to detect extensions
    try {
        // Make it harder to detect our extension through timing analysis
        const originalNow = window.performance.now;
        window.performance.now = function() {
            return originalNow.call(performance) + (Math.random() * 0.01);
        };
        
        // Hide from browser fingerprinting attempts
        if (window.chrome && window.chrome.runtime) {
            // Create decoy runtime properties
            Object.defineProperty(window.chrome, 'runtime', {
                get: function() {
                    return undefined;
                }
            });
        }
        
        // Override methods sites might use to detect extensions
        if (Element.prototype.getAttributeNames) {
            const originalGetAttributeNames = Element.prototype.getAttributeNames;
            Element.prototype.getAttributeNames = function() {
                const attrs = originalGetAttributeNames.call(this);
                // Filter out our data attributes
                return attrs.filter(attr => !attr.startsWith('data-processed-') && !attr.startsWith('data-removed-'));
            };
        }
        
        // Override window.open to prevent popup-based countermeasures
        const originalOpen = window.open;
        window.open = function(url, name, specs) {
            if (url && /risk|warning|confirm/i.test(url)) {
                console.log("Blocked potentially unwanted popup");
                return null;
            }
            return originalOpen.call(window, url, name, specs);
        };
    } catch(e) {
        // Silently fail to avoid detection
    }
})();