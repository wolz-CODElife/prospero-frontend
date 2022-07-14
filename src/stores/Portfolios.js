import { defineStore } from "pinia";
// import {
// 	getLeaderBoardDataForTable,
// 	getMyPortfoliosDataForTable,
// 	updateSelectedWallet,
// } from "@/api";

export const usePortfolios = defineStore("Portfolios", {
	state: () => {
		return {
			allPortfolios: [
				// {
				// 	name: "AFS1000 🔱",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: true,
				// },
				// {
				// 	name: "Harry Mcguire",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: false,
				// },
				// {
				// 	name: " 🌈 Lulu Nation Fans",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: false,
				// },
				// {
				// 	name: "GX 650 Lords 🏖",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: false,
				// },
				// {
				// 	name: "Moon Gatekeepers",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: false,
				// },
			],

			myPortfolios: [
				// {
				// 	name: "New User",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: true,
				// },
				// {
				// 	name: "Harry Mcguire",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: true,
				// },
				// {
				// 	name: " 🌈 Lulu Nation Fans",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: true,
				// },
				// {
				// 	name: "GX 650 Lords 🏖",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: true,
				// },
				// {
				// 	name: "Moon Gatekeepers",
				// 	fee: 2.6,
				// 	d7: 8,
				// 	d30: 12,
				// 	d90: 34,
				// 	y1: 60,
				// 	created: true,
				// },
			],

			selectedPortfolio: {
				name: "",
				fee: 0,
				d7: 0,
				d30: 0,
				d90: 0,
				y1: 0,
			},

			overview: [
				{
					asset: {
						name: "USD",
						icon: "https://i.postimg.cc/Mpmky9Ms/image.png",
					},
					holdings: "1000.00",
					roi: { value: "0.00", percent: 0 },
					deposits: "40.00",
					withdrawals: "0.00",
				},
				{
					asset: {
						name: "BTC",
						icon: "https://i.postimg.cc/MGnDWTSy/image.png",
					},
					holdings: "0.0",
					roi: { value: "50.0", percent: 1 },
					deposits: "0.0",
					withdrawals: "20.0",
				},
				{
					asset: {
						name: "AVAX",
						icon: "https://i.postimg.cc/br1T18qh/image.png",
					},
					holdings: "0.10",
					roi: { value: "0.0", percent: 0 },
					deposits: "0.0",
					withdrawals: "100.0",
				},
			],

			activeOverview: {
				asset: {
					name: "USD",
					icon: "https://i.postimg.cc/Mpmky9Ms/image.png",
				},
				holdings: "1000.00",
				roi: { value: "0.00", percent: 0 },
				deposits: "40.00",
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
		};
	},

	actions: {
		// Fill empty portfolio list with an API call
		// async getAllPortfolios() {
		// 	console.log("getAllPortfolios called");
		// 	try {
		// 		this.allPortfolios = await getLeaderBoardDataForTable();
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },

		// async getMyPortfolios() {
		// 	try {
		// 		console.log("getMyPortfolios called");
		// 		this.myPortfolios = await getMyPortfoliosDataForTable();
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },

		doSelectPortfolio(val) {
			console.log(
				"doSelectPortfolio called with val:" + JSON.stringify(val, null, 2)
			);
			this.selectedPortfolio = val;
			this.activeHeader = "right";
			// updateSelectedWallet(val.prosperoWalletAddress);
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
			this.selectedPortfolio = {
				name: "",
				fee: 0,
				d7: 0,
				d30: 0,
				d90: 0,
				y1: 0,
			};
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

		// function showCreate() {
		// 	tableView.value = false;
		// 	(async () => {
		// 		var status = await createPortfolio("Name Of Wallet Goes Here");
		// 		if (!status.success) {
		// 			console.log(status.error);
		// 			//error code here
		// 		} else {
		// 			if (status.prosperoWalletAddressCreated != null) {
		// 				console.log(
		// 					"new prosperoWalletAddressCreated:" +
		// 						status.prosperoWalletAddressCreated
		// 				);
		// 			} else {
		// 				console.log(
		// 					"no new prosperoWalletAddressCreated from tx returned from created but created successfully, wait for finished method event to fire."
		// 				);
		// 			}
		// 		}
		//   })();

		//   function doSelect(val) {
		// 	selectedPortfolioId.value = val;
		// 	activeRow.value = val;
		// 	console.log(activeRow.value);
		// 	updateActiveLeaderboardRow(val);
		// 	disabled.value = false;
		// 	console.log("disabled is", disabled.value);
		// }
	},

	getters: {
		createdPortfolios(state) {
			return state.myPortfolios.filter(
				(portfolio) => portfolio.created === true
			);
		},

		joinedPortfolios(state) {
			return state.myPortfolios.filter(
				(portfolio) => portfolio.created === false
			);
		},
	},
});
