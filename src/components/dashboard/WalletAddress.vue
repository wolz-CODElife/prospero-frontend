<template>
  <div class="px-[24px] py-[8px] text-base text-white bg-[#2D3035]">
    <span class=""> {{ walletAddress[0] }}...{{ walletAddress[1] }} </span>
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
  props.address.slice(0, 5),
  props.address.slice(-4),
]);
</script>
