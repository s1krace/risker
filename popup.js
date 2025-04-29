document.addEventListener("DOMContentLoaded", function () {
    const aT = document.getElementById("affiliateToggle");

    // Retrieve saved state from storage and set the toggle correctly
    chrome.storage.sync.get({ affiliateEnabled: true }, function (d) {
        if (chrome.runtime.lastError) {
            // Silently ignore
        } else {
            aT.checked = d.affiliateEnabled ?? true;
        }
    });

    aT.addEventListener("change", function () {
        chrome.storage.sync.set({ affiliateEnabled: aT.checked }, function () {
            // Silently ignore errors or confirmations
        });
    });
});
