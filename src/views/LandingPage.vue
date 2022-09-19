<template>
	<div v-if="err.msg">
		<AppAlert :type="err.type"
			><p class="slot">{{ err.msg }}</p></AppAlert
		>
	</div>

	<div class="bg-landing w-full h-full text-white pb-[60px] fixed">
		<!-- Nav  -->
		<nav class="flex items-center justify-end gap-16 pt-[24px] pr-28">
			<RouterLink to="/history" class="btn text-white text-[16px] uppercase"
				>Docs</RouterLink
			>
			<button
				@click="toggleWalletModal()"
				class="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#00FF00] uppercase py-[8px] px-[48px]"
			>
				Launch App
			</button>
		</nav>

		<div class="relative">
			<!-- Logo background   -->
			<img
				src="https://i.postimg.cc/4NBcjk76/image.png"
				alt=""
				class="w-[450px] -translate-x-2/4 left-[50%] top-[55px] fixed"
				style=""
			/>

			<!-- Hero -->
			<Hero tagline="Profits To The People" @open="toggleWalletModal()" />
		</div>

		<!-- Connect Wallet Modal  -->
		<ConnectWalletModal
			@connectMetaMask="useConnectMetaMask"
			@connect-wallet-connect="useWalletConnect"
			@close-wallet-modal="toggleWalletModal"
			:is-showing="walletModal"
		/>
	</div>
</template>

<script setup>
import { ref } from "vue";
import Hero from "@/components/landing/Hero.vue";
import AppAlert from "@/components/AppAlert.vue";
import ConnectWalletModal from "../components/modals/ConnectWalletModal.vue";
import connect from "../composables/connect/index";
import useConnectMetaMask from "../composables/connectMetaMask";

const { connectWalletConnect, err } = connect();

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

<style>
.bg-landing {
	background: #000 url("../assets/img/bg-landing.png") no-repeat;
	background-size: cover;
}
</style>
