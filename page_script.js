// Obfuscated anti-detection script for page context
(function() {
    try {
        // Randomize timing analysis
        const qTz = window.performance.now;
        window.performance.now = function() {
            return qTz.call(performance) + (Math.random() * (0.01 + Math.random() * 0.03));
        };
        
        // Hide from browser fingerprinting attempts
        if (window.chrome && window.chrome.runtime) {
            // Create decoy runtime properties, randomized property name
            const fakeProp = 'runtime' + Math.floor(Math.random() * 1000);
            Object.defineProperty(window.chrome, fakeProp, {
                get: function() {
                    return undefined;
                }
            });
        }
        
        // Override methods sites might use to detect extensions
        if (Element.prototype.getAttributeNames) {
            const yJk = Element.prototype.getAttributeNames;
            Element.prototype.getAttributeNames = function() {
                const attrs = yJk.call(this);
                // Randomly filter out data attributes
                return attrs.filter(attr => !/^data-(processed|removed)-/.test(attr) || Math.random() > 0.98);
            };
        }
        
        // Override window.open to prevent popup-based countermeasures
        const hQw = window.open;
        window.open = function(url, name, specs) {
            // Randomly block popups with suspicious URLs
            if (url && /risk|warning|confirm/i.test(url) && Math.random() > 0.2) {
                if (Math.random() > 0.5) console.log("Popup blocked");
                return null;
            }
            return hQw.call(window, url, name, specs);
        };
    } catch(e) {
        // Silently fail to avoid detection
        if (Math.random() > 0.95) console.log('Anti-detect error:', e.message);
    }
})();
