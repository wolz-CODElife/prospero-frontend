<template>
	<div class="relative w-[330px]">
		<div class="p-[0px_10px] bg-black">
			<div
				@click="toggleDropdown"
				class="text-white text-[14px] py-[8px] shadow rounded flex items-center justify-between cursor-pointer px-[15px]"
			>
				<img src="@/assets/img/Search.svg" alt="" />
				<input
					type="search"
					class="bg-transparent border-0 outline-0"
					placeholder="Search or select token"
				/>
				<img
					src="@/assets/img/left-angle.svg"
					alt=""
					class="fill-[#868C9D] -rotate-90"
				/>
			</div>
		</div>
		<div
			class="w-full absolute z-50 top-[100%] bg-[#191A20] max-h-[200px] overflow-y-auto"
			v-if="open"
		>
			<div v-for="token in portfolioStore.tokenList">
				<div
					class="flex items-center justify-between bg-[#2D3035] p-[10px_20px] mb-[2px]"
				>
					<p class="flex text-white">
						<img
							:src="token.icon"
							alt=""
							class="w-[30px] h-[30px] mr-[10px]"
						/>
						{{ token.name }}
					</p>
					<button class="text-[#005A57]" @click="add(token)">ADD</button>
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
		default: "Select",
	},
});

const open = ref(false);

function toggleDropdown() {
	open.value = !open.value;
}

function add(item) {
	portfolioStore.allocationList.push(item);
	portfolioStore.tokenList.splice(item, 1);
	open.value = false;
}
</script>
