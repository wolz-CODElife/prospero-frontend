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
				Please connect your wallet
			</p>

			<Wallet v-bind="$attrs" />
		</div>
	</Modal>
</template>

<script setup>
import Modal from "../Modal.vue";
import Wallet from "../landing/Wallet.vue";

const props = defineProps(["isShowing"]);

defineEmits(["closeWalletModal"]);
</script>
