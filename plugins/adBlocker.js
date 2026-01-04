const adPatterns = [
  '*://*.doubleclick.net/*',
  '*://*.googlesyndication.com/*',
  '*://*.google-analytics.com/*',
  '*://*.ad-delivery.net/*',
  '*://*.quantserve.com/*',
  '*://*.adnxs.com/*',
  '*://*.scorecardresearch.com/*'
];

const cleanCSS = `
  .announcement, 
  .sc-ads, 
  .adBox, 
  .visuals__ads, 
  .sidebarAdvertisement, 
  .premium-upsell, 
  .upsellBanner,
  div[class*="Advertisement"],
  .promotedItem,
  [id^="ad-"] { 
    display: none !important; 
    height: 0 !important;
    width: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

function injectCleaner(win) {
  const { session } = win.webContents;

  session.webRequest.onBeforeRequest({ urls: adPatterns }, (details, callback) => {
    callback({ cancel: true });
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(cleanCSS);
    
    win.webContents.executeJavaScript(`
      const observer = new MutationObserver(() => {
        const adOverlay = document.querySelector('.adVisual');
        const skipBtn = document.querySelector('.skipControl__skip');
        if (adOverlay) adOverlay.remove();
        if (skipBtn) skipBtn.click();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    `);
  });
}

module.exports = { injectCleaner };