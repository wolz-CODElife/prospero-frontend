<template>
	<DepositModal @deposit-action="joinDepositAction" @go-back="props.goBack" />
</template>

<script setup>
import DepositModal from "./dashboard/DepositModal.vue";

const props = defineProps({
	goBack: {
		type: Function,
	},
});

function joinDepositAction() {
	console.log("Opened Join Deposit Action");
}
</script>
