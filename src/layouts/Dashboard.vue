<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="z-10 bg-[#2D3035] p-[28px] relative">
			<DepositModal v-if="joinView" @go-back="goBack" />
			<div v-else>
				<DashHeader />
				<DashMain @do-join="doJoin" />
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Sidebar from "./dashboard/Sidebar.vue";
import DashHeader from "./dashboard/DashHeader.vue";
import DashMain from "./dashboard/DashMain.vue";
import DepositModal from "@/components/dashboard/DepositModal.vue";

// Route protection
onBeforeMount(() => {
	if (!JSON.parse(localStorage.getItem("userState")).status) {
		window.location.replace("/");
	}
});

const joinView = ref(false);

function doJoin() {
	joinView.value = true;
}

function goBack() {
	joinView.value = false;
}
</script>
