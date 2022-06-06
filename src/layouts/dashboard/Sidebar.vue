<template>
  <aside class="z-[9999] fixed lg:static">
    <div class="h-screen">
      <div class="fixed w-[inherit] h-[inherit] bg-black py-[40px] px-[40px]">
        <!-- logo -->
        <img
          src="https://i.postimg.cc/HsKSt0Cp/image.png"
          alt=""
          class="mx-auto w-[150px]"
        />

        <WalletAddress :address="address" />

        <div class="bg-[#2D3035] my-[40px] h-[1px]" />

        <!-- Navs -->
        <ul class="flex flex-col gap-y-[28px] mt-[40px]">
          <li
            v-for="(nav, i) in navs"
            :key="i"
            class="px-[24px] py-[12px] text-base text-white uppercase bg-[#2D3035]"
            :class="{
              'bg-[#005A57]': activePage($route.path, nav.title),
            }"
          >
            <RouterLink
              :to="nav.link"
              class="flex items-center gap-x-[16px] text-[16px] nav-title"
            >
              <img :src="nav.icon" alt="" />

              <span class="" v-if="nav.title === 'Dashboard'"> Home </span>
              <span class="" v-else>
                {{ nav.title }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import WalletAddress from "@/components/dashboard/WalletAddress.vue";
import connect from "@/composables/connect/index";

const { state } = connect();

const address = ref(state.address);

const mobileNavShowing = ref(false);

const navs = ref([
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "https://i.postimg.cc/pXqYmCWK/image.png",
  },
  {
    title: "Manage",
    link: "/manage",
    icon: "https://i.postimg.cc/J0S6vQsy/image.png",
  },
  {
    title: "History",
    link: "/history",
    icon: "https://i.postimg.cc/VNcydzLS/image.png",
  },
]);

function toggleMobileNav() {
  mobileNavShowing.value = !mobileNavShowing.value;
}

function activePage(link, title) {
  let path = link.split("/")[1];
  let re = new RegExp(path, "g");
  if (title.toLowerCase() === path && re.test(link)) return true;
  return false;
}
</script>
