<template>
  <div
    class="px-[24px] py-[12px] text-base text-white bg-[#2D3035] flex justify-between"
  >
    <span class=""> {{ walletAddress[0] }}...{{ walletAddress[1] }} </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="w-[16px]"
      fill="white"
    >
      <path
        d="M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const walletAddress = computed(() => [
  props.address.slice(0, 6),
  props.address.slice(-6),
]);
</script>
