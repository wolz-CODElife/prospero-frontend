<template>
	<div
		class="pt-[10px] border border-t-0 border-b-0 border-white w-full"
	></div>
	<div class="border border-t-0 border-white h-[calc(100vh-210px)]">
		<div class="w-full h-[calc(100%-10px)] grid grid-cols-12 gap-x-[10px]">
			<div class="col-span-4">
				<!-- Pie chart  -->
				<PieChartContainer class="h-[65%]" />

				<!--Social Media  -->
				<Socials v-bind="$attrs" class="mt-[10px] h-[35%]" />
			</div>

			<div class="col-span-8">
				<!-- Line chart container  -->
				<div class="bg-[#191A20] h-[40%] max-h-[40%] px-[20px] relative">
					<!-- Line chart top -->
					<div
						class="absolute top-0 text-xs text-[#868C9D] flex justify-between w-[calc(100%-40px)] bg-[#191A20]"
					>
						<div class="flex ml-[20px]">
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'd1'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('d1')"
							>
								1D
							</button>
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'd7'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('d7')"
							>
								7D
							</button>
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'm1'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('m1')"
							>
								1M
							</button>
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'm3'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('m3')"
							>
								3M
							</button>
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'y1'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('y1')"
							>
								1Y
							</button>
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'ytd'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('ytd')"
							>
								YTD
							</button>
							<button
								class="chart-ctrl"
								:class="[
									currentChart === 'all'
										? 'text-[#00FF00] border-t-[#00FF00]'
										: 'text-[#868C9D] border-transparent',
								]"
								@click="changeChart('all')"
							>
								ALL
							</button>
						</div>
						<!-- Date here  -->
						<span class="mr-[30px] mt-[10px] uppercase"
							>Feb 1, 2022, 19:50
						</span>
					</div>

					<!-- Actual line chart  -->
					<LineChart
						:chart-data="portfolioStore.lineChartData"
						class="mt-[50px] absolute bottom-[20px] inset-x-[20px]"
					/>
				</div>

				<!--Table  -->
				<Table v-bind="$attrs" class="mt-[10px] h-[60%] overflow-y-auto" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import PieChartContainer from "@/components/dashboard/PieChartContainer.vue";
import Socials from "@/components/dashboard/Socials.vue";
import Table from "@/components/dashboard/Table.vue";
import LineChart from "@/components/charts/LineChart.ts";
import Loader from "@/components/Loader.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const currentChart = ref("all");

function changeChart(chart) {
	currentChart.value = chart;
}

/*
getLeaderBoardDataOverTime and getMyPortfoliosDataOverTime both return an array of objects for the line charts.
Each objects key is the prospero wallet address, which is then an array of that wallets total value, profits and user invested over time.
time is every day for the last year.
getLeaderBoardDataOverTime will return the leaders value so when a user is clicked on the leader board (all portfolios), use this one and the other one
when the user has clicked on my portfolios.

Here's what it looks like:

myPortfoliosDataOverTime:{
  "0x25da3a563d48f8f226568483fb62b480c7019792": [
    {
      "date": "8-24-2021",
      "profit": 0,
      "value": 0,
      "usdInvested": 0
    },
    {
      "date": "8-25-2021",
      "profit": 0,
      "value": 0,
      "usdInvested": 0
    }...............
	................
	  {
      "date": "8-24-2022",
      "profit": 1781.9954002581285,
      "value": 1784.9954002581285,
      "usdInvested": 2.9999999999999356
    }
  ],
  "0x78bbd8f530fb2f6119509869158b15310592e4f0": [
    {
      "date": "8-24-2021",
      "profit": 0,
      "value": 0,
      "usdInvested": 0
    },
    {
      "date": "8-25-2021",
      "profit": 0,
      "value": 0,
      "usdInvested": 0
    }...........
  ]
]
*/
</script>

<style lang="postcss">
.chart-ctrl {
	@apply pt-[5px] w-[30px] mr-[20px] border-t-2  hover:text-[#00FF00];
}
</style>
