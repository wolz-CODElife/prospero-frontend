<template>
	<div
		class="border border-t-0 border-white w-full grid grid-cols-12 gap-[10px] pt-[10px]"
	>
		<div class="col-span-4 grid grid-rows-5 gap-[10px]">
			<!-- Pie chart  -->
			<PieChartContainer />

			<!--Social Media  -->
			<Socials />
		</div>

		<div class="col-span-8 grid grid-rows-5 gap-[10px]">
			<!-- Line chart  -->
			<div class="row-span-2 bg-[#191A20]"></div>

			<!--Table  -->
			<Table v-bind="$attrs" />
		</div>
	</div>
</template>

<script setup>
import PieChartContainer from "@/components/dashboard/PieChartContainer.vue";
import Socials from "@/components/dashboard/Socials.vue";
import Table from "@/components/dashboard/Table.vue";
</script>
