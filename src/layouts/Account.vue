<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="z-10 bg-[#191A20] p-[28px] max-h-[100vh] relative">
			<slot></slot>
		</main>
	</div>
</template>

<script setup>
import Sidebar from "./dashboard/Sidebar.vue";
</script>
