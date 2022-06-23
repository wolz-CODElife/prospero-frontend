import { defineStore } from "pinia";

export const useAllPortfolios = defineStore("AllPortfolios", {
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

			selectedPortfolio: {
				name: "",
				fee: null,
				d7: null,
				d30: null,
				d90: null,
				y1: null,
			},

			activeHeader: "left",

			// activeRow:
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
				this.selectedPortfolio = {
					name: "",
					fee: null,
					d7: null,
					d30: null,
					d90: null,
					y1: null,
				};
			} else {
				this.activeHeader = "left";
			}
		},
	},

	getters: {},
});
