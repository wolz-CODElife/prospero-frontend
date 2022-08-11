<template>
	<div class="row-span-3 bg-[#191A20] pt-[20px]">
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

				<!-- Skeleton table -->
				<TableSkeleton v-if="portfolioStore.isLoading" />

				<!-- All Portfolios / My Portfolios Tables -->
				<TableComponent
					v-else
					:portfolioList="
						portfolioStore.activePortfolioType === 'All Portfolios'
							? portfolioStore.allPortfolios
							: portfolioStore.myPortfolios
					"
					@toggleDisabled="toggleDisabled"
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
					<div v-if="portfolioStore.firstCreateView">
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
					<AllocationContainer v-else />
				</div>

				<!-- Withdraw mode  -->
				<div
					v-if="portfolioStore.activeMode === 'withdraw'"
					class="px-[20px]"
				>
					<withdrawal-card
						:title="wcOne.title"
						:desc="wcOne.desc"
						icon="https://i.postimg.cc/05pNHQs8/image.png"
						@withdraw-action="openSwapModal"
					/>
					<withdrawal-card
						:title="wcTwo.title"
						:desc="wcTwo.desc"
						icon="https://i.postimg.cc/Gm3tbWcH/image.png"
						@withdraw-action="openDirectModal"
					/>
				</div>
			</div>
		</div>

		<!-- This is the view of the 'Table' section of Prospero when the route is on /manage  -->
		<div v-else-if="path === 'manage'">
			<!-- Go back-->
			<h3 class="text-[#00FF00] uppercase mb-[16px] mx-[10px]">
				Manage Portfolio
			</h3>

			<!-- Manage Portfolio  -->
			<AllocationContainer />
		</div>
	</div>

	<!-- swap Modal -->
	<Modal v-if="swap" @close="closeSwapModal()">
		<div v-if="firstView" class="mx-[20px] my-[16px]">
			<wc-overview />
			<!-- Form  -->
			<div class="w-full mt-[32px]">
				<!-- Enter amount  -->
				<div class="mb-[28px] relative">
					<label
						for="amount"
						class="-top-[12px] z-50 absolute ml-[14px] uppercase text-white text-[10px] bg-black px-[8px] py-[4px] -mb-[16px] w-max"
						>Enter Amount</label
					>
					<input
						type="text"
						name="amount"
						id="amount"
						v-model="amount"
						placeholder="$0"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					/>
				</div>

				<!-- SELECT THE SINGLE TOKEN YOU ARE WITHDRAWING INTO  -->
				<div class="mb-[28px] relative">
					<label
						for="token"
						class="-top-[12px] z-50 absolute ml-[14px] uppercase text-white text-[10px] bg-black px-[8px] py-[4px] -mb-[16px]"
						>SELECT THE SINGLE TOKEN YOU ARE WITHDRAWING INTO</label
					>
					<!-- todo: change to select  -->
					<input
						type="text"
						name="token"
						id="token"
						v-model="singleToken"
						placeholder="Select"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					/>
				</div>

				<!-- Withdraw  -->
				<button
					@click="doWithdraw"
					class="btn btn-primary w-full"
					:class="
						disableWithdraw
							? 'opacity-50 cursor-text '
							: 'opacity-1 cursor-pointer hover:bg-transparent'
					"
					:disabled="disableWithdraw"
				>
					Withdraw
				</button>
			</div>
		</div>

		<div v-else>
			<!-- Loading  -->
			<div
				v-if="loading"
				class="flex flex-col justify-center items-center gap-[30px] text-center my-[20px]"
			>
				<!-- Logo  -->
				<img
					src="https://i.postimg.cc/tJMqnqDk/image.png"
					alt=""
					class="mx-auto max-w-[130px] object-contain animate-pulse"
				/>
				<h1 class="text-white text-center text-[20px] uppercase">
					Pending transaction. Please wait for confirmation...
				</h1>
			</div>

			<!-- Error  -->
			<div
				v-else-if="error"
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<h1 class="text-[20px] text-center uppercase">
					Unable to swap into one token
				</h1>
			</div>

			<!-- Successful -->
			<div
				v-else
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<img
					src="https://i.postimg.cc/Y2vdsnZW/image.png"
					alt=""
					class="max-w-[65%]"
				/>
				<h1 class="text-[20px] uppercase">withdrawal successful!</h1>

				<!-- todo: replace this w real values -->
				<p class="text-[16px]">
					$10.00 has been sent to you. Wait a few moments for the tokens to
					transfer and reflect in your wallet. Gas used $2.24
				</p>

				<button
					@click="closeSwapModal"
					class="btn btn-primary uppercase w-full"
				>
					Take me to home
				</button>
			</div>
		</div>
	</Modal>

	<!-- Withdrawal Modal -->
	<Modal v-if="direct" @close="closeDirectModal()">
		<div v-if="firstView" class="mx-[20px] my-[16px]">
			<wc-overview />
			<!-- Form  -->
			<div class="w-full mt-[32px]">
				<!-- Enter amount  -->
				<div class="mb-[28px] relative">
					<label
						for="amount"
						class="-top-[12px] z-50 absolute ml-[14px] uppercase text-white text-[10px] bg-black px-[8px] py-[4px] -mb-[16px] w-max"
						>Enter Amount</label
					>
					<input
						type="text"
						name="amount"
						id="amount"
						v-model="amount"
						placeholder="$0"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					/>
				</div>

				<!-- Withdraw  -->
				<button
					@click="doWithdraw"
					class="btn btn-primary w-full"
					:class="
						disableWithdraw
							? 'opacity-50 cursor-text '
							: 'opacity-1 cursor-pointer hover:bg-transparent'
					"
					:disabled="disableWithdraw"
				>
					Withdraw
				</button>
			</div>
		</div>

		<div v-else>
			<!-- Loading  -->
			<div
				v-if="loading"
				class="flex flex-col justify-center items-center gap-[30px] text-center my-[20px]"
			>
				<!-- Logo  -->
				<img
					src="https://i.postimg.cc/tJMqnqDk/image.png"
					alt=""
					class="mx-auto max-w-[130px] object-contain animate-pulse"
				/>
				<h1 class="text-white text-center text-[20px] uppercase">
					Pending transaction...
				</h1>
			</div>

			<!-- Error  -->
			<div
				v-else-if="error"
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<h1 class="text-[20px] text-center uppercase">
					Unable to swap into one token
				</h1>
			</div>

			<!-- Successful -->
			<div
				v-else
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<img
					src="https://i.postimg.cc/Y2vdsnZW/image.png"
					alt=""
					class="max-w-[65%]"
				/>
				<h1 class="text-[20px] uppercase">withdrawal successful!</h1>
				todo:
				<p class="text-[16px]">
					$10.00 has been sent to you. Wait a few moments for the tokens to
					transfer and reflect in your wallet. Gas used $2.24
				</p>

				<button
					@click="closeDirectModal"
					class="btn btn-primary uppercase w-full"
				>
					Take me to home
				</button>
			</div>
		</div>
	</Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { usePortfolios } from "@/stores/Portfolios";
import {
	withdraw,
	updateNewWalletVariables,
	updateUIStatus,
	getTokenListForManageUI,
} from "@/api";
import Modal from "../Modal.vue";
import WithdrawalCard from "./WithdrawalCard.vue";
import WcOverview from "./WcOverview.vue";
import { useRouter } from "vue-router";
import AllocationContainer from "../manage/AllocationContainer.vue";
import TableComponent from "./TableComponent.vue";
import TableSkeleton from "./TableSkeleton.vue";

const { currentRoute } = useRouter();

const path = computed(() => {
	return currentRoute.value.name;
});

const portfolioStore = usePortfolios();

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

const swap = ref(false);

const direct = ref(false);

const firstView = ref(true);

const portfolioName = ref("");

const fundFee = ref("1.0");

const amount = ref("");

const singleToken = ref("");

const tabs = ref(["All Portfolios", "My Portfolios"]);

const disabled = ref(true);

const disabledDepToPortfolio = computed(
	() => !portfolioName.value || !fundFee.value
);

function getTokenListForManage() {
	console.log("getTokenListForManage");
	try {
		tokenList.value = getTokenListForManageUI();
		console.log("getTokenListForManage token list is:", tokenList.value);
	} catch (error) {
		console.log(error);
	}
}

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
			setTimeout(() => {
				alert(
					"You've already joined ",
					portfolioStore.selectedPortfolio.name
				);
			}, 500);
		} else {
			disabled.value = false;
		}
	} else {
		disabled.value = false;
	}
}

const disableWithdraw = computed(() => {
	if (swap.value) {
		!amount.value || !singleToken.value;
	} else {
		!amount.value;
	}
});

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

async function doWithdraw() {
	//to do - add tokens swapping into
	try {
		console.log("do ");
		const res = await withdraw([], amount.value);
		console.log(res);
		if (res.success) {
			var usdAmountOfGas = res.gasUsed.usdAmountOfGas;
			console.log("usdAmountOfGas to show in modal:" + usdAmountOfGas);
			loading.value = false;
		} else {
			error.value = true;
			console.log(success.error);
			loading.value = false;
		}
	} catch (error) {
		error.value = true;
		console.log(error);
		loading.value = false;
	}
	firstView.value = false;
	error.value = false;
}

function openSwapModal() {
	swap.value = true;
	console.log("swap value rn is: ", swap.value);
	console.log("works.....swap");
}

function openDirectModal() {
	direct.value = true;
}

function closeSwapModal() {
	swap.value = false;
	reset();
}

function closeDirectModal() {
	direct.value = false;
	reset();
}

function reset() {
	portfolioStore.goBack();
	firstView.value = true;
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
	}
);
</script>
