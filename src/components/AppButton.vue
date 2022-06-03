<script setup>
import { computed } from "vue";

const props = defineProps({
	type: {
		type: String,
		default: "button",
	},

	color: {
		type: String,
		default: "default",
	},

	text: {
		type: Boolean,
		default: false,
	},

	outlined: {
		type: Boolean,
		default: false,
	},

	block: {
		type: Boolean,
		default: false,
	},

	to: {
		type: [String, Object],
		default: "",
	},

	href: {
		type: String,
		default: "",
	},

	size: {
		type: String,
		default: "md",
	},
});

const type = computed(() =>
	props.to ? "router-link" : props.href ? "a" : "button"
);

const classes = computed(() => {
	return [
		"btn",
		`btn-${props.color}`,
		`btn-${props.size}`,
		{
			"btn-outlined": props.outlined,
			"btn-text": props.text,
			"btn-block": props.block,
		},
	];
});
</script>

<template>
	<component :is="type" :to="to" :href="href" :type="type" :class="classes">
		<slot />
	</component>
</template>

<style>
.btn {
	@apply inline-flex justify-center items-center appearance-none border border-transparent font-normal transition duration-300
    focus:ring focus:outline-none focus:ring-offset-1 text-[16px] ease-out hover:cursor-pointer;
}
.btn-text {
	@apply p-0 inline border-none underline bg-transparent hover:bg-transparent hover:text-green-600 text-green-500;
}
.btn-block {
	@apply w-full block;
}

.btn:disabled {
	@apply bg-gray-100 hover:bg-gray-100 hover:border-gray-100 text-gray-400 border-gray-100 cursor-not-allowed;
}

/* 
 * -----
 * COLORS
 * -----
 */

.btn-primary {
	@apply border-green-500 bg-green-500 hover:border-[#00FF00] text-white 
    focus:ring-green-300;
}
.btn-secondary {
	@apply border-teal-500 bg-teal-500 hover:bg-teal-600 hover:border-teal-600 text-white 
  focus:ring-teal-300;
}
.btn-error {
	@apply border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 text-white 
    focus:ring-red-300;
}
.btn-success {
	@apply border-amber-500 bg-amber-500 hover:bg-amber-600 hover:border-amber-600 text-white 
    focus:ring-amber-300;
}

/*
 * OUTLINED VARIANT
 * ----------------
 */

.btn-primary.btn-outlined {
	@apply bg-transparent border-green-500 text-green-500 hover:bg-green-500  hover:text-white;
}
.btn-white.btn-outlined {
	@apply bg-transparent border-white text-white hover:border-[#00FF00] hover:text-white;
}
.btn-secondary.btn-outlined {
	@apply bg-transparent border-teal-500 text-teal-500 hover:bg-teal-500  hover:text-white;
}
.btn-success.btn-outlined {
	/* hero - get started */
	@apply bg-transparent border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]  hover:text-white;
}

.btn-error.btn-outlined {
	@apply bg-transparent border-red-500 text-red-500 hover:bg-red-500  hover:text-white;
}

/* 
 * -----
 * SIZES
 * -----
 */
.btn-xxs {
	@apply text-xs px-1.5 py-1;
}
.btn-xs {
	@apply text-xs px-2 py-1.5;
}
.btn-sm {
	@apply text-sm px-2.5 py-1.5;
}
.btn-md {
	@apply px-3 py-2;
}
.btn-lg {
	@apply text-base px-4 py-2.5;
}
.btn-xl {
	@apply text-lg px-5 py-3;
}
.btn-2xl {
	@apply text-xl px-5 py-4;
}
</style>
