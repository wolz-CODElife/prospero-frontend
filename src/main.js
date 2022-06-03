import { createApp } from "vue";
// import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// import Dashboard from "./layouts/Dashboard.vue";

import "./assets/css/tailwind.css";

const app = createApp(App);

// app.use(createPinia());
app.use(router);
// app.component("Dashboard", Dashboard);
app.mount("#app");
