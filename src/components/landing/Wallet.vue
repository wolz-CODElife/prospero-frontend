<template>
	<button
		class="w-full bg-transparent border-[0.5px] border-[#009D98] text-white text-[14px] hover:bg-[#009D98] flex justify-between items-center py-[12px] px-[20px] mb-[20px]"
		@click="$emit('connect')"
	>
		<h5 class="text-sm md:text-base uppercase">{{ wallet }}</h5>

		<img :src="logo" alt="" class="h-[40px] object-contain" />
	</button>
</template>

<script setup>
const props = defineProps(["wallet", "logo"]);
</script>
