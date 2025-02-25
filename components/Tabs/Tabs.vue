<template>
  <div class="w-full max-w-md mx-auto mt-4">
    <!-- Tab Buttons -->
    <div class="flex border-b border-gray-300">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="setActiveTab(tab)"
        class="flex-1 py-2 text-center text-gray-600 hover:text-gray-900 transition-colors border-b-2"
        :class="{
          'border-blue-500 text-blue-600 font-semibold': activeTab === tab,
          'border-transparent': activeTab !== tab
        }"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-4 bg-white shadow-md rounded-b-lg">
      <div v-if="activeTab === 'Home'">Home</div>
      <div v-if="activeTab === 'Suggestions'"><Suggestions/></div>
      <div v-if="activeTab === 'Settings'">⚙️ Einstellungen ändern.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Suggestions from './suggestions.vue';

const tabs = ['Home','Suggestions','Settings',];
const activeTab = ref(tabs[0]);

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>
