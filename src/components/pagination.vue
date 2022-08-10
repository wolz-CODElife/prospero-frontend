<template>
	<div class="flex justify-end items-center gap-[15px]">
		<span class="text-[#C3C7CD] text-[14px]">Page</span>

		<!-- Current page -->
		<input
			type="number"
			@change="$emit('updateShowingPortfolios')"
			aria-label="current page"
			:max="totalLeaderboardPages"
			:value="currentPage"
			class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
		/>

		<!-- Total pages count  -->
		<span class="text-[#C3C7CD] text-[14px]"
			>of <span class="ml-[10px]"> {{ totalLeaderboardPages }}</span></span
		>

		<!-- Prev & Next  -->
		<div class="flex gap-0">
			<button class="px-[14px] bg-[#005A57]" @click="$emit('prevPage')">
				<img src="@/assets/img/left-angle.svg" alt="" />
			</button>

			<button class="px-[14px] bg-[#005A57]" @click="$emit('nextPage')">
				<img
					src="@/assets/img/left-angle.svg"
					alt=""
					class="transform rotate-180"
				/>
			</button>
		</div>
	</div>
</template>

<script setup>
defineProps({});
</script>
