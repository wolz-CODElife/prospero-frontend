<template>
	<DepositModal
		@deposit-action="createDepositAction"
		@go-back="props.goBack"
		@redirect="props.redirect"
	/>
</template>

<script setup>
import DepositModal from "./dashboard/DepositModal.vue";
import { usePortfolios } from "@/stores/Portfolios";
import { createPortfolioThenDeposit} from "@/api";

const portfolioStore = usePortfolios();

const props = defineProps({
	goBack: {
		type: Function,
	},
	redirect: {
		type: Function,
	},
});

async function createDepositAction() {
	console.log("Opened Create Deposit Action");
	
	portfolioStore.depositDialog = true;//THIS LINE OPENS MODAL BUT MAKES MESTAMASK NOT OPEN AUTOMATICALLY
	
}
</script>
