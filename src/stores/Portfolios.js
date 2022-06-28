import { defineStore } from "pinia";

export const usePortfolios = defineStore("Portfolios", {
	state: () => {
		return {
			allPortfolios: [
				{
					name: "AFS1000 🔱",
					fee: 2.6,
					d7: 8,
					d30: 12,
					d90: 34,
					y1: 60,
				},
				{
					name: "Harry Mcguire",
					fee: 2.6,
					d7: 8,
					d30: 12,
					d90: 34,
					y1: 60,
				},
				{
					name: " 🌈 Lulu Nation Fans",
					fee: 2.6,
					d7: 8,
					d30: 12,
					d90: 34,
					y1: 60,
				},
				{
					name: "GX 650 Lords 🏖",
					fee: 2.6,
					d7: 8,
					d30: 12,
					d90: 34,
					y1: 60,
				},
				{
					name: "Moon Gatekeepers",
					fee: 2.6,
					d7: 8,
					d30: 12,
					d90: 34,
					y1: 60,
				},
			],

			myPortfolios: [],

			joinedPortfolios: [],

			createdPortfolios: [],

			selectedPortfolio: {
				name: "",
				fee: 0,
				d7: 0,
				d30: 0,
				d90: 0,
				y1: 0,
			},

			activeHeader: "left",

			activePortfolioType: "All Portfolios", // Or 'My Portfolios'

			activeMode: "join", //create
		};
	},

	actions: {
		// 1. fill empty portfolio list with an API call

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
				this.reset();
				this.activePortfolioType = "My Portfolios";
			} else {
				this.reset();
				this.activePortfolioType = "All Portfolios";
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

		depositToCreate() {},
	},

	getters: {},
});
