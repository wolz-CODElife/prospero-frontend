<template>
  <div class="h-full w-full bg-[#191A20] border border-[#2D3035] p-[30px]">
    <div class="flex justify-between">
      <button class="button text-[#00FF00]">&#91; Go BACK</button>
      <h1 class="text-white text-[20px]">DEPOSITING TO PORTFOLIO</h1>
    </div>
    <!-- Name  -->
    <div
      class="mt-[20px] p-[20px] bg-black flex justify-between items-center w-full"
    >
      <h2 class="text-white">AFS1000 🔱</h2>
      <div
        class="py-[8px] px-[15px] max-w-max uppercase bg-[#2D3035] text-white shadow-[0px_0px_5px_rgba(0,0,0,0.5);]"
      >
        <span class="text-[#00FF00]"
          >FILL IN YOUR DEPOSIT AMOUNT FROM ONE TOKEN OR ACROSS MULTIPLE
          TOKENS</span
        >
      </div>
    </div>

    <table class="table-auto w-full">
      <thead>
        <tr
          class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[20px] px-[30px]"
        >
          <th class="pl-[5px] pt-[20px] pb-[12px]">Token</th>
          <th>Price</th>
          <th>Available</th>
          <th>Amount to Deposit</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(token, i) in tokenList"
          key="i"
          class="text-white text-left py-[20px] mx-[28px] border-b border-b-[#2D3035]"
        >
          <td class="flex items-center">
            <img
              :src="token.icon"
              alt=""
              class="w-[30px] h-[30px] mr-[10px]"
            />{{ token.name }}
          </td>
          <td>{{ token.price }}</td>
          <td>{{ token.available }}</td>
          <td>{{ token.amount }}</td>
        </tr>
      </tbody>
      <tfoot>
        <td colspan="2">TOTAL</td>
        <td>$1920</td>
        <td><input type="number" /></td>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

// const props = defineProps({
//   showDeposit: {
//     type: Boolean,
//     default: false,
//   },
// });
// const open = ref(showDeposit);
// function closeModal() {
//   open.value = !open.value;
// }

const tokenList = ref([
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
  {
    icon: "https://i.postimg.cc/q7Jkt16B/image.png",
    name: "Pangolin",
    price: 2.6,
    available: 8,
    amount: 12,
  },
]);
</script>

<style lang="postcss" scoped>
td {
  @apply py-[10px];
}

th {
  @apply uppercase;
}
</style>
