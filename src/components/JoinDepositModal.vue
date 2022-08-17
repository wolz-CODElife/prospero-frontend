<template>
	<DepositModal @go-back="props.goBack" @redirect="props.redirect" />
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
</script>
