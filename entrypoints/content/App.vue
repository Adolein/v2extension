<script lang="ts" setup>
import vueLogo from "~/assets/vue.svg";
import "~/assets/tailwind.css";
import Test from "@/components/test.vue";

</script>

<template>
    <div class="container">
        <img :src="vueLogo" />
        <p>Vue method implementiert</p>
    </div>
    <Test/>
</template>

<style scoped>
.container {
    position: fixed;
    right: 16px;
    top: 16px;
    width: 250px;
    height: 200px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    color: black;
}

img {
    width: 72px;
}
</style>