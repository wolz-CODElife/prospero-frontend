<template>
  <div class="row-span-3 bg-[#191A20] py-[20px]">
    <div class="flex justify-between mx-[20px]">
      <div class="p-[10px] bg-black">
        <ul class="flex">
          <li
            v-for="tab in tabs"
            :key="tab"
            @click="changeTab(tab.text)"
            class="py-[8px] px-[15px] w-[160px] uppercase"
            :class="[
              activeTab === tab.text
                ? 'bg-[#2D3035] text-white'
                : 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
            ]"
          >
            {{ tab.text }}
          </li>
        </ul>

        <!-- :class="[
              activeTab === tab.text
                ? 'bg-[#2D3035] text-white'
                : 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
            ]" -->
      </div>

      <!-- Deposit / withdraw  -->
      <div
        class="flex items-center gap-[12px]"
        v-if="activeTab !== 'All Portfolios'"
      >
        <button
          class="py-[8px] px-[15px] w-[125px] uppercase bg-[#005A57] text-white"
          @click="$emit('openDeposit')"
        >
          Deposit
        </button>

        <button
          class="py-[8px] px-[15px] w-[125px] uppercase border border-[#005A57] text-white"
        >
          Withdraw
        </button>
      </div>

      <!-- Join / create  -->
      <div class="flex items-center gap-[12px]" v-else>
        <button
          class="py-[8px] px-[15px] w-[125px] uppercase bg-[#005A57] text-white"
        >
          Join
        </button>

        <button
          class="py-[8px] px-[15px] w-[125px] uppercase border border-[#005A57] text-white"
        >
          Create
        </button>
      </div>
    </div>
    <!-- Portfolio Table -->
    <div class="my-[20px]">
      <table class="table-auto w-full">
        <thead>
          <tr
            class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[10px] px-[30px]"
          >
            <th class="pl-[20px]">SELECT</th>
            <th>NAME</th>
            <th class="border-r border-r-[#2D3035]">FEE</th>
            <th class="pl-[20px]">7D%</th>
            <th>30D%</th>
            <th>90D%</th>
            <th class="pr-[30px]">1YR%</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(portfolio, i) in portfolioList"
            key="i"
            class="text-white text-left py-[20px] mx-[28px] border-b border-b-[#2D3035]"
          >
            <td class="ml-[20px] pl-[18px]">
              <input type="radio" :name="portfolio.name" :id="portfolio.name" />
            </td>
            <td>{{ portfolio.name }}</td>
            <td class="border-r border-r-[#2D3035] pr-[30px]">
              {{ portfolio.fee }}
            </td>
            <td class="pl-[20px]">{{ portfolio.d7 }}</td>
            <td>{{ portfolio.d30 }}</td>
            <td>{{ portfolio.d90 }}</td>
            <td class="mr-[20px] pr-[18px]">{{ portfolio.y1 }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Search  -->

      <!-- Pagination  -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("All Portfolios");

const tabs = ref([
  {
    text: "All Portfolios",
  },
  {
    text: "My Portfolios",
  },
]);

function changeTab(tab) {
  activeTab.value = tab;
}

const portfolioList = ref([
  {
    name: "AFS1000 🔱",
    fee: 2.6,
    d7: 8,
    d30: 12,
    d90: 34,
    y1: 60,
  },
  {
    name: "Harry Mcguire",
    fee: 2.6,
    d7: 8,
    d30: 12,
    d90: 34,
    y1: 60,
  },
  {
    name: " 🌈 Lulu Nation Fans",
    fee: 2.6,
    d7: 8,
    d30: 12,
    d90: 34,
    y1: 60,
  },
  {
    name: "GX 650 Lords 🏖",
    fee: 2.6,
    d7: 8,
    d30: 12,
    d90: 34,
    y1: 60,
  },
  {
    name: "Moon Gatekeepers",
    fee: 2.6,
    d7: 8,
    d30: 12,
    d90: 34,
    y1: 60,
  },
]);
</script>

<style lang="postcss" scoped>
td {
  @apply py-[10px];
}
</style>
