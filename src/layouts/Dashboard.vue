<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="z-10 bg-[#2D3035] px-[28px] pt-[14px]">
			<JoinDepositModal
				v-if="joinView"
				@go-back="goBack"
				@redirect="redirect"
			/>

			<CreateDepositModal
				v-else-if="createView"
				@go-back="goBack"
				@redirect="redirect"
			/>

			<div v-else class="">
				<DashHeader />

				<DashMain
					@do-join="doJoin"
					@do-justDeposit="doJustDeposit"
					@do-create="doCreate"
					:disabled="smDisabled"
				/>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { updateUIStatus } from "@/api";
import Sidebar from "./dashboard/Sidebar.vue";
import DashHeader from "./dashboard/header/DashHeader.vue";
import DashMain from "./dashboard/DashMain.vue";
import JoinDepositModal from "@/components/JoinDepositModal.vue";
import CreateDepositModal from "@/components/CreateDepositModal.vue";
import { initializeApi, rebalance } from "@/api";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

// Route protection
onBeforeMount(async () => {
	(async () => {
		if (!JSON.parse(localStorage.getItem("userState")).status) {
			// todo: change this to router replace
			window.location.replace("/");
		} else {
			try {
				await initializeApi();
				portfolioStore.isLoading = true;
				try {
					await portfolioStore.getPortfolios();
					portfolioStore.isLoading = false;
				} catch (error) {
					portfolioStore.isLoading = false;
					portfolioStore.isError = true;
				}
			} catch (error) {
			}
		}
	})();
});

const joinView = ref(false);

const createView = ref(false);

const smDisabled = computed(() => !portfolioStore.selectedPortfolio.name);

function doJoin() {
	updateUIStatus(2);
	joinView.value = true;
}

function doJustDeposit() {
	updateUIStatus(3);
	joinView.value = true;
}

function doCreate() {
	updateUIStatus(1);
	createView.value = true;
}

function goBack() {
	if (joinView.value) {
		portfolioStore.activeMode = "join";
	} else {
		portfolioStore.activeMode = "create";
	}
	portfolioStore.reset();
	joinView.value = false;
	createView.value = false;
}

async function redirect() {
	// if (joinView.value) {

	portfolioStore.activeMode = "join";
	portfolioStore.activePortfolioType = "My Portfolios";
	joinView.value = false;
	createView.value = false;
	var theProspWalletAddressSelectedBefore =
		portfolioStore.selectedPortfolio.prosperoWalletAddress;

	await portfolioStore.loadData();

	for (var i = 0; i < portfolioStore.myPortfolios.length; i++) {
		var thisPort = portfolioStore.myPortfolios[i];
		if (
			thisPort.prosperoWalletAddress == theProspWalletAddressSelectedBefore
		) {
			portfolioStore.selectedPortfolio = thisPort;
			break;
		}
	}
	await portfolioStore.doSelectPortfolio(thisPort);
}
</script>
