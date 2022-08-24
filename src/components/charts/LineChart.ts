import { defineComponent, h } from "vue";

import { Line } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	CategoryScale,
	Plugin,
} from "chart.js";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	CategoryScale
);

export default defineComponent({
	name: "LineChart",
	components: {
		Line,
	},
	props: {
		chartId: {
			type: String,
			default: "line-chart",
		},
		width: {
			type: Number,
			default: 400,
		},
		height: {
			type: Number,
			default: 300,
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
		// const DATA_COUNT = 7;
		// const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };
		const chartData = {
			labels: [
				"2014",
				"2015",
				"2016",
				"2017",
				"2018",
				"2019",
				"2020",
				"2021",
				"2022",
			],
			datasets: [
				{
					label: "ALL",
					backgroundColor: "#00ff00",
					borderColor: "#00ff00",
					data: [20, 24, 28, 32, 20, 40, 28, 48, 52],
					tension: 0.3,
					hoverRadius: 40,
				},
			],
		};

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
		};

		return () =>
			h(Line, {
				chartData,
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
