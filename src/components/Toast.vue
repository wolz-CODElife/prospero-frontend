<template>
	<!-- convert to toast component eventually: todo  -->
	<div
		class="fixed bottom-0 inset-x-0 bg-[#] z-[1000]"
		:class="[
			props.toast.type === 'success' ? 'bg-[#40b96e]' : 'bg-[#A96965]',
		]"
		v-if="props.toast.isToastActive"
	>
		<div class="mx-auto text-center text-white py-[12px]">
			{{ props.toast.text }}
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	toast: {
		type: Object,
	},
});
</script>
