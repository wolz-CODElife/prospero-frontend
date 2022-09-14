import { defineStore } from "pinia";

import {
	getLeaderBoardDataForTable,
	getMyPortfoliosDataForTable,
	updateSelectedWallet,
	getMyHoldings,
	getMyUSDDepositsTotal,
	getMyROITotal,
	getMyROITotalPercentage,
	getLineChartData,
	initializeApi,
	getAllTxns,
	getTotalWithdrawals,
	getBalancesInEoa,
} from "@/api";
import { data } from "autoprefixer";

export const usePortfolios = defineStore("Portfolios", {
	state: () => {
		return {
			allPortfolios: [],

			myPortfolios: [],

			myManagingPortfolios: [],

			selectedPortfolio: {},

			allocationList: [],

			tokenList: [],

			allTxns: [],

			overview: [
				{
					asset: {
						name: "USD",
						icon: "https://i.postimg.cc/Mpmky9Ms/image.png",
					},
					holdings: "0",
					roi: { value: "0.00", percent: 0 },
					deposits: "0.00",
					withdrawals: "0.00",
				},

				{
					asset: {
						name: "BTC",
						icon: "https://i.postimg.cc/MGnDWTSy/image.png",
					},
					holdings: "0",
					roi: { value: "0.00", percent: 0 },
					deposits: "0.00",
					withdrawals: "0.00",
				},

				{
					asset: {
						name: "AVAX",
						icon: "https://i.postimg.cc/br1T18qh/image.png",
					},
					holdings: "0.00",
					roi: { value: "0.00", percent: 0 },
					deposits: "0.00",
					withdrawals: "0.00",
				},
			],

			activeOverview: {
				asset: {
					name: "USD",
					icon: "https://i.postimg.cc/Mpmky9Ms/image.png",
				},
				holdings: "0",
				roi: { value: "0.00", percent: 0 },
				deposits: "0.00",
				withdrawals: "0.00",
			},

			activeHeader: "left",

			activePortfolioType: "All Portfolios", // Or 'My Portfolios'

			activeMode: "join", //create

			tableView: true,

			firstCreateView: true,

			depositDialog: false,

			confirmDeposit: false,

			depositDisabled: true,

			createdPortfolios: [],

			selectedManagePortfolio: {},

			isLoading: true,

			isError: false,

			isPortfolioAcceptingNewInvestors: false,

			portfolioFundFee: 0,

			lineChartData: {},

			activeFilter: "All",

			depositMessage: "",

			fromDate: "",

			toDate: "",
		};
	},

	actions: {
		resetLineChart() {
			this.lineChartData.datasets[0].data = [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			];
		},

		reset() {
			this.selectedPortfolio = {};
		},

		async loadData() {
			try {
				console.log("calling loadData");
				await initializeApi();
				this.isLoading = true;
				try {
					await this.getPortfolios();
					this.isLoading = false;
				} catch (error) {
					this.isLoading = false;
					this.isError = true;
					console.log("get portfolios error", error);
				}
			} catch (error) {
				console.log("init error", error);
			}
		},

		async getPortfolios() {
			this.isLoading = true;
			try {
				this.myManagingPortfolios = [];
				this.tokenList = await getBalancesInEoa();
				this.allPortfolios = await getLeaderBoardDataForTable();
				this.myPortfolios = await getMyPortfoliosDataForTable();
				for (var i = 0; i < this.myPortfolios.length; i++) {
					var thisPort = this.myPortfolios[i];
					if (thisPort.wallet_type == "Leader") {
						this.myManagingPortfolios.push(thisPort);
					}
				}
				this.activeOverview.holdings = await getMyHoldings();
				this.activeOverview.deposits = await getMyUSDDepositsTotal();
				this.activeOverview.withdrawals = await getTotalWithdrawals();

				this.activeOverview.roi.value = await getMyROITotal();
				this.activeOverview.roi.percent = await getMyROITotalPercentage();
				this.allTxns = getAllTxns();
				this.lineChartData = getLineChartData("all my holdings", "");

				//this.lineChartData = getLineChartData("all portfolios", "0xe2accfbaa0840d31b552971c30e7003e69cb3f39")
				//this.xAxisLineChart = getAxisDataForLineChart("all portfolios", "0xe2accfbaa0840d31b552971c30e7003e69cb3f39", "x")
				//this.yAxisLineChart = getAxisDataForLineChart("all portfolios", "0xe2accfbaa0840d31b552971c30e7003e69cb3f39", "y")
				this.isLoading = false;
				//console.log("got all and my portfolios");
			} catch (error) {
				this.isLoading = false;
				this.isError = true;
				console.log(error);
			}
		},

		async getTokenList() {
			this.isLoading = true;
			try {
				this.tokenList = await getBalancesInEoa();
				this.isLoading = false;
			} catch (error) {
				this.isLoading = false;
				this.isError = true;
				console.log(error);
			}
		},

		async doSelectPortfolio(val) {
			console.log(
				"doSelectPortfolio called with val:" + JSON.stringify(val, null, 2)
			);
			this.selectedPortfolio = val;
			this.activeHeader = "right";
			await updateSelectedWallet(val.prosperoWalletAddress);
			this.lineChartData = getLineChartData(
				this.activePortfolioType,
				val.prosperoWalletAddress
			);
		},

		async toggleActiveHeader() {
			if (this.activeHeader === "left") {
				this.activeHeader = "right";
				console.log("on left mmoving right");
				this.reset();
				//if (this.selectedPortfolio!=undefined){
				//await updateSelectedWallet(this.selectedPortfolio);
				//this.lineChartData = getLineChartData(
				//	this.activePortfolioType,
				//	this.selectedPortfolio.prosperoWalletAddress
				//);
				//}
			} else {
				console.log("on right, going left...");
				this.activeHeader = "left";
				this.lineChartData = getLineChartData("all my holdings", "");
			}
		},

		changeActivePortfolioType() {
			if (this.activePortfolioType === "All Portfolios") {
				this.activePortfolioType = "My Portfolios";
			} else {
				this.activePortfolioType = "All Portfolios";
			}
			this.reset();
		},

		showCreate() {
			this.reset();
			this.activeMode = "create";
		},

		showJoin() {
			this.reset();
			this.activeMode = "join";
			portfolioStore.tableView = true;
			portfolioStore.firstCreateView = true;
		},

		goBack() {
			this.tableView = true;
			this.activePortfolioType = "All Portfolios";
			this.activeMode = "join";
			this.activeHeader = "left";
			this.reset();
		},

		updateActiveOverview(asset) {
			this.activeOverview = this.overview.find(
				(item) => item.asset.name === asset
			);
		},

		updateFilter(filter) {
			this.activeFilter = filter;
		},
	},

	getters: {
		joinedPortfolios(state) {
			return state.myPortfolios.filter(
				(portfolio) => portfolio.wallet_type === "Leader"
			);
		},

		filteredTxnList(state) {
			if (state.activeFilter === "All") {
				console.log("All Txns are -", state.allTxns);
				return state.allTxns.slice().reverse();
			} else {
				return state.allTxns
					.filter((txn) => txn.type === state.activeFilter)
					.reverse();
			}
		},
	},
});
