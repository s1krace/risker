document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("affiliateToggle");

    // Retrieve saved state from storage and set the toggle correctly
    chrome.storage.sync.get({ affiliateEnabled: true }, function (data) {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving toggle state:", chrome.runtime.lastError);
        } else {
            toggle.checked = data.affiliateEnabled ?? true; // Default to true if undefined
        }
    });

    toggle.addEventListener("change", function () {
        chrome.storage.sync.set({ affiliateEnabled: toggle.checked }, function () {
            if (chrome.runtime.lastError) {
                console.error("Error saving toggle state:", chrome.runtime.lastError);
            } else {
                console.log("Affiliate toggle updated:", toggle.checked);
            }
        });
    });
});
