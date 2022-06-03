<template>
	<div class="grid grid-cols-12 gap-0">
		<Sidebar class="col-span-2" />
		<main class="col-span-12 lg:col-span-10 z-10">
			<div class="px-[20px] lg:px-[40px] xl:px-[80px] py-[36px]">
				<h1 class="text-center text-black pt-[100px]">
					Welcome to Prospero
				</h1>
				<Slot />
			</div>
		</main>
	</div>
</template>

<script setup>
import Sidebar from "./dashboard/Sidebar.vue";
// export default {
// 	name: "Dashboard",

// };
</script>
