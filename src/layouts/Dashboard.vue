<template>
	<div class="grid grid-cols-[300px_1fr] gap-0 max-h-screen">
		<Sidebar class="w-[300px]" />
		<main class="py-[14px] px-[28px]">
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
					@do-create="doCreate"
					:disabled="smDisabled"
				/>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { joinPortfolio, createPortfolio, deposit } from "@/api";
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
	joinView.value = true;
	//console.log("doJoin called");
	//(async () => {
	//	var status = await joinPortfolio();
	//	if (!status.success) {
	//		console.log(status.error);
	//		//error code here
	//	}
	//})();
}

function doCreate() {
	console.log("CREATE..");
	(async () => {
		var status = await createPortfolio("Created wallet name here", 20);
		if (!status.success) {
			console.log(status.error);
			//error code here
		}
	})();
	createView.value = true;
}

function goBack() {
	if (joinView.value) {
		portfolioStore.activeMode = "join";
	} else {
		portfolioStore.activeMode = "create";
	}
	portfolioStore.goBack();
	joinView.value = false;
	createView.value = false;
}

function redirect() {
	if (joinView.value) {
		portfolioStore.activeMode = "join";
		portfolioStore.activePortfolioType = "My Portfolios";
		// portfolioStore.myPortfolios.push()
		portfolioStore.goBack();
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
		portfolioStore.myPortfolios.push({
			...portfolioStore.selectedPortfolio,
			created: true,
		});
	}
	joinView.value = false;
	createView.value = false;
}
</script>

<style>
main {
	background: #1f2127 url(https://i.postimg.cc/bwgqP5RR/Backgd.png) no-repeat
		right bottom;
	background-size: cover;
}
</style>
