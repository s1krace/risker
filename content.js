// =========================
// Content Script Main Entry
// =========================
(function () {
    // === ADVANCED OBFUSCATION UTILS ===
    function randName(len=8) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let out = '';
        for (let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
        return out + Math.floor(Math.random()*10000);
    }
    function b64d(s) { return atob(s); }
    function dynFunc(args, body) { return new Function(args, body); }
    const instanceId = Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4) + Date.now().toString(36).slice(-4);

    // =========================
    // 1. Utility Functions
    // =========================
    // === RUNTIME-GENERATED UTILS ===
    const domUtils = {
        // Remove element from DOM with randomized style hiding
        rmv: function(el) {
            if (!el) return;
            try {
                const styles = [
                    ['display', 'none'],
                    ['visibility', 'hidden'],
                    ['opacity', '0'],
                    ['pointerEvents', 'none']
                ].sort(() => Math.random() - 0.5);
                styles.forEach(([prop, val]) => el.style[prop] = val);
                setTimeout(() => {
                    try { el.remove(); } catch(e) { /* silent fail */ }
                }, 50 + Math.floor(Math.random() * 200));
            } catch(e) { /* silent fail */ }
        },
        // Notification utility with fixed top-centered layout
        notify: function(msg) {
            try {
                // Create notification container
                const n = document.createElement("div");
                n.id = "ntf-" + Math.random().toString(36).substring(2, 8) + '-' + Date.now().toString(36).slice(-3);
                // Load Google Font Cal Sans if needed
                if (!document.getElementById('cal-sans-font')) {
                    const link = document.createElement('link');
                    link.id = 'cal-sans-font';
                    link.rel = 'stylesheet';
                    link.href = 'https://fonts.googleapis.com/css2?family=Cal+Sans:wght@400;700&display=swap';
                    document.head.appendChild(link);
                }
                // Apply notification styles
                Object.assign(n.style, {
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxWidth: "400px",
                    padding: "20px 30px",
                    backgroundColor: "#e0e0e0",
                    color: "#000",
                    border: "1px solid #000",
                    fontFamily: "'Cal Sans', sans-serif",
                    fontSize: "18px",
                    textAlign: "center",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                    opacity: "1",
                    transition: "opacity 0.5s ease-out",
                    zIndex: "999999"
                });
                n.textContent = msg;
                document.body.appendChild(n);
                // Fade out after 2s and remove
                setTimeout(() => {
                    n.style.opacity = "0";
                }, 2000);
                // Ensure removal after fade
                setTimeout(() => {
                    if (n.parentNode) n.parentNode.removeChild(n);
                }, 2500);
            } catch(e) { /* silent fail */ }
        },
        // URL cleaner utility
        urlClean: function(url) {
            try {
                const urlObj = new URL(url);
                const paramsToRemove = ['ref', 'inviteCode', 'share_code', 'affiliate', 'trk', 'utm_source', 'utm_medium'];
                paramsToRemove.sort(() => Math.random() - 0.5).forEach(param => urlObj.searchParams.delete(param));
                return urlObj.toString();
            } catch(e) {
                return url;
            }
        }
    };

    /**
     * Finds elements that may represent risk overlays or popups.
     */
    // Slightly obfuscated, randomize selector order & regex
    function findRiskElements() {
        try {
            const results = [];
            const hostname = window.location.hostname;
            const textMatches = Array.from(document.querySelectorAll('div, section, aside'))
                .filter(el => {
                    try {
                        // Skip notification elements
                        if (el.id && el.id.startsWith('ntf-')) return false;
                        const text = el.innerText || '';
                        const riskWords = ['risk','warning','reminder','caution','alert','confirm','agreement'];
                        const rx = new RegExp(riskWords.sort(() => Math.random() - 0.5).join('|'),'i');
                        const hasRiskText = rx.test(text);
                        const isPopupStyle = (
                            window.getComputedStyle(el).position === 'fixed' || 
                            parseInt(window.getComputedStyle(el).zIndex) > 80 + Math.floor(Math.random()*60)
                        );
                        return hasRiskText && isPopupStyle && text.length < 900 + Math.floor(Math.random()*200);
                    } catch(e) {
                        return false;
                    }
                });
            results.push(...textMatches);
            // Randomize selector order and add noise
            // Obfuscated patterns and selectors
            const patterns = [
                ...['modal', 'popup', 'dialog', 'overlay', 'mask', 'drawer'].map(k => `[class*='${k}']`),
                ...['modal', 'popup', 'dialog'].map(k => `[id*='${k}']`),
                "[role='dialog']", "[aria-modal='true']"
            ];
            // Obfuscate selector string
            const selParts = ['el', 'overlay', 'n-modal-body-wrapper', 'risk-modal', 'ant-modal-root', 'modal', 'overlay', 'keywords-modal'];
            const siteMatches = Array.from(document.querySelectorAll(
                `.${selParts[0]}-${selParts[1]}, .${selParts[2]}, div.${selParts[3]}, .${selParts[4]}, div[class*='${selParts[5]}'] + div[class*='${selParts[6]}'], #${selParts[7]}`
            ));
            results.push(...siteMatches);
            if (/cnfans|joya|mule|orient|hoo|oop/i.test(hostname)) {
                const siteMatches = Array.from(document.querySelectorAll(
                    ".el-overlay, .n-modal-body-wrapper, div.risk-modal, .ant-modal-root, " +
                    "div[class*='modal'] + div[class*='overlay'], #keywords-modal"
                ));
                if (Math.random() > 0.2) {
                results.push(...siteMatches);
            }
            }
            return Array.from(new Set(results));
        } catch(e) {
            return [];
        }
    }

    /**
     * Cleans up links by restoring original hrefs if needed.
     */
    // Slightly obfuscated, randomize link selection
    function cleanLinks() {
        try {
            let linksCleaned = 0;
            const links = document.querySelectorAll("a[href]" + (Math.random() > 0.5 ? ":not([href*='javascript'])" : ""));
            links.forEach(link => {
                try {
                    if (!link.hasAttribute('data-processed-' + instanceId)) {
                        const originalHref = link.href;
                        const cleanedHref = domUtils.urlClean(originalHref);
                        if (cleanedHref !== originalHref) {
                            link.href = cleanedHref;
                            link.setAttribute('data-original-href', originalHref);
                            link.setAttribute('data-processed-' + instanceId, 'true');
                            linksCleaned++;
                        }
                    }
                } catch(e) { /* continue to next link */ }
            });
            if (linksCleaned > 0) {
                domUtils.notify("//: System: Sanitized " + linksCleaned + " links");
            }
            return linksCleaned;
        } catch(e) {
            return 0;
        }
    }
    
    /**
     * Cleans up the current page URL by removing certain query parameters.
     */
    // Slightly obfuscated, randomize param order
    function cleanPageURL() {
        try {
            const currentURL = window.location.href;
            const cleanedURL = domUtils.urlClean(currentURL);
            if (cleanedURL !== currentURL) {
                history.replaceState(null, document.title, cleanedURL);
                domUtils.notify("//: System: URL sanitized");
            }
        } catch(e) { /* silent fail */ }
    }
    
    /**
     * Enables and checks the 'agree' checkbox if present.
     */
    // Slightly obfuscated, randomize selector order
    function activateAgreeCheckbox() {
        try {
            const checkboxSelectors = [
                "input#agree.form-check-input", 
                "input[type='checkbox'][name*='agree']",
                "input[type='checkbox'][id*='agree']",
                "input[type='checkbox'][class*='agree']",
                "input[type='checkbox'][aria-label*='agree' i]",
                "input[type='checkbox'][disabled]"
            ];
            const enableCheckbox = () => {
                const checkboxes = document.querySelectorAll(checkboxSelectors.join(','));
                let activated = 0;
                checkboxes.forEach(checkbox => {
                    if (checkbox?.disabled) {
                        checkbox.disabled = false;
                        checkbox.checked = true;
                        activated++;
                    }
                });
                return activated;
            };
            const checkInterval = 400 + Math.floor(Math.random() * 200);
            const checkAttempts = 15 + Math.floor(Math.random() * 10);
            let attempts = 0;
            const interval = setInterval(() => {
                const activated = enableCheckbox();
                attempts++;
                if (activated > 0) {
                    domUtils.notify("//: System: Checkbox activated");
                }
                if (attempts >= checkAttempts) {
                    clearInterval(interval);
                }
            }, 400 + Math.floor(Math.random() * 200)); // Randomize interval
        } catch(e) { /* silent fail */ }
    }
    
    /**
     * Restores scrolling to the page if it was disabled by overlays.
     */
    // Slightly obfuscated, randomize property order
    function restoreScrolling() {
        try {
            const bodyStyle = document.body.style;
            const htmlStyle = document.documentElement.style;
            if (bodyStyle.overflow === 'hidden') {
                bodyStyle.overflow = 'auto';
            }
            if (htmlStyle.overflow === 'hidden') {
                htmlStyle.overflow = 'auto';
            }
            document.body.classList.forEach(cls => {
                if (cls.includes('overflow') || cls.includes('no-scroll')) {
                    document.body.classList.remove(cls);
                }
            });
        } catch(e) { /* silent fail */ }
    }
    
    /**
     * Injects CSS to hide overlays/popups stealthily.
     */
    // Slightly obfuscated, randomize selectors and rules
    function injectStealthCSS() {
        try {
            const styleId = 'stealth-style-' + instanceId;
            if (document.getElementById(styleId)) return;
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                [class*="risk"], [class*="modal"], [class*="popup"], [class*="overlay"], 
                [class*="dialog"], [id*="risk"], [id*="modal"], [id*="popup"], 
                [id*="overlay"], [id*="dialog"], [role="dialog"], [aria-modal="true"],
                .el-overlay, .n-modal-body-wrapper, .ant-modal-root, .ant-modal-mask,
                div[role="dialog"]:not([aria-label*="chat"]):not([aria-label*="menu"]) {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                html[style*="overflow: hidden"], body[style*="overflow: hidden"] {
                    overflow: auto !important;
                }
                div[class*="mask"], div[class*="backdrop"], div[class*="overlay"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
            `;
            const insertPosition = document.head.children.length > 0 ? 
                Math.floor(Math.random() * document.head.children.length) : 0;
            if (insertPosition === 0 || document.head.children.length === 0) {
                document.head.prepend(style);
            } else {
                document.head.children[insertPosition - 1].after(style);
            }
        } catch(e) { /* silent fail */ }
    }
    
    /**
     * Removes risk overlays/popups from the DOM.
     */
    function removeRiskElements() {
        try {
            const elements = findRiskElements();
            let removed = 0;
            elements.forEach(el => {
                if (!el.hasAttribute('data-removed-' + instanceId)) {
                    domUtils.rmv(el);
                    el.setAttribute('data-removed-' + instanceId, 'true');
                    removed++;
                }
            });
            if (removed > 0) {
                domUtils.notify("Risk removed by https://github.com/s1krace/risker");
                restoreScrolling();
            }
            return removed;
        } catch(e) {
            return 0;
        }
    }
    
    // =========================
    // 3. Observers and Event Listeners
    // =========================
    /**
     * Observes DOM changes to reactively remove overlays/popups.
     */
    function observeDomChanges() {
        try {
            // Randomize delay further
            const randomDelay = () => 80 + Math.floor(Math.random() * 200);
            const observer = new MutationObserver(mutations => {
                setTimeout(() => {
                    let shouldProcess = false;
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length || 
                            (mutation.type === 'attributes' && 
                             (mutation.target.classList.contains('modal') || 
                              mutation.target.classList.contains('popup') ||
                              mutation.target.id.includes('modal')))) {
                            shouldProcess = true;
                            break;
                        }
                    }
                    if (shouldProcess) {
                        removeRiskElements();
                        setTimeout(cleanLinks, randomDelay());
                        cleanPageURL();
                    }
                }, randomDelay());
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'display']
            });
            return observer;
        } catch(e) {
            return setInterval(() => {
                removeRiskElements();
                cleanLinks();
                cleanPageURL();
            }, 1000);
        }
    }
    
    /**
     * Intercepts link clicks to restore original navigation if needed.
     */
    function setupLinkInterception() {
        try {
            document.addEventListener('click', event => {
                const target = event.target.closest('a[data-original-href]');
                if (target) {
                    event.preventDefault();
                    event.stopPropagation();
                    const originalHref = target.getAttribute('data-original-href');
                    window.location.href = originalHref;
                }
            }, true);
        } catch(e) { /* silent fail */ }
    }
    
    /**
     * Periodically checks and maintains script activity.
     */
    function setupHeartbeat() {
        try {
            const heartbeatKey = btoa('hb_' + instanceId);
            const checkInterval = 15000 + Math.floor(Math.random() * 10000);
            let counter = 0;
            const interval = setInterval(() => {
                try {
                    sessionStorage.setItem(heartbeatKey, ++counter);
                    if (typeof domUtils.rmv !== 'function' || typeof domUtils.notify !== 'function') {
                        initialize();
                    }
                    removeRiskElements();
                    cleanPageURL();
                    restoreScrolling();
                    if (!document.getElementById('stealth-style-' + instanceId)) {
                        injectStealthCSS();
                    }
                } catch(e) {
                    initialize();
                }
            }, checkInterval);
            return interval;
        } catch(e) { /* silent fail */ }
    }
    
    // =========================
    // 4. Initialization Logic
    // =========================
    /**
     * Initializes all features and sets up observers.
     */
    function initialize() {
        try {
            cleanPageURL();
            injectStealthCSS();
            setTimeout(() => {
                cleanLinks();
                removeRiskElements();
                activateAgreeCheckbox();
                restoreScrolling();
            }, 50);
            setTimeout(() => {
                const observer = observeDomChanges();
                setupLinkInterception();
                setupHeartbeat();
            }, 100);
            setInterval(() => {
                removeRiskElements();
                cleanPageURL();
            }, 2000 + Math.floor(Math.random() * 1000));
        } catch(e) {
            injectStealthCSS();
            cleanPageURL();
        }
    }
    
    // =========================
    // 5. Function Overrides (Anti-Detection)
    // =========================
    try {
        // Anti-fingerprinting: Hide our script from Function.prototype.toString
        const originalFunction = Function.prototype.toString;
        Function.prototype.toString = function() {
            const fakes = [initialize, removeRiskElements, domUtils.rmv, domUtils.notify];
            if (fakes.includes(this)) {
                return 'function() { [native code] }';
            }
            return originalFunction.apply(this, arguments);
        };
        // Anti-fingerprinting: Remove script element traces
        const scripts = document.querySelectorAll('script');
        scripts.forEach(s => {
            if (s.innerText.includes('Content Script Main Entry')) {
                s.remove();
            }
        });
    } catch(e) { /* silent fail */ }
    
    initialize();
})();
