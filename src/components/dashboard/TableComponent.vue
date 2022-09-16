<template>
	<div>
		<table class="table-auto w-full my-[10px]">
			<thead>
				<tr
					class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[5px] px-[30px] bg-[#191A20]"
				>
					<th class="pl-[20px]">NAME</th>
					<th
						@click="sortBy('fee')"
						class="border-r border-r-[#2D3035] hover:cursor-pointer"
					>
						<span class="flex items-center gap-x-[4px]"
							>FEE
							<span
								class="opacity-[0] sort"
								:class="[
									sortValue === 'fee' ? 'opacity-[1]' : 'opacity-[0]',
								]"
								><svg
									width="7"
									height="9"
									viewBox="0 0 7 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5001 8.24986C3.62442 8.24986 3.74365 8.20048 3.83156 8.11257C3.91947 8.02466 3.96885 7.90543 3.96885 7.78111V2.35017L5.98073 4.36299C6.02431 4.40657 6.07605 4.44114 6.133 4.46473C6.18994 4.48831 6.25097 4.50045 6.31261 4.50045C6.37424 4.50045 6.43527 4.48831 6.49221 4.46473C6.54916 4.44114 6.6009 4.40657 6.64448 4.36299C6.68806 4.3194 6.72263 4.26766 6.74622 4.21072C6.76981 4.15378 6.78195 4.09275 6.78195 4.03111C6.78195 3.96948 6.76981 3.90845 6.74622 3.8515C6.72263 3.79456 6.68806 3.74282 6.64448 3.69924L3.83198 0.886736C3.78844 0.843083 3.73671 0.808449 3.67976 0.784818C3.62281 0.761187 3.56176 0.749023 3.5001 0.749023C3.43845 0.749023 3.3774 0.761187 3.32045 0.784818C3.2635 0.808449 3.21177 0.843083 3.16823 0.886736L0.355729 3.69924C0.26771 3.78726 0.218262 3.90663 0.218262 4.03111C0.218262 4.15559 0.26771 4.27497 0.355729 4.36299C0.443748 4.45101 0.563127 4.50045 0.687604 4.50045C0.812081 4.50045 0.931461 4.45101 1.01948 4.36299L3.03135 2.35017V7.78111C3.03135 7.90543 3.08074 8.02466 3.16865 8.11257C3.25656 8.20048 3.37578 8.24986 3.5001 8.24986Z"
										fill="#868C9D"
									/>
								</svg> </span
						></span>
					</th>
					<th @click="sortBy('d7')" class="pl-[20px] hover:cursor-pointer">
						<span class="flex items-center gap-x-[4px]"
							>7D%
							<span
								class="opacity-[0] sort"
								:class="[
									sortValue === 'd7' ? 'opacity-[1]' : 'opacity-[0]',
								]"
								><svg
									width="7"
									height="9"
									viewBox="0 0 7 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5001 8.24986C3.62442 8.24986 3.74365 8.20048 3.83156 8.11257C3.91947 8.02466 3.96885 7.90543 3.96885 7.78111V2.35017L5.98073 4.36299C6.02431 4.40657 6.07605 4.44114 6.133 4.46473C6.18994 4.48831 6.25097 4.50045 6.31261 4.50045C6.37424 4.50045 6.43527 4.48831 6.49221 4.46473C6.54916 4.44114 6.6009 4.40657 6.64448 4.36299C6.68806 4.3194 6.72263 4.26766 6.74622 4.21072C6.76981 4.15378 6.78195 4.09275 6.78195 4.03111C6.78195 3.96948 6.76981 3.90845 6.74622 3.8515C6.72263 3.79456 6.68806 3.74282 6.64448 3.69924L3.83198 0.886736C3.78844 0.843083 3.73671 0.808449 3.67976 0.784818C3.62281 0.761187 3.56176 0.749023 3.5001 0.749023C3.43845 0.749023 3.3774 0.761187 3.32045 0.784818C3.2635 0.808449 3.21177 0.843083 3.16823 0.886736L0.355729 3.69924C0.26771 3.78726 0.218262 3.90663 0.218262 4.03111C0.218262 4.15559 0.26771 4.27497 0.355729 4.36299C0.443748 4.45101 0.563127 4.50045 0.687604 4.50045C0.812081 4.50045 0.931461 4.45101 1.01948 4.36299L3.03135 2.35017V7.78111C3.03135 7.90543 3.08074 8.02466 3.16865 8.11257C3.25656 8.20048 3.37578 8.24986 3.5001 8.24986Z"
										fill="#868C9D"
									/>
								</svg> </span
						></span>
					</th>
					<th @click="sortBy('d30')" class="hover:cursor-pointer">
						<span class="flex items-center gap-x-[4px]"
							>30D%
							<span
								class="opacity-[0] sort"
								:class="[
									sortValue === 'd30' ? 'opacity-[1]' : 'opacity-[0]',
								]"
								><svg
									width="7"
									height="9"
									viewBox="0 0 7 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5001 8.24986C3.62442 8.24986 3.74365 8.20048 3.83156 8.11257C3.91947 8.02466 3.96885 7.90543 3.96885 7.78111V2.35017L5.98073 4.36299C6.02431 4.40657 6.07605 4.44114 6.133 4.46473C6.18994 4.48831 6.25097 4.50045 6.31261 4.50045C6.37424 4.50045 6.43527 4.48831 6.49221 4.46473C6.54916 4.44114 6.6009 4.40657 6.64448 4.36299C6.68806 4.3194 6.72263 4.26766 6.74622 4.21072C6.76981 4.15378 6.78195 4.09275 6.78195 4.03111C6.78195 3.96948 6.76981 3.90845 6.74622 3.8515C6.72263 3.79456 6.68806 3.74282 6.64448 3.69924L3.83198 0.886736C3.78844 0.843083 3.73671 0.808449 3.67976 0.784818C3.62281 0.761187 3.56176 0.749023 3.5001 0.749023C3.43845 0.749023 3.3774 0.761187 3.32045 0.784818C3.2635 0.808449 3.21177 0.843083 3.16823 0.886736L0.355729 3.69924C0.26771 3.78726 0.218262 3.90663 0.218262 4.03111C0.218262 4.15559 0.26771 4.27497 0.355729 4.36299C0.443748 4.45101 0.563127 4.50045 0.687604 4.50045C0.812081 4.50045 0.931461 4.45101 1.01948 4.36299L3.03135 2.35017V7.78111C3.03135 7.90543 3.08074 8.02466 3.16865 8.11257C3.25656 8.20048 3.37578 8.24986 3.5001 8.24986Z"
										fill="#868C9D"
									/>
								</svg> </span
						></span>
					</th>
					<th @click="sortBy('d90')" class="hover:cursor-pointer">
						<span class="flex items-center gap-x-[4px]"
							>90D%
							<span
								class="opacity-[0] sort"
								:class="[
									sortValue === 'd90' ? 'opacity-[1]' : 'opacity-[0]',
								]"
								><svg
									width="7"
									height="9"
									viewBox="0 0 7 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5001 8.24986C3.62442 8.24986 3.74365 8.20048 3.83156 8.11257C3.91947 8.02466 3.96885 7.90543 3.96885 7.78111V2.35017L5.98073 4.36299C6.02431 4.40657 6.07605 4.44114 6.133 4.46473C6.18994 4.48831 6.25097 4.50045 6.31261 4.50045C6.37424 4.50045 6.43527 4.48831 6.49221 4.46473C6.54916 4.44114 6.6009 4.40657 6.64448 4.36299C6.68806 4.3194 6.72263 4.26766 6.74622 4.21072C6.76981 4.15378 6.78195 4.09275 6.78195 4.03111C6.78195 3.96948 6.76981 3.90845 6.74622 3.8515C6.72263 3.79456 6.68806 3.74282 6.64448 3.69924L3.83198 0.886736C3.78844 0.843083 3.73671 0.808449 3.67976 0.784818C3.62281 0.761187 3.56176 0.749023 3.5001 0.749023C3.43845 0.749023 3.3774 0.761187 3.32045 0.784818C3.2635 0.808449 3.21177 0.843083 3.16823 0.886736L0.355729 3.69924C0.26771 3.78726 0.218262 3.90663 0.218262 4.03111C0.218262 4.15559 0.26771 4.27497 0.355729 4.36299C0.443748 4.45101 0.563127 4.50045 0.687604 4.50045C0.812081 4.50045 0.931461 4.45101 1.01948 4.36299L3.03135 2.35017V7.78111C3.03135 7.90543 3.08074 8.02466 3.16865 8.11257C3.25656 8.20048 3.37578 8.24986 3.5001 8.24986Z"
										fill="#868C9D"
									/>
								</svg> </span
						></span>
					</th>
					<th @click="sortBy('y1')" class="pr-[30px] hover:cursor-pointer">
						<span class="flex items-center gap-x-[4px]"
							>1YR%
							<span
								class="opacity-[0] sort"
								:class="[
									sortValue === 'y1' ? 'opacity-[1]' : 'opacity-[0]',
								]"
								><svg
									width="7"
									height="9"
									viewBox="0 0 7 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5001 8.24986C3.62442 8.24986 3.74365 8.20048 3.83156 8.11257C3.91947 8.02466 3.96885 7.90543 3.96885 7.78111V2.35017L5.98073 4.36299C6.02431 4.40657 6.07605 4.44114 6.133 4.46473C6.18994 4.48831 6.25097 4.50045 6.31261 4.50045C6.37424 4.50045 6.43527 4.48831 6.49221 4.46473C6.54916 4.44114 6.6009 4.40657 6.64448 4.36299C6.68806 4.3194 6.72263 4.26766 6.74622 4.21072C6.76981 4.15378 6.78195 4.09275 6.78195 4.03111C6.78195 3.96948 6.76981 3.90845 6.74622 3.8515C6.72263 3.79456 6.68806 3.74282 6.64448 3.69924L3.83198 0.886736C3.78844 0.843083 3.73671 0.808449 3.67976 0.784818C3.62281 0.761187 3.56176 0.749023 3.5001 0.749023C3.43845 0.749023 3.3774 0.761187 3.32045 0.784818C3.2635 0.808449 3.21177 0.843083 3.16823 0.886736L0.355729 3.69924C0.26771 3.78726 0.218262 3.90663 0.218262 4.03111C0.218262 4.15559 0.26771 4.27497 0.355729 4.36299C0.443748 4.45101 0.563127 4.50045 0.687604 4.50045C0.812081 4.50045 0.931461 4.45101 1.01948 4.36299L3.03135 2.35017V7.78111C3.03135 7.90543 3.08074 8.02466 3.16865 8.11257C3.25656 8.20048 3.37578 8.24986 3.5001 8.24986Z"
										fill="#868C9D"
									/>
								</svg> </span
						></span>
					</th>
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
					class="text-left py-[5px] mx-[28px] border-b border-b-[#2D3035] text-white hover:bg-[#003D3B]"
					:class="[
						portfolioStore.selectedPortfolio.prosperoWalletAddress ===
						portfolio.prosperoWalletAddress
							? 'bg-[#003D3B] '
							: 'bg-transparent',
					]"
				>
					<td class="pl-[20px] flex justify-between items-center">
						{{ portfolio.name }}
						<span
							v-if="portfolio.wallet_type === 'Leader'"
							class="bg-[#6FCF97] bg-opacity-20 text-[#6FCF97] text-[10px] p-[6px]"
							>Managing</span
						>
						<!-- <span
							v-if="portfolio.wallet_type === 'Trailer'"
							class="bg-[#6FCF97] bg-opacity-20 text-[#6FCF97] text-[10px] p-[6px]"
							>Investing</span
						> -->
					</td>
					<td class="border-r border-r-[#2D3035]">
						{{ portfolio.fee }}
					</td>
					<td>{{ portfolio.d7 }} <span></span></td>
					<td>{{ portfolio.d30 }}</td>
					<td>{{ portfolio.d90 }}</td>
					<td>
						{{ portfolio.y1 }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Bottom -->
	<div class="grid grid-cols-12 px-[20px] mt-[10px]">
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
import { ref, computed, watch, onMounted } from "vue";
import { usePortfolios } from "@/stores/Portfolios";

const props = defineProps({
	portfolioList: {
		type: Array,
		default: true,
	},
	portfolioState: {
		type: String,
		default: true,
	},
});

defineEmits(["toggleDisabled"]);

const portfolioStore = usePortfolios();
const currentPage = ref(1);
const filteredPortfolios = ref([]);
const searchQuery = ref("");
let sortValue = ref("y1");

onMounted(() => {
	sortBy("y1");
});

const resetCurrentPage = () => {
	currentPage.value = 1;
	filteredPortfolios.value = props.portfolioList.slice(
		(currentPage.value - 1) * 4,
		currentPage.value * 4
	);
};

function sortBy(cond) {
	if (sortValue.value === cond) {
		filteredPortfolios.value = props.portfolioList
			.sort((a, b) => (a["y1"] < b["y1"] ? 1 : b["y1"] < a["y1"] ? -1 : 0))
			.slice(0, 4);
		sortValue.value = "y1";
	} else {
		if(cond === 'fee') {
			filteredPortfolios.value = props.portfolioList
			.sort((a, b) => (a.fee < b.fee ? -1 : b.fee < a.fee ? 1 : 0))
			.slice(0, 4);
			sortValue.value = cond;
		} else {
			filteredPortfolios.value = props.portfolioList
			.sort((a, b) => (a[cond] < b[cond] ? 1 : b[cond] < a[cond] ? -1 : 0))
			.slice(0, 4);
			sortValue.value = cond;
			// console.log(`sort by ${cond}:`, filteredPortfolios.value);
		}
	}
}

watch(
	() => [props.portfolioList, props.portfolioState],
	() => {
		updateShowingPortfolios(), resetCurrentPage();
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
	filteredPortfolios.value = props.portfolioList.slice(
		(currentPage.value - 1) * 4,
		currentPage.value * 4
	);

	// if (
	//   currentPage.value <= props.portfolioList.length / 4 &&
	//   currentPage.value > 1
	// ) {
	//   filteredPortfolios.value = props.portfolioList
	//     .slice(-(currentPage.value * 4), -(currentPage.value * 4 - 4))
	//     .reverse();
	// } else {
	//   filteredPortfolios.value = props.portfolioList.slice(4).reverse();
	// }
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

th:hover .sort {
	@apply opacity-[1];
}
</style>
