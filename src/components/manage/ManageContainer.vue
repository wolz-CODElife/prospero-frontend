<template>
	<hr class="border-[#2D3035]" />
	<!-- Select Portfolio to Manage component  -->
	<SelectPortfolio />

	<div class="flex items-center justify-between p-[10px]">
		<!-- Select Token To add -->
		<SelectToken />

		<!-- Change Fund fee -->
		<div class="flex items-center gap-[10px]">
			<label for="" class="uppercase text-white text-[12px]"
				>Fund <br />fee %</label
			>
			<input
				type="number"
				name=""
				id=""
				v-model="portfolioStore.portfolioFundFee"
				class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[12px] border border-[#003D3B] focus:outline-none"
			/>
		</div>

		<!-- Accepting new investors -->
		<div
			class="flex gap-[12px] items-center p-[5px_10px] text-white"
			:class="
				portfolioStore.isPortfolioAcceptingNewInvestors
					? 'bg-[#2D3035]'
					: 'bg-[#005A57]'
			"
		>
			<label for="" class="uppercase text-[12px]"
				>Accepting <br />
				new investors</label
			>
			<label class="switch">
				<input
					type="checkbox"
					aria-label="djdn"
					:checked="portfolioStore.isPortfolioAcceptingNewInvestors"
					v-model="portfolioStore.isPortfolioAcceptingNewInvestors"
				/>
				<span class="slider round"></span>
			</label>
		</div>
	</div>

	<hr class="border-[#2D3035]" />

	<!-- Table  -->
	<div class="h-[200px] lg:h-[300px] overflow-y-auto">
		<table class="table-auto w-full mb-[20px]">
			<thead>
				<tr
					class="text-[#868C9D] text-left border-b border-b-[#2D3035] px-[30px]"
				>
					<th class="pl-[16px]">ALLOCATION</th>
					<th>TOKEN</th>
					<th>PRICE</th>
					<th class="border-r border-r-[#2D3035]">MC</th>
					<th class="pl-[20px]">7D%</th>
					<th>30D%</th>
					<th>90D%</th>
					<th>1YR%</th>
				</tr>
			</thead>
			<tbody>
				<tr
					class="text-left mx-[28px] border-b border-b-[#2D3035] text-white"
					v-for="(token, i) in portfolioStore.allocationList"
					:key="i"
				>
					<td class="flex items-center gap-[20px] pl-[10px]">
						<!-- Delete token  -->
						<button @click="deleteToken(token)">
							<img src="@/assets/img/delete.svg" alt="" />
						</button>

						<!-- Input allocation  -->
						<input
							type="number"
							name=""
							id=""
							v-model="token.allocation"
							@keyup="newList($event.target.value, token.name)"
							class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
						/>
					</td>
					<td>{{ token.name }}</td>
					<td>${{ token.price.toFixed(2) }}</td>
					<td class="border-r border-r-[#2D3035]">
						${{ parseFloat(token.mc) }}M
					</td>
					<td class="pl-[20px]">{{ token.d7 }}%</td>
					<td>{{ token.d30 }}%</td>
					<td>{{ token.d90 }}%</td>
					<td>{{ token.y1 }}%</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="absolute bottom-0 inset-x-0">
		<!-- Save allocation -->
		<button
			v-if="!success && totalAllocation > 0"
			@click="doSaveAllocation"
			class="btn btn-primary uppercase w-full mt-[50px]"
			:class="
				disableSaveAllocation
					? 'opacity-50 cursor-text '
					: 'opacity-1 cursor-pointer hover:bg-transparent'
			"
			:disabled="disableSaveAllocation"
		>
			{{ totalAllocation }}% -
			<span v-if="!disableSaveAllocation"
				>Click here to save allocation</span
			>
			<span v-else-if="disableSaveAllocation && totalAllocation > 100"
				>Reduce total allocation to 100%</span
			>
			<span v-else-if="disableSaveAllocation && totalAllocation < 100"
				>Need {{ remAllocation }}% more allocation</span
			>
		</button>

		<!-- Saved display  -->
		<button
			v-if="success"
			disabled
			class="btn btn-primary uppercase w-full mt-[32px]"
		>
			100% - Allocation saved!
		</button>
		<!-- <Toast type="success" /> -->
	</div>

	<!-- saveAllocationModal -->
	<Modal v-if="saveAllocationModal" @close="closeAllocationModal()">
		<!-- Loading  -->
		<div
			v-if="loading"
			class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
		>
			<h1 class="text-[20px] text-center uppercase">Loading...</h1>
		</div>

		<!-- Error  -->
		<div
			v-else-if="error"
			class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
		>
			<h1 class="text-[20px] text-center uppercase">
				Unable to save allocation
			</h1>
			<p>
				{{ errorMessage }}
			</p>
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
			<h1 class="text-[20px] uppercase">You're All set!</h1>

			<p class="text-[16px]">
				Your porfolio allocation was successfully saved.
			</p>

			<button
				@click="successCloseAllocationModal"
				class="btn btn-primary uppercase mx-auto"
			>
				Thanks
			</button>
		</div>
	</Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import SelectToken from "./SelectToken.vue";
import Modal from "../Modal.vue";
import Dashboard from "@/layouts/Dashboard.vue";
import SelectPortfolio from "./SelectPortfolio.vue";

import { usePortfolios } from "@/stores/Portfolios";
import {
	rebalance,
	getTokenArray,
	updateNewInvestors,
	updatePercentageFee,
} from "@/api";
import { useRouter } from "vue-router";
import router from "@/router/index.js";

const portfolioStore = usePortfolios();

const loading = ref(false);

const error = ref(false);

const success = ref(false);

const switchChecked = ref(portfolioStore.isPortfolioAcceptingNewInvestors);

const saveAllocationModal = ref(false);

const fundFee = ref(portfolioStore.portfolioFundFee);

const errorMessage = ref("SHIT");

const disableSaveAllocation = computed(
	() => totalAllocation.value < 100 || totalAllocation.value > 100
);

const remAllocation = computed(() => {
	return 100 - totalAllocation.value;
});

const totalAllocation = computed(() => {
	return portfolioStore.allocationList.reduce((accumulator, currentValue) => {
		if (!(parseFloat(currentValue.allocation) > 0)) {
			return accumulator + 0;
		} else {
			return accumulator + parseFloat(currentValue.allocation);
		}
	}, 0);
});

async function doSaveAllocation() {
	var selectedProsperoWalletAddress =
		portfolioStore.selectedPortfolio.prosperoWalletAddress;

	if (
		portfolioStore.isPortfolioAcceptingNewInvestors !=
		portfolioStore.selectedPortfolio.acceptingNewInvestorsOriginal
	) {
		var result = await updateNewInvestors(
			selectedProsperoWalletAddress,
			portfolioStore.isPortfolioAcceptingNewInvestors
		);
		if (!result.success) {
			loading.value = false;
			error.value = true;
			console.error(result.error);
			//to do - add error message here
			return;
		}
	}
	//if the portfolio fee is less than the original
	if (
		portfolioStore.portfolioFundFee <
		portfolioStore.selectedPortfolio.leaderPercentageFeeOriginal
	) {
		//updatePercentageFee(prosperoWalletAddress, newPercFee)
		portfolioStore.portfolioFundFee = parseInt(
			portfolioStore.portfolioFundFee
		);
		var result = await updatePercentageFee(
			selectedProsperoWalletAddress,
			portfolioStore.portfolioFundFee
		);
		if (!result.success) {
			loading.value = false;
			error.value = true;
			console.error(result.error);
			//to do - add error message here
			return;
		}
	} else if (
		portfolioStore.portfolioFundFee >
		portfolioStore.selectedPortfolio.leaderPercentageFeeOriginal
	) {
		console.error("show error - new percentage fee has to be less.");
	}
	var tokenAddressesToRemix = [];
	var percentages = [];
	var newTokensAlloc = portfolioStore.allocationList;
	for (var i = 0; i < newTokensAlloc.length; i++) {
		var token = newTokensAlloc[i];
		var perc = Number(token.allocation);
		if (perc > 0) {
			percentages.push(Number(token.allocation));
			tokenAddressesToRemix.push(token.address);
		}
	}
	if (percentages.length != tokenAddressesToRemix.length) {
		console.error(
			"percentages and tokenAddressesToRemix length are different!"
		);
		return;
	}

	try {
		let res = await rebalance(
			percentages,
			tokenAddressesToRemix,
			selectedProsperoWalletAddress
		);
		if (!res.success) {
			loading.value = false;
			error.value = true;
			//errorMsg.value = res.error;
			//alert(res.error);//to do - need an error message box here
			errorMessage.value = res.error;
		} else {
			error.value = false;
			loading.value = false;
			success.value = true;
			//usdAmountOfGas.value = res.gasUsed.usdAmountOfGas.toFixed(2);
		}
	} catch (err) {
		loading.value = false;
		error.value = true;
		success.value = false;
	}

	saveAllocationModal.value = true;

	await loadFreshDataFromApi();
}

function closeAllocationModal() {
	saveAllocationModal.value = false;
}

async function loadFreshDataFromApi() {
	await portfolioStore.loadData();
	var selectedPortAddress =
		portfolioStore.selectedManagePortfolio.prosperoWalletAddress;
	var port;
	for (var i = 0; i < portfolioStore.myPortfolios.length; i++) {
		var port = portfolioStore.myPortfolios[i];
		var thisProspAddress = port.prosperoWalletAddress;
		if (thisProspAddress == selectedPortAddress) {
			break;
		}
	}
	if (port == undefined) {
		alert(" no port found rebalance");
		return;
	}
	//for (var tokenAddress in port) {
	//	if (tokenAddress.length == 42){
	//	}
	//}

	portfolioStore.selectedManagePortfolio = port;
	await onClickedPort(port);
}

async function onClickedPort(portfolio) {

	//Do this for line chart
	portfolioStore.activePortfolioType = "My Portfolios";
	await portfolioStore.doSelectPortfolio(portfolio);

	portfolioStore.selectedPortfolio = portfolio;
	portfolioStore.allocationList = [];

	portfolioStore.portfolioFundFee = portfolio.leaderPercentageFee;
	portfolioStore.isPortfolioAcceptingNewInvestors =
		portfolio.acceptingNewInvestors;
	var port = portfolio["portfolioObject"];
	for (var tokenAddress in port) {
		if (tokenAddress.length == 42) {
			var token = port[tokenAddress];
			token["address"] = tokenAddress;
			token["allocation"] = token.percentage;
			token["allocation"] = token["allocation"].toFixed(2);
			token["allocation"] = parseInt(token["allocation"] * 100);
			//token['mc']=0;
			//token['d7']=token['d7'];
			//token['d30']=token['d30'];
			//token['d90']=token['d90'];
			//token['y1']=token['y1'];
			token["icon"] = token.image;

			portfolioStore.allocationList.push(token);
		}
	}
	var currentAllocationList = portfolioStore.allocationList;

	var tokenList = getTokenArray();
	var newTokenList = [];

	for (var i = 0; i < tokenList.length; i++) {
		var thisToken = tokenList[i];
		var foundItAlready = false;
		for (var j = 0; j < currentAllocationList.length; j++) {
			var thisAllocationToken = currentAllocationList[j];
			if (thisAllocationToken.address == thisToken.address) {
				foundItAlready = true;
			}
		}
		if (!foundItAlready) {
			thisToken["icon"] = thisToken.logoURI;
			newTokenList.push(thisToken);
		}
	}
	portfolioStore.tokenList = newTokenList;
}

async function successCloseAllocationModal() {
	// saveAllocationModal.value = false;
	saveAllocationModal.value = false;
	portfolioStore.activePortfolioType = "My Portfolios";

	var selectedPortAddress =
		portfolioStore.selectedManagePortfolio.prosperoWalletAddress;
	await portfolioStore.loadData();
	var port;
	for (var i = 0; i < portfolioStore.myPortfolios.length; i++) {
		port = portfolioStore.myPortfolios[i];
		if (port.prosperoWalletAddress == selectedPortAddress) {
			portfolioStore.selectedManagePortfolio = port;
			break;
		}
	}

	portfolioStore.selectedManagePortfolio = port;
	portfolioStore.selectedPortfolio = port;
	portfolioStore.activePortfolioType = "My Portfolios";
	await portfolioStore.doSelectPortfolio(port);

	portfolioStore.allocationList = [];
	var portfolio = portfolioStore.selectedManagePortfolio;
	portfolioStore.portfolioFundFee = portfolio.leaderPercentageFee;
	portfolioStore.isPortfolioAcceptingNewInvestors =
		portfolio.acceptingNewInvestors;
	var port = portfolio["portfolioObject"];
	for (var tokenAddress in port) {
		if (tokenAddress.length == 42) {
			var token = port[tokenAddress];
			token["address"] = tokenAddress;
			token["allocation"] = token.percentage;
			token["allocation"] = token["allocation"].toFixed(2);
			token["allocation"] = parseInt(token["allocation"] * 100);
			//token['mc']=0;
			//token['d7']=0;
			//token['d30']=0;
			//token['d90']=0;
			//token['y1']=0;
			token["icon"] = token.image;
			portfolioStore.allocationList.push(token);
		}
	}
	var currentAllocationList = portfolioStore.allocationList;
	var tokenList = getTokenArray();
	var newTokenList = [];
	for (var i = 0; i < tokenList.length; i++) {
		var thisToken = tokenList[i];
		var foundItAlready = false;
		for (var j = 0; j < currentAllocationList.length; j++) {
			var thisAllocationToken = currentAllocationList[j];
			if (thisAllocationToken.address == thisToken.address) {
				foundItAlready = true;
			}
		}
		if (!foundItAlready) {
			thisToken["icon"] = thisToken.logoURI;
			newTokenList.push(thisToken);
		}
	}
	portfolioStore.tokenList = newTokenList;
	success.value = false;
}

function newList(amt, name) {
	let newTokenList = portfolioStore.tokenList.map((token) => {
		if (token.name === name) {
			token = { ...token, allocation: parseFloat(amt) };
		}
		return token;
	});
	portfolioStore.tokenList = newTokenList;
}

function deleteToken(item) {
	for (var i = 0; i < portfolioStore.allocationList.length; i++) {
		if (item.address == portfolioStore.allocationList[i]["address"]) {
			portfolioStore.allocationList.splice(i, 1);
		}
	}
	portfolioStore.tokenList.push(item);
}
</script>

<style lang="postcss" scoped>
.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

.slider:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

input:checked + .slider {
	background-color: #04ce04;
}

input:focus + .slider {
	box-shadow: 0 0 1px #04ce04;
}

input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
	border-radius: 34px;
}

.slider.round:before {
	border-radius: 50%;
}

td,
th {
	@apply py-[8px] text-[13px];
}
</style>
