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
					${{ getProfit(portfolioStore.selectedPortfolio) }}

					<span class="text-[14px]"
						>{{ getProfitPercentage(portfolioStore.selectedPortfolio) }}
					</span>
				</h3>
			</div>
		</div>

		<!-- Right stats -->
		<div class="flex-1">
			<div class="border-l border-[#2D3035] pl-[10px]">
				<h2 class="text-[#868C9D] text-[14px]">AUM</h2>
				<h3 class="text-white text-[16px]">
					${{ getTotalValue(portfolioStore.selectedPortfolio) }}
				</h3>
			</div>

			<hr class="my-[12px] border-[#2D3035]" />
			<div class="border-l border-[#2D3035] pl-[10px]">
				<h2 class="text-[#868C9D] text-[14px]">Investors</h2>
				<h3 class="text-white text-[16px]">
					{{ getNumberOfTrailers(portfolioStore.selectedPortfolio) }}
				</h3>
			</div>
		</div>
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";
import { getLeadersPortfolioForAddress } from "@/api";
const portfolioStore = usePortfolios();

function slice(str) {
	if (str.length <= 13) return str;
	return str.slice(0, 10) + "...";
}

function getProfit(portObject) {
	portObject = portObject["portfolioObject"];

	if (portObject == undefined) {
		return 0;
	}

	var profit = portObject["profit"];

	if (profit == 0) {
		return 0;
	}

	profit = profit.toFixed(2);

	return profit;
}

function getNumberOfTrailers(portObject) {
	if (portObject == undefined) {
		return 0;
	}
	return portObject["numberOfTrailers"];
}

function getProfitPercentage(portObject) {
	//console.log("pp getNumberOfTrailers portObject:"+JSON.stringify(portObject,null,2))

	//console.log("portObject:"+JSON.stringify(portObject,null,2))
	if (portObject == null) {
		return 0;
	}

	var profitP = portObject.y1;
	if (profitP == 0) {
		return 0;
	}
	return profitP; //.toFixed(2);
}

function getTotalValue(portObject) {
	portObject = portObject["portfolioObject"];
	if (portObject == undefined) {
		return 0;
	}
	var totalValue = portObject.totalValue;
	totalValue = totalValue.toFixed(2);
	return totalValue;
}
</script>
