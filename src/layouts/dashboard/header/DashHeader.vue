<template>
	<div>
		<div class="grid grid-cols-12 h-[190px] text-[#868C9D] bg-black">
			<!-- Left side of header  -->
			<div
				class="col-span-8 bg-black pl-[30px] py-[10px] border"
				:class="[
					portfolioStore.activeHeader === 'left'
						? 'border-white border-b-0'
						: 'border-black border-b-white',
				]"
			>
				<div
					class="flex items-center justify-between font-medium uppercase"
				>
					<!-- Types of asset -->
					<div class="w-[130px] p-[10px] bg-[#2D3035]">
						<ul>
							<li
								v-for="tab in portfolioStore.overview"
								:key="tab"
								@click="
									portfolioStore.updateActiveOverview(tab.asset.name)
								"
								class="p-[6px] flex gap-[10px] items-center"
								:class="[
									portfolioStore.activeOverview.asset.name ===
									tab.asset.name
										? 'bg-black text-white shadow-[0px_0px_5px_rgba(0,0,0,0.5);]'
										: 'bg-[#2D3035] text-[#868C9D]',
								]"
							>
								<span>
									<img
										:src="tab.asset.icon"
										alt=""
										class="w-[20px] h-[20px]"
								/></span>
								{{ tab.asset.name }}
							</li>
						</ul>
					</div>

					<!-- Left stats -->
					<div class="flex-1 ml-[30px]">
						<h2 class="text-[#868C9D] text-[14px] mt-[16px]">
							My holdings
						</h2>
						<h3 class="text-white text-[24px]">${{ myHoldings }}</h3>
						<hr class="my-[12px] border-[#2D3035]" />
						<h2 class="text-[#868C9D] text-[14px]">ROI</h2>
						<h3 class="text-white text-[24px]">
							+${{ portfolioStore.activeOverview?.roi.value }}
							<span class="text-[14px]"
								>{{ portfolioStore.activeOverview?.roi.percent }}%
								<span>^</span></span
							>
						</h3>
					</div>

					<!--Toggler  -->
					<button
						@click="portfolioStore.toggleActiveHeader"
						class="mx-[10px]"
					>
						<img
							src="@/assets/img/green-toggle.svg"
							alt=""
							v-if="portfolioStore.activeHeader === 'left'"
						/>
						<img src="@/assets/img/white-toggle.svg" alt="" v-else />
					</button>

					<!-- Right stats -->
					<div class="flex-1">
						<div class="border-l border-[#2D3035] pl-[10px]">
							<h2 class="text-[#868C9D] text-[14px]">Deposits</h2>
							<h3 class="text-white text-[16px]">
								${{ portfolioStore.activeOverview?.deposits }}
							</h3>
						</div>

						<hr class="my-[12px] border-[#2D3035]" />
						<div class="border-l border-[#2D3035] pl-[10px]">
							<h2 class="text-[#868C9D] text-[14px]">Withdrawals</h2>
							<h3 class="text-white text-[16px]">
								${{ portfolioStore.activeOverview?.withdrawals }}
							</h3>
						</div>
					</div>
				</div>
			</div>

			<!-- Right side of header  -->
			<div
				class="col-span-4 bg-black border py-[30px]"
				:class="[
					portfolioStore.activeHeader === 'left'
						? 'border-black border-b-white'
						: 'border-white border-b-0',
				]"
			>
				<RightHeader />
			</div>
		</div>
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";
import RightHeader from "../header/RightHeader.vue";

const portfolioStore = usePortfolios();
calculateTotals();

var myHoldings = 0;

function calculateTotals() {
	console.log("calculateTotals - how to call after api call?");
	var myPortfolios = portfolioStore.myPortfolios;

	//console.log("portfolioStore:" + JSON.stringify(portfolioStore, null, 2));
	myHoldings = 0;
	var deposits = 0;
	var withdrawals = 0;
	var roiTotal = 0;
	for (var i = 0; i < myPortfolios.length; i++) {
		var thisPortObj = myPortfolios[i];
		var portfolioObject = thisPortObj["portfolioObject"];
		if (portfolioObject != undefined) {
			//console.log(
			//	"portfolioObject:" + JSON.stringify(portfolioObject, null, 2)
			//);
			myHoldings = myHoldings + portfolioObject.totalValue;
			deposits = deposits + portfolioObject.totalUsd;
			//withdrawals = withdrawa
			roiTotal = roiTotal + portfolioObject.profit;
			console.log("myHoldings:" + myHoldings);
		}
	}
	
}


</script>
