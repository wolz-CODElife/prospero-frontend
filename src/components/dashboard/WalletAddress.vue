<template>
	<div class="px-[24px] py-[12px] text-base text-white bg-[#2D3035]">
		<div>
			<span class=""> {{ walletAddress[0] }}...{{ walletAddress[1] }} </span>
		</div>
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
