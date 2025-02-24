export default defineUnlistedScript(() => {
    console.log("hallo Suggestion")

    setTimeout(() => {
        const suggestions = document.querySelectorAll("#nav-flyout-searchAjax .s-suggestion");

        if (suggestions.length > 0) {
            console.log("Suchvorschläge:");
            suggestions.forEach((suggestion) => {
                console.log(suggestion.textContent?.trim());
            });
        } else {
            console.log("Keine Suchvorschläge gefunden.");
        }
    }, 1000);
})