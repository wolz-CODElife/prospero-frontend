<template>
	<div>
		<hr class="border-[#2D3035]" />

		<div class="p-[10px]">
			<div class="p-[10px] bg-black w-max">
				<div class="w-[230px] relative">
					<div
						@click="toggleDropdown"
						class="bg-[#2D3035] text-white text-[14px] py-[8px] shadow rounded flex items-center justify-between gap-[16px] cursor-pointer px-[15px]"
					>
						<span v-if="portfolioStore.selectedPortfolio.name">
							{{ portfolioStore.selectedPortfolio.name }}
						</span>
						<span class="text-white text-[14px]" v-else
							>Select a portfolio</span
						>
						<img
							src="@/assets/img/left-angle.svg"
							alt=""
							class="fill-[#868C9D] -rotate-90"
						/>
					</div>

					<!-- Dropdown -->
					<ul
						v-if="open"
						class="absolute bg-[#2D3035] mt-[8px] py-[4px] cursor-pointer w-full rounded shadow"
					>
						<li
							v-for="portfolio in portfolioStore.myPortfolios"
							:key="portfolio"
							@click="
								portfolioStore.doSelectPortfolio(portfolio),
									(open = false)
							"
							class="hover:bg-slate hover:bg-opacity-10 text-white px-[12px] py-[4px]"
						>
							{{ portfolio.name }}
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Bottom  -->
		<hr class="border-[#2D3035]" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const open = ref(false);

function toggleDropdown() {
	open.value = !open.value;
}
</script>
