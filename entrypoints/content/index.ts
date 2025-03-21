import { ContentScriptContext } from "wxt/client";
import App from "./App.vue";
import { createApp } from "vue";
import "./reset.css";
import ProductTable from "@/components/productTable.vue";
import V1 from "@/components/chart/v1.vue";



export default defineContentScript({

    matches: ['*://*.amazon.de/*'],

    cssInjectionMode: "ui",

    async main(ctx) {

        //insertProductTable()
        window.addEventListener('message', searchSuggestions);

        //ProductTable

        const ui = await defineProductTable(ctx);
        if (ui) {
            // Mount initially
            ui.mount()
            
            // Re-mount when page changes
            ctx.addEventListener(window, "wxt:locationchange", (event) => {
                ui.mount();
            });
        }

        //chart
        const chart = await defineChart(ctx);
        if (chart) {
            // Mount initially
            chart.mount();

            // Re-mount when page changes
            ctx.addEventListener(window, "wxt:locationchange", (event) => {
                chart.mount();
            });
        }




        //Overlay
        /* 
        const ui = await defineOverlay(ctx);
        
        // Mount initially
        ui.mount();

        // Re-mount when page changes
        ctx.addEventListener(window, "wxt:locationchange", (event) => {
            ui.mount();
        }); */
    },

});

/* function defineOverlay(ctx: ContentScriptContext) {
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
} */


async function searchSuggestions(event: any) {
    if (event.source !== window || event.data.type !== 'SEARCH_KEYWORDS') {
        return;
    }
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
}

/* function insertProductTable() {
    const centerCol = document.getElementById('centerCol');

    if (!centerCol) {
        console.error('centerCol nicht gefunden.');
        return;
    }

    // Produktdaten auslesen
    const productName = document.querySelector('#productTitle')?.textContent?.trim() || 'Unbekannt';
    const price = document.querySelector('.a-price .a-offscreen')?.textContent?.trim() || 'Keine Angabe';
    const discount = document.querySelector('.savingsPercentage')?.textContent?.trim() || 'Kein Rabatt';

    // Neues Div für Vue erstellen
    const productDiv = document.createElement('div');
    productDiv.id = 'product-table-container';
    centerCol.insertAdjacentElement('afterend', productDiv);

    // Vue App mounten
    createApp(ProductTable, {
        products: [{
            name: productName,
            price: price,
            discount: discount
        }]
    }).mount('#product-table-container');
} */

function extractProductData() {
    const titleElement = document.querySelector('#productTitle');
    const priceElement = document.querySelector('.a-price .a-offscreen');
    const discountElement = document.querySelector('.savingsPercentage');

    if (!titleElement || !priceElement) return null;

    const product = {
        name: titleElement.textContent?.trim() || 'Kein Titel gefunden',
        price: priceElement.textContent?.trim() || 'Preis nicht verfügbar',
        discount: discountElement?.textContent?.trim() || '—'
    };
    saveProductToHistory(product);
    return product
}

/* function insertProductTable() {
    const targetElement = document.querySelector('#centerCol');
    if (!targetElement) return;

    // Neues Div für die Tabelle erstellen
    const container = document.createElement('div');
    container.id = 'product-table-container';
    container.classList.add('w-full', 'mt-4');

    targetElement.appendChild(container);

    // Vue App erstellen
    const app = createApp(ProductTable, { products: [extractProductData()] });
    app.mount(container);
} */

function defineProductTable(ctx: ContentScriptContext) {
    const anchorElement = document.querySelector("#ppd");
    if (!anchorElement) return;
    return createShadowRootUi(ctx, {
        name: "product-table",
        position: "inline",
        append: "after",
        anchor: "#ppd",
        onMount(container) {
            const app = createApp(ProductTable);
            app.mount(container);

            return app;
        },
        onRemove(app) {
            app?.unmount();
        },
    });
}

function defineChart(ctx: ContentScriptContext) {
    const anchorElement = document.querySelector("#ppd");
    if (!anchorElement) return;
    return createShadowRootUi(ctx, {
        name: "chart-v1",
        position: "inline",
        append: "after",
        anchor: "#ppd",
        onMount(container) {
            const app = createApp(V1);
            app.mount(container);

            return app;
        },
        onRemove(app) {
            app?.unmount();
        },
    });
}


const product = extractProductData();
saveProductToHistory(product);

async function saveProductToHistory(product: { name: string; price: string; discount: string } | null) {
    if (!product) return;
    if (!product.name) return;

    chrome.storage.local.get("productHistory", (data) => {
        let history = data.productHistory || [];

        const exists = history.some((p: { name: string }) => p.name === product.name);
        if (exists) return;

        history.unshift(product);

        chrome.storage.local.set({ productHistory: history });
    });
}

async function loadProductHistory(callback: (history: any[]) => void) {
    chrome.storage.local.get("productHistory", (data) => {
        callback(data.productHistory || []);
    });
}


