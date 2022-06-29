import { createApp } from "vue";
import {
	initializeApi,
	rebalance,
	withdraw,
	getGraphData,
	getHistoricalPrices,
	updateUIFieldValues,
} from "@/api";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
import { createPinia } from "pinia";
// import Notifications from '@kyvg/vue3-notification'

await initializeApi();
//await getGraphData();
//await getHistoricalPrices();
//TESTING
//console.log("TESTING")
//await rebalance([90,10], ["0x9a1a6f9bfb0f93dbec9c0e8ffa36e5628ec681fc","0x03098b801e61f9efb3fdb42676a594bbc587d69d"]);
//await withdraw([], 1000000000000000000);
// await updateUIFieldValues();

//await getGraphData();
const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
