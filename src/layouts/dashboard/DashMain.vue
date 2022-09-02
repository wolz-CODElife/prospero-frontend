<template>
	<div
		class="pt-[10px] border border-t-0 border-b-0 border-white w-full"
	></div>
	<div
		class="border border-t-0 border-white max-h-[calc(100vh-240px)] overflow-y-auto"
	>
		<div class="w-full grid grid-cols-12 gap-[10px]">
			<div class="col-span-4 grid grid-rows-5 gap-y-[10px]">
				<!-- Pie chart  -->
				<PieChartContainer class="" />

				<!--Social Media  -->
				<Socials v-bind="$attrs" class="" />
			</div>

			<div class="col-span-8 grid grid-rows-5 gap-[10px]">
				<!-- Line chart container  -->
				<div class="bg-[#191A20] row-span-2 px-[40px] py-[20px]">
					<!-- Line chart  -->
					<LineChart :chart-data="portfolioStore.lineChartData" />
				</div>

				<!--Table  -->
				<Table v-bind="$attrs" class="row-span-3" />
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
