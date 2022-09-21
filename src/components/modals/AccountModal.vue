<template>
	<Modal @close="$emit('close')" v-if="props.firstView">
		<div class="mx-[12px] my-[16px]">
			<AccountOverview />

			<div class="flex items-center justify-between mb-[40px]">
				<button
					@click="toggleWalletModal"
					class="btn btn-primary-outline w-[200px] uppercase"
				>
					Change wallet
				</button>

				<button
					@click="$emit('doLogout')"
					class="btn btn-red-outline w-[200px] uppercase"
				>
					Log out
				</button>
			</div>
		</div>
	</Modal>

	<!-- Change Wallet Modal 
	<ConnectWalletModal
		@connectMetaMask="useChangeMetaMask"
		@connect-wallet-connect="useWalletConnect"
		@close-wallet-modal="toggleWalletModal"
		:is-showing="walletModal"
	/> -->

	<!-- Change Wallet Modal  -->
	<ChangeWalletModal
		@close-wallet-modal="toggleWalletModal"
		:is-showing="walletModal"
	/>

	<Modal @close="$emit('close')" v-if="props.secondView"> Log out view </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../Modal.vue";
import AccountOverview from "../modals/AccountOverview.vue";
import ConnectWalletModal from "./ConnectWalletModal.vue";
import connect from "@/composables/connect/index";
import useChangeMetaMask from "@/composables/changeMetaMask";
import ChangeWalletModal from "./ChangeWalletModal.vue";

const props = defineProps({
	firstView: Boolean,
	secondView: Boolean,
});

defineEmits(["close", "doLogout"]);

const { err } = connect();
const walletModal = ref(false);

function toggleWalletModal() {
	walletModal.value = !walletModal.value;
}

async function useWalletConnect() {
	connectWalletConnect().then((data) => {
		if (data.error) {
			err.value = {
				msg: "Coin98 Extension is not installed!",
				type: "error",
			};
		} else {
			window.location.replace("dashboard");
		}
	});
}
</script>
