<template>
	<h1 class="text-center text-black pt-[100px]">Welcome to Prospero 
		<button
			@click="logoutWallet"
			class="border-2 border-[#00FF00] text-[#00FF00] bg-transparent uppercase py-[8px] px-[48px]"
		>Disconnect Wallet</button>
	</h1>
</template>

<script setup>
import connect from "../composables/connect/index";

const { disconnectWallet, state } = connect();

async function logoutWallet() {
	await disconnectWallet()
	window.location.replace("/")
}

</script>
