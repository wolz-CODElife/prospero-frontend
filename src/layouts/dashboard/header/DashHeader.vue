<template>
	<div>
		<div class="grid grid-cols-12 h-[150px] text-[#868C9D] bg-black">
			<!-- Left side of header  -->
			<div
				class="col-span-8 bg-black pl-[30px] border"
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
								class="p-[6px] flex gap-[10px] items-center cursor-pointer"
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
						<h2 class="text-[#868C9D] text-[13px] mt-[16px]">
							My holdings
						</h2>
						<h3 class="text-white text-[20px]">
							{{ portfolioStore.activeOverview?.holdings }}
						</h3>
						<hr class="my-[12px] border-[#2D3035]" />
						<h2 class="text-[#868C9D] text-[13px]">ROI</h2>
						<h3 class="text-white text-[20px]">
							{{ portfolioStore.activeOverview?.roi.value }}
							<span class="text-[13px]"
								>{{ portfolioStore.activeOverview?.roi.percent }}
							</span>
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
							<h2 class="text-[#868C9D] text-[13px]">Deposits</h2>
							<h3 class="text-white text-[16px]">
								{{ portfolioStore.activeOverview?.deposits }}
							</h3>
						</div>

						<hr class="my-[12px] border-[#2D3035]" />
						<div class="border-l border-[#2D3035] pl-[10px]">
							<h2 class="text-[#868C9D] text-[13px]">Withdrawals</h2>
							<h3 class="text-white text-[16px]">
								{{ portfolioStore.activeOverview?.withdrawals }}
							</h3>
						</div>
					</div>
				</div>
			</div>

			<!-- Right side of header  -->
			<div
				class="col-span-4 bg-black border pt-[20px]"
				:class="[
					portfolioStore.activeHeader === 'left'
						? 'border-black border-b-white'
						: 'border-white border-b-0',
					h,
				]"
			>
				<RightHeader />
			</div>
		</div>
	</div>
</template>

<script setup>
import RightHeader from "../header/RightHeader.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();
</script>
