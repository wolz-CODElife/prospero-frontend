<template>
	<div class="pt-[10px] w-full h-screen">
		<!-- <div class="max-h-[calc(100vh-246px)] overflow-y-auto"> -->
		<!-- <div class="w-full h-full"> -->
		<!--Table  -->
		<Table v-bind="$attrs" class="" />
	</div>
</template>

<script setup>
import Table from "@/components/dashboard/Table.vue";
</script>
