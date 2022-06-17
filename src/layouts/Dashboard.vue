<template>
  <div class="grid grid-cols-[300px_1fr] gap-0">
    <Sidebar class="w-[300px]" />
    <!-- Deposit view -->
    <main class="z-10 bg-[#2D3035] p-[28px] relative">
      <DepositModal />
    </main>
    <!-- Withdraw view-->
    <!-- <main
      class="z-10 bg-[#2D3035] p-[28px] relative"
      v-else-if="showWithdraw"
    ></main> -->
    <!-- Dashboard view -->
    <!-- <main class="z-10 bg-[#2D3035] p-[28px] relative" v-else>
      Header 
      <DashHeader />
      Main 
      <DashMain @emit="openDeposit" />
    </main> -->
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Sidebar from "./dashboard/Sidebar.vue";
import DashHeader from "./dashboard/DashHeader.vue";
import DashMain from "./dashboard/DashMain.vue";
import DepositModal from "@/components/dashboard/DepositModal.vue";

// Route protection
onBeforeMount(() => {
  if (!JSON.parse(localStorage.getItem("userState")).status) {
    window.location.replace("/");
  }
});

// const showDeposit = ref(false);
// const showWithdraw = ref(false);
// function openDeposit() {
//   console.log("Opened Deposit");
//   showDeposit.value = true;
// }
</script>
