<template>
	<!-- Join Directions  -->
	<div class="" v-if="portfolioStore.activeMode === 'join'">
		<!-- 'All Portfolios' instruction permutations-->
		<div v-if="portfolioStore.activePortfolioType === 'All Portfolios'">
			<div>
				<h2
					class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase"
					v-if="portfolioStore.selectedPortfolio.name"
				>
					Insert token charts here
				</h2>

				<h2
					class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase"
					v-else
				>
					Select
					<span v-if="portfolioStore.allPortfolios.length === 0"
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
					class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase"
					v-if="portfolioStore.selectedPortfolio.name"
				>
					Insert token charts here
				</h2>

				<h2
					class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase"
					v-else
				>
					Select a portfolio to display here
				</h2>
			</div>
		</div>

		<img
			v-if="!portfolioStore.selectedPortfolio.name"
			src="@/assets/img/arrow.svg"
			alt=""
			class="-rotate-45 mx-auto mt-[26px]"
		/>
	</div>

	<!-- Create Directions  -->
	<div class="" v-if="portfolioStore.activeMode === 'create'">
		<h2 class="text-[#868C9D] text-[14px] text-center mt-[16px] uppercase">
			Create
			<span v-if="portfolioStore.createdPortfolios.length === 0">First</span>
			portfolio to manage
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
