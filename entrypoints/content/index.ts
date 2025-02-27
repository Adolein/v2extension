import { ContentScriptContext } from "wxt/client";
import App from "./App.vue";
import { createApp } from "vue";
import "./reset.css";

export default defineContentScript({
    matches: ['*://*.amazon.de/*'],
    cssInjectionMode: "ui",

    async main(ctx) {
        // 🔥 Falls der Listener bereits existiert, zuerst entfernen!
        window.removeEventListener('message', handleMessage);
        window.addEventListener('message', handleMessage);

        const ui = await defineOverlay(ctx);

        // Re-mount wenn sich die Seite ändert
        ctx.addEventListener(window, "wxt:locationchange", () => {
            ui.mount();
        });
    }
});

// 🔹 **Funktion für Nachrichtenevent**
function handleMessage(event: MessageEvent) {
    if (event.source !== window || event.data.type !== 'SEARCH_KEYWORDS') return;

    console.log('Empfange Keywords:', event.data.keywords);
    const keywords = event.data.keywords;
    const results: { keyword: string; suggestions: string[] }[] = [];

    const searchField = document.getElementById("twotabsearchtextbox") as HTMLInputElement;
    if (!searchField) return;

    (async () => {
        for (const keyword of keywords) {
            searchField.value = keyword;
            searchField.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 1000));

            const suggestionElements = document.querySelectorAll('.s-suggestion');
            const suggestionTexts = Array.from(suggestionElements).map(el => el.textContent?.trim() || '');

            results.push({ keyword, suggestions: suggestionTexts });

            // 🔥 Nachricht an Background-Skript statt direkt ans Popup!
            chrome.runtime.sendMessage({ type: 'SUGGESTIONS', keyword, suggestions: suggestionTexts });
        }
    })();
}

// 🔹 **Shadow-Root für Vue UI**
function defineOverlay(ctx: ContentScriptContext) {
    return createShadowRootUi(ctx, {
        name: "vue-overlay",
        position: "modal",
        zIndex: 99999,
        onMount(container, _shadow, shadowHost) {
            const app = createApp(App);
            app.mount(container);
            shadowHost.style.pointerEvents = "none";
            return app;
        },
        onRemove(app) {
            app?.unmount();
        },
    });
}
