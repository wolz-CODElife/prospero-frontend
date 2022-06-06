<template>
  <aside class="h-screen">
    <div class="fixed top-1/4 w-[inherit] h-[396px] px-[36px]">
      <img
        src="https://i.postimg.cc/vZgYT9bL/image.png"
        alt=""
        class="absolute h-full left-[50%] -top-[55px] -z-0"
      />
      <ul
        class="flex flex-col justify-center items-center gap-y-[36px] my-auto z-20"
      >
        <li v-for="(item, i) in links" :key="i" class="">
          <a
            :href="item.link"
            target="blank"
            class="flex flex-col items-center gap-y-[16px] no-underline hover:scale-125 ease-in-out duration-200"
          >
            <img
              :src="item.icon"
              class="w-[55px] z-50"
              :alt="`Link to my ${item.title}`"
            />
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
const links = ref([
  {
    title: "Twitter",
    link: "https://twitter.com/prosperodefi",
    icon: "https://i.postimg.cc/Pxx4j6zM/image.png",
  },
  {
    title: "Medium",
    link: "https://medium.com/@louis-prospero",
    icon: "https://i.postimg.cc/Zqq7bKJ3/image.png",
  },
  {
    title: "Email",
    link: "mailto:info@prospero.fund",
    icon: "https://i.postimg.cc/HLK2TwZD/image.png",
  },
]);

// const getImageUrl = (name) => {
// 	return new URL(`../assets/img/${name}`, import.meta.url).href;
// };
// return { links, getImageUrl };
</script>
