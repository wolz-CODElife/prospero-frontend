<template>
	<div class="row-span-5 bg-[#191A20] px-[28px] py-[20px]">
		<div class="h-[108px] flex justify-between items-center">
			<!-- Left button  -->
			<button
				class="h-full w-[24px] flex justify-center items-center bg-[#2D3035]"
			>
				<img
					src="@/assets/img/left-angle.svg"
					alt=""
					class="fill-[#868C9D]"
				/>
			</button>

			<!-- Directions  -->
			<DashDir
				empty-selected-card-classes="h-full flex flex-col gap-y-[14px] justify-center items-center"
				arrow-class="-rotate-45"
			>
				<template #selectedPortfolioDisplay>
					<div class="flex gap-[24px] text-white">
						<div
							v-for="(portfolio, i) in portfolioStore.selectedPortfolio
								.portfolioObject"
							:key="i"
						>
							<div
								class="flex flex-col items-center justify-center gap-[12px]"
							>
								<img :src="portfolio.image" alt="portfolio image" />
								<div>{{ portfolio.name }}</div>
								<div>{{ percent(portfolio.percentage) }}</div>
							</div>
						</div>
					</div>
				</template>
			</DashDir>

			<!-- Right button  -->
			<button
				class="h-full w-[24px] flex justify-center items-center bg-[#2D3035]"
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
			<img
				src="https://i.postimg.cc/KjHz2Jzs/image.png"
				alt=""
				class="w-[250px] mx-auto"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import DashDir from "@/layouts/dashboard/DashDir.vue";
import Stats from "@/layouts/dashboard/Stats.vue";

import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const percent = computed((arg) => {
	return arg + "%";
});
</script>
