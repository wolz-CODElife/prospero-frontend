<template>
	<div class="bg-[#191A20]">
		<div
			class="grid grid-cols-12 text-[#868C9D] m-[30px] border-[20px] border-[#868C9D]"
		>
			<!-- Left side of header  -->
			<div
				class="col-span-8 bg-black px-[30px] py-[20px] flex items-center justify-between h-full font-medium uppercase"
			>
				<!-- My holdings -->
				<div>
					<h2 class="text-[#868C9D] text-[14px]">My holdings</h2>
					<h3 class="text-white text-[24px]">
						${{ portfolioStore.activeOverview?.holdings }}
					</h3>
				</div>

				<!-- Total deposits -->
				<div class="border-l border-[#2D3035] pl-[10px]">
					<h2 class="text-[#868C9D] text-[14px]">Total Deposits</h2>
					<h3 class="text-white text-[24px]">
						${{ portfolioStore.activeOverview?.deposits }}
					</h3>
				</div>

				<!-- Total Withdrawals  -->
				<div class="border-l border-[#2D3035] pl-[10px]">
					<h2 class="text-[#868C9D] text-[14px]">Total Withdrawals</h2>
					<h3 class="text-white text-[24px]">
						${{ portfolioStore.activeOverview?.withdrawals }}
					</h3>
				</div>
			</div>

			<!-- Right side of header  -->
			<div
				class="col-span-4 bg-transparent pl-[30px] py-[20px] uppercase flex flex-col gap-y-[12px]"
			>
				<div class="flex items-center">
					<h3 class="text-white mr-auto">From</h3>
					<input
						type="text"
						class="py-[8px] pl-[24px] w-[3/4] bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00] focus:bg-white"
						aria-label="from-date"
						v-model="fromDate"
						onfocus="(this.type='date')"
					/>
				</div>

				<div class="flex items-center gap-[12px]">
					<h3 class="text-white mr-auto">To</h3>
					<input
						type="text"
						class="py-[8px] pl-[24px] w-[3/4] bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00] focus:bg-white"
						aria-label="to-date"
						v-model="toDate"
						onfocus="(this.type='date')"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const toDate = ref("");

const fromDate = ref("22-07-22");

watch(
	() => toDate.value,
	() => {
		console.log(toDate.value);
	}
);
</script>
