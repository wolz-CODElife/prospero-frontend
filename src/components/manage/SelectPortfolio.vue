<template>
	<div class="p-[10px]">
		<select
			v-model="portfolioStore.selectedManagePortfolio"
			class="bg-[#2D3035] text-white text-[14px] py-[8px] px-[15px] uppercase w-[330px] focus:outline-none"
		>
			<option disabled selected :value="{}" class="uppercase">
				Select a portfolio to manage
			</option>
			<option
				v-for="(portfolio, i) in portfolioStore.joinedPortfolios"
				:key="i"
				:value="portfolio"
			>
				{{ returnNameUpdateSelectedPortfolio(portfolio) }}
			</option>
		</select>
	</div>
</template>

<script setup>
import { ref} from "vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

function returnNameUpdateSelectedPortfolio(portfolio){
	
	console.log("PORT:"+JSON.stringify(portfolio,null,2));
	portfolioStore.selectedPortfolio=portfolio;
	return portfolio.name;
}

function onChangeManagedPortfolio(portfolio) {
  console.log(JSON.stringify(portfolio, null, 2));
}

defineProps({
	placeholder: {
		type: String,
		default: "Select a portfolio to manage",
	},
});

const open = ref(false);


</script>
