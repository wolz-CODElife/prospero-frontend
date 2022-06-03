<template>
	<div class="sidebar z-[9999] fixed lg:static">
		<aside class="h-screen">
			<div class="fixed w-[inherit] h-[inherit] bg-black p-[32px]">
				<!-- logo -->

				<!-- Navs -->
				<ul class="flex flex-col gap-y-[36px] mt-[48px]">
					<li
						v-for="(nav, i) in navs"
						:key="i"
						class="px-[24px] py-[16px] text-base text-white rounded"
						:class="{
							'bg-blue': activePage($route.path, nav.title),
						}"
					>
						<RouterLink
							:to="nav.link"
							class="flex items-center gap-x-[16px]"
						>
							<!-- <img src="nav.icon" alt="" /> -->
							<span class="">
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
				title: "Home",
				link: "/dashboard",
				icon: "",
			},
			{
				title: "Manage",
				link: "/manage",
				icon: "service",
			},
			{
				title: "Settings",
				link: "/settings",
				icon: "settings",
			},
		]);

		function toggleMobileNav() {
			mobileNavShowing.value = !mobileNavShowing.value;
		}

		function activePage(link, title) {
			let path = link.split("/")[1];
			// let name = title

			let re = new RegExp(path, "g");
			if (title.toLowerCase() === path && re.test(link)) return true;

			return false;
		}

		return { navs, mobileNavShowing, toggleMobileNav, activePage };
	},
};
</script>

<style lang="postcss" scoped>
li:last-child {
	@apply fixed bottom-40;
}
</style>
