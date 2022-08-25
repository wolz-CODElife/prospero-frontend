<template>
	<div>
		<div class="flex justify-between items-center m-[30px] mb-[15px]">
			<h2 class="text-[20px] text-white uppercase">Account History</h2>

			<div class="flex gap-[30px]">
				<Filters
					:filters="historyFilters"
					v-model="portfolioStore.activeFilter"
					@update-filter="updateFilter"
				/>
			</div>
		</div>

		<hr class="border-[#2D3035]" />

		<div
			class="mx-[30px] my-[15px] flex justify-between items-center bg-[#2D3035] pr-[20px]"
			v-for="(txn, i) in portfolioStore.filteredTxnList"
		>
			<div
				class="py-[15px] px-[22px]"
				:class="[txn.type === 'deposit' ? 'bg-[#54AC68]' : 'bg-[#B34B4B]']"
			>
				<h5 class="uppercase text-white text-[14px] mb-[12px]">
					<span v-if="txn.type === 'deposit'">Deposit</span>
					<span v-if="txn.type === 'withdrawal'">Withdrawal</span>
				</h5>
				<h6 class="text-white">
					<span>{{ txn.time }}</span>
					<span class="ml-[4px]">{{ txn.date }}</span>
				</h6>
			</div>

			<div>
				<h5 class="uppercase text-white text-[14px] mb-[12px]">
					{{ txn.portfolioName }}
				</h5>
				<h6 class="text-[14px] text-[#868C9D]">
					<span v-if="txn.type === 'deposit'"
						><svg
							width="16"
							height="11"
							viewBox="0 0 16 11"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M16 6.38857L3.40445 6.38856L6.58667 9.57968L5.33333 10.833L9.3251e-07 5.49967L5.33334 0.166342L6.58667 1.41968L3.40445 4.61079L16 4.61079L16 6.38857Z"
								fill="#04CE04"
							/>
						</svg>
					</span>
					<span v-else-if="txn.type === 'withdrawal'"
						><svg
							width="16"
							height="11"
							viewBox="0 0 16 11"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M3.88546e-07 6.38856L12.5956 6.38856L9.41333 9.57967L10.6667 10.833L16 5.49967L10.6667 0.16634L9.41333 1.41967L12.5956 4.61079L5.43964e-07 4.61078L3.88546e-07 6.38856Z"
								fill="#E95149"
							/>
						</svg>
					</span>
					{{ swapCount(txn) }} Swap(s) and
					{{ transferCount(txn) }} Transfer(s)
				</h6>
			</div>

			<a
				class="text-[#868C9D] text-[12px]"
				:href="txn.snowtraceLink"
				target="_blank"
			>
				VIEW ON THE SNOWTRACE EXPLORER
				<span
					><svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.5 6.875C12.3342 6.875 12.1753 6.94085 12.0581 7.05806C11.9408 7.17527 11.875 7.33424 11.875 7.5V11.25C11.875 11.4158 11.8092 11.5747 11.6919 11.6919C11.5747 11.8092 11.4158 11.875 11.25 11.875H3.75C3.58424 11.875 3.42527 11.8092 3.30806 11.6919C3.19085 11.5747 3.125 11.4158 3.125 11.25V3.75C3.125 3.58424 3.19085 3.42527 3.30806 3.30806C3.42527 3.19085 3.58424 3.125 3.75 3.125H7.5C7.66576 3.125 7.82473 3.05915 7.94194 2.94194C8.05915 2.82473 8.125 2.66576 8.125 2.5C8.125 2.33424 8.05915 2.17527 7.94194 2.05806C7.82473 1.94085 7.66576 1.875 7.5 1.875H3.75C3.25272 1.875 2.77581 2.07254 2.42417 2.42417C2.07254 2.77581 1.875 3.25272 1.875 3.75V11.25C1.875 11.7473 2.07254 12.2242 2.42417 12.5758C2.77581 12.9275 3.25272 13.125 3.75 13.125H11.25C11.7473 13.125 12.2242 12.9275 12.5758 12.5758C12.9275 12.2242 13.125 11.7473 13.125 11.25V7.5C13.125 7.33424 13.0592 7.17527 12.9419 7.05806C12.8247 6.94085 12.6658 6.875 12.5 6.875Z"
							fill="#868C9D"
						/>
						<path
							d="M9.99996 3.125H10.9875L7.05621 7.05C6.99763 7.1081 6.95114 7.17723 6.9194 7.25339C6.88767 7.32955 6.87134 7.41124 6.87134 7.49375C6.87134 7.57626 6.88767 7.65795 6.9194 7.73411C6.95114 7.81027 6.99763 7.8794 7.05621 7.9375C7.11431 7.99608 7.18344 8.04258 7.2596 8.07431C7.33576 8.10604 7.41745 8.12237 7.49996 8.12237C7.58247 8.12237 7.66416 8.10604 7.74032 8.07431C7.81648 8.04258 7.88561 7.99608 7.94371 7.9375L11.875 4.0125V5C11.875 5.16576 11.9408 5.32473 12.058 5.44194C12.1752 5.55915 12.3342 5.625 12.5 5.625C12.6657 5.625 12.8247 5.55915 12.9419 5.44194C13.0591 5.32473 13.125 5.16576 13.125 5V2.5C13.125 2.33424 13.0591 2.17527 12.9419 2.05806C12.8247 1.94085 12.6657 1.875 12.5 1.875H9.99996C9.8342 1.875 9.67523 1.94085 9.55802 2.05806C9.44081 2.17527 9.37496 2.33424 9.37496 2.5C9.37496 2.66576 9.44081 2.82473 9.55802 2.94194C9.67523 3.05915 9.8342 3.125 9.99996 3.125Z"
							fill="#868C9D"
						/>
					</svg>
				</span>
			</a>

			<span class="text-[16px] text-white">${{ txn.amount }}</span>

			<div class="bg-[#868C9D] text-white text-[12px] py-[10px] px-[12px]">
				Completed <span class="text-white">✔️</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Table from "@/components/dashboard/Table.vue";
import Filters from "./Filters.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

// onMounted(() => {
// 	activeFilter.value = "All";
// 	console.log(activeFilter.value);
// });

const historyFilters = ref(["All", "Deposits", "Withdrawals"]);

function updateFilter(filter) {
	portfolioStore.activeFilter = filter;
}

// const activeFilter = ref("");
</script>
