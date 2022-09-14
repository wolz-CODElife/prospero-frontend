<template>
	<div class="bg-[#191A20] py-[20px]">
		<!-- Directions  -->
		<DashDir
			empty-selected-card-classes="h-full flex gap-[24px] justify-center items-center"
			arrow-class="-rotate-90"
		>
			<template #selectedPortfolioDisplay>
				<h2
					class="text-[#868C9D] text-[14px] text-center uppercase"
					v-if="portfolioStore.selectedPortfolio.name"
				>
					<span
						v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
						>Follow</span
					>
					{{ portfolioStore.selectedPortfolio.name }} Community
				</h2>
			</template>
		</DashDir>

		<hr class="my-[12px] border-[#2D3035]" />

		<!-- Bottom  -->
		<div
			v-if="portfolioStore.activeMode === 'create'"
			class="text-center text-[30px] text-white"
		>
			New UI here
		</div>

		<div
			v-else
			class="flex justify-between items-center px-[48px]"
			:class="
				props.disabled
					? 'opacity-30 cursor-text'
					: 'opacity-1 cursor-pointer'
			"
		>
			<div v-for="(sm, i) in props.socials" :key="i">
				<div class="flex flex-col items-center gap-y-[12px]">
					<h2 class="text-[#868C9D] text-[14px] uppercase">
						{{ sm.title }}
					</h2>
					<!-- todo: convert this to read link from API -->
					<a :href="sm.link">
						<img :src="sm.icon" alt="" class="h-[40px] object-contain" />
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import SocialsDirection from "./SocialsDirection.vue";
import { usePortfolios } from "@/stores/Portfolios";
import DashDir from "@/layouts/dashboard/DashDir.vue";

// Store
const portfolioStore = usePortfolios();

// Props
const props = defineProps({
	socials: {
		type: Array,
		default: [
			{
				title: "Discord",
				link: "",
				icon: "https://i.postimg.cc/fTGZ6Z9Y/image.png",
			},
			{
				title: "Telegram",
				link: "",
				icon: "https://i.postimg.cc/02GGMGq3/image.png",
			},
			{
				title: "Twitter",
				link: "",
				icon: "https://i.postimg.cc/dtkrPLvW/image.png",
			},
		],
	},

	disabled: {
		type: Boolean,
		default: true,
	},
});

// const
</script>
