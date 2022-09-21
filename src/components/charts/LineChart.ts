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
import { usePortfolios } from "@/stores/Portfolios";

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
		chartData: {
			type: Object,
			default: () => {},
		},
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
		const portfolioStore = usePortfolios();
		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			onClick: (event, elements, chart) => {
				if (elements[0]) {
					const i = elements[0].index;
					let dateOptions = {
						month: "short",
						day: "numeric",
						year: "numeric",
					};
					let newDate = new Date(chart.data.labels[i]).toLocaleDateString(
						"en-us",
						dateOptions
					);
					portfolioStore.lineChartSelectedDate = newDate;

				}
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		};

		return () =>
			h(Line, {
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
