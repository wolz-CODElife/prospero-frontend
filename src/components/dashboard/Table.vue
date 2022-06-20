<template>
	<div class="row-span-3 bg-[#191A20] py-[20px]">
		<div v-if="tableView">
			<div class="flex justify-between mx-[20px]">
				<!-- Toggle Tabs  -->
				<div class="p-[10px] bg-black">
					<ul class="flex">
						<li
							v-for="tab in tabs"
							:key="tab"
							@click="changeTab(tab.text)"
							class="py-[8px] px-[15px] text-[14px] w-[160px] uppercase cursor-pointer"
							:class="[
								activeTab === tab.text
									? 'bg-[#2D3035] text-white'
									: 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
							]"
						>
							{{ tab.text }}
						</li>
					</ul>
				</div>

				<!-- Deposit / withdraw  -->
				<div
					class="flex items-center gap-[12px]"
					v-if="activeTab !== 'All Portfolios'"
				>
					<button
						class="btn btn-primary w-[125px]"
						:class="
							disabled
								? 'opacity-50 cursor-text'
								: 'opacity-1 cursor-pointer'
						"
						:disabled="disabled"
						@click="$emit('openDeposit')"
					>
						Deposit
					</button>

					<button
						class="btn btn-primary-outline w-[125px]"
						:class="
							disabled
								? 'opacity-50 cursor-text hover:bg-transparent'
								: 'opacity-1 cursor-pointer'
						"
						:disabled="disabled"
					>
						Withdraw
					</button>
				</div>

				<!-- Join / create  -->
				<div class="flex items-center gap-[12px]" v-else>
					<button
						@click="$emit('doJoin')"
						class="btn btn-primary w-[125px]"
						:class="
							disabled
								? 'opacity-50 cursor-text'
								: 'opacity-1 cursor-pointer'
						"
						:disabled="disabled"
					>
						Join
					</button>

					<button
						@click="showCreate"
						class="btn btn-primary-outline w-[125px]"
					>
						Create
					</button>
				</div>
			</div>

			<!-- All Portfolio & My Portfolio Tables -->
			<div class="my-[20px]">
				<table class="table-auto w-full">
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
							v-for="(portfolio, i) in portfolioList"
							key="i"
							@click="doSelect(i)"
							class="text-left py-[20px] mx-[28px] border-b border-b-[#2D3035] text-white hover:bg-[#003D3B]"
							:class="[
								activeRow === i ? 'bg-[#003D3B] ' : 'bg-transparent',
							]"
						>
							<td class="ml-[20px] pl-[18px]">
								<input
									type="radio"
									:name="portfolio.name"
									:id="portfolio.name"
									@onchange="doSelect(i)"
								/>
							</td>
							<td>{{ portfolio.name }}</td>
							<td class="border-r border-r-[#2D3035] pr-[30px]">
								{{ portfolio.fee }}
							</td>
							<td class="pl-[20px]">{{ portfolio.d7 }}</td>
							<td>{{ portfolio.d30 }}</td>
							<td>{{ portfolio.d90 }}</td>
							<td class="mr-[20px] pr-[18px]">{{ portfolio.y1 }}</td>
						</tr>
					</tbody>
				</table>

				<!-- Search  -->

				<!-- Pagination  -->
			</div>
		</div>

		<div v-else>
			<button class="btn btn-primary" @click="showTable()">Go Back</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const disabled = ref(true);

const tableView = ref(true);

// const props = defineProps({
// 	tableView: {
// 		type: Boolean,
// 		default: true,
//   },

// 	portfolioList: {
// 		type: Array,
// 		required: true,
// 	},

// selectedPortfolioId: {
//   type: String,
//   required: true,
// }
// });

const activeTab = ref("All Portfolios");

const activeRow = ref(null);

const selectedPortfolioId = ref(null);

const tabs = ref([
	{
		text: "All Portfolios",
	},
	{
		text: "My Portfolios",
	},
]);

const portfolioList = ref([
	{
		name: "AFS1000 🔱",
		fee: 2.6,
		d7: 8,
		d30: 12,
		d90: 34,
		y1: 60,
	},
	{
		name: "Harry Mcguire",
		fee: 2.6,
		d7: 8,
		d30: 12,
		d90: 34,
		y1: 60,
	},
	{
		name: " 🌈 Lulu Nation Fans",
		fee: 2.6,
		d7: 8,
		d30: 12,
		d90: 34,
		y1: 60,
	},
	{
		name: "GX 650 Lords 🏖",
		fee: 2.6,
		d7: 8,
		d30: 12,
		d90: 34,
		y1: 60,
	},
	{
		name: "Moon Gatekeepers",
		fee: 2.6,
		d7: 8,
		d30: 12,
		d90: 34,
		y1: 60,
	},
]);

function changeTab(tab) {
	activeTab.value = tab;
}

function doSelect(val) {
	selectedPortfolioId.value = val;
	activeRow.value = val;
	console.log(activeRow.value);
	disabled.value = false;
}

function showCreate() {
	tableView.value = false;
}

function showTable() {
	tableView.value = true;
}

// const filteredPortfolioList = computed(() => {
// 	return portfolioList;
// });
</script>

<style lang="postcss">
.btn {
	@apply py-[8px] px-[15px] uppercase text-white;
}

.btn-primary {
	@apply bg-[#005A57];
}
.btn-primary-outline {
	@apply bg-transparent border border-[#005A57] hover:bg-[#005A57];
}
</style>