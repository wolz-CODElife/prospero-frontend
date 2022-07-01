<template>
	<DepositModal
		@deposit-action="createDepositAction"
		@go-back="props.goBack"
	/>
</template>

<script setup>
import DepositModal from "./dashboard/DepositModal.vue";

const props = defineProps({
	goBack: {
		type: Function,
	},
});

function createDepositAction() {
	console.log("Opened Create Deposit Action");
}
</script>
