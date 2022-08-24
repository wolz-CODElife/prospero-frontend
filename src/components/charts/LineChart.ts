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
		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
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
