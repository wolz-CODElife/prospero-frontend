<template>
	<!-- Selected portfolio not empty -->
	<div v-if="portfolioStore.selectedPortfolio.name">
		<slot name="selectedPortfolioDisplay"></slot>
	</div>

	<!-- Selected portfolio empty  -->
	<div v-else>
		<div v-if="path === 'dashboard'">
			<!-- Join Mode  -->
			<div v-if="portfolioStore.activeMode === 'join'">
				<!-- Empty Selected Portfolio - 2 modes - All and My -->
				<div :class="emptySelectedCardClasses">
					<!-- All portfolios - 2 extra modes - first time join or not first time -->
					<h2
						class="text-[#868C9D] text-center text-[14px] uppercase"
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
							class="text-[#868C9D] text-center text-[14px] uppercase"
							v-if="portfolioStore.myPortfolios.length === 0"
						>
							Join or create a portfolio first
						</h2>

						<h2
							class="text-[#868C9D] text-center text-[14px] uppercase"
							v-else
						>
							Select A portfolio to display here
						</h2>
					</div>

					<!-- Arrow indicator - -->
					<img src="@/assets/img/arrow.svg" alt="" :class="arrowClass" />
				</div>
			</div>

			<!-- Create/withdraw Mode  -->
			<div
				v-if="
					portfolioStore.activeMode === 'create' ||
					portfolioStore.activeMode === 'withdraw'
				"
			>
				<!-- Create Mode  -->

				<div
					:class="emptySelectedCardClasses"
					v-if="portfolioStore.activeMode === 'create'"
				>
					<h2 class="text-[#868C9D] text-center text-[14px] uppercase">
						Create
						<span v-if="portfolioStore.createdPortfolios.length === 0"
							>First
						</span>
						Portfolio to Manage
					</h2>
					<img src="@/assets/img/arrow.svg" alt="" :class="arrowClass" />
				</div>

				<!-- Selected portfolio not empty  -->
			</div>
		</div>

		<div v-else-if="path === 'manage'">
			<!-- Selected portfolio empty  -->
			<div
				v-if="portfolioStore.selectedPortfolio.name === ''"
				:class="emptySelectedCardClasses"
			>
				<h2 class="text-[#868C9D] text-center text-[14px] uppercase">
					Select a portfolio to manage
				</h2>
				<img src="@/assets/img/arrow.svg" alt="" :class="arrowClass" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePortfolios } from "@/stores/Portfolios";
import { useRouter } from "vue-router";
import Stats from "./Stats.vue";

const { currentRoute } = useRouter();

defineProps({
	emptySelectedCardClasses: String,
	arrowClass: String,
});

const path = computed(() => {
	return currentRoute.value.name;
});

const portfolioStore = usePortfolios();

function slice(str) {
	if (str.length <= 13) return str;
	return str.slice(0, 10) + "...";
}
</script>
