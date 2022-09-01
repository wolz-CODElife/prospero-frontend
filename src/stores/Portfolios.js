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
	getTotalWithdrawals
} from "@/api";


export const usePortfolios = defineStore("Portfolios", {
	state: () => {
		return {
			allPortfolios: [],

			myPortfolios: [],

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

			depositMessage:"",
		};
	},

	actions: {
		// Fill empty portfolio list with an API call

		async loadData(){
			try {
				console.log("calling loadData");
				await initializeApi();
				this.isLoading = true;
				try {
					await this.getPortfolios();
					this.isLoading = false;
				} catch (error) {
					this.isLoading = false;
					this .isError = true;
					console.log("get portfolios error", error);
				}
			} catch (error) {
				console.log("init error", error);
			}
		},

		async getPortfolios() {
			this.isLoading = true;
			/*this.lineChartData = {
				labels: [
					"8-6-2022",
					"8-7-2022",
					"8-8-2022",
					"8-9-2022",
					"8-10-2022",
					"8-11-2022",
					"8-12-2022",
					"8-13-2022",
					"8-14-2022",
					"8-15-2022",
					"8-16-2022",
					"8-17-2022",
					"8-18-2022",
					"8-19-2022",
					"8-20-2022",
					"8-21-2022",
					"8-22-2022",
					"8-23-2022",
					"8-24-2022",
					"8-25-2022",
				],
				datasets: [
					{
						label: "ALL",
						backgroundColor: "#00ff00",
						borderColor: "#00ff00",
						data: [
							0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						],
						tension: 0.3,
						hoverRadius: 40,
					},
				],
			};
			*/
			try {
				this.allPortfolios = await getLeaderBoardDataForTable();
				this.myPortfolios = await getMyPortfoliosDataForTable();
				this.activeOverview.holdings = await getMyHoldings();
				this.activeOverview.deposits = await getMyUSDDepositsTotal();
				this.activeOverview.withdrawals = await getTotalWithdrawals();

				this.activeOverview.roi.value = await getMyROITotal();
				this.activeOverview.roi.percent = await getMyROITotalPercentage();
				this.allTxns = getAllTxns();
				//this.lineChartData = getLineChartData("all portfolios", "0xe2accfbaa0840d31b552971c30e7003e69cb3f39")
				//this.xAxisLineChart = getAxisDataForLineChart("all portfolios", "0xe2accfbaa0840d31b552971c30e7003e69cb3f39", "x")
				//this.yAxisLineChart = getAxisDataForLineChart("all portfolios", "0xe2accfbaa0840d31b552971c30e7003e69cb3f39", "y")
				this.isLoading = false;
				console.log("got all and my portfolios");
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
			console.log("Kachi see this", this.lineChartData);
		},

		toggleActiveHeader() {
			if (this.activeHeader === "left") {
				this.activeHeader = "right";
				this.reset();
			} else {
				this.activeHeader = "left";
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

		reset() {
			this.selectedPortfolio = {};
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
			console.log("kachi see active filter", this.activeFilter);
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
				return state.allTxns;
			} else {
				return state.allTxns.filter((txn) => {
					txn.type === state.activeFilter;
				});
			}
		},
	},
});
