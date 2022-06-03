<template>
	<section>
		<div
			class="flex flex-col items-center justify-center h-[60vh] w-full relative"
		>
			<!-- Prospero Text -->
			<img
				src="@/assets/img/prospero.svg"
				alt="Prospero Logo Text"
				class="w-[580px] max-w-[70%]"
			/>

			<!-- Tagline -->
			<h3 class="mt-[24px] mb-[40px] text-base">
				{{ tagline }}
			</h3>

			<!-- CTA -->
			<button
				class="border-2 border-[#00FF00] bg-transparent hover:bg-white hover:border-white hover:text-[#00FF00] text-white uppercase py-[8px] px-[48px]"
				@click="$emit('open')"
			>
				Get Started
			</button>

			<!-- Social media links -->
			<SocialLinks class="absolute right-[230px]" />
		</div>

		<!-- Powered by   -->
		<div class="text-center">
			<h4 class="uppercase text-[#00FF00] text-base">Powered by</h4>
			<img
				src="https://i.postimg.cc/52RJ9wYW/image.png"
				alt=""
				class="w-[20px] h-[48px] mx-auto"
			/>
			<!-- Avalanche logo  -->
			<img
				src="https://i.postimg.cc/L5L5TXrh/image.png"
				alt=""
				class="w-[60px] mx-auto mt-[28px] mb-[16px] border-[10px] border-white/5 rounded-full"
			/>
			<!-- Avalanche link text  -->
			<a href="" class="underline text-white">Avalanche</a>
		</div>
	</section>
</template>

<script setup>
// import { RouterView } from "vue-router";

import SocialLinks from "../SocialLinks.vue";

defineProps({
	tagline: {
		type: String,
		required: true,
	},
});
</script>

<style>
section {
}
</style>
