<template>
	<div class="p-[10px]">
		<select
			@change="onClickedPort(portfolioStore.selectedManagePortfolio)"
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
				{{ portfolio.name }}
			</option>
		</select>
	</div>
</template>

<script setup>
import { ref} from "vue";
import { usePortfolios } from "@/stores/Portfolios";
import { getTokenArray } from "@/api";
//getTokenArray
const portfolioStore = usePortfolios();

function returnNameUpdateSelectedPortfolio(portfolio){
	/*
	console.log("PORT:"+JSON.stringify(portfolio,null,2));
	portfolioStore.selectedPortfolio=portfolio;
	portfolioStore.allocationList=[];
	var port = portfolio['portfolioObject'];
	console.log("port:"+JSON.stringify(port,null,2));

	for (var tokenAddress in port) {
		if (tokenAddress.length == 42){
		var token = port[tokenAddress];
		token['address'] = tokenAddress;
		token['allocation']=token.percentage;
		token['mc']=0;
		token['d7']=0;
		token['d30']=0;
		token['d90']=0;
		token['y1']=0;
		token['icon']=token.image;
		portfolioStore.allocationList.push(token);
		}
	}
	console.log("allocation list:"+JSON.stringify(portfolioStore.allocationList,null,2));
*/
	return portfolio.name;
}

function onClickedPort(portfolio) {
	console.log("onClickedPort");
	//console.log("PORT:"+JSON.stringify(portfolio,null,2));
	portfolioStore.selectedPortfolio=portfolio;
	portfolioStore.allocationList=[];
	var port = portfolio['portfolioObject'];
	//console.log("port:"+JSON.stringify(port,null,2));
	//
	//var tokenList = portfolioStore.tokenList;

	for (var tokenAddress in port) {
		if (tokenAddress.length == 42){
		var token = port[tokenAddress];
		token['address'] = tokenAddress;
		token['allocation']=token.percentage;
		token['allocation']=token['allocation'].toFixed(2);
		token['allocation']=token['allocation']*100;
		token['mc']=0;
		token['d7']=0;
		token['d30']=0;
		token['d90']=0;
		token['y1']=0;
		token['icon']=token.image;
		portfolioStore.allocationList.push(token);
		
		}
	}
	var currentAllocationList = portfolioStore.allocationList;
	
	var tokenList = getTokenArray();
	//portfolioStore.tokenList=[];
	var newTokenList = []
	//console.log("tokenList:"+JSON.stringify(tokenList,null,2));
	
		
		for (var i =0;i<tokenList.length;i++){
			var thisToken = tokenList[i];
			var foundItAlready = false;
			for (var j=0;j<currentAllocationList.length;j++){
				var thisAllocationToken = currentAllocationList[j];
				if (thisAllocationToken.address == thisToken.address){
					foundItAlready=true;
				}
			}
		if (!foundItAlready){
			thisToken['icon']=thisToken.logoURI;
			newTokenList.push(thisToken)
		}
	}
	portfolioStore.tokenList=newTokenList;
	/*
	var currentAllocationList = portfolioStore.allocationList;
	for (var j=0;j<currentAllocationList.length;j++){
		var thisAllocationToken = currentAllocationList[j];
	}
	//portfolioStore.tokenList
	var finalTokenList = []
	for (var i =0;i<tokenList.length;i++){
		var thisToken = tokenList[i];
		var foundItAlready = false;
		for (var j=0;j<currentAllocationList.length;j++){
			var thisAllocationToken = currentAllocationList[j];
			if (thisAllocationToken.address == thisToken.address){
				foundItAlready=true;
			}
		}
		if (!foundItAlready){
			finalTokenList.push(thisToken);
		}
		*/
	//console.log("token list:"+JSON.stringify(portfolioStore.tokenList,null,2));
	//console.log("allocation list:"+JSON.stringify(portfolioStore.allocationList,null,2));
}

defineProps({
	placeholder: {
		type: String,
		default: "Select a portfolio to manage",
	},
});

const open = ref(false);


</script>
