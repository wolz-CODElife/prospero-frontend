<template>
	<div class="bg-landing w-full text-white pb-[60px]" v-if="loaded">
		<!-- Nav  -->
		<nav class="flex items-center justify-end gap-16 pt-[24px] pr-28">
			<RouterLink to="/history" class="btn text-white text-[16px] uppercase"
				>Docs</RouterLink
			>
			<Button
				@click="connectWallet"
				class="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#00FF00] uppercase py-[8px] px-[48px]"
				>Launch App</Button
			>
		</nav>

		<!-- Logo background   -->
		<img
			src="https://i.postimg.cc/HkYbXP84/Prospero-logo-alone-4x-1hero-logo.png"
			alt=""
			class="w-[582px] h-[400px] fixed top-[98px] left-[27%]"
		/>

		<main class="relative">
			<!-- Hero -->
			<Hero tagline="Profits To The People" @open="connectWallet" />
		</main>

		<!-- Connect WalletModal  -->
		<Modal v-if="walletConnectModal" @close="walletConnectModal = false">
			<!-- <h5 class="text-lg lg:text-2xl font-bold text-black" slot="header">
				Add New Bank Account
			</h5> -->

			<div class="text-white">
				<!-- Logo  -->
				<img
					src="https://i.postimg.cc/tJMqnqDk/image.png"
					alt=""
					class="mx-auto w-[105px]"
				/>

				<!-- Prospero Text -->
				<img
					src="@/assets/img/prospero.svg"
					alt="Prospero Logo Text"
					class="w-[103px] mx-auto mt-[14px] mb-[40px]"
				/>

				<p class="text-center text-[16px] mb-[30px]">
					Please connect your wallet
				</p>

				<Wallet
					wallet="Metamask"
					logo="https://i.postimg.cc/vHLKfmGX/image.png"
					@connect="connectMetaMaskWallet"
				/>

				<Wallet
					wallet="Coinbase Wallet"
					logo="https://i.postimg.cc/3xBrW7yD/image.png"
					@connect="connectWalletConnect"
				/>

				<Wallet
					wallet="Coin 98"
					logo="https://i.postimg.cc/52V2mJ6n/image.png"
					@connect="connectWalletConnect"
				/>

				<Wallet
					wallet="Fortmatic"
					logo="https://i.postimg.cc/nV45DtfH/image.png"
					@connect="connectWalletConnect"
				/>

				<Wallet
					wallet="Wallet Connect"
					logo="https://i.postimg.cc/sXXXZJvz/image.png"
					@connect="connectWalletConnect"
				/>
			</div>
		</Modal>
	</div>

	<div
		class="h-screen w-full flex flex-col justify-center align-center bg-black"
		v-else
	>
		<!-- Logo  -->
		<img
			src="https://i.postimg.cc/tJMqnqDk/image.png"
			alt=""
			class="mx-auto max-w-[50vw] animate-pulse"
		/>
	</div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import Hero from "@/components/landing/Hero.vue";
import Modal from "@/components/Modal.vue";
import Wallet from "../components/landing/Wallet.vue";
// import connectWalletConnect from "@/composables/connect/connectWalletConnect";

// import connect from "../composables/connect/index";

const walletConnectModal = ref(false);
const loaded = ref(false);

onBeforeMount(() => {
	setTimeout(() => {
		loaded.value = true;
	}, 2000);
});

function connectWallet() {
	walletConnectModal.value = !walletConnectModal.value;
}

async function connectMetaMaskWallet() {
	if (typeof window.ethereum !== "undefined") {
		const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		});
		const account = accounts[0];
		if (account) {
			window.location.replace("dashboard");
		}
	} else {
		console.log("Install Metamask");
	}
}

async function connectWalletConnect() {
	alert("Wallet Connect!");
}
</script>

<style>
.bg-landing {
	background: url("../assets/img/bg-landing.png") repeat;
}
</style>
