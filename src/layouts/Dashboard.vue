<template>
  <div class="grid grid-cols-[300px_1fr] gap-0">
    <Sidebar class="w-[300px]" />
    <main class="z-10">
      <div class="px-[20px] lg:px-[40px] xl:px-[80px] py-[36px]">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import Sidebar from "./dashboard/Sidebar.vue";

// Route protection
onBeforeMount(() => {
  if (!JSON.parse(localStorage.getItem("userState")).status) {
    window.location.replace("/");
  }
});
</script>
