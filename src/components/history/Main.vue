<template>
	<div>kmdkmdkd</div>
	<!-- <div class="pt-[10px] w-full h-screen">
		<div class="flex">
			<h2 class="text-[20px] text-white">Account History</h2>

			<div class="flex gap-[30px]">
				<button
					v-for="(tab, i) in tabs"
					:key="i"
					@click="
									filterActiveHistoryType(i),
								"
					class="py-[8px] px-[15px] text-[14px] w-[160px] uppercase cursor-pointer"
					:class="[
						portfolioStore.activePortfolioType === tab
							? 'bg-[#2D3035] text-white'
							: 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
					]"
				>
					{{ tab }}
				</button>
			</div>
		</div>
	</div> -->
</template>

<script setup>
import Table from "@/components/dashboard/Table.vue";
</script>
