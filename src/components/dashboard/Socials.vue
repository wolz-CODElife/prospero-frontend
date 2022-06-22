<template>
  <div class="row-span-1 bg-[#191A20] py-[20px]">
    <div class="w-full flex items-center justify-center gap-x-[24px]">
      <h2 class="text-[#868C9D] text-[14px] uppercase">
        Select first portfolio to join
      </h2>

      <img src="@/assets/img/arrow.svg" alt="" class="-rotate-90" />
    </div>

    <hr class="my-[12px] border-[#2D3035]" />

    <div class="flex justify-between items-center px-[48px]">
      <div v-for="(sm, i) in socials" :key="i">
        <div class="flex flex-col items-center gap-y-[12px]">
          <h2 class="text-[#868C9D] text-[14px] uppercase">
            {{ sm.title }}
          </h2>

          <a :href="sm.link">
            <img :src="sm.icon" alt="" class="h-[40px] object-contain" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const socials = ref([
  {
    title: "Discord",
    link: "",
    icon: "https://i.postimg.cc/fTGZ6Z9Y/image.png",
  },
  {
    title: "Telegram",
    link: "",
    icon: "https://i.postimg.cc/02GGMGq3/image.png",
  },
  {
    title: "Twitter",
    link: "",
    icon: "https://i.postimg.cc/dtkrPLvW/image.png",
  },
]);
</script>
