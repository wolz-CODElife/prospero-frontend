<template>
	<div class="relative max-w-[330px]">
		<div class="p-[0px_10px] bg-black w-max">
			<div class="w-max">
				<div
					@click="toggleDropdown"
					class="text-white text-[14px] py-[8px] shadow rounded flex items-center justify-between gap-[16px] cursor-pointer px-[15px]"
				>
					<img src="@/assets/img/Search.svg" alt="" />
					<input
						type="search"
						class="bg-transparent border-0 p-[10px] outline-0"
						placeholder="Search or select token"
					/>
					<img
						src="@/assets/img/left-angle.svg"
						alt=""
						class="fill-[#868C9D] -rotate-90"
					/>
				</div>
			</div>
		</div>
		<div
			class="w-full absolute z-50 top-[100%] bg-[#191A20] max-h-[200px] overflow-y-auto"
			v-if="open"
		>
			<div
				class="flex items-center justify-between bg-[#2D3035] p-[10px_20px] mb-[2px]"
			>
				<p class="flex text-white">
					<img
						src="@/assets/img/twitter.svg"
						alt=""
						class="w-[30px] h-[30px] mr-[10px]"
					/>
					BTC
				</p>
				<button class="text-[#005A57]">ADD</button>
			</div>
			<div
				class="flex items-center justify-between bg-[#2D3035] p-[10px_20px] mb-[2px]"
			>
				<p class="flex text-white">
					<img
						src="@/assets/img/twitter.svg"
						alt=""
						class="w-[30px] h-[30px] mr-[10px]"
					/>
					BTC
				</p>
				<button class="text-[#005A57]">ADD</button>
			</div>
			<div
				class="flex items-center justify-between bg-[#2D3035] p-[10px_20px] mb-[2px]"
			>
				<p class="flex text-white">
					<img
						src="@/assets/img/twitter.svg"
						alt=""
						class="w-[30px] h-[30px] mr-[10px]"
					/>
					BTC
				</p>
				<button class="text-[#005A57]">ADD</button>
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
		default: "Select",
	},
});

const open = ref(false);
const TokenList = ref([]);

function toggleDropdown() {
	open.value = !open.value;
}
</script>
