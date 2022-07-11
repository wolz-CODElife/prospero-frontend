<template>
	<div v-if="path === 'dashboard'">
		<div v-if="portfolioStore.activeMode === 'join'">
			<!-- Selected portfolio not empty - stats  -->
			<div v-if="portfolioStore.selectedPortfolio.name">
				<!-- slot will work here -->
				<p class="text-white">insert slot here</p>
			</div>

			<!-- Empty Selected Portfolio - 2 modes - All and My -->
			<div
				class="h-full flex flex-col gap-y-[24px] justify-center items-center"
				v-else
			>
				<!-- All portfolios - 2 extra modes - first time join or not first time -->
				<h2
					class="text-center text-[14px] uppercase"
					v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
				>
					Select
					<span v-if="portfolioStore.joinedPortfolios.length === 0"
						>first</span
					>
					Portfolio to Join
				</h2>

				<!-- My portfolios - 2 modes - empty myPortfolios, !empty myPortfolios  -->
				<div
					v-else-if="
						portfolioStore.activePortfolioType === 'My Portfolios'
					"
				>
					<h2
						class="text-center text-[14px] uppercase"
						v-if="portfolioStore.myPortfolios.length === 0"
					>
						Join a portfolio first
					</h2>

					<h2 class="text-center text-[14px] uppercase" v-else>
						Select A portfolio to display here
					</h2>
				</div>

				<!-- Arrow indicator - todo: add class props  -->
				<img src="@/assets/img/arrow.svg" alt="" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();
</script>

<style lang="postcss" scoped>
h2 {
	@apply text-[#868C9D];
}
</style>
