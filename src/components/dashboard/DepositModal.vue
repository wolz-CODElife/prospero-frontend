<template>
	<div class="h-full w-full bg-[#191A20] border border-[#2D3035] p-[30px]">
		<div class="flex justify-between">
			<!-- Go BACK -->
			<button
				class="button text-[#00FF00] uppercase flex gap-[14px] items-center"
				@click="$emit('goBack')"
			>
				<img src="@/assets/img/direction.svg" alt="" />
				Go BACK
			</button>

			<h1 class="text-[#868C9D] text-[16px]">DEPOSITING TO PORTFOLIO</h1>
		</div>

		<div
			class="mt-[20px] p-[20px] bg-black flex justify-between items-center w-full"
		>
			<!-- Name  -->
			<h2 class="text-white">{{ portfolioStore.selectedPortfolio.name }}</h2>

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
					class="text-white text-left py-[20px] mx-[28px] px-[28px] border-b border-b-[#2D3035]"
					:class="[activeRow === i ? 'bg-[#003D3B] ' : 'bg-transparent']"
				>
					<td class="flex items-center px-[28px]">
						<img
							:src="token.icon"
							alt=""
							class="w-[30px] h-[30px] mr-[10px]"
						/>{{ token.name }}
					</td>
					<td>${{ token.price }}</td>
					<td>${{ token.available }}</td>
					<td>${{ token.usdAmountEnteredByUser }}</td>
				</tr>
			</tbody>
			<tfoot class="bg-[#2D3035] text-white py-[14px] px-[22px]">
				<tr class="px-[20px]">
					<td colspan="2" class="pl-[32px]">TOTAL</td>
					<td>$1920</td>
					<td class="text-[#00FF00]">$20</td>
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
				class="basis-1/2 btn btn-primary"
				:class="
					depositDisabled
						? 'opacity-50 cursor-text'
						: 'opacity-1 cursor-pointer'
				"
				@click="openDialogModal"
				:disabled="depositDisabled"
			>
				Deposit
			</button>
		</div>

		<Modal v-if="depositDialog" @close="depositDialog = false">
			<!-- Approve Required  -->
			<div
				v-if="!confirmDeposit"
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<img
					src="@/assets/img/caution.svg"
					alt=""
					class="w-[62px] h-[62px]"
				/>
				<h1 class="text-[20px] uppercase">Approve required</h1>
				<p class="text-[16px]">
					Before you can use Prospero, you need to approve the tokens to be
					transferred.
				</p>
				<button
					class="btn btn-primary w-full"
					@click="confirmDeposit = true"
				>
					Okay
				</button>
			</div>

			<!-- Deposit Successful -->
			<div
				v-else
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<img
					src="https://i.postimg.cc/Y2vdsnZW/image.png"
					alt=""
					class="max-w-[65%]"
				/>
				<h1 class="text-[20px] uppercase">Deposit Successful</h1>
				<p class="text-[16px]">
					$20.00 has been sent to AFS1000 🔱. Wait a few moments for the
					tokens to transfer and reflect in your portfolio tab. Gas used
					$2.24
				</p>
				<button
					class="btn btn-primary uppercase w-full"
					@click="
						$emit('goBack'),
							portfolioStore.reset(),
							(portfolioStore.activeMode = 'join')
					"
				>
					Take me to my portfolios
				</button>
			</div>
		</Modal>
	</div>
</template>

<script setup>
//balancesInEoa
import {getBalancesInEoa, deposit, updateAmount} from '@/api'

import { ref } from "vue";
import Modal from "../Modal.vue";
import { usePortfolios } from "@/stores/Portfolios";
const portfolioStore = usePortfolios();

const depositDialog = ref(false);

const confirmDeposit = ref(false);

const depositDisabled = ref(true);

const activeRow = ref(null);

function openDialogModal() {
	(async () => {
		var status = await deposit();
		if (!status.success){
			console.log(status.error);
			//error code here
		}
	})()
	depositDialog.value = true;
}

function enableDeposit(tokenId) {
	activeRow.value = tokenId;
	depositDisabled.value = false;
}



const tokenList = ref([]);
(async () => {
	var tokenListData = await getBalancesInEoa();//getLeaderBoardDataForTable();
	if (tokenListData.hasOwnProperty("error")){
		console.log(tokenListData.error);
		//error code here
	}
	tokenList.value = tokenListData;
})()
/*
const tokenList = ref([
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
	{
		icon: "https://i.postimg.cc/q7Jkt16B/image.png",
		name: "Pangolin",
		price: 2.6,
		available: 8,
		amount: 12,
	},
]);
*/
</script>

<style lang="postcss">
td {
	@apply py-[10px];
}

tbody tr {
	@apply hover:bg-[#003D3B];
}

th {
	@apply uppercase;
}
</style>
