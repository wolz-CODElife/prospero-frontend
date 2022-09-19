<template>
	<div class="relative">
		<div
			@click="toggleAccountModal"
			class="px-[24px] py-[8px] text-white bg-[#2D3035] flex justify-between items-center cursor-pointer"
		>
			<span class="text-[16px] tracking-wider">
				{{ walletAddress[0] }}...{{ walletAddress[1] }}
			</span>

			<svg
				width="11"
				height="7"
				viewBox="0 0 11 7"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1.75 1.625L5.5 5.375L9.25 1.625"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>

		<!-- Account Modal  -->
		<AccountModal
			v-if="open"
			:first-view="firstView"
			:second-view="logOutView"
			@close="toggleAccountModal"
			@do-logout="logoutWallet"
		/>

		<!-- <div v-if="open" class="text-white">Opened Modal</div> -->
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import AccountModal from "@/components/modals/AccountModal.vue";
import connect from "@/composables/connect/index";

const { state, disconnectWallet } = connect();

const props = defineProps({
	address: {
		type: String,
		required: true,
	},
});

defineEmits(["openModal"]);

const open = ref(false);

const firstView = ref(true);

const logOutView = ref(false);

async function logoutWallet() {
	await disconnectWallet();
	window.location.replace("/");
}

function toggleAccountModal() {
	open.value = !open.value;
}

const walletAddress = computed(() => [
	props.address.slice(0, 6),
	props.address.slice(-6),
]);
</script>
