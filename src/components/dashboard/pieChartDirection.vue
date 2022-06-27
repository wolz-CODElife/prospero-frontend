<template>
	<!-- Join Directions  -->
	<div
		class=""
		v-if="
			!portfolioStore.createMode &&
			portfolioStore.selectedPortfolio.name === ''
		"
	>
		<h2 class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase">
			Select first portfolio to join
		</h2>
		<img
			src="@/assets/img/arrow.svg"
			alt=""
			class="-rotate-45 mx-auto mt-[26px]"
		/>
	</div>

	<!-- Create Directions  -->
	<div
		class=""
		v-if="
			portfolioStore.createMode &&
			portfolioStore.createdPortfolios.length === 0
		"
	>
		<h2 class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase">
			Create First portfolio to manage
		</h2>
		<img
			src="@/assets/img/arrow.svg"
			alt=""
			class="-rotate-45 mx-auto mt-[26px]"
		/>
	</div>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();
</script>
