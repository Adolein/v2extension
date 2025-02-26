<template>
    <p> Keywords eingeben</p>
    <textarea v-model="keywords" class="w-full h-32 p-2 m-2 border rounded-md"
        placeholder="Ein Keyword pro Zeile..."></textarea>

    <div v-if="suggestions.length" class="my-4">
        <h3 class="text-md font-semibold">Vorschläge</h3>
        <ul class="mt-2 space-y-1">
            <li v-for="(item, index) in suggestions" :key="index" class="bg-gray-100 p-2 rounded-md">
                <p class="font-semibold">{{ item.keyword }}:</p> {{ item.results.join(', ') }}
            </li>
        </ul>
    </div>

    <button v-if="!suggestions.length" class="bg-indigo-600 text-white p-2" @click="createCSVFile">CSV-Datei
        Erstellen</button>
    <button v-if="suggestions.length" @click="downloadCSV" class="bg-green-600 text-white p-2">CSV-Datei
        Herunterladen</button>

</template>
<script setup lang="ts">
import "~/assets/tailwind.css";

const keywords = ref('');
const suggestions = ref<{ keyword: string; results: string[] }[]>([]);


const createCSVFile = () => {
    const keywordList = keywords.value.split('\n').map(k => k.trim()).filter(k => k);
    suggestions.value = [];
    // Nachricht an Content Script senden
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (keywords) => {
                    window.postMessage({ type: 'SEARCH_KEYWORDS', keywords }, '*');
                },
                args: [keywordList]
            });
        }
    });

    // Warte auf Antwort mit Suchvorschlägen
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'SUGGESTIONS') {
            suggestions.value.push({ keyword: message.keyword, results: message.suggestions });
        }
    });
};

// CSV herunterladen
const downloadCSV = () => {

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Keyword;Suggestions\n';

    suggestions.value.forEach(({ keyword, results }) => {
        const escapedKeyword = `"${keyword.replace(/"/g, '""')}"`;

        const escapedResults = results
            .map(result => `"${result.replace(/"/g, '""')}"`)
            .join(';');

        csvContent += `${escapedKeyword};${escapedResults}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'amazon_Vorschläge.csv');
    document.body.appendChild(link);
    link.click();
};

</script>