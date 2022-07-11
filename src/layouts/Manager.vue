<template>
	<div class="grid grid-cols-[300px_1fr] gap-0">
		<Sidebar class="w-[300px]" />
		<main class="p-[28px]">
			<h1 class="text-white text-[30px] text-center">Manager</h1>
		</main>
	</div>
</template>

<script setup>
import Sidebar from "./dashboard/Sidebar.vue";

// Route protection
 onMount(() => {
 	console.log("MANAGE...");
 });
</script>
