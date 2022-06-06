import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
// import Notifications from '@kyvg/vue3-notification'
// import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);
// app.use(Notifications)
// app.use(createPinia());

app.mount("#app");
