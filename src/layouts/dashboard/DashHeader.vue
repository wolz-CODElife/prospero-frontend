<template>
	<div>
		<div class="grid grid-cols-12 h-full text-[#868C9D] bg-black">
			<!-- Left side of header  -->
			<div
				class="col-span-8 bg-black pl-[30px] py-[10px] border"
				:class="[
					portfolioStore.activeHeader === 'left'
						? 'border-white border-b-0'
						: 'border-black border-b-white',
				]"
			>
				<div
					class="flex items-center justify-between font-medium uppercase"
				>
					<!-- Types of asset -->
					<div class="w-[130px] p-[10px] bg-[#2D3035]">
						<ul>
							<li
								v-for="tab in portfolioStore.overview"
								:key="tab"
								@click="
									portfolioStore.updateActiveOverview(tab.asset.name)
								"
								class="p-[6px] flex gap-[10px] items-center"
								:class="[
									portfolioStore.activeOverview.asset.name ===
									tab.asset.name
										? 'bg-black text-white shadow-[0px_0px_5px_rgba(0,0,0,0.5);]'
										: 'bg-[#2D3035] text-[#868C9D]',
								]"
							>
								<span>
									<img
										:src="tab.asset.icon"
										alt=""
										class="w-[20px] h-[20px]"
								/></span>
								{{ tab.asset.name }}
							</li>
						</ul>
					</div>

					<!-- Left stats -->
					<div class="flex-1 ml-[30px]">
						<h2 class="text-[#868C9D] text-[14px] mt-[16px]">
							My holdings
						</h2>
						<h3 class="text-white text-[24px]">
							${{ portfolioStore.activeOverview?.holdings }}
						</h3>
						<hr class="my-[12px] border-[#2D3035]" />
						<h2 class="text-[#868C9D] text-[14px]">ROI</h2>
						<h3 class="text-white text-[24px]">
							+${{ portfolioStore.activeOverview?.roi.value }}
							<span class="text-[14px]"
								>{{ portfolioStore.activeOverview?.roi.percent }}%
								<span>^</span></span
							>
						</h3>
					</div>

					<!--Toggler  -->
					<button
						@click="portfolioStore.toggleActiveHeader"
						class="mx-[10px]"
					>
						<img
							src="@/assets/img/green-toggle.svg"
							alt=""
							v-if="portfolioStore.activeHeader === 'left'"
						/>
						<img src="@/assets/img/white-toggle.svg" alt="" v-else />
					</button>

					<!-- Right stats -->
					<div class="flex-1">
						<div class="border-l border-[#2D3035] pl-[10px]">
							<h2 class="text-[#868C9D] text-[14px]">Deposits</h2>
							<h3 class="text-white text-[16px]">
								${{ portfolioStore.activeOverview?.deposits }}
							</h3>
						</div>

						<hr class="my-[12px] border-[#2D3035]" />
						<div class="border-l border-[#2D3035] pl-[10px]">
							<h2 class="text-[#868C9D] text-[14px]">Withdrawals</h2>
							<h3 class="text-white text-[16px]">
								${{ portfolioStore.activeOverview?.withdrawals }}
							</h3>
						</div>
					</div>
				</div>
			</div>

			<!-- Right side of header  -->
			<div
				class="col-span-4 bg-black border py-[20px]"
				:class="[
					portfolioStore.activeHeader === 'left'
						? 'border-black border-b-white'
						: 'border-white border-b-0',
				]"
			>
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
							v-if="
								portfolioStore.activePortfolioType === 'My Portfolios'
							"
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
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePortfolios } from "@/stores/Portfolios";
import { computed } from "@vue/reactivity";

const portfolioStore = usePortfolios();

const props = defineProps({
	cmd: {
		type: String,
		default: "Select First Portfolio to Join",
	},
});

function slice(str) {
	if (str.length <= 13) return str;
	return str.slice(0, 10) + "...";
}
</script>
