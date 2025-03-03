<template>
  <div class="mt- 4 w-full max-w-4xl mx-auto my-4 bg-white shadow-lg rounded-lg overflow-hidden">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-blue-600 text-white text-left">
          <th class="p-3">Artikelname</th>
          <th class="p-3">Preis</th>
          <th class="p-3">Rabatt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="index" class="border-b hover:bg-gray-100 transition">
          <td class="p-3">{{ product.name }}</td>
          <td class="p-3 font-semibold text-green-600">{{ product.price }}</td>
          <td class="p-3 text-red-500">{{ product.discount || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import "~/assets/tailwind.css";

defineProps<{ products: { name: string; price: string; discount?: string }[] }>();
</script>
