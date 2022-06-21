import { createApp } from "vue";
import {initializeApi} from '@/api'

import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";

//<script type="application/javascript" defer  src="api.js"></script>
// import Notifications from '@kyvg/vue3-notification'
// import { createPinia } from "pinia";
//(async () => {

await initializeApi();

//})();
const app = createApp(App);

app.use(router);
// app.use(Notifications)
// app.use(createPinia());

app.mount("#app");
