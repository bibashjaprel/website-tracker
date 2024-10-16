let activeTabId = null;
const timeSpent = {};

chrome.tabs.onActivated.addListener(activeInfo => {
    if (activeTabId) {
        const currentUrl = new URL(activeTabId.url);
        const domain = currentUrl.hostname;

        const endTime = Date.now();
        if (!timeSpent[domain]) timeSpent[domain] = 0;
        timeSpent[domain] += (endTime - activeTabId.startTime) / 1000;

        chrome.storage.local.set({ timeSpent }, () => {
            console.log(`Time for ${domain}: ${timeSpent[domain]} seconds`);
        });
    }

    activeTabId = activeInfo;
    chrome.tabs.get(activeTabId.tabId, tab => {
        if (tab) {
            activeTabId.url = tab.url;
            activeTabId.startTime = Date.now();
        } else {
            console.error("Tab not found or inactive.");
        }
    });
});

setInterval(() => {
    chrome.storage.local.set({ timeSpent }, () => {
        console.log('Time spent data saved:', timeSpent);
    });
}, 60000);
