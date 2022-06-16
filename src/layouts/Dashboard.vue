<template>
  <div class="grid grid-cols-[300px_1fr] gap-0">
    <Sidebar class="w-[300px]" />
    <main class="z-10 bg-[#2D3035] p-[28px]">
      <!-- Header  -->
      <DashHeader />
      <!-- Main  -->
      <DashMain />
    </main>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Sidebar from "./dashboard/Sidebar.vue";
import Wallet from "@/components/landing/Wallet.vue";
import DashHeader from "./dashboard/DashHeader.vue";
import DashMain from "./dashboard/DashMain.vue";

// Route protection
onBeforeMount(() => {
  if (!JSON.parse(localStorage.getItem("userState")).status) {
    window.location.replace("/");
  }
});
</script>
