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
				Please disconnect this site from your wallet provider, then logout to connect a new wallet. <br>
                <img src="https://i.postimg.cc/fRXcGSmD/image.png" alt="connect wallet" class="mx-auto my-[20px] w-[80%] max-h-[300px] object-contain">
			</p>
		</div>
	</Modal>
</template>

<script setup>
import Modal from "../Modal.vue";

const props = defineProps(["isShowing"]);

defineEmits(["closeWalletModal"]);
</script>
