<template>
	<div id="app">
		<div
			v-if="mobile"
			class="fixed top-0 z-[1000000] inset-0 overflow-y-hidden bg-black/95 w-full h-full flex items-center justify-center"
		>
			<h1 class="text-white">Please use a desktop</h1>
		</div>

		<div
			class="h-screen w-full flex flex-col justify-center align-center bg-black"
			v-if="notloaded"
		>
			<!-- Logo  -->
			<img
				src="https://i.postimg.cc/tJMqnqDk/image.png"
				alt=""
				class="mx-auto max-w-[50vw] animate-pulse"
			/>
		</div>

		<component v-else :is="layout">
			<RouterView />
		</component>
	</div>
</template>

<script>
import Account from "./layouts/Account.vue";
import Dashboard from "./layouts/Dashboard.vue";
import Landing from "./layouts/Landing.vue";

import { RouterView, useRouter } from "vue-router";
import { ref, onBeforeMount, computed } from "vue";

export default {
	components: {
		Account,
		Dashboard,
		Landing,
	},

	setup() {
		const { currentRoute } = useRouter();
		const mobile = ref(false);

		const notloaded = ref(true);

		onBeforeMount(() => {
			setTimeout(() => {
				notloaded.value = false;
				if (window.matchMedia("(max-width: 1024px)").matches) {
					mobile.value = true;
				} else {
					mobile.value = false;
				}
				window.addEventListener("resize", () => {
					if (window.matchMedia("(max-width: 1024px)").matches) {
						mobile.value = true;
					} else {
						mobile.value = false;
					}
				});
			}, 2000);
		});

		const layout = computed(() => {
			console.log("current route is: ", currentRoute);
			return currentRoute.value.meta.layout;
		});

		return {
			layout,
			mobile,
			notloaded,
		};
	},
};
</script>

<style lang="pcss">
.btn {
	@apply py-[8px] px-[15px] uppercase text-white;
}

.btn-primary {
	@apply bg-[#005A57] border border-[#005A57];
}

.btn-primary-outline {
	@apply bg-transparent border border-[#005A57] hover:bg-[#005A57];
}
</style>
