<template>
	<div class="h-full w-full bg-[#191A20] border border-[#2D3035] p-[30px]">
		<div
			v-if="loading"
			class="flex flex-col h-[75vh] justify-center items-center gap-[30px] text-center my-[20px]"
		>
			<img
				src="https://i.postimg.cc/tJMqnqDk/image.png"
				alt=""
				class="mx-auto max-w-[90px] object-contain animate-pulse"
			/>
			<Loader />
		</div>

		<div v-else-if="error">Error loading Tokens in your Wallet</div>

		<div v-else>
			<!-- Go BACK -->
			<div class="flex justify-between">
				<button
					class="button text-[#00FF00] uppercase flex gap-[14px] items-center"
					@click="$emit('goBack')"
				>
					<img src="@/assets/img/direction.svg" alt="" />
					Go BACK
				</button>

				<h1 class="text-[#868C9D] text-[16px]">DEPOSITING TO PORTFOLIO</h1>
			</div>

			<!-- Details  -->
			<div
				class="mt-[20px] p-[20px] bg-black flex justify-between items-center w-full"
			>
				<!-- Name  -->
				<h2 class="text-white">
					{{ portfolioStore.selectedPortfolio.name }}
				</h2>

				<!-- Instruction -->
				<div
					class="py-[8px] px-[15px] max-w-max uppercase flex items-center gap-[14px] bg-[#2D3035] text-white shadow-[0px_0px_5px_rgba(0,0,0,0.5);]"
				>
					<img src="@/assets/img/caution.svg" alt="" />
					<span class="text-[#00FF00] text-[12px]"
						>FILL IN YOUR DEPOSIT AMOUNT FROM ONE TOKEN OR ACROSS MULTIPLE
						TOKENS</span
					>
				</div>
			</div>

			<!-- Token List Table -->
			<table class="table-fixed w-full">
				<thead>
					<tr
						class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[20px] px-[60px]"
					>
						<th class="pl-[28px] pt-[20px] pb-[12px]">Token</th>
						<th>Price</th>
						<th>Available</th>
						<th>Amount to Deposit</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(token, i) in tokenList"
						key="i"
						@click="enableDeposit(i)"
						class="text-white text-left mx-[28px] border-b border-b-[#2D3035]"
					>
						<td class="flex items-center px-[28px] mt-[10px]">
							<img
								:src="token.icon"
								alt=""
								class="w-[30px] h-[30px] mr-[10px]"
							/>{{ slice(token.name, 12, 9) }}
						</td>
						<td>${{ parseFloat(token.price).toFixed(2) }}</td>
						<td>${{ parseFloat(token.available).toFixed(2) }}</td>
						<td class="py-[10px]">
							<input
								class="py-[4px] pl-[8px] w-max bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00]"
								type="number"
								aria-label="usd amount"
								v-model.lazy="token.usdAmountEnteredByUser"
								@keyup="add($event.target.value, token.name)"
							/>
						</td>
					</tr>
				</tbody>
				<tfoot class="bg-[#2D3035] text-white px-[22px]">
					<tr class="px-[20px]">
						<td colspan="2" class="pl-[32px]">TOTAL</td>
						<td>${{ totalAvailable }}</td>
						<td class="text-[#00FF00]">${{ totalAmtToDeposit }}</td>
					</tr>
				</tfoot>
			</table>

			<div class="flex gap-20 mt-[30px] w-full">
				<!-- Cancel  -->
				<button
					class="basis-1/2 btn btn-primary-outline"
					@click="$emit('goBack'), portfolioStore.reset()"
				>
					Cancel
				</button>

				<!-- Deposit  -->
				<button
					@click="firstView = true"
					class="basis-1/2 btn btn-primary"
					:disabled="disableDeposit"
					:class="
						disableDeposit
							? 'opacity-50 cursor-text'
							: 'opacity-1 cursor-pointer'
					"
				>
					Deposit
				</button>
			</div>
		</div>
	</div>

	<Modal @close="$emit('goBack'), closeViews()" v-if="firstView">
		<!--  Approve Required  -->
		<div
			class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
		>
			<img src="@/assets/img/caution.svg" alt="" class="w-[62px] h-[62px]" />
			<h1 class="text-[20px] uppercase">Approve required</h1>
			<p class="text-[16px]">
				Before you can use Prospero, you need to approve the tokens to be
				transferred.
			</p>
			<button
				class="btn btn-primary w-full"
				@click="depositToPortfolio(), toggleView"
			>
				Okay
			</button>
		</div>
	</Modal>

	<Modal @close="$emit('goBack'), closeViews()" v-if="secondView">
		<!-- Loading  -->
		<div
			v-if="loading"
			class="flex flex-col justify-center items-center gap-[30px] text-center my-[20px]"
		>
			<img
				src="https://i.postimg.cc/tJMqnqDk/image.png"
				alt=""
				class="mx-auto max-w-[90px] object-contain animate-pulse"
			/>
			<Loader />
		</div>

		<!-- Error  -->
		<div
			v-else-if="error"
			class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
		>
			<img
				src="https://i.postimg.cc/tJMqnqDk/image.png"
				alt=""
				class="mx-auto max-w-[130px] object-contain animate-pulse"
			/>
			<h1 class="text-[20px] text-center uppercase">
				🚫 Deposit Unsuccessful
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
			<h1 class="text-[20px] uppercase">🥳 Deposit Successful!</h1>

			<!-- todo: replace these with real values  -->
			<p class="text-[16px]">
				${{ totalAmtToDeposit }} has been sent to
				{{ portfolioStore.selectedPortfolio.name }}. Wait a few moments for
				the tokens to transfer and reflect in your portfolio tab. Gas used
				${{ usdAmountOfGas }}
			</p>

			<button
				class="btn btn-primary uppercase w-full"
				@click="$emit('redirect')"
			>
				Take me to my portfolios
			</button>
		</div>
	</Modal>
</template>

<script setup>
import { getBalancesInEoa, handleDepositType, updateApiTokenList } from "@/api";
import { onMounted, computed, ref } from "vue";
import Modal from "../Modal.vue";
import { usePortfolios } from "@/stores/Portfolios";
import Loader from "../Loader.vue";
import { useRouter } from "vue-router";
const { currentRoute } = useRouter();

const portfolioStore = usePortfolios();

const loading = ref(false);

const error = ref(false);

const errorMsg = ref("");

const success = ref(false);

const firstView = ref(false);

const secondView = ref(false);

const tokenList = ref([]);

let usdAmountOfGas = ref("");

onMounted(() => {
	getTokenList();
});

function toggleView() {
	firstView.value = false;
	secondView.value = true;
}

function closeViews() {
	firstView.value = false;
	secondView.value = false;
}

function closeModal() {
	portfolioStore.depositDialog = false;
	portfolioStore.goBack();
}
async function getTokenList() {
	try {
		loading.value = true;
		tokenList.value = await getBalancesInEoa();
		loading.value = false;
	} catch (error) {
		loading.value = false;
		error.value = true;
		console.log(error);
	}
}

async function depositToPortfolio() {
	//currentRoute.push('/')
	//router.push({ name: 'user', params: { username: 'erina' } })

	firstView.value = false;
	secondView.value = true;

	console.log("depositToPortfolio called");
	loading.value = true;

	try {
		let res = await handleDepositType();
		console.log(res);
		if (res.success) {
			console.log("success is true");
			usdAmountOfGas.value = res.gasUsed.usdAmountOfGas.toFixed(2);
			console.log("usdAmountOfGas to show in modal:" + usdAmountOfGas.value);
			error.value = false;
			loading.value = false;
			await portfolioStore.loadData();
			// portfolioStore.myPortfolios.push(portfolioStore.selectedPortfolio);
			//await initializeApi();
			//await portfolioStore.getPortfolios();
		} else {
			console.log("success is false");
			loading.value = false;
			error.value = true;
			errorMsg.value = res.error;
			console.log(errorMsg.value);
		}
	} catch (err) {
		console.log("exception err:" + err);
		loading.value = false;
		error.value = true;
	}
	console.log("done");
}

async function add(amt, name) {
	let newTokenList = tokenList.value.map((token) => {
		if (token.name === name) {
			token = { ...token, usdAmountEnteredByUser: parseFloat(amt) };
			console.log("TOKEN:" + JSON.stringify(token, null, 2));
		}
		return token;
	});
	updateApiTokenList(newTokenList);

	tokenList.value = newTokenList;

	console.log(tokenList.value);
}

const totalAmtToDeposit = computed(() => {
	return tokenList.value.reduce((accumulator, currentValue) => {
		if (!(parseFloat(currentValue.usdAmountEnteredByUser) > 0)) {
			return accumulator + 0;
		} else {
			return accumulator + parseFloat(currentValue.usdAmountEnteredByUser);
		}
	}, 0);
});

function slice(str, total, start) {
	if (str.length <= total) return str;
	return str.slice(0, start) + "...";
}

const disableDeposit = computed(() => totalAmtToDeposit.value <= 0);

const totalAvailable = computed(() => {
	return tokenList.value.reduce((accumulator, currentValue) => {
		if (!(parseFloat(currentValue.available) > 0)) {
			return accumulator + 0;
		} else {
			return accumulator + parseFloat(currentValue.available);
		}
	}, 0);
});
</script>

<style lang="postcss" scoped>
tfoot td {
	@apply py-[14px];
}
</style>
