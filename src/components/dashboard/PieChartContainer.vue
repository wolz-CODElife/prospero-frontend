<template>
	<div class="row-span-5 bg-[#191A20] px-[28px] py-[20px]">
		<div class="h-[108px] grid grid-cols-12 gap-x-[10px] items-center">
			<!-- Left button  -->
			<button
				class="h-full col-span-1 w-[24px] flex justify-center items-center bg-[#2D3035]"
			>
				<img
					src="@/assets/img/left-angle.svg"
					alt=""
					class="fill-[#868C9D]"
				/>
			</button>

			<!-- Directions  -->
			<div class="col-span-10 h-[108px] overflow-x-auto">
				<DashDir
					empty-selected-card-classes="h-full flex flex-col gap-y-[14px] justify-center items-center"
					arrow-class="-rotate-45"
				>
					<template #selectedPortfolioDisplay>
						<div class="flex gap-[24px] text-white">
							<div
								v-for="(portfolio, i) in portfolioStore
									.selectedPortfolio.portfolioObject"
								:key="i"
							>
								<div
									class="flex flex-col items-center justify-center border border-[#2D3035] px-[10px] py-[14px] bg-[#1F2127]"
									v-if="displayPerc(portfolio.percentage) !== 'NaN%'"
								>
									<img
										:src="portfolio.image"
										alt="portfolio image"
										class="w-[20px] h-[20px] mb-[20px]"
									/>
									<div class="text-[10px] mb-[5px]">
										{{ portfolio.symbol }}
									</div>
									<div class="text-[12px]">
										{{ displayPerc(portfolio.percentage) }}
									</div>

									<div
										class="h-[10px] w-full"
										:style="{ backgroundColor: portfolio.color }"
									></div>
								</div>
							</div>
						</div>
					</template>
				</DashDir>
			</div>

			<!-- Right button  -->
			<button
				class="h-full col-span-1 w-[24px] col-end-13 flex justify-center items-center bg-[#2D3035]"
			>
				<img
					src="@/assets/img/right-angle.svg"
					alt=""
					class="fill-[#868C9D]"
				/>
			</button>
		</div>

		<!-- Pie chart  -->

		<div class="mt-[90px]">
			<PieChart
				v-if="portfolioStore.selectedPortfolio.name"
				:chart-data="realChartData"
			/>

			<img
				v-else
				src="https://i.postimg.cc/KjHz2Jzs/image.png"
				alt=""
				class="w-[250px] mx-auto"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import DashDir from "@/layouts/dashboard/DashDir.vue";
import Stats from "@/layouts/dashboard/Stats.vue";
import PieChart from "../charts/PieChart.ts";

import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

// const pieChartPlugins = ref([

// ])
// portfolioStore.selectedPortfolio.portfolioObject.map((item) => {
// 				return parseFloat(displayPerc(item.percentage).replace("%", ""));
// 			}),

// let chartData = ref({
// 	labels: ["", ""],
// 	datasets: [
// 		{
// 			backgroundColor: ["#7262C5", "#2854D7"],
// 			data: [30, 60],
// 		},
// 	],
// });

const realChartData = computed(() => {
	let chartData = [];
	for (const item in portfolioStore.selectedPortfolio.portfolioObject) {
		chartData.push(portfolioStore.selectedPortfolio.portfolioObject[item]);
	}
	return {
		labels: chartData.map((item) => {
			return item.name;
		}),
		datasets: [
			{
				backgroundColor: chartData.map((portfolio) => {
					return portfolio.color;
				}),
				data: chartData.map((item) => {
					return parseFloat(displayPerc(item.percentage).replace("%", ""));
				}),
			},
		],
	};
});

function displayPerc(perc) {
	return (perc * 100).toFixed(1) + "%";
}
</script>
