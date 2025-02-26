import { ContentScriptContext } from "wxt/client";
import App from "./App.vue";
import { createApp } from "vue";
import "./reset.css";

export default defineContentScript({

    //matches: ['*://*.google.com/*'],
    matches: ['*://*.amazon.de/*'],
    //https://www.amazon.de/dp/B01JLGWGEQ
    cssInjectionMode: "ui",

    async main(ctx) {
        window.addEventListener('message', async (event) => {
            if (event.source !== window || event.data.type !== 'SEARCH_KEYWORDS') {
                return;
            }
            console.log('Watcher 2')

            const keywords = event.data.keywords;
            const results = [];

            for (const keyword of keywords) {
                const searchField = document.getElementById("twotabsearchtextbox") as HTMLInputElement;

                if (searchField) {
                    searchField.value = keyword;
                    searchField.dispatchEvent(new Event('input', { bubbles: true }));
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const suggestionElements = document.querySelectorAll('.s-suggestion');
                    const suggestionTexts = Array.from(suggestionElements).map(el => el.textContent?.trim() || '');

                    results.push({ keyword, suggestions: suggestionTexts });

                    // Nachricht an Popup
                    chrome.runtime.sendMessage({ type: 'SUGGESTIONS', keyword, suggestions: suggestionTexts });
                }
            }
        });


        const ui = await defineOverlay(ctx);

        // Mount initially
        //ui.mount();

        // Re-mount when page changes
        ctx.addEventListener(window, "wxt:locationchange", (event) => {
            ui.mount();
        });



        /* console.log('Hello content.');
        console.log("Injecting script...");
        await injectScript("/injected.js", {
            keepInDom: true,
        });
        await injectScript("/searchfield.js", {
            keepInDom: true,
        });
        await injectScript("/suggestion.js", {
            keepInDom: true,
        });
        console.log("Done!"); */


        ////////////////
        // Vanilla JS Method
        ////
        /* const newDiv = document.createElement("div");
        newDiv.id = "my-wxt-div";
        newDiv.style.position = "fixed";
        newDiv.style.bottom = "10px";
        newDiv.style.right = "10px";
        newDiv.style.backgroundColor = "rgba(0,0,0,0.7)";
        newDiv.style.color = "white";
        newDiv.style.padding = "10px";
        newDiv.style.borderRadius = "5px";
        newDiv.innerText = "Vanilla JS implementiert";
        document.body.appendChild(newDiv); */

    },

});

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
