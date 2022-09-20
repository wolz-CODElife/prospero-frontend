<template>
	<button
		class="w-full bg-[#2D3035] flex gap-[16px] justify-between items-center text-left px-[20px] mb-[20px]"
		@click="$emit('withdrawAction')"
	>
		<div class="basis-3/4">
			<h5 class="text-[14px] font-medium text-white uppercase">
				{{ props.title }}
			</h5>
			<p class="text-[#C3C7CD] text-[12px]">{{ props.desc }}</p>
		</div>

		<img
			:src="props.icon"
			alt=""
			class="w-[120px] max-h-[80%] object-contain"
		/>

		<img src="https://i.postimg.cc/L8298gb5/image.png" alt="" />
	</button>
</template>

<script setup>
const props = defineProps(["title", "desc", "icon"]);
</script>
