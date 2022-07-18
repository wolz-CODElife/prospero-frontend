<template>
	<div>
		<div class="p-[10px]">
			<div class="p-[10px] bg-black w-max">
				<div class="w-[330px] relative">
					<div
						@click="toggleDropdown"
						class="bg-[#2D3035] text-white text-[14px] py-[8px] shadow rounded flex items-center justify-between gap-[16px] cursor-pointer px-[15px]"
					>
						<span v-if="portfolioStore.selectedPortfolio.name">
							{{ portfolioStore.selectedPortfolio.name }}
						</span>
						<span class="text-white text-[14px]" v-else
							>{{ placeholder }}
						</span>
						<img
							src="@/assets/img/left-angle.svg"
							alt=""
							class="fill-[#868C9D] -rotate-90"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

defineProps({
	placeholder: {
		type: String,
		default: "Select a portfolio to manage",
	},
});

const open = ref(false);

function toggleDropdown() {
	open.value = !open.value;
}
</script>
