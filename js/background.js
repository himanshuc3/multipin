function updateCount(tabId, isOnRemoved) {
    browser.tabs.query({})
    .then((tabs) => {
      let length = tabs.length;
  
      // onRemoved fires too early and the count is one too many.
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
      if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
        length--;
      }
  
        browser.browserAction.setBadgeText({text: length.toString()});
        browser.browserAction.setBadgeBackgroundColor({'color': 'rgba(0,0,0,1)'});
    });
}
  
browser.tabs.onRemoved.addListener(
    (tabId) => { updateCount(tabId, true);
});
browser.tabs.onCreated.addListener(
    (tabId) => { updateCount(tabId, false);
});
browser.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('background.html')});
});
wupdateCount();