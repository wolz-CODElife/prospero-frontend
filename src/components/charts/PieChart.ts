import { defineComponent, h } from "vue";

import { Pie } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	Plugin,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
	name: "PieChart",
	components: {
		Pie,
	},
	props: {
		chartData: {
			type: Object,
			default: () => {},
		},
		chartId: {
			type: String,
			default: "pie-chart",
		},
		width: {
			type: Number,
			default: 250,
		},
		height: {
			type: Number,
			default: 150,
		},
		cssClasses: {
			default: "",
			type: String,
		},
		styles: {
			type: Object,
			default: () => {},
		},
		plugins: {
			type: Array,
			default: () => [],
		},
	},
	setup(props) {
		// const chartData = {
		// 	// pass this dynam
		// 	labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs", "NewFramework"],
		// 	datasets: [
		// 		// no idea how to generate this
		// 		{
		// 			backgroundColor: [
		// 				"#7262C5",
		// 				"#2854D7",
		// 				"#BB97CD",
		// 				"#8BC663",
		// 				"#9A8D5B",
		// 			],
		// 			// dynam
		// 			data: [30, 180, 30, 60, 60],
		// 		},
		// 	],
		// };

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
					// labels: {
					// 	color: "rgb(255, 99, 132)",
					// 	display: "flex",
					// },
				},
			},
		};

		return () =>
			h(Pie, {
				chartData: props.chartData,
				chartOptions,
				chartId: props.chartId,
				width: props.width,
				height: props.height,
				cssClasses: props.cssClasses,
				styles: props.styles,
				plugins: props.plugins,
			});
	},
});
