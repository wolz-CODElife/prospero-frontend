<template>
	<div class="sidebar z-[9999] fixed lg:static">
		<aside class="h-screen">
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
					class="w-[200px] max-w-[70%] mx-auto pt-[30px]"
				/>

				<!-- Navs -->
				<ul class="flex flex-col gap-y-[36px] mt-[48px]">
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
				</ul>
			</div>
		</aside>
	</div>
</template>

<script>
import { ref } from "vue";
export default {
	name: "Sidebar",

	setup() {
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
			// let name = title === "Contact us" ? "support" : title;
			let re = new RegExp(path, "g");
			if (title.toLowerCase() === path && re.test(link)) return true;

			return false;
		}

		function activeScreen(pre, link) {
			//  let route = this.$route.name;
			let name = pre.split("-")[0];
			return name === link.split("/")[1];
		}

		return { navs, mobileNavShowing, toggleMobileNav, activePage };
	},
};
</script>
