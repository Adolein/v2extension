<template>
  test
  {{ productHistory.productHistory }}
  <div class="mt-4 w-full mx-auto my-4  shadow-lg rounded-lg overflow-hidden">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-indigo-600 text-white text-left">
          <th class="p-3">Artikelname</th>
          <th class="p-3">Preis</th>
          <th class="p-3">Rabatt</th>
          <th class="p-3">Popup</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in productHistory" :key="index" class="border-b hover:bg-gray-100 transition">
          <td class="p-3">{{ product.name }}</td>
          <td class="p-3 font-semibold text-green-600">{{ product.price }}</td>
          <td class="p-3 text-red-500">{{ product.discount || '—' }}</td>
          <td class="p-3" @click="openPopup">
            <button class="hover:cursor-pointer">
              📌
            </button>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import "~/assets/tailwind.css";

defineProps<{ products: { name: string; price: string; discount?: string }[] }>();

function openPopup() {
  chrome.runtime.sendMessage({ action: "open_popup" });
}

// Typ für die Produkte definieren
interface Product {
  name: string;
  price: string;
  discount?: string;
}

// `ref` mit korrektem Typ initialisieren
const productHistory = ref<Product[]>([]);

/* onMounted(() => {
  console.log('mounted')
  chrome.storage.local.get("productHistory", (data) => {
    console.log('DATA')
    console.log(data.productHistory)
    productHistory.value = data.productHistory || [];
    console.log(productHistory.value)
  });
}); */

onMounted(() => {
  console.log("Component mounted, loading product history...");

  chrome.storage.local.get("productHistory", (data) => {
    console.log("DATA from storage:", data);

    // Prüfe, ob `productHistory` existiert und ein Array ist
    if (Array.isArray(data.productHistory)) {
      productHistory.value = data;
    } else {
      productHistory.value = [];
    }

    console.log("Updated productHistory:", productHistory.value);
  });
});

console.log(productHistory.value)
</script>
