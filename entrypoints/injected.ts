export default defineUnlistedScript(() => {
  console.log("Hello from injected.ts");

  // DOM analysieren
  const titleElement = document.querySelector("#productTitle");
  const title = titleElement?.textContent?.trim() || "Kein Titel gefunden";
  console.log("Produkt-Titel:", title);

  const priceElement = document.querySelector(".a-price .a-offscreen");
  const price = priceElement?.textContent?.trim() || "Kein Preis gefunden";
  console.log("Preis:", price);

  console.log(document)
});