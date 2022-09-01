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
					portfolioStore.isError = true;
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
	//portfolioStore.selectedPortfolio
	//portfolioStore.reset();
	// } else {
	// 	portfolioStore.activeMode = "create";
	// 	portfolioStore.firstCreateView = false;
	// }
}
</script>
