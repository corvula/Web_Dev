function showTime(totalSeconds) {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

function getSiteName(url) {
  try {
    let site = new URL(url);
    return site.hostname;
  } catch (e) {
    return 'невідомий сайт';
  }
}

function loadTheme() {
  chrome.storage.local.get(['theme'], function(data) {
    let theme = data.theme || 'light';
    document.body.className = theme;
    updateThemeButton(theme);
  });
}

function updateThemeButton(theme) {
  let btn = document.getElementById('themeToggle');
  if (theme === 'dark') {
    btn.textContent = 'Світла тема';
  } else {
    btn.textContent = 'Темна тема';
  }
}

function toggleTheme() {
  let currentTheme = document.body.className;
  let newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.body.className = newTheme;
  chrome.storage.local.set({ theme: newTheme });
  updateThemeButton(newTheme);
}

document.addEventListener('DOMContentLoaded', async function() {

  loadTheme();

  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  let currentTab = tabs[0];
  let siteName = getSiteName(currentTab.url);
  
  document.getElementById('siteName').textContent = siteName;

  chrome.storage.local.get([siteName + '_time', siteName + '_limit'], function(data) {
    let currentTime = data[siteName + '_time'] || 0;
    let limit = data[siteName + '_limit'];

    showTime(currentTime);

    if (limit) {
      let hours = Math.floor(limit / 3600);
      let minutes = Math.floor((limit % 3600) / 60);
      let seconds = limit % 60;
      
      document.getElementById('limitHours').value = hours;
      document.getElementById('limitMinutes').value = minutes;
      document.getElementById('limitSeconds').value = seconds;

      if (currentTime >= limit) {
        document.getElementById('warning').style.display = 'block';
      }

      let remaining = Math.max(0, limit - currentTime);
      let remHours = Math.floor(remaining / 3600);
      let remMinutes = Math.floor((remaining % 3600) / 60);
      let remSeconds = remaining % 60;
      
      document.getElementById('limitInfo').textContent = 
        `Залишилось: ${remHours}г ${remMinutes}хв ${remSeconds}с`;
    }
  });

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  document.getElementById('setBtn').addEventListener('click', function() {
    let hours = parseInt(document.getElementById('limitHours').value) || 0;
    let minutes = parseInt(document.getElementById('limitMinutes').value) || 0;
    let seconds = parseInt(document.getElementById('limitSeconds').value) || 0;
    
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds > 0) {
      let saveData = {};
      saveData[siteName + '_limit'] = totalSeconds;
      chrome.storage.local.set(saveData);
      
      alert(`Ліміт встановлено: ${hours}г ${minutes}хв ${seconds}с`);
    } else {
      alert('Введіть хоча б одне значення більше 0');
    }
  });

  document.getElementById('resetBtn').addEventListener('click', function() {
    let saveData = {};
    saveData[siteName + '_time'] = 0;
    chrome.storage.local.set(saveData);
    
    showTime(0);
    document.getElementById('warning').style.display = 'none';
    alert('Час скинуто!');
  });

  setInterval(async function() {
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      let site = getSiteName(tabs[0].url);
      if (site === siteName) {
        chrome.storage.local.get([siteName + '_time', siteName + '_limit'], function(data) {
          let currentTime = data[siteName + '_time'] || 0;
          let limit = data[siteName + '_limit'];
          
          showTime(currentTime);
          
          if (limit) {
            let remaining = Math.max(0, limit - currentTime);
            let remHours = Math.floor(remaining / 3600);
            let remMinutes = Math.floor((remaining % 3600) / 60);
            let remSeconds = remaining % 60;
            
            document.getElementById('limitInfo').textContent = 
              `Залишилось: ${remHours}г ${remMinutes}хв ${remSeconds}с`;
            
            if (currentTime >= limit) {
              document.getElementById('warning').style.display = 'block';
            }
          }
        });
      }
    }
  }, 1000);
});