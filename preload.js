const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {});

window.addEventListener('DOMContentLoaded', () => {
  // --- SELECTORS ---
  // This is a guess for the main container of the "My Bets" list.
  const MY_BETS_CONTAINER_SELECTOR = 'app-my-bets';

  // Based on the user's HTML, this is the element for the cashout multiplier (e.g., 1.50x).
  const MULTIPLIER_SELECTOR = '.bubble-multiplier';

  // We'll search for the cashout value based on its proximity to the multiplier.
  // It often contains the currency symbol.
  const CURRENCY_SYMBOL = 'R$';

  console.log('Scraper preload script loaded. Waiting for the bets container...');

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

        mutation.addedNodes.forEach(node => {
          // Ensure we are looking at an element node.
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          // Check if the newly added node is a bet entry or contains one.
          // We'll identify a completed bet by the presence of the multiplier element.
          const multiplierEl = node.querySelector(MULTIPLIER_SELECTOR);

          if (multiplierEl) {
            console.log('Completed bet entry detected.');
            const multiplierValue = multiplierEl.innerText.trim();
            let cashoutValue = 'N/A';

            // Now, let's find the cashout value. It's likely in a sibling
            // or a nearby element. We'll search the entire bet entry node for it.
            const allTextNodes = Array.from(node.querySelectorAll('div, span'));
            const cashoutNode = allTextNodes.find(el => el.innerText.includes(CURRENCY_SYMBOL));

            if (cashoutNode) {
              cashoutValue = cashoutNode.innerText.trim();
            }

            console.log(`Scraped Data: Cashout=${cashoutValue}, Multiplier=${multiplierValue}`);

            // Send the extracted data to the main process.
            ipcRenderer.send('cashout-data', {
              cashout: cashoutValue,
              multiplier: multiplierValue
            });
          }
        });
      }
    }
  });

  // Wait for the target container to appear in the DOM, as it's loaded dynamically.
  const interval = setInterval(() => {
    const targetNode = document.querySelector(MY_BETS_CONTAINER_SELECTOR);
    if (targetNode) {
      console.log('Bets container (`app-my-bets`) found! Starting the observer.');
      clearInterval(interval);
      // Start observing the target node for added child nodes.
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  }, 1000); // Check every second.
});
