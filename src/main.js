import { createApp } from "vue";
import {
	initializeApi,
	rebalance,
	withdraw,
	getGraphData,
	getWithdrawTableData,
	getChartDataSelectedMyPortfolio,
	getChartDataSelectedLeader,
	depositContract,
	getValuesOverTimeForLeaderAddress,
	getValuesOverTimeForMyPortfolioAddress,
	getValuesOverTimeForLinechartLeaderboardAddress,
	getValuesOverTimeForLinechartMyPortfolioAddress
} from "@/api";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
import { createPinia } from "pinia";

await initializeApi();
await getValuesOverTimeForLinechartMyPortfolioAddress("0x4cc4b88c622ee9b2c9007a6aea014a093c2fefc5", 7);

//await depositContract(tokens, amounts, methodType, avaxValue)
//await depositContract(["0x9a1a6f9bfb0f93dbec9c0e8ffa36e5628ec681fc"], [100000+""], 0+"", 0+"", "0x4cc4b88c622ee9b2c9007a6aea014a093c2fefc5")

//await getWithdrawTableData();
//await getChartDataSelectedMyPortfolio();
//await getChartDataSelectedLeader();
//await getGraphData();
//await getHistoricalPricesUpdateChartsData();
//TESTING
//console.log("TESTING")
//await rebalance([90,10], ["0x9a1a6f9bfb0f93dbec9c0e8ffa36e5628ec681fc","0x03098b801e61f9efb3fdb42676a594bbc587d69d"]);
//await withdraw([], 1000000000000000000);
// await updateUIFieldValuesMyPortfolio();

//await getGraphData();
const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
