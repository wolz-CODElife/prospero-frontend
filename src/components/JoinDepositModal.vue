<template>
	<DepositModal @deposit-action="joinDepositAction" @go-back="props.goBack" />
</template>

<script setup>
import DepositModal from "./dashboard/DepositModal.vue";
import { deposit } from "@/api";

const props = defineProps({
	goBack: {
		type: Function,
	},
});

function joinDepositAction() {
	console.log("Opened Join Deposit Action");
	(async () => {
		var status = await deposit();
		if (!status.success) {
			console.log(status.error);
			//error code here
		}
	})();
}
</script>
