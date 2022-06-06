<template>
  <div class="grid grid-cols-12 gap-0">
    <Sidebar class="col-span-2" />
    <main class="col-span-10 z-10">
      <div class="px-[20px] lg:px-[40px] xl:px-[80px] py-[36px]">
        <slot />
        <button
          @click="logoutWallet"
          class="underline text-[#000] w-full uppercase mx-auto"
        >
          Disconnect Wallet
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import Sidebar from "./dashboard/Sidebar.vue";
import connect from "@/composables/connect/index";

const { disconnectWallet } = connect();

// Route protection
onBeforeMount(() => {
  if (!JSON.parse(localStorage.getItem("userState")).status) {
    window.location.replace("/");
  }
});

async function logoutWallet() {
  await disconnectWallet();
  window.location.replace("/");
}
</script>
