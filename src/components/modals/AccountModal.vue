<template>
	<Modal @close="$emit('close')" v-if="props.firstView">
		<div class="mx-[12px] my-[16px]">
			<AccountOverview />

			<div class="flex items-center justify-between mb-[40px]">
				<button
					@click="changeWallet"
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

	<Modal @close="$emit('close')" v-if="props.secondView"> Log out view </Modal>
</template>

<script setup>
import Modal from "../Modal.vue";
import AccountOverview from "../modals/AccountOverview.vue";

const props = defineProps({
	firstView: Boolean,
	secondView: Boolean,
});

defineEmits(["close", "doLogout"]);

function changeWallet() {
	console.log("Change wallet works");
}
</script>
