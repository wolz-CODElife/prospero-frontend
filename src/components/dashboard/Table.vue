<template>
	<div class="row-span-3 bg-[#191A20] py-[20px]">
		<!-- This is the view of the 'Table' section of Prospero when the route is on /dashboard  -->
		<div v-if="path === 'dashboard'">
			<!-- Join / Deposit View -->
			<div v-if="portfolioStore.tableView">
				<!-- Toggle Tabs  -->
				<div class="flex justify-between mx-[20px]">
					<!-- All / My -->
					<div class="p-[10px] bg-black">
						<div class="flex">
							<button
								v-for="tab in tabs"
								:key="tab"
								@click="
									portfolioStore.changeActivePortfolioType(),
										(disabled = true)
								"
								class="py-[8px] px-[15px] text-[14px] w-[160px] uppercase cursor-pointer"
								:class="[
									portfolioStore.activePortfolioType === tab
										? 'bg-[#2D3035] text-white'
										: 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
								]"
							>
								{{ tab }}
							</button>
						</div>
					</div>

					<!-- Join / create  -->
					<div
						class="flex items-center gap-[12px]"
						v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
					>
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
							@click="
								portfolioStore.showCreate(),
									(portfolioStore.tableView = false)
							"
							class="btn btn-primary-outline w-[125px]"
						>
							Create
						</button>
					</div>

					<!-- Deposit / withdraw  -->
					<div class="flex items-center gap-[12px]" v-else>
						<button
							@click="$emit('doJoin'), updateUIStatusAPICaller(3)"
							class="btn btn-primary w-[125px]"
							:class="
								disabled
									? 'opacity-50 cursor-text'
									: 'opacity-1 cursor-pointer'
							"
							:disabled="disabled"
						>
							Deposit
						</button>

						<button
							@click="(portfolioStore.tableView = false), showWithdraw()"
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
				</div>

				<!-- Loading Portfolios - Skeleton table -->
				<TableSkeleton v-if="portfolioStore.isLoading" />

				<!-- Error  -->
				<div
					v-else-if="
						portfolioStore.isError ||
						portfolioStore.allPortfolios.length === 0
					"
					class="text-center text-white mt-[150px]"
				>
					An error occured loading portfolio
				</div>

				<!-- All Portfolios / My Portfolios Tables -->
				<TableComponent
					v-else
					:portfolioList="
						portfolioStore.activePortfolioType === 'All Portfolios'
							? portfolioStore.allPortfolios
							: portfolioStore.myPortfolios
					"
					portfolioState="portfolioStore.activePortfolioType"
					@toggle-disabled="toggleDisabled"
				/>
			</div>

			<!-- Create / Withdraw View  -->
			<div v-else>
				<!-- Go back-->
				<div class="px-[10px]">
					<button
						class="button text-[#00FF00] uppercase flex gap-[14px] items-center mb-[16px]"
						@click="portfolioStore.goBack()"
					>
						<img src="@/assets/img/direction.svg" alt="" />
						<span> Go Back </span>
					</button>
				</div>

				<!-- Create mode  -->
				<div v-if="portfolioStore.activeMode === 'create'">
					<!-- Top - Create view  -->
					<div>
						<!-- Create new portfolio -->
						<h4
							class="text-[16px] text-center uppercase text-white mt-[40px] mb-[28px]"
						>
							Create new portfolio
						</h4>

						<!-- Form  -->
						<div class="w-2/3 mx-auto">
							<!-- Portfolio name  -->
							<div class="mb-[28px] relative">
								<label
									for="p-name"
									class="-top-[12px] z-50 absolute ml-[24px] uppercase text-white text-[12px] bg-black px-[8px] py-[4px] -mb-[16px] w-max"
									>Enter Portfolio name</label
								>
								<input
									type="text"
									name="p-name"
									id="p-name"
									v-model="portfolioName"
									class="pt-[28px] pb-[14px] pl-[24px] w-full bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00]"
								/>
							</div>

							<!-- Fund fee  -->
							<div class="mb-[28px] relative">
								<label
									for="p-fee"
									class="-top-[12px] z-50 absolute ml-[24px] uppercase text-white text-[12px] bg-black px-[8px] py-[4px] -mb-[16px]"
									>Fund fee</label
								>
								<!-- span % here  -->
								<input
									type="text"
									name="p-fee"
									id="p-fee"
									v-model="fundFee"
									class="pt-[28px] pb-[14px] pl-[24px] w-full bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00]"
								/>
							</div>

							<!-- Open Deposit Modal  -->
							<button
								@click="
									$emit('doCreate'),
										assignName(),
										updateNameAndFeeApi()
								"
								class="btn btn-primary"
								:class="
									disabledDepToPortfolio
										? 'opacity-50 cursor-text '
										: 'opacity-1 cursor-pointer hover:bg-transparent'
								"
								:disabled="disabledDepToPortfolio"
							>
								Deposit to Portfolio
							</button>
						</div>
					</div>

					<!-- Allocation view on redirect  -->
					<!-- <ManageContainer v-else /> -->
				</div>

				<!-- Withdraw mode  -->
				<div
					v-if="portfolioStore.activeMode === 'withdraw'"
					class="px-[20px]"
				>
					<!-- Choose withdraw type  -->
					<WithdrawalPrompt
						:title="wcOne.title"
						:desc="wcOne.desc"
						icon="https://i.postimg.cc/05pNHQs8/image.png"
						@withdraw-action="enableSwap"
					/>

					<WithdrawalPrompt
						:title="wcTwo.title"
						:desc="wcTwo.desc"
						icon="https://i.postimg.cc/Gm3tbWcH/image.png"
						@withdraw-action="enableDirect"
					/>
				</div>

				<!-- Withdrawal Modal  -->
				<WithdrawalModal
					v-if="withdrawMode !== ''"
					@close="closeWithdrawalModal"
					@redirect="redirect"
					@doWithdraw="doWithdraw"
					:mode="withdrawMode"
					:firstView="firstView"
					:secondView="secondView"
					:loading="loading"
					:error="error"
					v-model:amount="amount"
					v-model:singleToken="singleToken"
					:fee="gasFee"
				/>
			</div>
		</div>

		<!-- This is the view of the 'Table' section of Prospero when the route is on /manage  -->
		<div v-else-if="path === 'manage'">
			<!-- Go back-->
			<h3 class="text-[#00FF00] uppercase mb-[16px] mx-[10px]">
				Manage Portfolio
			</h3>

			<!-- Manage Portfolio  -->
			<ManageContainer />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
	withdraw,
	updateNewWalletVariables,
	updateUIStatus,
	getTokenListForManageUI,
} from "@/api";
import WithdrawalPrompt from "../withdrawal/WithdrawalPrompt.vue";
// import WithdrawalPromptSwap from "../withdrawal/WithdrawalPromptSwap.vue";

import WithdrawalModal from "../withdrawal/WithdrawalModal.vue";
import { useRouter } from "vue-router";
import ManageContainer from "../manage/ManageContainer.vue";
import TableComponent from "./TableComponent.vue";
import TableSkeleton from "./TableSkeleton.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const { currentRoute } = useRouter();

const path = computed(() => {
	return currentRoute.value.name;
});

const portfolioToShow = ref("");

const wcOne = ref({
	title: "Swap into one token - ",
	desc: "You are swapping your portfolio multi-tokens withdrawal into one single token withdrawal which would then be deposited into your wallet.",
});

const wcTwo = ref({
	title: "Portfolio tokens directly to wallet (cheaper gas) -",
	desc: "You are withdrawing an even amount of portfolio tokens directly to your wallet.",
});

const tokenList = ref([]);

const loading = ref(false);

const error = ref(false);

const success = ref(false);

const withdrawMode = ref("");

const firstView = ref(true);

const secondView = ref(false);

const portfolioName = ref("");

const fundFee = ref("20");

const amount = ref("");

const singleToken = ref("");

const tabs = ref(["All Portfolios", "My Portfolios"]);

const disabled = ref(true);

const gasFee = ref(0);

const disabledDepToPortfolio = computed(
	() => !portfolioName.value || !fundFee.value
);

async function doWithdraw() {
	firstView.value = false;
	secondView.value = true;
	loading.value = true;
	///if (singleToken.value=="" || (amount.value =="" || (parseFloat(amount.value) <=0))){
	//	loading.value = false;
	//	error.value = true;
	//}
	var tokens = [singleToken.value];
	try {
		const res = await withdraw([], parseFloat(amount.value));
		loading.value = false;
		if (res.success) {
			gasFee.value = res.gasUsed.usdAmountOfGas;
			if (gasFee.value != 0) {
				gasFee.value = gasFee.value.toFixed(2);
			}
			console.log("Gas Fee to show in modal:" + gasFee.value);
			error.value = false;
			loading.value = false;
			console.log("WD LOAINDG DATA...");
			await portfolioStore.loadData();
			console.log("done loading data");
		} else {
			loading.value = false;
			error.value = true;
			console.log(res.error);
		}
	} catch (error) {
		loading.value = false;
		error.value = true;
		console.log(error);
	}
}

// function getTokenListForManage() {
// 	console.log("getTokenListForManage");
// 	try {
// 		tokenList.value = getTokenListForManageUI();
// 		console.log("getTokenListForManage token list is:", tokenList.value);
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

function toggleDisabled() {
	if (portfolioStore.activePortfolioType === "All Portfolios") {
		if (
			portfolioStore.myPortfolios.some(
				(selected) =>
					selected.prosperoWalletAddress ===
					portfolioStore.selectedPortfolio.prosperoWalletAddress
			)
		) {
			disabled.value = true;
		} else {
			disabled.value = false;
		}
	} else {
		disabled.value = false;
	}
}

// const disableWithdraw = computed(() => {
// 	if (swap.value) {
// 		!amount.value || !singleToken.value;
// 	} else {
// 		!amount.value;
// 	}
// });

function updateNameAndFeeApi() {
	console.log(
		"updateNameAndFeeApi portfolioName:" +
			portfolioName.value +
			" fundFee:" +
			fundFee.value
	);
	updateNewWalletVariables(portfolioName.value, fundFee.value);
}

function updateUIStatusAPICaller(uiType) {
	console.log("updateUIStatusAPICaller with type:" + uiType);
	updateUIStatus(uiType);
}

function enableSwap() {
	withdrawMode.value = "swap";
	console.log("works.....swap", withdrawMode.value);
}

function enableDirect() {
	withdrawMode.value = "direct";
	console.log("works.....direct");
}

function closeWithdrawalModal() {
	firstView.value = true;
	secondView.value = false;
	loading.value = false;
	error.value = false;
	withdrawMode.value = "";
	amount.value = "";
	singleToken.value = "";
}

function assignName() {
	portfolioStore.selectedPortfolio.name = portfolioName.value;
}

function showWithdraw() {
	portfolioStore.activeMode = "withdraw";
}

watch(
	() => currentRoute.value.name,
	() => {
		success.value = false;
		portfolioStore.reset();
		portfolioStore.resetLineChart();
	}
);
</script>
