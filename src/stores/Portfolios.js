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

			activePortfolioType: "All Portfolios", // or mine or mine & manager

			createMode: false,
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
				this.activePortfolioType = "My Portfolios";
				this.reset();
			} else {
				this.activePortfolioType = "All Portfolios";
			}
		},

		showCreate() {
			this.reset();
			this.createMode = true;
		},

		showJoin() {
			this.createMode = false;
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
