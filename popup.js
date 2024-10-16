document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('timeSpent', data => {
      const analyticsDiv = document.getElementById('analytics');
      analyticsDiv.innerHTML = '';

      if (data.timeSpent && Object.keys(data.timeSpent).length > 0) {
          Object.keys(data.timeSpent).forEach(domain => {
              const time = data.timeSpent[domain];
              const timeDisplay = document.createElement('div');
              timeDisplay.className = 'flex justify-between items-center p-2 bg-gray-200 rounded';

              const textContent = document.createElement('span');
              textContent.textContent = `${domain}: ${time.toFixed(2)} seconds`;
              timeDisplay.appendChild(textContent);

              const closeButton = document.createElement('button');
              closeButton.className = 'flex items-center justify-center w-8 h-8 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors';
              closeButton.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9.293l4.646-4.647a1 1 0 011.415 1.415L11.414 10l4.647 4.646a1 1 0 01-1.415 1.415L10 11.414l-4.646 4.646a1 1 0 01-1.415-1.415L8.586 10 3.939 5.354a1 1 0 011.415-1.415L10 9.293z" clip-rule="evenodd" />
                  </svg>
              `;
              closeButton.onclick = () => closeCurrentSite(domain);
              timeDisplay.appendChild(closeButton);

              analyticsDiv.appendChild(timeDisplay);
          });
      } else {
          analyticsDiv.textContent = 'No data available.';
      }
  });
});

function closeCurrentSite(domain) {
  chrome.tabs.query({ url: `*://${domain}/*` }, tabs => {
      tabs.forEach(tab => {
          chrome.tabs.remove(tab.id);
      });
  });
}
