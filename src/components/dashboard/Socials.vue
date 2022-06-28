<template>
	<div class="row-span-1 bg-[#191A20] py-[20px]">
		<!-- Top -->
		<!-- Create First portfolio to manage  -->
		<div
			class="w-full flex justify-center items-center gap-x-[24px]"
			v-if="portfolioStore.createMode"
		>
			<h2 class="text-[#868C9D] text-[14px] uppercase">
				Create
				<span v-if="portfolioStore.createdPortfolios.length === 0"
					>First</span
				>
				portfolio to manage
			</h2>

			<img src="@/assets/img/arrow.svg" alt="" class="-rotate-90" />
		</div>

		<!-- Select first portfolio to join on only "All Portfolios" -->
		<div class="w-full flex justify-center items-center gap-x-[24px]" v-else>
			<!-- All Instruction permutations in H2 -->
			<div v-if="portfolioStore.activePortfolioType === 'All Portfolios'">
				<div>
					<h2
						class="text-[#868C9D] text-[14px] uppercase"
						v-if="portfolioStore.selectedPortfolio.name"
					>
						Follow {{ portfolioStore.selectedPortfolio.name }} Community
					</h2>

					<h2 class="text-[#868C9D] text-[14px] uppercase" v-else>
						Select
						<span v-if="portfolioStore.joinedPortfolios.length === 0"
							>first</span
						>
						portfolio to join
					</h2>
				</div>
			</div>

			<!-- All Instruction permutations in H2 -->
			<div v-else>
				<div>
					<h2
						class="text-[#868C9D] text-[14px] uppercase"
						v-if="portfolioStore.selectedPortfolio.name"
					>
						{{ portfolioStore.selectedPortfolio.name }} Community
					</h2>

					<h2 class="text-[#868C9D] text-[14px] uppercase" v-else>
						Select a portfolio to display here
					</h2>
				</div>
			</div>

			<img
				v-if="!portfolioStore.selectedPortfolio.name"
				src="@/assets/img/arrow.svg"
				alt=""
				class="-rotate-90"
			/>
		</div>

		<hr class="my-[12px] border-[#2D3035]" />

		<!-- Bottom  -->
		<div
			v-if="portfolioStore.createMode"
			class="text-center text-[60px] text-white"
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
import { usePortfolios } from "@/stores/Portfolios";

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
