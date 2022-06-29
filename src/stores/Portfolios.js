import { defineStore } from "pinia";
import {
	getLeaderBoardDataForTable,
	updateActiveLeaderboardRow,
	createPortfolio,
	getBalancesInEoa,
	deposit,
} from "@/api";

export const usePortfolios = defineStore("Portfolios", {
	state: () => {
		return {
			allPortfolios: [],

			selectedPortfolio: {
				name: "",
				fee: 0,
				d7: 0,
				d30: 0,
				d90: 0,
				y1: 0,
			},

			joinedPortfolios: [],

			createdPortfolios: [],

			activeHeader: "left",

			activePortfolioType: "All Portfolios", // Or 'My Portfolios'

			activeMode: "join", //create
		};
	},

	actions: {
		// Fill empty portfolio list with an API call
		async getAllPortfolios() {
			try {
				let leaderBoardData = await getLeaderBoardDataForTable();
				this.allPortfolios = leaderBoardData;
			} catch (error) {
				console.log(error);
			}
		},

		doSelectPortfolio(val) {
			this.selectedPortfolio = val;
			this.activeHeader = "right";
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
				this.reset();
			} else {
				this.activePortfolioType = "All Portfolios";
				this.reset();
			}
		},

		showCreate() {
			this.reset();
			this.activeMode = "create";
		},

		showJoin() {
			this.reset();
			this.activeMode = "join";
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
		myPortfolios(state) {
			return state.joinedPortfolios + state.createdPortfolios;
		},
	},
});
