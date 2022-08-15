<template>
	<div
		class="w-full bg-[#2D3035] flex gap-[16px] justify-between items-center text-left p-[20px] mb-[20px]"
	>
		<div class="flex flex-col gap-y-[16px] font-medium uppercase">
			<div class="">
				<h2 class="text-[#868C9D] text-[12px]">Portfolio</h2>
				<h3 class="text-white text-[16px]">
					{{ portfolioStore.selectedPortfolio.name }}
				</h3>
			</div>
			<div class="">
				<h2 class="text-[#868C9D] text-[12px]">Available Balance</h2>
				<h3 class="text-white text-[16px]">
					${{
						portfolioStore.selectedPortfolio.portfolioObject.totalValue.toFixed(
							2
						)
					}}
				</h3>
			</div>
		</div>

		<!-- Logo  -->
		<img
			src="https://i.postimg.cc/tJMqnqDk/image.png"
			alt=""
			class="w-[45px]"
		/>
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";
const portfolioStore = usePortfolios();
</script>
