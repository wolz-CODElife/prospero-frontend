<template>
	<aside class="z-[9999] fixed lg:static">
		<div class="h-screen w-[300px]">
			<div
				class="fixed w-[inherit] h-[inherit] bg-black pt-[30px] px-[40px]"
			>
				<!-- logo -->
				<img
					src="https://i.postimg.cc/HsKSt0Cp/image.png"
					alt=""
					class="mx-auto w-[100px]"
				/>

				<!-- QUARTERLY PERFORMANCE BONUS POOL -->
				<div
					class="text-center w-[220px] bg-pool mb-[30px] py-[10px] px-[28px] bg-[url('https://i.postimg.cc/mgjp5LvY/image.png')]"
					v-if="path === 'manage'"
				>
					<h1 class="text-white uppercase text-[12px]">
						QUARTERLY PERFORMANCE BONUS POOL
					</h1>

					<h2 class="text-[#54AC68] text-[24px] my-[16px]">$0.00</h2>

					<div class="flex justify-center">
						<div class="flex" v-for="item in countdown" :key="item">
							<div class="flex flex-col">
								<h5 class="text-[16px] text-white">
									{{ item.figure }}
								</h5>

								<h6 class="text-[10px] text-[#C3C7CD] uppercase">
									{{ item.unit }}
								</h6>
							</div>

							<!-- colon divider -->
							<p
								class="text-white text-[16px] mx-[18px]"
								v-if="item !== countdown[2]"
							>
								:
							</p>
						</div>
					</div>
				</div>

				<!-- Wallet Address  -->
				<WalletAddress :address="address" />

				<div class="bg-[#2D3035] my-[40px] h-[1px]" />

				<!-- Navs -->
				<ul class="flex flex-col gap-y-[20px] mt-[30px]">
					<li
						v-for="(nav, i) in navs"
						:key="i"
						class="px-[24px] py-[8px] text-base text-white uppercase"
						:class="[
							activePath === nav.link ? 'bg-[#005A57]' : 'bg-[#2D3035]',
						]"
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
				</ul>
			</div>
		</div>
	</aside>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import WalletAddress from "@/components/dashboard/WalletAddress.vue";
import connect from "@/composables/connect/index";
import { useRouter } from "vue-router";

const { currentRoute } = useRouter();

const path = computed(() => {
	return currentRoute.value.name;
});

const activePath = computed(() => {
	return currentRoute.value.path;
});

const { state, disconnectWallet } = connect();

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

const countdown = ref([
	{
		figure: "00",
		unit: "days",
	},
	{
		figure: "00",
		unit: "hrs",
	},
	{
		figure: "00",
		unit: "mins",
	},
]);

onMounted(() => {
	window.ethereum.on("accountsChanged", function (accounts) {
		const account = accounts[0];
		if (account) {
			state.address = account;
			address.value = account;
		}
		// Time to reload your interface with accounts[0]!
	});
});

// async function logoutWallet() {
// 	await disconnectWallet();
// 	window.location.replace("/");
// }

function toggleMobileNav() {
	mobileNavShowing.value = !mobileNavShowing.value;
}

function activePage(link, title) {
	let path = link.split("/")[1];
	let re = new RegExp(path, "g");
	if (title.toLowerCase() === path && re.test(link)) return true;
	return false;
}

function changeRoute() {}
</script>

<style>
.bg-pool {
	background-size: cover;
}
div.countdown:not(:last-child)::after {
	content: ":";
	color: white;
	font-size: 16px;
	font-weight: 900;
	display: inline-flex;
}
</style>
