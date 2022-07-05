<template>
	<div
		class="w-full flex justify-center items-center gap-x-[24px]"
		v-if="
			portfolioStore.activeMode === 'join' ||
			portfolioStore.activeMode === 'withdraw'
		"
	>
		<!-- Selected portfolio not empty  -->

		<h2
			class="text-[#868C9D] text-[14px] uppercase"
			v-if="portfolioStore.selectedPortfolio.name"
		>
			<span v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
				>Follow</span
			>
			{{ portfolioStore.selectedPortfolio.name }} Community
		</h2>

		<!-- Empty Selected Portfolio  -->
		<div class="h-full flex gap-[14px] justify-center items-center" v-else>
			<h2
				class="text-[#868C9D] text-[14px] text-center uppercase"
				v-if="portfolioStore.activePortfolioType === 'My Portfolios'"
			>
				Select A portfolio to display here
			</h2>

			<h2 v-else class="text-[#868C9D] text-[14px] uppercase">
				Select
				<span v-if="portfolioStore.allPortfolios.length === 0">first</span>
				Portfolio to Join
			</h2>

			<img src="@/assets/img/arrow.svg" alt="" class="-rotate-90" />
		</div>
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
