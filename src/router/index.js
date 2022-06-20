import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/LandingPage.vue"),
			meta: {
				layout: "landing",
				title: "Prospero",
				icon: "https://i.postimg.cc/tJMqnqDk/image.png",
			},
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("../views/Dashboard.vue"),
			meta: {
				layout: "dashboard",
				title: "Prospero | Home",
				icon: "https://i.postimg.cc/tJMqnqDk/image.png",
			},
		},

		{
			path: "/manage",
			name: "manage",
			component: () => import("../views/Manage.vue"),
			meta: {
				layout: "manage",
			},
		},
		{
			path: "/history",
			name: "history",
			component: () => import("../views/History.vue"),
			meta: {
				layout: "dashboard",
			},
		},
	],
});

export default router;
