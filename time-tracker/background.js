let currentSite = null;
let startTime = null;
let notifiedSites = {}; 

function getSiteName(url) {
  try {
    let site = new URL(url);
    return site.hostname;
  } catch (e) {
    return null;
  }
}

function showLimitNotification(siteName, limitSeconds) {
  let hours = Math.floor(limitSeconds / 3600);
  let minutes = Math.floor((limitSeconds % 3600) / 60);
  let seconds = limitSeconds % 60;
  
  let timeText = '';
  if (hours > 0) timeText += hours + ' год ';
  if (minutes > 0) timeText += minutes + ' хв ';
  if (seconds > 0) timeText += seconds + ' с';
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23f44336"/><text x="50" y="70" font-size="60" text-anchor="middle" fill="white">!</text></svg>',
    title: 'Ліміт часу вичерпано!',
    message: `Сайт: ${siteName}\nВстановлений ліміт: ${timeText}\n\nЧас зробити перерву!`,
    priority: 2,
    requireInteraction: true
  });

}

function saveCurrentTime() {
  if (!currentSite || !startTime) return;
  
  let now = Date.now();
  let elapsed = Math.floor((now - startTime) / 1000);
  
  chrome.storage.local.get([currentSite + '_time', currentSite + '_limit'], function(data) {
    let oldTime = data[currentSite + '_time'] || 0;
    let newTime = oldTime + elapsed;
    let limit = data[currentSite + '_limit'];
    
    let saveData = {};
    saveData[currentSite + '_time'] = newTime;
    chrome.storage.local.set(saveData);

    if (limit && newTime >= limit) {
      if (!notifiedSites[currentSite]) {
        showLimitNotification(currentSite, limit);
        notifiedSites[currentSite] = true;
      }
    } else if (limit && newTime < limit) {
      notifiedSites[currentSite] = false;
    }
  });
  
  startTime = Date.now();
}

chrome.tabs.onActivated.addListener(async function(info) {
  saveCurrentTime();
  let tab = await chrome.tabs.get(info.tabId);
  currentSite = getSiteName(tab.url);
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0] && tabs[0].id === tabId) {
      saveCurrentTime();
      currentSite = getSiteName(tab.url);
      startTime = Date.now();
    }
  }
});

setInterval(saveCurrentTime, 10000);

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  if (tabs[0]) {
    currentSite = getSiteName(tabs[0].url);
    startTime = Date.now();
  }
});