<template>
  <div id="app">
    <div v-if="mobile" class="fixed top-0 z-[1000000] inset-0 overflow-y-hidden bg-black/95 w-full h-full flex items-center justify-center">
      <h1 class="text-white h1">Please use a desktop</h1>
    </div>
    <component :is="layout">
      <RouterView />
    </component>
  </div>
</template>

<script>
import Dashboard from "./layouts/Dashboard.vue";
import Landing from "./layouts/Landing.vue";

import { RouterView, useRouter } from "vue-router";
import { ref, onBeforeMount, computed } from "vue";

export default {
  components: {
    Dashboard,
    Landing,
  },

  setup() {
    const { currentRoute } = useRouter();
    const mobile = ref(false);

    onBeforeMount(() => {
      setTimeout(() => {
        if (window.matchMedia("(max-width: 1024px)").matches) {
          mobile.value = true
        } else {
          mobile.value = false
        }
        window.addEventListener("resize", () => {
          if (window.matchMedia("(max-width: 1024px)").matches) {
            mobile.value = true
          } else {
            mobile.value = false
          }
        })
      }, 2000);
    });

    const layout = computed(() => {
      console.log(currentRoute.value.meta.layout);

      return currentRoute.value.meta.layout;
    });
    return {
      layout,
      mobile
    };
  },
};
</script>
