<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="z-10 bg-[#2D3035] p-[28px] relative">
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

			<div v-else>
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
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { updateUIStatus } from "@/api";
import Sidebar from "./dashboard/Sidebar.vue";
import DashHeader from "./dashboard/DashHeader.vue";
import DashMain from "./dashboard/DashMain.vue";
import JoinDepositModal from "@/components/JoinDepositModal.vue";
import CreateDepositModal from "@/components/CreateDepositModal.vue";
import { usePortfolios } from "@/stores/Portfolios";
import { initializeApi,  rebalance } from "@/api";

const portfolioStore = usePortfolios();

// Route protection
onBeforeMount(async () => {
	if (!JSON.parse(localStorage.getItem("userState")).status) {
		window.location.replace("/");
	}
	// todo: optimize nested try blocks
	 try {
		console.log("calling initializeAPI");
	 	await initializeApi();
	 	try {
	 		portfolioStore.getAllPortfolios();
			portfolioStore.getMyPortfolios();
	 	} catch (error) {
	 		console.log("get all portfolios error", error);
	 	}
	 } catch (error) {
	 	console.log("init error", error);
	 }
});

const joinView = ref(false);

const createView = ref(false);

const smDisabled = computed(() => !portfolioStore.selectedPortfolio.name);

function doJoin() {
	console.log('doJoin function')
	updateUIStatus(2)
	joinView.value = true;
}

function doJustDeposit() {
	console.log('doJuseDeposit function')
	updateUIStatus(3)
	joinView.value = true;
}

function doCreate() {
	console.log('doCreate function')
	updateUIStatus(1)
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
		portfolioStore.activePortfolioType = "My Portfolios";
		// portfolioStore.myPortfolios.push()
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
		portfolioStore.selectedPortfolio = {
			name: "test display",
			fee: 0,
			d7: 0,
			d30: 0,
			d90: 0,
			y1: 0,
		};
		portfolioStore.createdPortfolios.push(portfolioStore.selectedPortfolio);
	}
	joinView.value = false;
	createView.value = false;
}
</script>
