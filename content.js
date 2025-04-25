(function () {
    // List of potential selectors for risk reminders across supported sites
    const riskReminderSelectors = [
        "#keywords-modal",
        ".n-modal-body-wrapper",
        ".el-overlay",
        "div.risk-modal.ant-modal-root",
        "[class*='modal'][class*='risk']",
        "[class*='popup'][class*='warning']",
        "[role='dialog'][aria-label*='risk' i]",
        "[role='dialog'][aria-label*='warning' i]",
    ];

    // Keywords for text-based matching (case-insensitive)
    const riskKeywords = /(risk|warning|reminder|caution|alert)/i;

    // Function to remove affiliate codes from a URL using URL API
    function removeAffiliateCodeBrute(url) {
        try {
            console.log("Original URL (Brute):", url);
            const urlObj = new URL(url);
            const paramsToRemove = ['ref', 'inviteCode'];
            paramsToRemove.forEach(param => {
                urlObj.searchParams.delete(param);
            });
            const cleanedURL = urlObj.toString();
            console.log("Cleaned URL (Brute):", cleanedURL);
            return cleanedURL;
        } catch (error) {
            console.error("Error processing URL (Brute):", error);
            return url;
        }
    }

    // Function to process and clean links (Brute Force)
    function cleanLinksBrute() {
        console.log("cleanLinksBrute() called");
        let linksCleaned = false; // Track if any links were cleaned
        const links = document.querySelectorAll("a[href]");
        links.forEach((link) => {
            const originalHref = link.href;
            const cleanedHref = removeAffiliateCodeBrute(originalHref);
            if (cleanedHref !== originalHref) {
                console.log("Original href (Brute):", originalHref, "Cleaned href (Brute):", cleanedHref);
                link.href = cleanedHref;
                link.setAttribute("data-original-href", originalHref); // Store original URL
                linksCleaned = true; // Set flag to true if at least one link was cleaned
            }
        });

        // Only show the notification when links are cleaned
        if (linksCleaned) {
            showNotification("//: System: Ref-link sanitized.");
        }
    }

    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const debouncedCleanLinksBrute = debounce(cleanLinksBrute, 500); // 500ms delay

    // Function to clean the URL in the address bar without reloading
    function cleanURL() {
        const currentURL = window.location.href;
        const cleanedURL = removeAffiliateCodeBrute(currentURL); // Use the same cleaning function

        if (cleanedURL !== currentURL) {
            console.log("Updating URL in address bar to:", cleanedURL);
            history.replaceState(null, "", cleanedURL);
        }
    }

    // Intercept link clicks to prevent redirection
    function interceptLinkClicks() {
        document.addEventListener("click", (event) => {
            const target = event.target.closest("a[data-original-href]");
            if (target) {
                event.preventDefault(); // Prevent default navigation
                const originalHref = target.getAttribute("data-original-href");
                console.log("Intercepted click, navigating to:", originalHref);
                window.location.href = originalHref; // Manually navigate
            }
        }, true); // Use capture phase to intercept before other scripts
    }

    function activateAgreeCheckbox() {
        const enableCheckbox = () => {
            const checkbox = document.querySelector(
                "input#agree.form-check-input, input[type='checkbox'][name*='agree']"
            );
            if (checkbox?.disabled) {
                checkbox.disabled = false;
                checkbox.checked = true;
            }
        };

        const interval = setInterval(enableCheckbox, 500);
        setTimeout(() => clearInterval(interval), 12000);
    }

    function removeElement(element) {
        if (element) {
            element.style.display = "none";
            element.remove();
        }
    }

    function restoreScrolling() {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
    }

    function showNotification(message) {
        let notification = document.createElement("div");
        notification.id = "removal-notification";
        notification.style.position = "fixed";
        notification.style.top = "10px";
        notification.style.left = "50%";
        notification.style.transform = "translateX(-50%)";
        notification.style.padding = "8px 12px"; // Reduced padding
        notification.style.backgroundColor = "#1E1E1E";
        notification.style.color = "#66FF66"; // Subdued green
        notification.style.fontFamily = "monospace";
        notification.style.fontSize = "13px"; // Slightly smaller
        notification.style.border = "1px solid #444"; // Darker border
        notification.style.borderRadius = "3px";
        notification.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.6)";
        notification.style.zIndex = "10000";
        notification.style.transition = "opacity 0.3s ease-out"; // Faster transition
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000); // Even shorter duration
    }

    function tryRemoveRiskReminder() {
        let removed = false;
        const hostname = window.location.hostname;

        // Try specific selectors first
        for (const selector of riskReminderSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach((el) => {
                    removeElement(el);
                    removed = true;
                });
            }
        }

        // Fallback: Look for elements with risk-related text
        const allModals = document.querySelectorAll(
            "div[role='dialog'], div[class*='modal'], div[class*='popup']"
        );
        allModals.forEach((modal) => {
            if (riskKeywords.test(modal.textContent)) {
                removeElement(modal);
                removed = true;
            }
        });

        // Site-specific fallbacks
        if (["cnfans.com", "2024.cnfans.com"].includes(hostname)) {
            const modal = document.querySelector("div[class*='modal']");
            if (modal) {
                removeElement(modal);
                removed = true;
            }
        } else if (
            ["mulebuy.com", "joyabuy.com", "joyagoo.com", "orientdig.com", "hoobuy.com", "oopbuy.com"].includes(
                hostname
            )
        ) {
            const overlay = document.querySelector("div[class*='overlay']");
            if (overlay) {
                removeElement(overlay);
                removed = true;
            }
        }

        if (removed) {
            showNotification("//: System: Task terminated.");
            restoreScrolling();
        }
    }

    function observeDomChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    tryRemoveRiskReminder();
                    debouncedCleanLinksBrute(); // Call the debounced function
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }

    function initialize() {
        tryRemoveRiskReminder();
        activateAgreeCheckbox();
        cleanLinksBrute(); // Initial clean on page load
        interceptLinkClicks(); // Start intercepting clicks
        cleanURL(); // Clean the URL in the address bar
        observeDomChanges();

        // Also clean the URL periodically to catch any dynamic changes
        setInterval(cleanURL, 2000); // Check every 2 seconds
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();
