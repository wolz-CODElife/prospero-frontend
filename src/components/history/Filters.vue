<template>
	<li
		v-for="filter in filters"
		:key="filter"
		@click="$emit('updateFilter', filter)"
		class="hover:text-white uppercase list-none"
		:class="[
			filter === portfolioStore.activeFilter
				? 'text-white'
				: 'text-[#868C9D]',
		]"
	>
		{{ filter }}
	</li>
</template>

<script setup>
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();
defineProps({
	filters: {
		type: Array,
		required: true,
	},
});

defineEmits(["updateFilter"]);
</script>
