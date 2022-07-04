<template>
	<DepositModal
		@deposit-action="joinDepositAction"
		@go-back="props.goBack"
		@redirect="props.redirect"
	/>
</template>

<script setup>
import DepositModal from "./dashboard/DepositModal.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const props = defineProps({
	goBack: {
		type: Function,
	},
	redirect: {
		type: Function,
	},
});

function joinDepositAction() {
	console.log("Opened Join Deposit Action");
	portfolioStore.depositDialog = true;
}
</script>
