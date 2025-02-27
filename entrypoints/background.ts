export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Nachrichten von Content Script empfangen und an Popup weiterleiten
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SUGGESTIONS') {
      console.log("Empfangene Vorschläge aus Content Script:", message);
      
      // Nachricht an das Popup senden
      chrome.runtime.sendMessage({
        type: 'SUGGESTIONS_UPDATE',
        keyword: message.keyword,
        suggestions: message.suggestions
      });
    }
  });
});
