<script lang="ts" setup>
import vueLogo from "~/assets/vue.svg";
import "~/assets/tailwind.css";
import Test from "@/components/test.vue";

</script>

<template>
    <div class="">
        <img :src="vueLogo" />
        <p>Vue method implementiert</p>
    </div>
    <Test/>
</template>

<style scoped>

</style>