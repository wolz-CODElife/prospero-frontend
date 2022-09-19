<template>
	<!-- Metamask -->
	<button class="wallet-btn" @click="$emit('connectMetaMask')">
		<h5 class="wallet-title">Metamask</h5>

		<img
			src="https://i.postimg.cc/vHLKfmGX/image.png"
			alt="Metamask wallet logo"
			class="wallet-img"
		/>
	</button>

	<!-- Coinbase Wallet -->
	<button class="wallet-btn" @click="$emit('connectWalletConnect')">
		<h5 class="wallet-title">Coinbase Wallet</h5>

		<img
			src="https://i.postimg.cc/3xBrW7yD/image.png"
			alt="Coinbase Wallet logo"
			class="wallet-img"
		/>
	</button>

	<!-- Coin 98 -->
	<button class="wallet-btn" @click="$emit('connectWalletConnect')">
		<h5 class="wallet-title">Coin 98</h5>

		<img
			src="https://i.postimg.cc/52V2mJ6n/image.png"
			alt="Coin 98 logo"
			class="wallet-img"
		/>
	</button>

	<!-- Fortmatic -->
	<button class="wallet-btn" @click="$emit('connectWalletConnect')">
		<h5 class="wallet-title">Fortmatic</h5>

		<img
			src="https://i.postimg.cc/nV45DtfH/image.png"
			alt="Fortmatic logo"
			class="wallet-img"
		/>
	</button>

	<!-- Wallet Connect -->
	<button class="wallet-btn" @click="$emit('connectWalletConnect')">
		<h5 class="wallet-title">Wallet Connect</h5>

		<img
			src="https://i.postimg.cc/vHLKfmGX/image.png"
			alt="Wallet Connect logo"
			class="wallet-img"
		/>
	</button>
</template>

<script setup>
defineEmits(["connectMetaMask, connectWalletConnect"]);
</script>

<style lang="postcss" scoped>
.wallet-btn {
	@apply w-full bg-transparent border-[0.5px] border-[#009D98] text-white text-[14px] hover:bg-[#009D98] flex justify-between items-center py-[8px] px-[20px] mb-[20px];
}

.wallet-title {
	@apply text-sm md:text-base uppercase;
}

.wallet-img {
	@apply h-[40px] object-contain;
}
</style>
