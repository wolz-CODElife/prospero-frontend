<template>
	<div class="min-h-[220px]">
		<table class="table-auto w-full my-[20px]">
			<thead>
				<tr
					class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[10px] px-[30px]"
				>
					<th class="pl-[20px]">SELECT</th>
					<th>NAME</th>
					<th class="border-r border-r-[#2D3035]">FEE</th>
					<th class="pl-[20px]">7D%</th>
					<th>30D%</th>
					<th>90D%</th>
					<th class="pr-[30px]">1YR%</th>
				</tr>
			</thead>

			<tbody>
				<tr
					v-for="portfolio in filteredPortfolios"
					key="portfolio"
					@click="
						portfolioStore.doSelectPortfolio(portfolio),
							$emit('toggleDisabled')
					"
					class="text-left py-[20px] mx-[28px] border-b border-b-[#2D3035] text-white hover:bg-[#003D3B]"
					:class="[
						portfolioStore.selectedPortfolio.prosperoWalletAddress ===
						portfolio.prosperoWalletAddress
							? 'bg-[#003D3B] '
							: 'bg-transparent',
					]"
				>
					<td class="ml-[20px] pl-[20px]">
						<input
							type="radio"
							:name="portfolio.prosperoWalletAddress"
							:id="portfolio.prosperoWalletAddress"
							@onchange="
								portfolioStore.doSelectPortfolio(portfolio),
									$emit('toggleDisabled')
							"
						/>
					</td>
					<td>{{ portfolio.name }}</td>
					<td class="border-r border-r-[#2D3035]">
						{{ portfolio.fee }}
					</td>
					<td>{{ portfolio.d7 }}</td>
					<td>{{ portfolio.d30 }}</td>
					<td>{{ portfolio.d90 }}</td>
					<td>{{ portfolio.y1 }}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Bottom -->
	<div class="grid grid-cols-12 px-[20px] my-[25px]">
		<!-- Search -->
		<div class="col-span-5">
			<div
				class="bg-black text-white text-[16px] border border-[#2D3035] focus:outline-none py-[12px] pl-[28px] pr-[12px] flex items-center gap-x-[24px]"
			>
				<img src="@/assets/img/Search.svg" alt="" />
				<input
					type="text"
					placeholder="Search by name"
					aria-label="Search by name"
					@keyup="updateSearchedPortfolios($event)"
					v-model="searchQuery"
					class="outline-none bg-black"
				/>
				<button
					v-show="searchQuery !== ''"
					@click="clearSearch"
					class="ml-auto"
				>
					<img src="@/assets/img/close.svg" alt="" />
				</button>
			</div>
		</div>

		<!-- Pagination  -->
		<div class="col-span-6 col-end-13">
			<div class="flex justify-end items-center gap-[15px]">
				<span class="text-[#C3C7CD] text-[14px]">Page</span>

				<!-- Current page  -->
				<input
					type="number"
					@change="updateShowingPortfolios"
					aria-label="current page"
					:max="totalLeaderboardPages"
					v-model="currentPage"
					class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
				/>

				<!-- Total pages count  -->
				<span class="text-[#C3C7CD] text-[14px]"
					>of
					<span class="ml-[10px]">
						{{ totalLeaderboardPages }}
					</span>
				</span>

				<!-- Prev & Next  -->
				<div class="flex gap-0">
					<button class="px-[14px] bg-[#005A57]" @click="prevPage">
						<img src="@/assets/img/left-angle.svg" alt="" />
					</button>

					<button class="px-[14px] bg-[#005A57]" @click="nextPage">
						<img
							src="@/assets/img/left-angle.svg"
							alt=""
							class="transform rotate-180"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { usePortfolios } from "@/stores/Portfolios";

const props = defineProps({
	portfolioList: {
		type: Array,
		default: true,
	},
});

const portfolioStore = usePortfolios();
const currentPage = ref(1);
const filteredPortfolios = ref([]);
const searchQuery = ref("");

watch(
	() => props.portfolioList,
	() => {
		updateShowingPortfolios();
	}
);

const totalLeaderboardPages = computed(() => {
	if (props.portfolioList.length / 4 < 1) {
		return 1;
	} else {
		return Math.ceil(props.portfolioList.length / 4);
	}
});

function clearSearch() {
	searchQuery.value = "";
	filteredPortfolios.value = props.portfolioList.slice(-4).reverse();
}

function updateShowingPortfolios() {
	if (
		currentPage.value <= props.portfolioList.length / 4 &&
		currentPage.value > 1
	) {
		filteredPortfolios.value = props.portfolioList
			.slice(-(currentPage.value * 4), -(currentPage.value * 4 - 4))
			.reverse();
	} else {
		filteredPortfolios.value = props.portfolioList.slice(-4).reverse();
	}
}

function updateSearchedPortfolios(event) {
	const term = event.target.value;
	console.log(term);
	filteredPortfolios.value = props.portfolioList
		.filter((portfolio) =>
			portfolio.name?.toLowerCase().includes(term.toLowerCase())
		)
		.slice(-4)
		.reverse();
}

function nextPage() {
	if (currentPage.value < totalLeaderboardPages.value) {
		currentPage.value += 1;
		updateShowingPortfolios();
	}
}

function prevPage() {
	if (currentPage.value > 1) {
		currentPage.value -= 1;
		updateShowingPortfolios();
	}
}
</script>

<style lang="postcss" scoped>
td,
th {
	@apply py-[10px];
}

td:not(:first-child),
th:not(:first-child) {
	@apply px-[14px];
}
</style>
