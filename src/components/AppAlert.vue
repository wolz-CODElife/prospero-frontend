<template>
  <div
    class="float-right p-[8px] text-[#353C47] animate-bounce"
    :class="props.type"
    v-if="!hidden"
    role="alert"
  >
    <div class="flex items-center">
      <img :src="types[type]" alt="" class="mr-[18px]" />
      <slot></slot>

      <button
        type="button"
        class="float-right ml-[36px]"
        aria-label="Close"
        @click="dismiss"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.243 6.243L11.486 11.486M1 11.486L6.243 6.243L1 11.486ZM11.486 1L6.242 6.243L11.486 1ZM6.242 6.243L1 1L6.242 6.243Z"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
const props = defineProps({
  type: {
    type: String,
    default: "info",
  },
  //   icon: {
  //     type: String,
  //     default: "https://i.postimg.cc/HxxhYTvZ/image.png",
  //   },
});

onMounted(() => {
  setTimeout(() => {
    hidden.value = true;
  }, 3000);
});

const hidden = ref(false);

const types = ref({
  info: "https://i.postimg.cc/HxxhYTvZ/image.png",
  success: "https://i.postimg.cc/hGkCH3k9/image.png",
  error: "https://i.postimg.cc/rygYdR2h/image.png",
  warning: "https://i.postimg.cc/SQ8xkq0N/image.png",
});

function dismiss() {
  hidden.value = true;
}
</script>

<style lang="postcss">
.info {
  @apply bg-[#E7EFF9];
}

.success {
  @apply bg-[#EDF7EF];
}

.error {
  @apply bg-[#EDC7BD];
}

.warning {
  @apply bg-[#FDF7EB];
}

p.slot {
  @apply font-semibold;
}
</style>
