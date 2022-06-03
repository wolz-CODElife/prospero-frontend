<template>
	<div class="px-[24px] py-[12px] text-base text-white bg-[#2D3035]">
		<div>
			<span class=""> {{ address }} </span>
		</div>
	</div>
</template>

<script setup>
defineProps({
	address: {
		type: String,
		required: true,
	},
});
</script>
