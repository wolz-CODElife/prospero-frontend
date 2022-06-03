<template>
	<div id="app">
		<component :is="layout">
			<RouterView />
		</component>
	</div>
</template>

<script>
import Dashboard from "./layouts/Dashboard.vue";
import Landing from "./layouts/Landing.vue";

import { RouterView, useRouter } from "vue-router";
import { computed } from "vue";

export default {
	components: {
		Dashboard,
		Landing,
	},

	setup() {
		const { currentRoute } = useRouter();

		const layout = computed(() => {
			console.log(currentRoute.value.meta.layout);

			return currentRoute.value.meta.layout;
		});
		return {
			layout,
		};
	},
};
//     })
</script>
