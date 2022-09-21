<template>
	<Modal v-if="props.isShowing" @close="$emit('closeWalletModal')">
		<div class="text-white">
			<!-- Logo  -->
			<img
				src="https://i.postimg.cc/tJMqnqDk/image.png"
				alt=""
				class="mx-auto w-[85px]"
			/>

			<!-- Prospero Text -->
			<img
				src="@/assets/img/prospero.svg"
				alt="Prospero Logo Text"
				class="w-[103px] mx-auto mt-[14px] mb-[28px]"
			/>

			<p class="text-center text-[16px] mb-[30px]">
				Please disconnect this site from your wallet provider, then connect a new wallet. <br>
                <img src="https://i.postimg.cc/fRXcGSmD/image.png" alt="connect wallet" class="mx-auto my-[20px] w-[80%] max-h-[300px] object-contain">
			</p>

            <p class="text-center text-[16px] mb-[30px]">
				<button
					@click="toggleWalletModal"
					class="btn btn-primary-outline w-[250px] mx-auto uppercase"
				>
					Connect New wallet
				</button>
            </p>
		</div>
	</Modal>



	Change Wallet Modal 
	<ConnectWalletModal
		@connectMetaMask="useChangeMetaMask"
		@connectWalletConnect="useWalletConnect"
		@close-wallet-modal="toggleWalletModal"
		:is-showing="walletModal"
	/>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../Modal.vue";
import ConnectWalletModal from "./ConnectWalletModal.vue";

const props = defineProps(["isShowing"]);

defineEmits(["closeWalletModal"]);

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
