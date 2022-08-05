<template>
	<div v-if="path === 'dashboard'">
		<!-- Join Mode  -->
		<div v-if="portfolioStore.activeMode === 'join'">
			<!-- Selected portfolio not empty  -->
			<div
				v-if="portfolioStore.selectedPortfolio.name"
				class="flex items-center justify-between font-medium uppercase"
			>
				<!-- Left stats -->
				<div class="flex-1">
					<div class="pl-[30px]">
						<h2 class="text-[#868C9D] text-[14px]">Name</h2>
						<h3 class="text-white text-[16px]">
							{{ slice(portfolioStore.selectedPortfolio.name) }}
						</h3>
					</div>

					<hr class="my-[12px] border-[#2D3035]" />
					<div class="pl-[30px]">
						<h2 class="text-[#868C9D] text-[14px]">ROI</h2>
						<h3 class="text-white text-[16px]">
							+$0
							<span class="text-[14px]">0% <span>^</span></span>
						</h3>
					</div>
				</div>

				<!-- Right stats -->
				<div class="flex-1">
					<div class="border-l border-[#2D3035] pl-[10px]">
						<h2 class="text-[#868C9D] text-[14px]">AUM</h2>
						<h3 class="text-white text-[16px]">$0</h3>
					</div>

					<hr class="my-[12px] border-[#2D3035]" />
					<div class="border-l border-[#2D3035] pl-[10px]">
						<h2 class="text-[#868C9D] text-[14px]">Investors</h2>
						<h3 class="text-white text-[16px]">0</h3>
					</div>
				</div>
			</div>

			<!-- Empty Selected Portfolio  -->
			<div
				class="h-full flex flex-col gap-y-[24px] justify-center items-center"
				v-else
			>
				<h2
					class="text-center text-[14px] uppercase"
					v-if="portfolioStore.activePortfolioType === 'My Portfolios'"
				>
					Select A portfolio to display here
				</h2>

				<h2 class="text-center text-[14px] uppercase" v-else>
					Select
					<span v-if="portfolioStore.allPortfolios.length === 0"
						>first</span
					>
					Portfolio to Join
				</h2>

				<img src="@/assets/img/arrow.svg" alt="" />
			</div>
		</div>

		<!-- Create/withdraw Mode  -->
		<div
			v-if="
				portfolioStore.activeMode === 'create' ||
				portfolioStore.activeMode === 'withdraw'
			"
		>
			<!-- Create Portfolio  -->
			<div
				class="h-full flex flex-col gap-y-[24px] justify-center items-center"
				v-if="portfolioStore.activeMode === 'create'"
			>
				<h2 class="text-center text-[14px] uppercase">
					Create
					<span v-if="portfolioStore.createdPortfolios.length === 0"
						>First
					</span>
					Portfolio to Manage
				</h2>
				<img src="@/assets/img/arrow.svg" alt="" />
			</div>

			<!-- Selected portfolio not empty  -->
			<div
				v-if="portfolioStore.selectedPortfolio.name"
				class="flex items-center justify-between font-medium uppercase"
			>
				<!-- Left stats -->
				<div class="flex-1">
					<div class="pl-[30px]">
						<h2 class="text-[#868C9D] text-[14px]">Name</h2>
						<h3 class="text-white text-[16px]">
							{{ slice(portfolioStore.selectedPortfolio.name) }}
						</h3>
					</div>

					<hr class="my-[12px] border-[#2D3035]" />
					<div class="pl-[30px]">
						<h2 class="text-[#868C9D] text-[14px]">ROI</h2>
						<h3 class="text-white text-[16px]">
							+$0
							<span class="text-[14px]">0% <span>^</span></span>
						</h3>
					</div>
				</div>

				<!-- Right stats -->
				<div class="flex-1">
					<div class="border-l border-[#2D3035] pl-[10px]">
						<h2 class="text-[#868C9D] text-[14px]">AUM</h2>
						<h3 class="text-white text-[16px]">$0</h3>
					</div>

					<hr class="my-[12px] border-[#2D3035]" />
					<div class="border-l border-[#2D3035] pl-[10px]">
						<h2 class="text-[#868C9D] text-[14px]">Investors</h2>
						<h3 class="text-white text-[16px]">0</h3>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div v-else-if="path === 'manage'">
		<!-- Create Portfolio  -->

		<!-- Selected portfolio not empty  -->
		<div
			v-if="portfolioStore.selectedPortfolio.name"
			class="flex items-center justify-between font-medium uppercase"
		>
			<!-- Left stats -->
			<div class="flex-1">
				<div class="pl-[30px]">
					<h2 class="text-[#868C9D] text-[14px]">Name</h2>
					<h3 class="text-white text-[16px]">
						{{ slice(portfolioStore.selectedPortfolio.name) }}
					</h3>
				</div>

				<hr class="my-[12px] border-[#2D3035]" />
				<div class="pl-[30px]">
					<h2 class="text-[#868C9D] text-[14px]">ROI</h2>
					<h3 class="text-white text-[16px]">
						{{ slice(portfolioStore.selectedPortfolio.profitPercentage) }}
						<span class="text-[14px]">0% <span>^</span></span>
					</h3>
				</div>
			</div>

			<!-- Right stats -->
			<div class="flex-1">
				<div class="border-l border-[#2D3035] pl-[10px]">
					<h2 class="text-[#868C9D] text-[14px]">AUM</h2>
					<h3 class="text-white text-[16px]">$0</h3>
				</div>

				<hr class="my-[12px] border-[#2D3035]" />
				<div class="border-l border-[#2D3035] pl-[10px]">
					<h2 class="text-[#868C9D] text-[14px]">Investors</h2>
					<h3 class="text-white text-[16px]">0</h3>
				</div>
			</div>
		</div>

		<!-- Selected portfolio empty  -->
		<div
			v-else
			class="h-full flex flex-col gap-y-[24px] justify-center items-center"
		>
			<h2 class="text-center text-[14px] uppercase">
				{{ manageDir }}
			</h2>
			<img src="@/assets/img/arrow.svg" alt="" :class="props.class" />
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePortfolios } from "@/stores/Portfolios";
import { useRouter } from "vue-router";

const { currentRoute } = useRouter();

const props = defineProps({
	manageDir: {
		type: String,
		default: "Select a portfolio to manage",
	},

	class: {
		type: String,
		required: false,
	},
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
