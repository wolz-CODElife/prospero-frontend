<template>
	<DashDir
		empty-selected-card-classes="h-full flex flex-col gap-y-[24px] justify-center items-center"
		arrow-class="none"
	>
		<template #selectedPortfolioDisplay>
			<Stats />
		</template>
	</DashDir>
</template>

<script setup>
import DashDir from "../DashDir.vue";
import Stats from "../Stats.vue";
</script>
