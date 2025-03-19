<template>
    <div class="flex justify-center items-center w-full">
      <div class="w-full max-w-lg bg-white shadow-lg rounded-lg p-4">
        <h2 class="text-xl font-bold text-center mb-4">Verkaufsstatistik</h2>
        <div class="relative">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import Chart from "chart.js/auto";
  
  const chartCanvas = ref<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;
  
  onMounted(() => {
    if (chartCanvas.value) {
      chartInstance = new Chart(chartCanvas.value, {
        type: "bar",
        data: {
          labels: ["Januar", "Februar", "März", "April", "Mai"],
          datasets: [
            {
              label: "Umsatz (€)",
              type: "bar",
              data: [500, 700, 800, 600, 900],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Durchschnittspreis (€)",
              type: "line",
              data: [50, 55, 53, 60, 62],
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }
  });
  </script>
  
  <style scoped>
  /* Passt die Höhe dynamisch an */
  .relative {
    height: 300px;
  }
  </style>
  