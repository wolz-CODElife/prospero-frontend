<template>
	<aside class="z-[9999] fixed lg:static">
		<div class="h-screen">
			<div
				class="fixed w-[inherit] h-[inherit] bg-black py-[80px] px-[40px]"
			>
				<!-- logo -->
				<img
					src="https://i.postimg.cc/tJMqnqDk/image.png"
					alt=""
					class="mx-auto w-[182px]"
				/>

				<!-- Prospero Text -->
				<img
					src="@/assets/img/prospero.svg"
					alt="Prospero Logo Text"
					class="w-[150px] max-w-[70%] mx-auto pt-[30px] mb-[70px]"
				/>

				<WalletAddress :address="address" />

				<hr class="text-black my-[40px]" />

				<!-- Navs -->
				<ul class="flex flex-col gap-y-[36px] mt-[40px]">
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

							<span class="" v-if="nav.title === 'Dashboard'">
								Home
							</span>
							<span class="" v-else>
								{{ nav.title }}
							</span>
						</RouterLink>
					</li>

					<li>
						<button
							@click="logoutWallet"
							class="border-2 border-[#00FF00] text-[#00FF00] bg-transparent uppercase py-[8px] px-[48px]"
						>
							Disconnect Wallet
						</button>
					</li>
				</ul>
			</div>
		</div>
	</aside>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import WalletAddress from "@/components/dashboard/WalletAddress.vue";
import connect from "@/composables/connect/index";

const { disconnectWallet, state } = connect();

// name: "Sidebar",
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

onBeforeMount(() => {
	if (!JSON.parse(localStorage.getItem("userState")).status) {
		window.location.replace("/");
	}
});
function toggleMobileNav() {
	mobileNavShowing.value = !mobileNavShowing.value;
}
function activePage(link, title) {
	let path = link.split("/")[1];
	// let name = title === "Contact us" ? "support" : title;
	let re = new RegExp(path, "g");
	if (title.toLowerCase() === path && re.test(link)) return true;
	return false;
}

async function logoutWallet() {
	await disconnectWallet();
	window.location.replace("/");
}

// return { navs, mobileNavShowing, toggleMobileNav, activePage, address,  };
// },
components: {
	WalletAddress;
}
// };
</script>
