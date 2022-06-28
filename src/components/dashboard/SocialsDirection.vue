<template>
	<!-- Join -->
	<div
		class="w-full flex justify-center items-center gap-x-[24px]"
		v-if="portfolioStore.activeMode === 'join'"
	>
		<!-- 'All Portfolios' instruction permutations-->
		<div v-if="portfolioStore.activePortfolioType === 'All Portfolios'">
			<div>
				<h2
					class="text-[#868C9D] text-[14px] uppercase"
					v-if="portfolioStore.selectedPortfolio.name"
				>
					Follow {{ portfolioStore.selectedPortfolio.name }} Community
				</h2>

				<h2 class="text-[#868C9D] text-[14px] uppercase" v-else>
					Select
					<span v-if="portfolioStore.joinedPortfolios.length === 0"
						>first</span
					>
					portfolio to join
				</h2>
			</div>
		</div>

		<!-- 'My Portfolios' instruction permutations -->
		<div v-else>
			<div>
				<h2
					class="text-[#868C9D] text-[14px] uppercase"
					v-if="portfolioStore.selectedPortfolio.name"
				>
					{{ portfolioStore.selectedPortfolio.name }} Community
				</h2>

				<h2 class="text-[#868C9D] text-[14px] uppercase" v-else>
					Select a portfolio to display here
				</h2>
			</div>
		</div>

		<img
			v-if="!portfolioStore.selectedPortfolio.name"
			src="@/assets/img/arrow.svg"
			alt=""
			class="-rotate-90"
		/>
	</div>

	<!-- Create -->
	<div
		class="w-full flex justify-center items-center gap-x-[24px]"
		v-if="portfolioStore.activeMode === 'create'"
	>
		<h2 class="text-[#868C9D] text-[14px] uppercase">
			Create
			<span v-if="portfolioStore.createdPortfolios.length === 0">First</span>
			portfolio to manage
		</h2>

		<img src="@/assets/img/arrow.svg" alt="" class="-rotate-90" />
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();
</script>
