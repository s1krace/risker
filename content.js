(function () {
    const instanceId = Math.random().toString(36).substring(2, 10);
    
    const _ops = {
        rmv: function(el) {
            if (!el) return;
            try {
                el.style.display = "none";
                el.style.visibility = "hidden";
                el.style.opacity = "0";
                el.style.pointerEvents = "none";
                setTimeout(() => {
                    try { el.remove(); } catch(e) { /* silent fail */ }
                }, 50 + Math.floor(Math.random() * 100));
            } catch(e) { /* silent fail */ }
        },
        
        notify: function(msg) {
            try {
                let n = document.createElement("div");
                n.id = "ntf-" + Math.random().toString(36).substring(2, 8);
                const positions = ["10px", "15px", "12px"];
                const colors = ["#1E1E1E", "#232323", "#202020"];
                const textColors = ["#66FF66", "#60FF60", "#68FF68"];
                const posIndex = Math.floor(Math.random() * positions.length);
                const colorIndex = Math.floor(Math.random() * colors.length);
                Object.assign(n.style, {
                    position: "fixed",
                    top: positions[posIndex],
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "15px 25px", // Increased padding for larger size
                    backgroundColor: colors[colorIndex],
                    color: textColors[colorIndex],
                    fontFamily: "monospace",
                    fontSize: "16px", // Increased font size
                    border: "1px solid #444",
                    borderRadius: "5px", // Slightly larger border radius
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Slightly stronger shadow
                    zIndex: "999999",
                    transition: "opacity 0.3s ease-out"
                });
                n.textContent = msg;
                document.body.appendChild(n);
                setTimeout(() => {
                    n.style.opacity = "0";
                    setTimeout(() => n.remove(), 300);
                }, 1800 + Math.floor(Math.random() * 400));
            } catch(e) { /* silent fail */ }
        },
        
        urlClean: function(url) {
            try {
                const urlObj = new URL(url);
                const paramsToRemove = ['ref', 'inviteCode', 'share_code', 'affiliate'];
                paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
                return urlObj.toString();
            } catch(e) {
                return url;
            }
        }
    };
    
    function findRiskElements() {
        try {
            const results = [];
            const hostname = window.location.hostname;
            const textMatches = Array.from(document.querySelectorAll('div, section, aside'))
                .filter(el => {
                    try {
                        const text = el.innerText || '';
                        const hasRiskText = /(risk|warning|reminder|caution|alert|confirm|agreement)/i.test(text);
                        const isPopupStyle = (
                            window.getComputedStyle(el).position === 'fixed' || 
                            parseInt(window.getComputedStyle(el).zIndex) > 100
                        );
                        return hasRiskText && isPopupStyle && text.length < 1000;
                    } catch(e) {
                        return false;
                    }
                });
            results.push(...textMatches);
            const patterns = [
                "[class*='modal']", "[class*='popup']", "[class*='dialog']",
                "[class*='overlay']", "[class*='mask']", "[class*='drawer']",
                "[id*='modal']", "[id*='popup']", "[id*='dialog']",
                "[role='dialog']", "[aria-modal='true']"
            ];
            const patternMatches = Array.from(document.querySelectorAll(patterns.join(',')))
                .filter(el => {
                    try {
                        const s = window.getComputedStyle(el);
                        return (
                            s.display !== 'none' && 
                            (s.position === 'fixed' || parseInt(s.zIndex) > 100) &&
                            el.offsetWidth > 200 && el.offsetHeight > 100
                        );
                    } catch(e) {
                        return false;
                    }
                });
            results.push(...patternMatches);
            if (/cnfans|joya|mule|orient|hoo|oop/i.test(hostname)) {
                const siteMatches = Array.from(document.querySelectorAll(
                    ".el-overlay, .n-modal-body-wrapper, div.risk-modal, .ant-modal-root, " +
                    "div[class*='modal'] + div[class*='overlay'], #keywords-modal"
                ));
                results.push(...siteMatches);
            }
            return Array.from(new Set(results));
        } catch(e) {
            return [];
        }
    }

    function cleanLinks() {
        try {
            let linksCleaned = 0;
            const links = document.querySelectorAll("a[href]");
            links.forEach(link => {
                try {
                    if (!link.hasAttribute('data-processed-' + instanceId)) {
                        const originalHref = link.href;
                        const cleanedHref = _ops.urlClean(originalHref);
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
                _ops.notify("//: System: Sanitized " + linksCleaned + " links");
            }
            return linksCleaned;
        } catch(e) {
            return 0;
        }
    }
    
    function cleanPageURL() {
        try {
            const currentURL = window.location.href;
            const cleanedURL = _ops.urlClean(currentURL);
            if (cleanedURL !== currentURL) {
                history.replaceState(null, document.title, cleanedURL);
                _ops.notify("//: System: URL sanitized");
            }
        } catch(e) { /* silent fail */ }
    }
    
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
                    _ops.notify("//: System: Checkbox activated");
                }
                if (attempts >= checkAttempts) {
                    clearInterval(interval);
                }
            }, checkInterval);
        } catch(e) { /* silent fail */ }
    }
    
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
    
    function removeRiskElements() {
        try {
            const elements = findRiskElements();
            let removed = 0;
            elements.forEach(el => {
                if (!el.hasAttribute('data-removed-' + instanceId)) {
                    _ops.rmv(el);
                    el.setAttribute('data-removed-' + instanceId, 'true');
                    removed++;
                }
            });
            if (removed > 0) {
                _ops.notify("//: System: Task terminated");
                restoreScrolling();
            }
            return removed;
        } catch(e) {
            return 0;
        }
    }
    
    function observeDomChanges() {
        try {
            const randomDelay = () => 100 + Math.floor(Math.random() * 150);
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
    
    function setupHeartbeat() {
        try {
            const heartbeatKey = btoa('hb_' + instanceId);
            const checkInterval = 15000 + Math.floor(Math.random() * 10000);
            let counter = 0;
            const interval = setInterval(() => {
                try {
                    sessionStorage.setItem(heartbeatKey, ++counter);
                    if (typeof _ops.rmv !== 'function' || typeof _ops.notify !== 'function') {
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
    
    try {
        const originalFunction = Function.prototype.toString;
        Function.prototype.toString = function() {
            if (this === initialize || 
                this === removeRiskElements || 
                this === _ops.rmv || 
                this === _ops.notify) {
                return 'function() { [native code] }';
            }
            return originalFunction.apply(this, arguments);
        };
    } catch(e) { /* silent fail */ }
    
    initialize();
})();
