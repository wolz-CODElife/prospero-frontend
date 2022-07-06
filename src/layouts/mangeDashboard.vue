<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="z-10 bg-[#2D3035] p-[28px] relative">
			<DashHeader />
			<DashMain
				@do-join="doJoin"
				@do-create="doCreate"
				:disabled="smDisabled"
			/>
		</main>
	</div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { joinPortfolio, createPortfolio } from "@/api";
import Sidebar from "./dashboard/Sidebar.vue";
import DashHeader from "./dashboard/DashHeader.vue";
import DashMain from "./dashboard/DashMain.vue";
import JoinDepositModal from "@/components/JoinDepositModal.vue";
import CreateDepositModal from "@/components/CreateDepositModal.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

// Route protection
onBeforeMount(() => {
	if (!JSON.parse(localStorage.getItem("userState")).status) {
		window.location.replace("/");
	}
});

const joinView = ref(false);

const createView = ref(false);

const smDisabled = computed(() => !portfolioStore.selectedPortfolio.name);

function doJoin() {
	console.log("Do join here...");
	joinView.value = true;
	 (async () => {
	 	var status = await joinPortfolio();
	 	if (!status.success) {
	 		console.log(status.error);
	 		//error code here
	 	}
	 })();
}

function doCreate() {
	createView.value = true;
}

function goBack() {
	if (joinView.value) {
		portfolioStore.activeMode = "join";
	} else {
		portfolioStore.activeMode = "create";
	}
	joinView.value = false;
	createView.value = false;
}
</script>
