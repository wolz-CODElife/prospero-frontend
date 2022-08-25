import { defineStore } from "pinia";

import {
	getLeaderBoardDataForTable,
	getMyPortfoliosDataForTable,
	updateSelectedWallet,
	getMyHoldings,
	getMyUSDDepositsTotal,
	getMyROITotal,
	getMyROITotalPercentage,
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

			activeFilter: "All",
		};
	},

	actions: {
		// Fill empty portfolio list with an API call
		async getPortfolios() {
			this.isLoading = true;
			try {
				this.allPortfolios = await getLeaderBoardDataForTable();
				this.myPortfolios = await getMyPortfoliosDataForTable();
				this.activeOverview.holdings = await getMyHoldings();
				this.activeOverview.deposits = await getMyUSDDepositsTotal();
				this.activeOverview.roi.value = await getMyROITotal();
				this.activeOverview.roi.percent = await getMyROITotalPercentage();

				this.isLoading = false;
				console.log("got all and my portfolios");
			} catch (error) {
				this.isLoading = false;
				this.isError = true;
				console.log(error);
			}
		},

		doSelectPortfolio(val) {
			console.log(
				"doSelectPortfolio called with val:" + JSON.stringify(val, null, 2)
			);
			this.selectedPortfolio = val;
			this.activeHeader = "right";
			updateSelectedWallet(val.prosperoWalletAddress);
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
	},

	getters: {
		// createdPortfolios(state) {
		// 	return state.myPortfolios.filter(
		// 		(portfolio) => portfolio.created === true
		// 	);
		// },
		joinedPortfolios(state) {
			return state.myPortfolios.filter(
				(portfolio) => portfolio.wallet_type === "Leader"
			);
		},

		filteredTxnList(state) {
			if (state.activeFilter === "All") {
				return state.allTxns;
			} else {
				return state.allTxns.filter(
					(txn) => txn.type === state.activeFilter
				);
			}
		},
	},
});
