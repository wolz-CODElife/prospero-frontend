<template>
<div
			v-if="loading"
			class="flex flex-col h-[75vh] items-center justify-center"
		>

			<Loader />
		</div>
	<Modal @close="$emit('close')" v-if="firstView">
		<div class="mx-[20px] my-[16px]">
			<WithdrawalOverview />
			<!-- Form  -->
			<form class="w-full mt-[32px]">
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
						v-model="withdrawalAmountHere"
						placeholder="$0"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					/>
				</div>

				<!-- SELECT THE SINGLE TOKEN YOU ARE WITHDRAWING INTO  -->
				<div class="mb-[28px] relative" v-if="mode === 'swap'">
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
						v-model="singleTokenHere"
						placeholder="Select"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					/>
				</div>

				<!-- Withdraw  -->
				<!-- :disabled="disableWithdraw" -->
				<!-- :class="
						disableWithdraw
							? 'opacity-50 cursor-text '
							: 'opacity-1 cursor-pointer hover:bg-transparent'
					" -->
				<button
					@click.prevent="withdrawHere"
					class="btn btn-primary bg-[#005A57] w-full cursor-pointer hover:bg-transparent"
				>
					Withdraw
				</button>
			</form>
		</div>
	</Modal>

	<Modal @close="$emit('close')" v-else>
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
			v-else-if="success"
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
				${{ withdrawalAmountHere }} has been sent to you. Wait a few moments for the
				tokens to transfer and reflect in your wallet. Gas used ${{
					usdAmountOfGas
				}}
			</p>

			<button
				class="btn btn-primary uppercase w-full"
					@click="myRedirect"
			>
				Take me to home
			</button>
		</div>
	</Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import Modal from "../Modal.vue";
import WithdrawalOverview from "../withdrawal/WithdrawalOverview.vue";
import { withdraw } from "@/api";
import { usePortfolios } from "@/stores/Portfolios";
import Loader from "../Loader.vue";
import { useRouter } from "vue-router";
import router from "@/router/index.js";

const withdrawalAmountHere = ref("");

const singleTokenHere = ref("");

const portfolioStore = usePortfolios();


const loading = ref(false);

const error = ref(false);

const errorMsg = ref("");

const success = ref(false);

const firstView = ref(true);

let usdAmountOfGas = ref("");

const mode = ref("");

/*
const props = defineProps({
	amount: String,
	singleToken: String,
	mode: String,
	firstView: Boolean,
	usdAmountofGas: String,
});


async function redirect() {
	console.log("redirect called");
	// if (joinView.value) {
	console.log("****this.selectedPortfolio:"+JSON.stringify(portfolioStore.selectedPortfolio,null,2));

	portfolioStore.activeMode = "join";
	portfolioStore.activePortfolioType = "My Portfolios";
	joinView.value = false;
	createView.value = false;
	var theProspWalletAddressSelectedBefore = portfolioStore.selectedPortfolio.prosperoWalletAddress;
	
	await portfolioStore.loadData();
	
	for (var i =0;i<portfolioStore.myPortfolios.length;i++){
		var thisPort = portfolioStore.myPortfolios[i]
		if (thisPort.prosperoWalletAddress == theProspWalletAddressSelectedBefore)
		{
			console.log('****found it****')
			portfolioStore.selectedPortfolio=thisPort;
			break;
		}
	}
	console.log("thisPort:"+JSON.stringify(thisPort,null,2));
	await portfolioStore.doSelectPortfolio(thisPort)

}

*/

async function withdrawHere(){
	loading.value=true;
	console.log('withdrawHere');
	success.value=true;
	//console.log('withdrawalAmountHere:'+JSON.stringify(withdrawalAmountHere,null,2));
	//return;
	//to do - add tokens swapping into
	try {
		console.log("doWithdraw amount.value:" +withdrawalAmountHere);
		console.log("singleTokenHere:"+singleTokenHere.value);

		var singleTokenValue= singleTokenHere.value;
		singleTokenValue = singleTokenValue.trim();
		console.log("singleTokenValue:"+singleTokenValue);
		const res = await withdraw([], withdrawalAmountHere.value);
		console.log(res);
		if (res.success) {
			console.log("success:")
			usdAmountOfGas.value = res.gasUsed.usdAmountOfGas;
			console.log("usdAmountOfGas to show in modal:" + usdAmountOfGas);
			await portfolioStore.loadData();
			loading.value=false;
			error.value = false;
			success.value =true;
			//loading.value = false;
			//error.value = true;
			//errorMsg.value = res.error;
			//error.value = false;
			//loading.value = false;
			//await portfolioStore.loadData();
		} else {
			console.log("not success:")
			loading.value = false;
			error.value = true;
			success.value =false;
		}
	} catch (error) {
		error.value = true;
		console.log(error);
		loading.value = false;
		success.value =false;

		//withdrawMode.value = "";
	}
	firstView.value = false;
	loading.value=false;

	//error.value = false;
}

async function myRedirect(){

	console.log("redirect called");
	// if (joinView.value) {
	console.log("****this.selectedPortfolio:"+JSON.stringify(portfolioStore.selectedPortfolio,null,2));
	success.value = false;
	loading.value=false;
	error.value=false;
	firstView.value = false;

	portfolioStore.activeMode = "join";
	portfolioStore.activePortfolioType = "My Portfolios";
	//joinView.value = false;
	//createView.value = false;
	var theProspWalletAddressSelectedBefore = portfolioStore.selectedPortfolio.prosperoWalletAddress;
	
	await portfolioStore.loadData();
	
	for (var i =0;i<portfolioStore.myPortfolios.length;i++){
		var thisPort = portfolioStore.myPortfolios[i]
		if (thisPort.prosperoWalletAddress == theProspWalletAddressSelectedBefore)
		{
			console.log('****found it****')
			portfolioStore.selectedPortfolio=thisPort;
			break;
		}
	}
	console.log("thisPort:"+JSON.stringify(thisPort,null,2));
	await portfolioStore.doSelectPortfolio(thisPort)

}

const totalAmtToWithdraw = ref("");

const disableWithdraw = computed(() => totalAmtToWithdraw.value <= 0);
</script>
