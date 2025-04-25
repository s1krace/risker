(function () {
    function fetchAffiliateCode() {
        const encodedAffiliateCodes = {
            "cnfans.com": "JmVmPTI3Mjc0NyZyZW1vdmVkX2l0ZW09MQ==",
            "mulebuy.com": "MjAwMDA2NjIw",
            "joyabuy.com": "MzAwMTEyNzIz",
            "orientdig.com": "MTAwMDczMTY5",
            "hoobuy.com": "dXRtX3NvdXJjZT1zaGFyZSZ1dG1fbWVkaXVtPXByb2R1Y3RfZGV0YWlscyZpbnZpdGVDb2RlPU1YemVheXhS",
            "oopbuy.com": "dXRtX3NvdXJjZT1saXVtPXByb2R1Y3RfZGV0YWlscyZpbnZpdGVDb2RlPVdNWUlHMkswTg=="
        };

        const hostname = window.location.hostname;
        if (encodedAffiliateCodes[hostname]) {
            return atob(encodedAffiliateCodes[hostname]);
        }
        return "";
    }

    function activateAgreeCheckbox() {
        const enableCheckbox = () => {
            const checkbox = document.querySelector("input#agree.form-check-input");
            if (checkbox?.disabled) {
                checkbox.disabled = false;
                checkbox.checked = true;
            }
        };

        const interval = setInterval(enableCheckbox, 500);
        setTimeout(() => clearInterval(interval), 12000);
    }

    function redirectToAffiliate() {
        chrome.storage.sync.get({ affiliateEnabled: true }, function (data) {
            if (!data.affiliateEnabled) return; // ✅ Affiliate links stay ON unless user disables them

            let url = new URL(window.location.href);
            let hostname = url.hostname;
            let affiliateCode = fetchAffiliateCode();

            const validHostnames = ["cnfans.com", "mulebuy.com", "joyabuy.com", "orientdig.com", "hoobuy.com", "oopbuy.com"];

            if (validHostnames.includes(hostname) && url.pathname.includes("/product")) {
                let modified = false;

                // ✅ Ensure the affiliate code is set
                if (url.searchParams.get("ref") !== affiliateCode) {
                    url.searchParams.set("ref", affiliateCode);
                    modified = true;
                }

                // ✅ Ensure &removed_item=1 is added for CNFans
                if (hostname === "cnfans.com" && !url.searchParams.has("removed_item")) {
                    url.searchParams.set("removed_item", "1");
                    modified = true;
                }

                if (modified) {
                    window.location.replace(url.toString());
                }
            }
        });
    }

    function removeRiskReminder() {
        let interval = setInterval(() => {
            let overlay = document.querySelector(".el-overlay");
            let riskDialog = document.querySelector(".el-overlay-dialog");

            if (overlay && riskDialog) {
                overlay.style.display = "none";
                overlay.remove();
                riskDialog.remove();
                clearInterval(interval);
                displayRemovalNotification();
            }
        }, 500);

        setTimeout(() => clearInterval(interval), 10000);
    }

    function displayRemovalNotification() {
        let notification = document.createElement("div");
        notification.id = "removal-notification";

        notification.style.backgroundColor = "#4caf50";
        notification.style.color = "#fff";
        notification.style.position = "fixed";
        notification.style.bottom = "-100px";
        notification.style.right = "10px";
        notification.style.padding = "15px 25px";
        notification.style.fontSize = "16px";
        notification.style.borderRadius = "5px";
        notification.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        notification.style.zIndex = "10000";
        notification.style.transition = "bottom 0.5s ease-out, opacity 1s ease-out";
        notification.textContent = "Risk Reminder removed! 😊";

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.bottom = "10px";
        }, 100);

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.remove();
            }, 1000);
        }, 10000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            redirectToAffiliate();
            removeRiskReminder();
            activateAgreeCheckbox();
        });
    } else {
        redirectToAffiliate();
        removeRiskReminder();
        activateAgreeCheckbox();
    }
})();