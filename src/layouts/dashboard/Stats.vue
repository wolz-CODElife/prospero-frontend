<template>
	<div class="flex items-center justify-between font-medium uppercase">
		<!-- Left stats -->
		<div class="flex-1">
			<div class="pl-[30px]">
				<h2 class="text-[#868C9D] text-[14px]">Name</h2>
				<h3 class="text-white text-[16px]">
					{{ slice(portfolioStore.selectedPortfolio.name) }}
				</h3>
			</div>

			<hr class="my-[12px] border-[#2D3035]" />
			<div class="pl-[30px]">
				<h2 class="text-[#868C9D] text-[14px]">ROI</h2>
				<h3 class="text-white text-[16px]">
					+$0
					<span class="text-[14px]">0% <span>^</span></span>
				</h3>
			</div>
		</div>

		<!-- Right stats -->
		<div class="flex-1">
			<div class="border-l border-[#2D3035] pl-[10px]">
				<h2 class="text-[#868C9D] text-[14px]">AUM</h2>
				<h3 class="text-white text-[16px]">$0</h3>
			</div>

			<hr class="my-[12px] border-[#2D3035]" />
			<div class="border-l border-[#2D3035] pl-[10px]">
				<h2 class="text-[#868C9D] text-[14px]">Investors</h2>
				<h3 class="text-white text-[16px]">0</h3>
			</div>
		</div>
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

function slice(str) {
	if (str.length <= 13) return str;
	return str.slice(0, 10) + "...";
}
</script>
