<template>
	<div
		class="border border-t-0 border-white w-full min-h-fit grid grid-cols-12 gap-[10px] pt-[10px]"
	>
		<div class="col-span-4 grid grid-rows-5 gap-y-[10px]">
			<!-- Pie chart  -->
			<PieChartContainer class="" />

			<!--Social Media  -->
			<Socials v-bind="$attrs" class="" />
		</div>

		<div class="col-span-8 grid grid-rows-5 gap-[10px]">
			<!-- Line chart  -->
			<div class="bg-[#191A20] row-span-2"></div>

			<!--Table  -->
			<Table v-bind="$attrs" class="row-span-3" />
		</div>
	</div>
</template>

<script setup>
import PieChartContainer from "@/components/dashboard/PieChartContainer.vue";
import Socials from "@/components/dashboard/Socials.vue";
import Table from "@/components/dashboard/Table.vue";
</script>
