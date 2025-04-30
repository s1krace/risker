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

    // Delete affiliate handler
    document.getElementById('delete-affiliate-btn').addEventListener('click', () => {
      chrome.storage.sync.get(['affiliates'], ({affiliates}) => {
        // Validation check
        const isValid = Array.isArray(affiliates) && 
          affiliates.every(a => 
            typeof a?.id === 'string' &&
            typeof a?.markedForDeletion === 'boolean'
          );
        
        if(!isValid) {
          alert('Invalid affiliate data structure - aborting deletion');
          return;
        }

        const filtered = affiliates.filter(a => !a.markedForDeletion);
        chrome.storage.sync.set({ affiliates: filtered });
      });
    });
});
