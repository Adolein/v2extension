export default defineContentScript({
    //matches: ['*://*.google.com/*'],
    matches: ['*://*.amazon.de/*'],
    //https://www.amazon.de/dp/B01JLGWGEQ
    async main(ctx) {
        console.log('Hello content.');
        console.log("Injecting script...");
        await injectScript("/injected.js", {
            keepInDom: true,
        });
        console.log("Done!");
        // Fügt ein div zur Seite hinzu
        const newDiv = document.createElement("div");
        newDiv.id = "my-wxt-div";
        newDiv.style.position = "fixed";
        newDiv.style.bottom = "10px";
        newDiv.style.right = "10px";
        newDiv.style.backgroundColor = "rgba(0,0,0,0.7)";
        newDiv.style.color = "white";
        newDiv.style.padding = "10px";
        newDiv.style.borderRadius = "5px";
        newDiv.innerText = "Mein Dev";
        document.body.appendChild(newDiv);
    },
});
