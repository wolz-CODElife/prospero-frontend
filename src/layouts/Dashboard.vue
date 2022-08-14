<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="z-10 bg-[#2D3035] p-[28px] max-h-[100vh] relative">
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

			<div v-else class="max-h-[calc(100vh-56px)]">
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
import { usePortfolios } from "@/stores/Portfolios";
import { initializeApi, rebalance } from "@/api";

const portfolioStore = usePortfolios();

// Route protection
onBeforeMount(async () => {
	(async () => {
		if (!JSON.parse(localStorage.getItem("userState")).status) {
			// todo: change this to router replace
			window.location.replace("/");
		} else {
			try {
				console.log("calling initializeAPI");
				await initializeApi();
				portfolioStore.isLoading = true;
				try {
					await portfolioStore.getPortfolios();
					portfolioStore.isLoading = false;
				} catch (error) {
					portfolioStore.isLoading = false;
					console.log("get portfolios error", error);
				}
			} catch (error) {
				console.log("init error", error);
			}
		}
	})();
});

const joinView = ref(false);

const createView = ref(false);

const smDisabled = computed(() => !portfolioStore.selectedPortfolio.name);

function doJoin() {
	console.log("doJoin function caing - dashboard");
	updateUIStatus(2);
	joinView.value = true;
}

function doJustDeposit() {
	console.log("doJuseDeposit function caing updateUIStatus(3)");
	updateUIStatus(3);
	joinView.value = true;
}

function doCreate() {
	console.log("doCreate function caing updateUIStatus(1)");
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

function redirect() {
	if (joinView.value) {
		portfolioStore.activeMode = "join";
		// console.log("Portoflio to be joined", portfolioStore.selectedPortfolio);
		//portfolioStore.myPortfolios.push(portfolioStore.selectedPortfolio);

		portfolioStore.activePortfolioType = "My Portfolios";
		portfolioStore.reset();
	} else {
		// todo: populate my portfolios array with this new deposit
		// - if it's a new portfolio you're creating i.e first deposit,
		// - then push object to my portfolios
		// - else update existing portfolio with new deposit, rebalance and all

		// if it's a new portfolio you're joining,
		// simply push object to myPortfolios
		portfolioStore.activeMode = "create";
		portfolioStore.firstCreateView = false;
		// todo: replace with correct values
	}
	joinView.value = false;
	createView.value = false;
}
</script>
