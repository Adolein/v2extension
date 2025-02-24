
export default defineUnlistedScript(() => {
    console.log("hallo Fromsearchfield")
    const searchInput = document.getElementById("twotabsearchtextbox") as HTMLInputElement;

    if (searchInput) {
        searchInput.value = "Drucker patronen";
        searchInput.dispatchEvent(new Event("input", { bubbles: true })); // Trigger für Amazon-Autovervollständigung
        console.log("Suchbegriff eingegeben:", searchInput.value);
    } else {
        console.log("Suchfeld nicht gefunden.");
    }
})