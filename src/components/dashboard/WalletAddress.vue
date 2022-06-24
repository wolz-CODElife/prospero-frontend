<template>
	<div class="relative">
		<div
			@click="toggleDropdown"
			class="px-[24px] py-[8px] text-white bg-[#2D3035] flex justify-between items-center"
		>
			<span class="text-[16px] tracking-wider">
				{{ walletAddress[0] }}...{{ walletAddress[1] }}
			</span>

			<svg
				width="11"
				height="7"
				viewBox="0 0 11 7"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1.75 1.625L5.5 5.375L9.25 1.625"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>

		<!-- Logout  -->
		<ul
			v-if="open"
			class="absolute mt-[8px] px-[14px] py-[8px] bg-[#2D3035] cursor-pointer w-full shadow"
		>
			<li
				@click="$emit('doLogout'), (open = false)"
				class="bg-[#2D3035] hover:bg-opacity-10 text-base text-white px-[12px] py-[4px]"
			>
				Logout
			</li>
		</ul>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
const props = defineProps({
	address: {
		type: String,
		required: true,
	},

	list: {
		type: Array,
		required: true,
	},
});

const open = ref(false);

const walletAddress = computed(() => [
	props.address.slice(0, 6),
	props.address.slice(-6),
]);

function toggleDropdown() {
	open.value = !open.value;
}
</script>
