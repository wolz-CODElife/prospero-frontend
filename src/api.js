//CONTRACTS VARIABLES:
var contractVariables = require("./apiLib/ContractVariables.json");
var wavaxAddressFakeFuji = contractVariables.wavaxAddressFakeFuji;
var factoryAddress = contractVariables.factoryAddress;
var prosperoPricesAddress = contractVariables.prosperoPricesAddress;
var pricesLibraryAddress = contractVariables.pricesLibraryAddress;
var subnetHelperContractAddress = contractVariables.subnetHelperContractAddress;
/*
var wavaxAddressFakeFuji="0x686bdcc79ec7f849669f3f908feb767f7c8d5b56"
var factoryAddress="0x1F3C45Cb6bDb9fe86686DEc9003A64DfF38b4652"
var prosperoPricesAddress="0xbd90c371c3524e86659291892B76820599633da9"
var pricesLibraryAddress="0x81D8Ed70151e7Ce3d36D2256F629f6862aC2A457"
var subnetHelperContractAddress="0x4A6cc169c359Fc340bAc1aEb973625CD64CEFdf7"
*/
//OBJECTS
var leaderBoardData = []; //leader board portfolios
var myWallets = {}; //my wallets either as a portfolio manager or investor
var historicalPricesObject = {}; //historical prices for tokens
var tokenArray = require("./apiLib/Tokens.json"); //set of tokens we use
var balancesInEoa = []; //used in deposits
var eventBlocksAlreadyHandledLatestBalances = [];
var eventBlocksAlreadyHandledFinishedMethod = []; //to do - remove me?  Unused?

var withdrawTableData = []; //for withdraw table
var leaderBoardDataOverTime = {}; //historical chart data leaderboard
var myPortfoliosDataOverTime = {}; //historical chart data my portfolios

//TO DO - have this updated on UI
var selectedProsperoWalletAddress; //="0x4cc4b88c622ee9b2c9007a6aea014a093c2fefc5"//CHANGE
var myWallets = 0;
//Libraries
const BigNumber = require("bignumber.js");
const Web3 = require("web3");
import detectEthereumProvider from "@metamask/detect-provider";
const ethers = require("ethers");
const axios = require("axios");
var graphData;
var web3;
var maxDate = localStorage.getItem("maxDate");

//ABIS
var ProsperoPricesJson = require("./apiLib/ProsperoPrices.json");
var ProsperoBeaconFactoryJson = require("./apiLib/ProsperoBeaconFactory.json");
var SubnetHelperContractJson = require("./apiLib/SubnetHelperContract.json");
var ProsperoWalletJson = require("./apiLib/ProsperoWallet.json");
var PricesLibraryJson = require("./apiLib/PricesLibrary.json");
var ERC20Json = require("./apiLib/ERC20.json");
//Constants
var WAVAX_COIN_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
var nativeTokenWrappedAddress = WAVAX_COIN_ADDRESS;
var ALOT_APPROVE = ethers.utils.parseEther("100000000000000");
var NativeTokenName = "Avax";
//Other Vars
var EOAAddress;
var ethersProvider;
var ethersSigner;
var nativeTokenPrice;
var isSubnet = false; //To Do - change me to something automatic by checking network
var avaxPrice;
var GAS_PRICE;
var alreadyListeningToFactoryEvents = false;
var blockNumWhenWebAppLaunched = 0;
var USD_SCALE = 1000000000000000000; //await ProsperoWalletLibConstants.methods.USD_SCALE().call()
var walletWaitingForEOA = ""; //do not use anymore
var activePortfolioType = "All Portfolios"; //default

//UI Objects - keys changed and formatted for UI
var leaderBoardUITableObject;
var myPortfolioDataForTable;
var newWalletObject;
var prosperoFactoryEventsInstance = null;

var DEPOSIT_THEN_REBALANCE = 0;
var WITHDRAW_ALL = 1;
var WITHDRAW_SWAP = 2;
var LEADER_SWAP = 3;
var LEADER_STRAIGHT_DEPOSIT = 4;
var CREATE_WALLET = 5;
var FOLLOW_WALLET = 6;

var UIStatus;
var UI_CREATE_THEN_DEPOSIT = 1;
var UI_JOIN_THEN_DEPOSIT = 2;
var UI_DEPOSIT_MY_PORTFOLIO = 3;
//FUNCTIONS
//TO DO:
//get rid of warnings solidity
//recent transactions (see image )
//account history (see image )
//contracts - add no more investors and change % fee for leader

//manage - kachi
function getTokenListForManageUI() {
	console.log("getTokenListForManageUI");
	if (
		selectedProsperoWalletAddress == null ||
		selectedProsperoWalletAddress == undefined
	) {
		console.log("selectedProsperoWalletAddress is null");
		return [{}];
		return;
	}
	var portToManage = [];
	var portfolio = getLeadersPortfolioForAddress(selectedProsperoWalletAddress);
	for (var key in portfolio) {
		if (keyIsTokenAddressNew(key)) {
			var price = portfolio[key]["price"];
			var name = portfolio[key]["symbol"];
			var allocation = portfolio[key]["percentage"];
			var uiObj = {
				price: price,
				name: name,
				uiObj: uiObj,
			};
			portToManage.push(uiObj);
		}
		/*
    name: "KBTC ",
		price: 120,
		mc: 340,
		allocation: 33,
		d7: 10,
		d30: 20,
		d90: 30,
		y1: 120,


    "totalValue": 3073.8131865138007,
    "totalUsd": 2840.413199702937,
    "profit": 233.39998681086354,
    "0xaa425487e19499171991397c29da7ba5c2c5d248": {
      "usdValue": 3073.8131865138002,
      "balance": "141236795768630974",
      "percentage": 0.9999999999999999,
      "name": "Wrapped BTC",
      "symbol": "WBTC.e",
      "price": 21763.54376907,
      "twentyFourHour": 872.418310043064,
      "image": "https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WBTC/logo.png"
    },
    "prosperoWalletAddress": "0x45adf1db8c12e68928712d8a20b5b342c3c47bc8",
    "profitLeader": 233.39998681086308,
    "walletValues": {
      "ProsperoBeaconFactoryAddress": "0x377D251772a4FCd2C039C718b14e229364bdC04e",
      "leaderEOA": "0xeeca92f4eb0b3102a62a414f1ff6290fFE23B67d",
      "prosperoPricesAddress": "0x3eac8c5D6518D434CB27E12f8b6565ed50B5b992",
      "prosperoDataAddress": "0x6264915AC05931470C35beccD6847dEB1F5B5fBd",
      "prosperoWalletAddress": "0x45adF1db8c12E68928712D8A20b5b342C3C47bC8",
      "walletName": "testers wallet",
      "profilePictureUrl": "",
      "totalSupply_percentageOwnership": "2850015852606667454968",
      "leaderPercentageFee": "200000000000000000",
      "prosperoPercentageFeeOfLeader": "200000000000000000"
    },
    "walletName": "testers wallet",
    "leaderPercentageFee": "200000000000000000",
    "prosperoPercentageFeeOfLeader": "200000000000000000",
    "numberOfTrailers": 3,
    "profitPercentage": 0.07593174101630303
  },
    */
	}
	return portToManage;
}
function keyIsTokenAddressNew(aKey) {
	for (var i = 0; i < tokenArray.length; i++) {
		var thisAdd = tokenArray[i]["address"];
		thisAdd = thisAdd.toLowerCase();
		aKey = aKey.toLowerCase();
		if (thisAdd == aKey) {
			return true;
		}
	}
	return false;
}

function updateUIStatus(newUIStatusType) {
	console.log("updateUIStatus called with:" + newUIStatusType);
	UIStatus = newUIStatusType;
}

function updateNewWalletVariables(walletName, fundFee) {
	newWalletObject = { walletName: walletName, fundFee: fundFee };
}

async function handleDepositType() {
	console.log("handleDepositType UIStatus:" + UIStatus);
	if (UIStatus == UI_CREATE_THEN_DEPOSIT) {
		console.log("UI_CREATE_THEN_DEPOSIT");
		var res = await createPortfolioThenDeposit();
	} else if (UIStatus == UI_JOIN_THEN_DEPOSIT) {
		console.log(" UI_JOIN_THEN_DEPOSIT");
		var res = await joinPortfolioThenDeposit();
	} else if (UIStatus == UI_DEPOSIT_MY_PORTFOLIO) {
		console.log("UI_DEPOSIT_MY_PORTFOLIO");
		var res = await deposit();
	} else {
		console.log("ERROR - no UI STATUS FOUND");
	}
	console.log("done handleDeposit");

	return res;
}

async function createPortfolioThenDeposit() {
	console.log("createPortfolioThenDeposit, setting walletWaitingForEOA");
	console.log("EOAAddress:" + EOAAddress);
	//walletWaitingForEOA=EOAAddress;
	//walletWaitingForEOA=walletWaitingForEOA.toLowerCase();
	//console.log("walletWaitingForEOA:"+walletWaitingForEOA)
	console.log("newWalletObject: " + JSON.stringify(newWalletObject, null, 2));
	var status = await createPortfolio(
		newWalletObject.walletName,
		newWalletObject.fundFee
	);
	if (!status.success) {
		console.log("createPortfolio fail.");
		//walletWaitingForEOA="";
		return status;
	}
	if (status.prosperoWalletAddressCreated == null) {
		console.log(
			"****** prosperoWalletAddressCreated is null - problem ***** "
		);
	} else {
		console.log(
			"prosperoWalletAddressCreated is NOT null, continuing... walletAddress:" +
				status.prosperoWalletAddressCreated
		);
		selectedProsperoWalletAddress = status.prosperoWalletAddressCreated;
	}
	//reset it if it was set
	status = await deposit();
	//walletWaitingForEOA="";
	return status;
}

async function joinPortfolioThenDeposit() {
	console.log("joinPortfolioThenDeposit");
	var status = await joinPortfolio();
	if (!status.success) {
		console.log("joinPortfolio fail.");
		return status;
	}
	//reset it if it was set
	status = await deposit();
	//walletWaitingForEOA="";
	return status;
}

async function getValuesOverTimeForLeaderAddress(prosperoWalletAddress) {
	//console.log("getValuesOverTimeForLeaderAddress")
	var returned = getValuesOverTimeHelper(
		leaderBoardDataOverTime,
		prosperoWalletAddress
	);
	//console.log("ret:"+JSON.stringify(returned,null,2))
	return returned;
}
async function getValuesOverTimeForMyPortfolioAddress(prosperoWalletAddress) {
	//console.log("getValuesOverTimeForMyPortfolioAddress")
	var returned = getValuesOverTimeHelper(
		myPortfoliosDataOverTime,
		prosperoWalletAddress
	);
	//console.log("ret:"+JSON.stringify(returned,null,2))
	return returned;
}
function getValuesOverTimeHelper(dataOverTimeObj, prosperoWalletAddress) {
	var startDate = null;
	var valuesOverTime = { all: 0, "7d": 0, "30d": 0, "90d": 0, "360d": 0 };
	for (var key in dataOverTimeObj) {
		var thisAdd = key.toLowerCase();
		prosperoWalletAddress = prosperoWalletAddress.toLowerCase();
		if (prosperoWalletAddress == thisAdd) {
			var dataOverTimeObjCopy = JSON.parse(
				JSON.stringify(dataOverTimeObj[key])
			);
			//({date:thisDate, profit: profit, value:thisGraphData["usersValues"][indexOfUser], usdInvested:thisGraphData["usdInvested"][indexOfUser]})
			dataOverTimeObjCopy.reverse();
			//console.log(" dataOverTimeObjCopy:"+JSON.stringify(dataOverTimeObjCopy,null,2))
			for (var i = 0; i < dataOverTimeObjCopy.length; i++) {
				//var val = dataOverTimeObjCopy[i]['value']/USD_SCALE
				//var usdInvested = dataOverTimeObjCopy[i]['usdInvested']/USD_SCALE
				//var profit = val - usdInvested
				//console.log("DDD:"+JSON.stringify(dataOverTimeObjCopy[i],null,2))
				var profit = dataOverTimeObjCopy[i]["profit"] / USD_SCALE;
				//console.log("profit:"+profit)
				//if (proifit != 0){
				// profit = profit.toFixed(2)
				//}
				//profit = profit+"";
				if (i == 0) {
					valuesOverTime["all"] = profit;
				} else if (i == 7) {
					valuesOverTime["7d"] = profit;
				} else if (i == 30) {
					valuesOverTime["30d"] = profit;
				} else if (i == 90) {
					valuesOverTime["90d"] = profit;
				} else if (i == 365) {
					valuesOverTime["365d"] = profit;
				}
			}
		}
	}
	//console.log(" valuesOverTime:"+JSON.stringify(valuesOverTime,null,2))
	return valuesOverTime;
}
//numberOfDays = number of days (number)
async function getValuesOverTimeForLinechartLeaderboardAddress(
	prosperoWalletAddress,
	numberOfDays
) {
	//console.log("getValuesOverTimeForLeaderboardAddress")
	var returned = getValuesOverTimeForLineChartHelper(
		leaderBoardDataOverTime,
		prosperoWalletAddress,
		numberOfDays
	);
	//console.log("ret:"+JSON.stringify(returned,null,2))
	return returned;
}
async function getValuesOverTimeForLinechartMyPortfolioAddress(
	prosperoWalletAddress,
	numberOfDays
) {
	//console.log("getValuesOverTimeForLinechartMyPortfolioAddress")
	var returned = getValuesOverTimeForLineChartHelper(
		myPortfoliosDataOverTime,
		prosperoWalletAddress,
		numberOfDays
	);
	//console.log("ret:"+JSON.stringify(returned,null,2))
	return returned;
}
function getValuesOverTimeForLineChartHelper(
	dataOverTimeObj,
	prosperoWalletAddress,
	numberOfDays
) {
	//leaderBoardDataOverTime

	for (var key in dataOverTimeObj) {
		var thisAdd = key.toLowerCase();
		prosperoWalletAddress = prosperoWalletAddress.toLowerCase();
		if (prosperoWalletAddress == thisAdd) {
			var dataOverTimeObjCopy = JSON.parse(
				JSON.stringify(dataOverTimeObj[key])
			);
			//({date:thisDate, profit: profit, value:thisGraphData["usersValues"][indexOfUser], usdInvested:thisGraphData["usdInvested"][indexOfUser]})
			dataOverTimeObjCopy.reverse();
			var tempData = [];
			//console.log(" dataOverTimeObjCopy:"+JSON.stringify(dataOverTimeObjCopy,null,2))
			for (var i = 0; i < dataOverTimeObjCopy.length; i++) {
				if (i <= numberOfDays) {
					var dObjToAdd = {
						date: dataOverTimeObjCopy[i].date,
						value: dataOverTimeObjCopy[i].value / USD_SCALE,
					};
					tempData.push(dObjToAdd);
				} else {
					break;
				}
			}
			tempData.reverse();
			//console.log(" tempData:"+JSON.stringify(tempData,null,2))
			return tempData;
		}
	}
}

function daysBetween(date_1, date_2) {
	var difference = date_1.getTime() - date_2.getTime();
	var totalDays = Math.ceil(difference / (1000 * 3600 * 24));
	return totalDays;
}
async function getWithdrawTableData() {
	withdrawTableData = [];
	var portfolio = await getMyWallet();
	for (var key in portfolio) {
		if (keyIsTokenAddress(key)) {
			var thisObj = portfolio[key];
			thisObj["address"] = key;
			withdrawTableData.push(thisObj);
		}
	}
	console.log(
		"withdrawTableData:" + JSON.stringify(withdrawTableData, null, 2)
	);
	return withdrawTableData;
}
async function getChartDataSelectedMyPortfolio() {
	var portfolio = await getMyWallet();
	var percentages = [];
	var labels = [];
	var colorArray = [];
	var images = [];

	for (var key in portfolio) {
		if (keyIsTokenAddress(key, portfolio)) {
			var thisObj = portfolio[key];

			var percentage = thisObj.percentage;
			percentage = (percentage * 100).toFixed(2);

			percentages.push(percentage);
			labels.push(thisObj.name);
			images.push(thisObj.image);
		}
	}
	for (var i = 0; i < percentages.length; i++) {
		colorArray.push(tokenArray[i]["color"]);
	}
	var chartData = {
		labels: labels,
		datasets: [
			{
				data: percentages,
				backgroundColor: colorArray,
				hoverOffset: 4,
			},
		],
	};
	var dataToReturn = {
		chartData: chartData,
		percentages: percentages,
		labels: labels,
		colorArray: colorArray,
		images: images,
	};
	console.log("dataToReturn:" + JSON.stringify(dataToReturn, null, 2));
	return dataToReturn;
}
function getLeadersPortfolioForAddress(prosperoWalletAddress) {
	console.log("getLeadersPortfolioForAddress:"+prosperoWalletAddress)
  	console.log("LBD:"+JSON.stringify(leaderBoardData,null,2));
	for (var i = 0; i < leaderBoardData.length; i++) {
		var thisProsperoWalletAddress =
			leaderBoardData[i]["prosperoWalletAddress"];
		thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
		prosperoWalletAddress = prosperoWalletAddress.toLowerCase();
    //console.log("prosperoWalletAddress    :"+prosperoWalletAddress)
    //console.log("thisProsperoWalletAddress:"+thisProsperoWalletAddress)

		if (thisProsperoWalletAddress == prosperoWalletAddress) {
			return leaderBoardData[i];
		}
	}
	//right here 
	for (var i = 0; i < myPortfolioDataForTable.length; i++) {
		var thisProsperoWalletAddress =
			myPortfolioDataForTable[i]["prosperoWalletAddress"];
		thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
		prosperoWalletAddress = prosperoWalletAddress.toLowerCase();
    //console.log("prosperoWalletAddress    :"+prosperoWalletAddress)
    //console.log("thisProsperoWalletAddress:"+thisProsperoWalletAddress)

		if (thisProsperoWalletAddress == prosperoWalletAddress) {
			return myPortfolioDataForTable[i];
		}
	}
	console.error(
		"** getLeadersPortfolioForAddress - no portfolio found ** prosperoWalletAddress:" +
			prosperoWalletAddress
	);
}
async function getChartDataSelectedLeader() {
	if (leaderBoardData.length == 0) {
		return {};
	}

	var portfolio = getLeadersPortfolioForAddress(selectedProsperoWalletAddress);
	var percentages = [];
	var labels = [];
	var colorArray = [];
	var images = [];
	for (var key in portfolio) {
		if (keyIsTokenAddress(key, portfolio)) {
			var thisObj = portfolio[key];

			var percentage = thisObj.percentage;
			percentage = (percentage * 100).toFixed(2);

			percentages.push(percentage);
			labels.push(thisObj.name);
			images.push(thisObj.image);
		}
	}
	for (var i = 0; i < percentages.length; i++) {
		colorArray.push(tokenArray[i]["color"]);
	}
	var chartData = {
		labels: labels,
		datasets: [
			{
				data: percentages,
				backgroundColor: colorArray,
				hoverOffset: 4,
			},
		],
	};
	var dataToReturn = {
		chartData: chartData,
		percentages: percentages,
		labels: labels,
		colorArray: colorArray,
		images: images,
	};
	console.log("dataToReturn:" + JSON.stringify(dataToReturn, null, 2));

	return dataToReturn;
	/*
  var ctx = document.getElementById('yourPortfolioChart').getContext('2d');
  if(yourPortfolioChart !=null){
  yourPortfolioChart.destroy()
  }
  yourPortfolioChart = new Chart(
  ctx,
  {
  type: 'pie',
  data:allChartData,
  options: {
  plugins: {
  legend: {
  display: true,
  onClick: null

  }
  },
  responsive:false,
  tooltips: {
  enabled: true,
  mode: 'single',
  callbacks: {
  label: function (tooltipItems, data) {
  var i = tooltipItems.index;
  return data.labels[i] + ": " + data.datasets[0].data[i] + " %";
  }
  }
  }
  }
  }
  );*/
}
function keyIsTokenAddress(key, obj) {
	if (obj.hasOwnProperty(key)) {
		if (
			key != "totalValue" &&
			key != "wallet_type" &&
			key != "prosperoWalletAddress" &&
			key != "totalUsd" &&
			key != "profit" &&
			key != "walletValues" &&
			//&& key!="has_inited_event_listener"
			key != "leaderProfit" &&
			key != "profitLeader" &&
			key != "walletName" &&
			key != "prosperoPercentageFeeOfLeader" &&
			key != "leaderPercentageFee" &&
			key != "numberOfTrailers" &&
			key != "profitPercentage"
		) {
			return true;
		}
		return false;
	}
	return false;
}

function getMyWallet() {
	if (
		selectedProsperoWalletAddress == null ||
		selectedProsperoWalletAddress == undefined ||
		selectedProsperoWalletAddress == ""
	) {
		console.error("** error selectedProsperoWalletAddress is empty **");
		return;
	}
	return myWallets[selectedProsperoWalletAddress];
}

//Left side header - Kachi
async function updateUIFieldValuesMyPortfolioMyPortfolio() {
	var portfolio = getMyWallet();
	var myHoldings = portfolio.totalValue;
	var usdInvested = portfolio.usdInvested;
	var deposits = portfolio.totalUsd;
	var profitsUsd = portfolio.profit;
	var profitPercentage = portfolio.profit / deposits;
	profitPercentage = profitPercentage * 100;
	profitPercentage = parseInt(profitPercentage);
	var withdraws = 0;
	var lastUsdDeposited = 0;

	//WITHDRAWS TOTAL BELOW
	for (var i = 0; i < graphData.length; i++) {
		var graphItem = graphData[i];
		//console.log("graphItem:"+JSON.stringify(graphItem,null,2))
		var addressVars = graphItem.addressVars;
		var intVars = graphItem.intVars;
		var users = graphItem.users;
		var usersValues = graphItem.usersValues;
		var methodType = intVars[0];
		var msgSender = addressVars[0];
		var indexOfUser = -1;
		var usdInvested = graphItem.usdInvested;
		msgSender = msgSender.toLowerCase();
		//console.log("*msgSender :"+msgSender)
		//console.log("*methodType:"+methodType)
		var eoaALower = EOAAddress.toLowerCase();
		if (msgSender == EOAAddress) {
			//console.log('found sender...')
			if (methodType == WITHDRAW_SWAP || methodType == WITHDRAW_ALL) {
				//console.log('found WD...')
				for (var f = 0; f < users.length; f++) {
					var thisUsersAddress = users[f];
					//console.log("thisUsersAddress:"+thisUsersAddress)
					thisUsersAddress = thisUsersAddress.toLowerCase();
					if (thisUsersAddress == eoaALower) {
						//console.log('found index...')
						indexOfUser = f;
					}
				}
				console.log("indexOfUser:" + indexOfUser);

				if (indexOfUser != -1) {
					var usdDeposited = usdInvested[indexOfUser];
					if (usdDeposited < lastUsdDeposited) {
						withdraws = withdraws + (lastUsdDeposited - usdDeposited);
					}
					lastUsdDeposited = usdDeposited;
				}
			}
		}
	}
	console.log("withdraws:" + withdraws);
	if (withdraws > 0) {
		withdraws = withdraws / USD_SCALE;
		withdraw = withdraws.toFixed(2);
	}
	//TO DO - UPDATE UI
}

//Right side header - Kachi
async function updateUIFieldValuesLeaderboard() {
	var portfolio = getLeadersPortfolioForAddress(selectedProsperoWalletAddress);
	var name = portfolio.walletName;
	var investors = portfolio.numberOfTrailers;
	var aum = portfolio.totalValue;
	var profitsUsd = portfolio.profitLeader;
	var profitsPercentage = portfolio.profitPercentage;
	//to do - update Ui
}
function updateApiTokenList(newTokenList) {
	balancesInEoa = newTokenList;
}
async function updateAmount(amount, tokenAddress) {
	console.log(
		"updateAmount called with amount:" +
			amount +
			" tokenAddress:" +
			tokenAddress
	);
	for (var i = 0; i < balancesInEoa.length; i++) {
		var thisDepositingObj = balancesInEoa[i];
		if (
			thisDepositingObj.address.toLowerCase() == tokenAddress.toLowerCase()
		) {
			balancesInEoa[i]["usdAmountEnteredByUser"] = amount;
		}
	}
}
//To do - update once you know how to do the selected leader board
async function updateSelectedProsperoWalletAddress(address) {
	console.log("*updateSelectedProsperoWallet called with address:" + address);
	selectedProsperoWalletAddress = address;
}
async function initNewEventListener() {
	console.log("initNewEventListener");
	if (prosperoFactoryEventsInstance == null) {
		alreadyListeningToFactoryEvents = true;
		console.log("setting .on in initNewEventListener");
		prosperoFactoryEventsInstance = await new ethers.Contract(
			factoryAddress,
			ProsperoBeaconFactoryJson.abi,
			ethersSigner
		);
		prosperoFactoryEventsInstance.on(
			"LatestBalancesFactory",
			async (
				tokens,
				users,
				balances,
				percentageOwnerships,
				usdInvested,
				usersValues,
				addressVars,
				intVars,
				walletName,
				profilePictureUrl,
				event
			) => {
				console.log("got LatestBalancesFactory");
				console.log(
					" LatestBalancesFactory event:" +
						" " +
						tokens +
						" " +
						users +
						" " +
						balances +
						" " +
						percentageOwnerships +
						" " +
						usdInvested +
						" " +
						usersValues +
						" " +
						addressVars +
						" " +
						intVars +
						" " +
						walletName +
						" " +
						JSON.stringify(event)
				);

				var methodType = intVars[0];
				var eoaAddressMsgSender = addressVars[0];
				eoaAddressMsgSender = eoaAddressMsgSender.toLowerCase();
				var myEoaAddress = EOAAddress.toLowerCase();
				console.log("methodType:" + methodType);
				console.log("eoaAddressMsgSender:" + eoaAddressMsgSender);
				console.log("event.blockNumber:" + event.blockNumber);
				console.log(
					"blockNumWhenWebAppLaunched:" + blockNumWhenWebAppLaunched
				);
				console.log("walletWaitingForEOA:" + walletWaitingForEOA);

				if (event.blockNumber <= blockNumWhenWebAppLaunched) {
					return;
				}
				if (
					eventBlocksAlreadyHandledLatestBalances.includes(
						event.blockNumber
					)
				) {
					return;
				}
				//var blocksAlreadyHadled = eventBlocksAlreadyHandledProsperoFactoryWallet
				eventBlocksAlreadyHandledLatestBalances.push(
					event.blockNumber + ""
				);

				var alertString = "Error - no methodType found.";

				//CREATE AND FOLLOW DOES NOT FIRE - REMOVE?
				/*if (methodType==CREATE_WALLET){
        if (EOAAddress == eoaAddressMsgSender){
         //console.log("received event of created wallet - it is the wallet the user was waiting for, doing nothing.")
          //walletWaitingForEOA="";
          return;
        }
        alertString ="A new Prospero wallet has been created, refreshing page now."
      }else if (methodType==FOLLOW_WALLET){
        if (EOAAddress == eoaAddressMsgSender){
         //console.log("received event of created wallet - it is the wallet the user was waiting for, doing nothing.")
          //walletWaitingForEOA="";
          return;
        }
        alertString ="A Prospero wallet has recently been followed, refreshing page now."
      }else 
      */
				if (methodType == LEADER_SWAP) {
					alertString =
						"A rebalance has just completed on a Prospero wallet, refreshing page now.";
				} else if (methodType == DEPOSIT_THEN_REBALANCE) {
					if (EOAAddress == eoaAddressMsgSender) {
						console.log(
							"received event of created wallet - it is the wallet the user was waiting for, doing nothing."
						);
						//walletWaitingForEOA="";
						return;
					}
					alertString =
						"A deposit has just been completed on a Prospero wallet, refreshing page now.";
				} else if (methodType == WITHDRAW_ALL) {
					alertString =
						"A withdraw has just been completed on a Prospero wallet, refreshing page now.";
				} else if (methodType == WITHDRAW_SWAP) {
					alertString =
						"A withdraw swap has just been completed on a Prospero wallet, refreshing page now.";
				} else if (methodType == LEADER_STRAIGHT_DEPOSIT) {
					if (EOAAddress == eoaAddressMsgSender) {
						console.log(
							"received event of created wallet - it is the wallet the user was waiting for, doing nothing."
						);
						//walletWaitingForEOA="";
						return;
					}
					alertString =
						"A deposit has just been completed on a Prospero wallet, refreshing page now.";
				}
				confirm(alertString);
				window.location.reload();
			}
		);
		//ONLY FOR CREATION OF WALLET AND FOLLOW - todo, consolidate to one function
		prosperoFactoryEventsInstance.on(
			"FinishedMethodFactory",
			async (
				methodType,
				eoaAddressMsgSender,
				prosperoWalletAddress,
				event
			) => {
				console.log(
					"got FinishedMethodFactory" +
						" " +
						methodType +
						" " +
						eoaAddressMsgSender +
						" " +
						prosperoWalletAddress +
						" " +
						JSON.stringify(event)
				);

				if (event.blockNumber <= blockNumWhenWebAppLaunched) {
					return;
				}
				if (
					eventBlocksAlreadyHandledFinishedMethod.includes(
						event.blockNumber
					)
				) {
					return;
				}
				eventBlocksAlreadyHandledFinishedMethod.push(
					event.blockNumber + ""
				);
				eoaAddressMsgSender = eoaAddressMsgSender.toLowerCase();
				console.log("walletWaitingForEOA:" + walletWaitingForEOA);
				console.log("eoaAddressMsgSender:" + eoaAddressMsgSender);

				var alertString = "Error - no methodType found.";
				if (methodType == CREATE_WALLET) {
					if (EOAAddress == eoaAddressMsgSender) {
						console.log(
							"received event of created wallet - it is the wallet the user was waiting for, doing nothing."
						);
						//walletWaitingForEOA="";
						return;
					}
					//if (eoaAddressMsgSender != myEoaAddress){
					//  return;
					//}
					alertString =
						"A new Prospero wallet has been created, refreshing page now.";
				} else if (methodType == FOLLOW_WALLET) {
					if (EOAAddress == eoaAddressMsgSender) {
						console.log(
							"received event of created wallet - it is the wallet the user was waiting for, doing nothing."
						);
						//walletWaitingForEOA="";
						return;
					}
					//if (eoaAddressMsgSender != myEoaAddress){
					//  return;
					//}
					alertString =
						"A Prospero wallet has recently been followed, refreshing page now.";
				}
				//LEADER_STRAIGHT_DEPOSIT
				confirm(alertString);
				window.location.reload();
			}
		);
	}
}

async function convertGraphDataToLeaderBoardAndMyWalletsData(){
	console.log("convertGraphDataToLeaderBoardAndMyWalletsData");
	var leaderBoardDataNew = {};
	var leaderBoardDataFinal = [];
	var myWalletsDataFinal = {};

	myPortfolioDataForTable=[];
	//leaderBoardUITableObject=[];
	//leaderBoardData=[];

	//console.log("graphData.length:"+graphData.length)
	for (var i = 0; i < graphData.length; i++) {
		var graphItem = graphData[i];
		//console.log("graphItem:"+JSON.stringify(graphItem,null,2))
		var intVars = graphItem['intVars'];
		//var methodType = intVars[]
		var thisProsperoWalletAddress = graphItem["addressVars"][2]
		thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
		if (!leaderBoardDataNew.hasOwnProperty(thisProsperoWalletAddress)){
			leaderBoardDataNew[thisProsperoWalletAddress]=graphItem
			//console.log("adding")
		}else{
			//console.log('already has.')
			var graphItemWeHaveAlready = leaderBoardDataNew[thisProsperoWalletAddress]
			var timeOfOneWeHave = graphItemWeHaveAlready["intVars"][4]
			var timeOfThisOne = graphItem["intVars"][4]
			//console.log("timeOfThisOne  :"+timeOfThisOne)
			//console.log("timeOfOneWeHave:"+timeOfOneWeHave)

			if (timeOfThisOne > timeOfOneWeHave){
				//console.log("replacing...")
				leaderBoardDataNew[thisProsperoWalletAddress]=graphItem
			}else{
				//console.log("Not replacing")
			}
		}
	}
	var cntrLB = 0;
	var cntrMyWallets = 0;
	var firstWallet = "";
	for (var key in leaderBoardDataNew) {
		var leaderBoardDataObject = {}
		var thisProsperoWalletAddress = key;
		var thisGraphItem = leaderBoardDataNew[key];
		var addressVars = thisGraphItem["addressVars"];
		var tokens = thisGraphItem["tokens"];
		var tokenBalances = thisGraphItem["balances"]
		var usersInPortfolio = thisGraphItem["users"]
		var leaderAddress = addressVars[1];
		var indexOfLeader = getIndexOfUser(thisGraphItem["users"], leaderAddress);
		leaderAddress = leaderAddress.toLowerCase();
		if (indexOfLeader != 0){
			console.error("ERROR - Index of leader is not zero - problem....")
			return;
		}

		var leadersUsdInvested = thisGraphItem["usdInvested"][indexOfLeader] / USD_SCALE;
		
		var indexOfUser = getIndexOfUser(thisGraphItem["users"], EOAAddress);
		if (indexOfUser == -1){
			//user not in this portfolio
		}else{
			//use IS in this portfolio...to do, add to my wallets.  If user is same as leader, it should be the same object in my 
			//wallets 
		}
		//console.log("leadersValue 1:"+thisGraphItem["usersValues"][indexOfLeader])

		//var leadersValue = thisGraphItem["usersValues"][indexOfLeader] /  USD_SCALE
		//console.log("leadersValue:"+leadersValue)
		//var profitLeaderUsd = leadersValue - leadersUsdInvested;
		var percentageOwnership = thisGraphItem["percentageOwnerships"]
		var thisPercentage = percentageOwnership[indexOfLeader];
		//console.log("thisPercentage:"+thisPercentage)
		//thisPercentage = thisPercentage / USD_SCALE;
		thisPercentage = thisPercentage / 100;
		//console.log("thisPercentage:"+thisPercentage)
		var portfolioObject = {}
		var leadersValue = 0;
		for (var i =0;i<tokens.length;i++){
			var tokenObj = {};
			var thisTokenAddress = tokens[i];
			thisTokenAddress = thisTokenAddress.toLowerCase();
			tokenObj["balance"] = parseInt((tokenBalances[i] * thisPercentage)+"");
			//right here 
			var aTokenObject = await getTokenObject_newMine(thisTokenAddress);
			var usdThisUserThisToken = await getUSDValue_MINE(
				tokenObj["balance"],
				thisTokenAddress
			);
			usdThisUserThisToken = usdThisUserThisToken * thisPercentage;
			tokenObj["name"] = aTokenObject["name"]
			tokenObj["price"] = aTokenObject["price"]
			tokenObj["usdValue"] = usdThisUserThisToken
			leadersValue = leadersValue + usdThisUserThisToken;
			tokenObj["symbol"] = aTokenObject["symbol"]
			tokenObj["twentyFourHour"] = aTokenObject["twentyFourHour"]
			tokenObj["image"] = aTokenObject["logoURI"]
			tokenObj["decimals"] = aTokenObject["decimals"]
			//tokenObj["percentage"] = usdThisUserThisToken / leadersValue;
			//tokenObj["usdValue"] 1.6017845582640506,
			//tokenObj["percentage"] 0.999999999999999,
			//tokenObj["name"] "Wrapped Eth",
			//tokenObj["symbol"] "WETH.e",
			//tokenObj["price"] 1688.14864955,
			//tokenObj["twentyFourHour"] -70.74646037905265,
			//tokenObj["image"] "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png"
			//allTokensInThisPort.push(tokenObj);
			//console.log("TOKEN OBJECT:"+JSON.stringify(tokenObj,null,2))
			portfolioObject[thisTokenAddress] = tokenObj;
		}
		for (var i =0;i<tokens.length;i++){
			tokenObj["percentage"] = tokenObj["usdValue"] / leadersValue;
		}
		/*
		var walletValues = {}
			walletValues["ProsperoBeaconFactoryAddress"] = thisProsperoWalletAddress;
			walletValues["leaderEOA"] = usersInPortfolio[indexOfLeader];
			walletValues["prosperoPricesAddress"] = "0x3eac8c5D6518D434CB27E12f8b6565ed50B5b992",
			walletValues["prosperoDataAddress"] = "0x6264915AC05931470C35beccD6847dEB1F5B5fBd",
			walletValues["prosperoWalletAddress"] = "0xdd9aC527A74cbf673f7d5d37053D0781B654b940",
			walletValues["walletName"] = "k;;sdksd",
			walletValues["totalSupply_percentageOwnership"] = "1909888602372440374",
			walletValues["leaderPercentageFee"] = "200000000000000000",
			walletValues["prosperoPercentageFeeOfLeader"]= "200000000000000000"
		*/
		var profitLeaderUsd = leadersValue - leadersUsdInvested;
		var profitLeaderPercentage = profitLeaderUsd / leadersUsdInvested;
		//if (profitLeaderPercentage>0 || profitLeaderPercentage<0){
		//	profitLeaderPercentage=profitLeaderPercentage.toFixed(2);
		//	profitLeaderPercentage=Number(profitLeaderPercentage);
		//}
		portfolioObject["totalValue"] = leadersValue;
		portfolioObject["totalUsd"] = leadersUsdInvested;
		portfolioObject["profit"] = profitLeaderUsd;
		leaderBoardDataObject["name"] = thisGraphItem["walletName"]
		leaderBoardDataObject["fee"] = "20%";//TO DO - need to add this
		leaderBoardDataObject["d7"] = 0;
		leaderBoardDataObject["d30"] = 0;
		leaderBoardDataObject["d90"] = 0;
		leaderBoardDataObject["y1"] = profitLeaderPercentage.toFixed(2)+"%";
		leaderBoardDataObject["prosperoWalletAddress"] = thisProsperoWalletAddress
		leaderBoardDataObject["portfolioObject"] = portfolioObject;
		leaderBoardDataObject["profitLeader"] = profitLeaderUsd;
		leaderBoardDataObject["leaderEOA"] = leaderAddress;

		leaderBoardDataObject["walletName"] = thisGraphItem["walletName"]
		leaderBoardDataObject["leaderPercentageFee"] = "20%";//TO DO - need to add this
		leaderBoardDataObject["prosperoPercentageFeeOfLeader"]  = "20%";//TO DO - need to add this
		leaderBoardDataObject["numberOfTrailers"] = usersInPortfolio.length;
		leaderBoardDataObject["profitPercentage"] = profitLeaderPercentage;
		//console.log("NEW LB DATA OBJ:"+JSON.stringify(leaderBoardDataObject,null,2))
		if (leadersValue > 0){
			if (firstWallet == ""){
			  firstWallet = thisProsperoWalletAddress;
			}
			leaderBoardDataObject["index"] = cntrLB;//TO DO - need to add this
			cntrLB=cntrLB+1;
			leaderBoardDataFinal.push(leaderBoardDataObject);
		}else{
			console.log('not adding - leader did not invest yet.')
		}
		if (indexOfUser == 0){
			//EOA is Leader
			leaderBoardDataObject['wallet_type'] = "Leader"
			//leaderBoardDataObject["index"] = cntrMyWallets;//TO DO - need to add this
			//cntrMyWallets=cntrMyWallets+1;
			
		}else if (indexOfUser > 0){
			//EOA is trailer 
			leaderBoardDataObject['wallet_type'] = "Trailer"
			//leaderBoardDataObject["index"] = cntrMyWallets;//TO DO - need to add this
			//cntrMyWallets=cntrMyWallets+1;

		}else{
			//EOA is not part of this wallet
			leaderBoardDataObject['wallet_type']=""
		}
		if ((indexOfUser > 0) || (indexOfUser == 0)){
			myWalletsDataFinal[thisProsperoWalletAddress]=leaderBoardDataObject
			myPortfolioDataForTable.push(leaderBoardDataObject);
		}
		
	  }
	  selectedProsperoWalletAddress = firstWallet;

	  myWallets = myWalletsDataFinal;
	  
	  leaderBoardUITableObject = leaderBoardDataFinal;
	  leaderBoardData = leaderBoardDataFinal;

	 //console.log("myWalletsDataFinal:"+JSON.stringify(myWalletsDataFinal,null,2))
	 // console.log("leaderBoardDataFinal:"+JSON.stringify(leaderBoardDataFinal,null,2))

		/*
		"index": 0,
    "name": "k;;sdksd",
    "fee": "20%",
    "d7": 0,
    "d30": 0,
    "d90": 0,
    "y1": 60.17876300118241,
    "prosperoWalletAddress": "0xdd9ac527a74cbf673f7d5d37053d0781b654b940",
    "portfolioObject": {
      "totalValue": 1.6017845582640522,
      "totalUsd": 0.9999969282522281,
      "profit": 0.6017876300118241,
      "0xb82c58c54d03b17063a024851b79105c9367270f": {
        "usdValue": 1.6017845582640506,
        "balance": "948840944007525",
        "percentage": 0.999999999999999,
        "name": "Wrapped Eth",
        "symbol": "WETH.e",
        "price": 1688.14864955,
        "twentyFourHour": -70.74646037905265,
        "image": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png"
      },
      "prosperoWalletAddress": "0xdd9ac527a74cbf673f7d5d37053d0781b654b940",
      "profitLeader": 0.6017876300118241,
      "walletValues": {
        "ProsperoBeaconFactoryAddress": "0x377D251772a4FCd2C039C718b14e229364bdC04e",
        "leaderEOA": "0x071018cb3364C47F407769C267e4B691227402aD",
        "prosperoPricesAddress": "0x3eac8c5D6518D434CB27E12f8b6565ed50B5b992",
        "prosperoDataAddress": "0x6264915AC05931470C35beccD6847dEB1F5B5fBd",
        "prosperoWalletAddress": "0xdd9aC527A74cbf673f7d5d37053D0781B654b940",
        "walletName": "k;;sdksd",
        "profilePictureUrl": "",
        "totalSupply_percentageOwnership": "1909888602372440374",
        "leaderPercentageFee": "200000000000000000",
        "prosperoPercentageFeeOfLeader": "200000000000000000"
      },
      "walletName": "k;;sdksd",
      "leaderPercentageFee": "200000000000000000",
      "prosperoPercentageFeeOfLeader": "200000000000000000",
      "numberOfTrailers": 2,
      "profitPercentage": 0.3756982341395628
    }
  }
  */

  //leaderBoardUITableObject
  //myPortfolioDataForTable
  var dupesCheck = []
  console.log(" ")
  console.log("Leader Board Summary:")
  console.log("Number Of Wallets:"+leaderBoardUITableObject.length)
  for (var i =0;i<leaderBoardUITableObject.length;i++){
	var thisObj = leaderBoardUITableObject[i];
	console.log("Name:"+thisObj.name)
	console.log(" address    :"+thisObj.prosperoWalletAddress)
	console.log(" wallet_type:"+thisObj.wallet_type)
	var prospAd = thisObj.prosperoWalletAddress;
	prospAd = prospAd.toLowerCase();
	if (dupesCheck.indexOf(prospAd)>-1){
	  console.error("Error - DUPE!!!!")
	}
	dupesCheck.push(prospAd)
  }
  dupesCheck = []
  console.log(" ")
  console.log("My Wallets Summary:")
  console.log("Number Of Wallets:"+myPortfolioDataForTable.length)
  for (var i =0;i<myPortfolioDataForTable.length;i++){
	var thisObj = myPortfolioDataForTable[i];
	console.log("Name:"+thisObj.name)
	console.log(" address    :"+thisObj.prosperoWalletAddress)
	console.log(" wallet_type:"+thisObj.wallet_type)
	var prospAd = thisObj.prosperoWalletAddress;
	prospAd = prospAd.toLowerCase();
	if (dupesCheck.indexOf(prospAd)>-1){
	  console.error("DUPE!!!!")
	}
	dupesCheck.push(prospAd)
  }
  console.log(" ")


}

async function getGraphData() {
	//console.log("getGraphData")
	var prspUrl = "https://api.thegraph.com/subgraphs/name/lapat/prospero"; // https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
	/*
  address[] tokens,
  address[] users,
  uint256[] balances,
  uint256[] percentageOwnerships,
  uint256[] usdInvested,
  uint256[] usersValues,
  address[] addressVars,
  uint256[] intVars,
  string walletName,
  string profilePictureUrl

  addressVars[0] = messageSender;
  addressVars[1] = ProsperoWallet(ProsperoWalletAddress)
  .getWalletValues()
  .leader;
  addressVars[2] = ProsperoWalletAddress;

  intVars[0] = uint256(methodType);
  intVars[1] = totalValueOfPortfolio;
  intVars[2] = feeStruct.usdFeeAmountProspero;
  intVars[3] = feeStruct.usdFeeAmountLeader;
  intVars[4] = block.timestamp;
  intVars[5] = feeStruct.profitAmount;
  for (uint256 i = 6; i < intVars.length; i++) {
  intVars[i] = ProsperoWallet(ProsperoWalletAddress)
  .last_remixGoalPercentages(i - 6);
}
*/
	try {
		var result = await axios.post(prspUrl, {
			query: `
      {
        latestBalancesFactories
        {
          id
          tokens
          users
          balances
          percentageOwnerships
          usdInvested
          usersValues
          addressVars
          intVars
          walletName
        }
      }
      `,
		});
		//console.log ("Query result: \n", result.data.data.latestBalancesFactories);
		graphData = result.data.data.latestBalancesFactories;
		for (var i = 0; i < graphData.length; i++) {
			var graphItem = graphData[i];
			//console.log("graphItem:"+JSON.stringify(graphItem,null,2))
		}
	} catch (err) {
		console.log("error getGraphData:" + err);
		return { success: false, error: err };
	}
	return { success: true };
	//}
}

//Variables just used below, to do, fix?
var lastUsdInvested = 0;
var lastBalancesInPort = [];
var lastAddressInPort = [];
async function getHistoricalPricesUpdateChartsData() {
	//console.log('getHistoricalPricesUpdateChartsData')
	//var now = new Date();
	var maxDateHere;
	var dates = [];
	var options = {
		timeZone: "Europe/London",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	};
	var formatter = new Intl.DateTimeFormat([], options);
	console.log("formatter date:" + formatter.format(new Date()));
	var now = new Date(formatter.format(new Date()));
	var nowFloored = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	nowFloored = nowFloored.getTime() / 1000;
	//console.log("nowFloored:"+nowFloored+" maxDate:"+maxDate)
	//Only get Coingecko data if we need it, then store it in local storage so we don't have to keep getting it.
	if (nowFloored > maxDate) {
		//if (true){

		console.log("nowFloored>maxDate");
		//if (true){
		for (var i = 0; i < tokenArray.length; i++) {
			var thisToken = tokenArray[i];
			localStorage.removeItem(thisToken.id);
			//https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=365&interval=daily
			//var tokenHistory = JSON.parse(localStorage.getItem(thisToken.id));
			//var shouldSearch = false;
			//if (!tokenHistory.hasOwnProperty("prices")){
			//console.log("SHOULD SEARCH - nowFloored>maxDate")
			//shouldSearch=true;
			//}
			//}
			//if (shouldSearch){
			console.log("searching...:" + thisToken.id);
			var hUrl =
				"https://api.coingecko.com/api/v3/coins/" +
				thisToken.id +
				"/market_chart?vs_currency=usd&days=365&interval=daily";
			var historicalPricesResponseHere = await fetch(hUrl);
			var priceObjHere = await historicalPricesResponseHere.json();
			priceObjHere = priceObjHere.prices;
			for (var k = 0; k < priceObjHere.length; k++) {
				var theDate = new Date(priceObjHere[k][0]);
				//console.log("t:"+priceObjHere[k][0])
				var justDate =
					theDate.getMonth() +
					1 +
					"-" +
					theDate.getDate() +
					"-" +
					theDate.getFullYear();
				//console.log('justDate:'+justDate)
				priceObjHere[k].push(justDate);
				var maxDateThisObj = priceObjHere[k][0] / 1000;
				if (maxDateThisObj > maxDate) {
					maxDateHere = new Date(
						theDate.getFullYear(),
						theDate.getMonth(),
						theDate.getDate()
					);
				}
				//var addLowerCase = thisToken.address
				//addLowerCase=addLowerCase.toLowerCase();
				//console.log("addLowerCase:"+addLowerCase)
				////console.log("priceObjHere[k][1]:"+priceObjHere[k][1])
				//historicalPricesObject[addLowerCase]={}
				//historicalPricesObject[addLowerCase][justDate]=priceObjHere[k][1]
				//tokenHistory['date']=justDate
			}
			//console.log("p:"+JSON.stringify(priceObjHere,null,2))
			localStorage.setItem(thisToken.id, JSON.stringify(priceObjHere));
			//var theDate = new Date(theStorage[k][0]);
			//console.log("t:"+theStorage[k][0])
			//var justDate = (theDate.getMonth()+1) +"-"+ theDate.getDate() +"-"+ theDate.getFullYear();
			localStorage.setItem("maxDate", maxDateHere.getTime() / 1000);
		}
	}

	var options = {
		timeZone: "Europe/London",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	};
	var formatter = new Intl.DateTimeFormat([], options);
	//console.log("formatter date:"+formatter.format(new Date()));
	var now = new Date(formatter.format(new Date()));
	var nowFloored = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	nowFloored = nowFloored.getTime() / 1000;

	//console.log('got them...')
	//While we are converting coingecko to dates mm-dd-yyyy, add it to a dates array for later
	for (var i = 0; i < tokenArray.length; i++) {
		dates = [];
		var thisToken = tokenArray[i];
		var theStorage = localStorage.getItem(thisToken.id);
		theStorage = JSON.parse(theStorage);
		//console.log('thisToken.id:'+thisToken.id)
		//console.log("theStorage:"+JSON.stringify(theStorage,null,2))
		//var tokenHistory = JSON.parse(theStorage);
		//console.log("thisToken.id:"+thisToken.id+"tokenHistory:"+JSON.stringify(tokenHistory,null,2))
		var addLowerCase = thisToken.address;
		addLowerCase = addLowerCase.toLowerCase();
		historicalPricesObject[addLowerCase] = {};
		for (var k = 0; k < theStorage.length; k++) {
			var justDateHere = theStorage[k][2];
			justDateHere = justDateHere.trim();
			var justDateHereD = new Date(justDateHere);
			justDateHereD = justDateHereD.getTime() / 1000;
			//console.log('justDateHereD:'+justDateHereD)
			//console.log('nowFloored   :'+nowFloored)
			//if (justDateHereD < nowFloored){
			if (!dates.includes(justDateHere)) {
				dates.push(justDateHere);
			} else {
				//console.log("includes")
			}
			//console.log("t:"+theStorage[k][0])
			//var justDateHere = (theDate.getMonth()+1) +"-"+ theDate.getDate() +"-"+ theDate.getFullYear();
			//console.log('justDate:'+justDate)
			//console.log("addLowerCase:"+addLowerCase)
			//console.log("theStorage[k][1]:"+theStorage[k][1])
			historicalPricesObject[addLowerCase][justDateHere] = theStorage[k][1];
			//}else{
			////console.log("NOT ADDINa")
			//}
		}
	}
	//console.log("historicalPricesObject:"+JSON.stringify(historicalPricesObject,null,2))
	//Find the value of the portfolio for all the graph data at that date
	for (var i = 0; i < graphData.length; i++) {
		//console.log("I;"+i)
		var graphItem = graphData[i];
		var timeOfGraph = graphItem["intVars"][4];
		timeOfGraph = timeOfGraph * 1000;
		var theDate = new Date(timeOfGraph);
		var justDateTheGraph =
			theDate.getMonth() +
			1 +
			"-" +
			theDate.getDate() +
			"-" +
			theDate.getFullYear();
		graphData[i]["date"] = justDateTheGraph;
		var tokens = graphItem["tokens"];
		graphData[i]["prices"] = [];
		//Do not need do this cuz value of port in the graph is already calculated
		for (k = 0; k < tokens.length; k++) {
			var addLowerCase = tokens[k];
			addLowerCase = addLowerCase.toLowerCase();
			if (historicalPricesObject.hasOwnProperty(addLowerCase)) {
				var thisAddObj = historicalPricesObject[addLowerCase];
				if (thisAddObj.hasOwnProperty(justDateTheGraph)) {
					graphData[i]["prices"].push(
						historicalPricesObject[addLowerCase][justDateTheGraph]
					);
				} else {
					console.log(
						"****** NEED TO REDEPLOY THE GRAPH ****** error - NO DATE getHistoricalPricesUpdateChartsData:" +
							justDateTheGraph +
							" thisAddObj:" +
							addLowerCase
					);
					console.log("thisAddObj:" + JSON.stringify(thisAddObj, null, 2));
				}
			} else {
				console.log(
					"****** NEED TO REDEPLOY THE GRAPH ****** error - NO ADDRESS getHistoricalPricesUpdateChartsData:" +
						justDateTheGraph +
						" thisAddObj:" +
						addLowerCase
				);
				console.log("thisAddObj:" + JSON.stringify(thisAddObj, null, 2));
			}
		}
		//console.log("justDateTheGraph:"+justDateTheGraph)
		//console.log("graphItem:"+JSON.stringify(graphData[i],null,2))
	}
	leaderBoardDataOverTime = {};
	myPortfoliosDataOverTime = {};

	var myWalletAddresses = [];
	for (var key in myWallets) {
		var thisProsperoWalletAddress = key;
		myPortfoliosDataOverTime[thisProsperoWalletAddress] = [];
		myWalletAddresses.push(thisProsperoWalletAddress);
	}

	var lbData = leaderBoardData;
	for (var i = 0; i < lbData.length; i++) {
		var thisProsperoWalletAddressLB = lbData[i].prosperoWalletAddress;
		leaderBoardDataOverTime[thisProsperoWalletAddressLB] = [];
	}

	lastUsdInvested = 0;
	lastBalancesInPort = [];
	lastAddressInPort = [];
	//Go through every date (gotten earlier) and make the chart data.  3 scenarios:
	//1) found in graph data.
	//2) not found in graph data and there has never been any graph data on it, profit is 0.
	//3) already found in graph data, not found now, use last usdInvested and lastBalanacesInPort to determine value of port with the price of the tokens on that day.
	for (var k = 0; k < dates.length; k++) {
		var thisDate = dates[k];
		//console.log("thisDate:"+thisDate)
		for (var i = 0; i < lbData.length; i++) {
			var thisProsperoWalletAddressLB = lbData[i].prosperoWalletAddress;
			thisProsperoWalletAddressLB =
				thisProsperoWalletAddressLB.toLowerCase();
			var thisLeaderEOA = lbData[i]["walletValues"]["leaderEOA"];
			await updateHistoryChartsDataObject(
				thisProsperoWalletAddressLB,
				leaderBoardDataOverTime,
				thisDate,
				thisLeaderEOA
			);
		}
	}
	//Have to do this
	lastUsdInvested = 0;
	lastBalancesInPort = [];
	lastAddressInPort = [];
	for (var k = 0; k < dates.length; k++) {
		var thisDate = dates[k];
		for (var i = 0; i < myWalletAddresses.length; i++) {
			var thisProsperoWalletAddressMyPorts = myWalletAddresses[i];
			thisProsperoWalletAddressMyPorts =
				thisProsperoWalletAddressMyPorts.toLowerCase();
			await updateHistoryChartsDataObject(
				thisProsperoWalletAddressMyPorts,
				myPortfoliosDataOverTime,
				thisDate,
				EOAAddress
			);
		}
	}
	console.log("leaderBoardDataOverTime :"+JSON.stringify(leaderBoardDataOverTime,null,2))
	console.log("myPortfoliosDataOverTime:"+JSON.stringify(myPortfoliosDataOverTime,null,2))
}
function getIndexOfUser(arrayOfAddresses, userAddress) {
	userAddress = userAddress.toLowerCase();
	for (var p = 0; p < arrayOfAddresses.length; p++) {
		var thisAdd = arrayOfAddresses[p];
		thisAdd = thisAdd.toLowerCase();
		if (thisAdd == userAddress) {
			return p;
		}
	}
	return -1;
}
async function updateHistoryChartsDataObject(
	walletAddress,
	dataForHistoryChart,
	thisDate,
	userAddress
) {
	//console.log("updateHistoryChartsDataObject")
	//console.log("dataForHistoryChart:"+JSON.stringify(dataForHistoryChart,null,2))
	//console.log("thisDate:"+thisDate)
	//console.log("userAddress:"+userAddress)
	//console.log("walletAddress:"+walletAddress)

	var foundIt = false;
	for (var p = 0; p < graphData.length; p++) {
		var thisGraphData = graphData[p];
		//console.log("thisGraphDat:"+JSON.stringify(thisGraphData,null,2))
		if (!foundIt) {
			//  addressVars[2] = ProsperoWalletAddress;
			var thisProsperoWalletAddress = thisGraphData["addressVars"][2];
			thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
			//console.log('thisProsperoWalletAddress:'+thisProsperoWalletAddress)
			//console.log('found address ****')
			if (
				thisProsperoWalletAddress == walletAddress &&
				thisGraphData["date"] == thisDate
			) {
				//console.log("found wallet and date")
				var indexOfUser = getIndexOfUser(
					thisGraphData["users"],
					userAddress
				);
				//console.log('indexOfUser:'+indexOfUser)
				if (indexOfUser == -1) {
					//console.log("could not find user")
					//console.error("updateHistoryChartsDataObject indexOfUser==-1")
					dataForHistoryChart[walletAddress].push({
						date: thisDate,
						profit: 0,
						value: 0,
						usdInvested: 0,
					});
					lastUsdInvested = 0;
					lastAddressInPort = thisGraphData["tokens"];
					lastBalancesInPort = thisGraphData["balances"];
					break;
				}
				//THIS IS WRONG - USERVALUES IS NOT RIGHT
				var profit =
					thisGraphData["usersValues"][indexOfUser] -
					thisGraphData["usdInvested"][indexOfUser];
				foundIt = true;
				profit = profit / USD_SCALE;
				//dataForHistoryChart[walletAddress].push(profit)
				lastUsdInvested = thisGraphData["usdInvested"][indexOfUser];
				lastAddressInPort = thisGraphData["tokens"];
				lastBalancesInPort = thisGraphData["balances"];
				//console.log("adding 1 thisDate:"+thisDate)
				dataForHistoryChart[walletAddress].push({
					date: thisDate,
					profit: profit,
					value: thisGraphData["usersValues"][indexOfUser],
					usdInvested: thisGraphData["usdInvested"][indexOfUser],
				});
				break;
			}
		}
	}
	if (!foundIt && lastUsdInvested == 0) {
		dataForHistoryChart[walletAddress].push({
			date: thisDate,
			profit: 0,
			value: 0,
			usdInvested: 0,
		});
		//console.log("adding 2 thisDate:"+thisDate)
	} else if (!foundIt && lastUsdInvested > 0) {
		//console.log("calculating:")
		//console.log("lastUsdInvested  :"+lastUsdInvested)
		//console.log("lastAddressInPort :"+lastAddressInPort)
		//console.log("lastBalancesInPort:"+lastBalancesInPort)
		var totalValue = 0;
		for (var f = 0; f < lastAddressInPort.length; f++) {
			//console.log('f:'+f)
			var addLowerCase = lastAddressInPort[f];
			addLowerCase = addLowerCase.toLowerCase();
			var balance = lastBalancesInPort[f] / USD_SCALE;
			var price = historicalPricesObject[addLowerCase][thisDate];
			//console.log("P here:"+price);
			var value = balance * price;
			//console.log("value:"+value)
			totalValue = totalValue + value;
		}
		//console.log("TV:"+totalValue)
		//console.log("lastUsdInvested:"+lastUsdInvested)
		var profit = totalValue - lastUsdInvested;
		//console.log("profit:"+profit)
		//console.log("adding 3 thisDate:"+thisDate)
		dataForHistoryChart[walletAddress].push({
			date: thisDate,
			profit: profit,
			value: totalValue,
			usdInvested: lastUsdInvested,
		});
	}
}

//withdraw - kachi
//tokenSwappingInto is an array of addresses swapping into, can only be of length 1 or 0.  So if you are
//not swapping into any tokens, just have an empty array - []
async function withdraw(tokenSwappingInto, amountToWithdraw) {
	console.log(
		"withdraw called:" +
			tokenSwappingInto +
			" amountToWithdraw:" +
			amountToWithdraw
	);
	try {
		var valueOfUsersPortfolioBefore = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		console.log(
			"valueOfUsersPortfolio before:" + valueOfUsersPortfolioBefore
		);
		amountToWithdraw = amountToWithdraw * USD_SCALE;
		amountToWithdraw = parseInt(amountToWithdraw);
		console.log("amountScaled:" + amountToWithdraw);
		var otherToken;
		var balSwappingIntoTokenBefore;
		if (tokenSwappingInto.length > 0) {
			otherToken = new web3.eth.Contract(
				ERC20Json.abi,
				tokenSwappingInto[0]
			);
			balSwappingIntoTokenBefore = await otherToken.methods
				.balanceOf(EOAAddress)
				.call();
			console.log("token swapping into:" + tokenSwappingInto[0]);
			//  var usdThisUserThisToken = await getUSDValue_MINE(1, tokenSwappingInto[0])//(usdBn.multipliedBy(percentageUserBn))+""
		}
		if (tokenSwappingInto.length > 1) {
			return {
				success: false,
				error: "You can not swap into multiple tokens.",
			};
		}
		var prosperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			selectedProsperoWalletAddress
		);

		var web3Tx = await prosperoWalletInstance.methods
			.withdraw(amountToWithdraw + "", tokenSwappingInto)
			.send({
				from: EOAAddress,
			})
			.on("error", function (error, receipt) {
				console.log("withdraw error:" + error);
				return { success: false, error: error };
			})
			.on("transactionHash", function (transactionHash) {
				//console.log("transactionhash:"+transactionHash)
			})
			.on("receipt", function (receipt) {
				//console.log("got receipt:"+JSON.stringify(receipt,null,2))
				////console.logreceipt.contractAddress) // contains the new contract address
			})
			.on("confirmation", function (confirmationNumber, receipt) {
				//console.log("receipt conf:"+JSON.stringify(receipt,null,2))
			});
		var cumulativeGasUsed = web3Tx.cumulativeGasUsed;
		var gasUsed = await calculateGasEstimate(cumulativeGasUsed);
		console.log("gasUsed:" + JSON.stringify(gasUsed, null, 2));
		var valueOfUsersPortfolioAfter = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		//console.log("valueOfUsersPortfolioBefore:"+valueOfUsersPortfolioBefore);
		//console.log("valueOfUsersPortfolioAfter :"+valueOfUsersPortfolioAfter);
		var success = false;
		if (
			Number(valueOfUsersPortfolioAfter) <
			Number(valueOfUsersPortfolioBefore)
		) {
			success = true;
		}
		if (!success) {
			console.log(
				"Error withdraw - Value of the portfolio is not less after the withdraw, before value:" +
					valueOfUsersPortfolioBefore +
					" after:" +
					valueOfUsersPortfolioAfter
			);
			return {
				success: false,
				error:
					"Value of the portfolio is not less after the withdraw, before value:" +
					valueOfUsersPortfolioBefore +
					" after:" +
					valueOfUsersPortfolioAfter,
			};
		}

		if (tokenSwappingInto.length == 1) {
			var balSwappingIntoTokenAfter = await otherToken.methods
				.balanceOf(EOAAddress)
				.call();
			balSwappingIntoTokenBefore = BigNumber(
				balSwappingIntoTokenBefore + ""
			);
			balSwappingIntoTokenAfter = BigNumber(balSwappingIntoTokenAfter + "");
			var successWithdrawSwap = false;
			if (
				balSwappingIntoTokenAfter.isGreaterThan(balSwappingIntoTokenBefore)
			) {
				successWithdrawSwap = true;
			}
			if (!successWithdrawSwap) {
				console.log(
					"balSwappingIntoTokenBefore:" + balSwappingIntoTokenBefore
				);
				console.log(
					"balSwappingIntoTokenAfter :" + balSwappingIntoTokenAfter
				);
				console.log("withdrawAmt              :" + amountToWithdraw);
				var msg =
					"Withdraw swap was not successfull, balances did not change.";
				console.log(msg);
				return { success: false, error: msg };
			}
		}
		return { success: true, gasUsed: gasUsed };
	} catch (e) {
		console.log("exception in withdraw" + e);
		return { success: false, error: e };
	}
}

//for manage portfolio (rebalanceing) - kachi
//tokenAddressesToRemix is an array of string token addresses
//percentages is an array of percentages allocations [33, 67]
async function rebalance(percentages, tokenAddressesToRemix) {
	console.log(
		"rebalance percentagesIn:" +
			percentages +
			" tokenAddressesToRemix:" +
			tokenAddressesToRemix
	);
	var thisWalletsObjBefore =
		await getValueOfBalancesOfTokensInPortfolioForUser(
			null,
			EOAAddress,
			selectedProsperoWalletAddress
		);
	console.log(
		" thisWalletsObjBefore:" + JSON.stringify(thisWalletsObjBefore, null, 2)
	);
	var areDiff = returnTrueIfPercentagesAreDiff(
		thisWalletsObjBefore,
		percentages,
		tokenAddressesToRemix
	);
	if (!areDiff) {
		console.log("Goal tokens and percentages are the same as current.");
		return {
			success: false,
			error: "Goal tokens and percentages are the same as current.",
		};
	}
	var totalPerc = 0;
	for (var x = 0; x < percentages.length; x++) {
		totalPerc = totalPerc + percentages[x];
	}
	if (totalPerc != 100) {
		var msg = "Percentages do not add up to 100.";
		console.log(msg);
		return { success: false, error: msg };
	}
	try {
		for (var x = 0; x < percentages.length; x++) {
			percentages[x] = percentages[x] / 100;
			//console.log("percentages[x]:"+percentages[x])
			var thisPercBn = BigNumber(percentages[x] + "");
			//console.log("thisPercBn:"+thisPercBn)
			var percScaleBn = BigNumber(USD_SCALE + "");
			//console.log("percScaleBn:"+percScaleBn)
			var thisFinalPerc = thisPercBn.multipliedBy(percScaleBn);
			//console.log("thisFinalPerc:"+thisFinalPerc)
			percentages[x] = thisFinalPerc;
		}
		console.log("percentages formatted:" + percentages);
		var prosperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			selectedProsperoWalletAddress
		);
		var web3Tx = await prosperoWalletInstance.methods
			.rebalancePortfolio(tokenAddressesToRemix, percentages)
			.send({
				from: EOAAddress,
			})
			.on("error", function (error, receipt) {
				console.log("error rebalancePortfolio:" + error);
				return { success: false, error: error };
			})
			.on("transactionHash", function (transactionHash) {
				//console.log("transactionhash:"+transactionHash)
			})
			.on("receipt", function (receipt) {
				//console.log("got receipt:"+JSON.stringify(receipt,null,2))
				////console.logreceipt.contractAddress) // contains the new contract address
			})
			.on("confirmation", function (confirmationNumber, receipt) {
				//console.log("receipt conf:"+JSON.stringify(receipt,null,2))
			});
		var cumulativeGasUsed = web3Tx.cumulativeGasUsed;
		var gasUsed = await calculateGasEstimate(cumulativeGasUsed);
		console.log("gasUsed:" + JSON.stringify(gasUsed, null, 2));

		var thisWalletsObj = await getValueOfBalancesOfTokensInPortfolioForUser(
			null,
			EOAAddress,
			selectedProsperoWalletAddress
		);
		//console.log('thisWalletsObj:'+JSON.stringify(thisWalletsObj,null,2))
		var areGoalPercentagesAndActualClose =
			await returnTrueIfPercentagesAreLessAndClose(
				thisWalletsObj,
				percentages,
				tokenAddressesToRemix
			);
		if (!areGoalPercentagesAndActualClose) {
			console.log("Current percentages do not match goal percentages.");

			return {
				success: false,
				error: "Current percentages do not match goal percentages.",
			};
		}
		return { success: true, gasUsed: gasUsed };
	} catch (exception) {
		console.error(
			"exception rebalance():" + JSON.stringify(exception, null, 2)
		);
		console.error("exception rebalance():" + exception);
		return { success: false, error: exception };
	}
}
async function shouldApprove() {
	//console.log("shouldApprove called");
	var total = 0;
	var numberOfDeposits = 0;
	var tokens = [];
	var amounts = [];
	var avaxValue = 0;
	for (var i = 0; i < balancesInEoa.length; i++) {
		var thisDepositingObj = balancesInEoa[i];
		//console.log('thisDepositingObj:'+JSON.stringify(thisDepositingObj,null,2))
		var usdAmountEnteredByUser = thisDepositingObj["usdAmountEnteredByUser"];
		usdAmountEnteredByUser = Number(usdAmountEnteredByUser);
		if (usdAmountEnteredByUser > 0) {
			//console.log('thisDepositingObj.name:'+thisDepositingObj.name)
			//var weiAmount = await getWeiAmount(usdAmountEnteredByUser, thisDepositingObj.address)
			var amountInEth = usdAmountEnteredByUser / thisDepositingObj.price;
			amountInEth = amountInEth.toFixed(16);
			//console.log('amountInEth:'+amountInEth)
			var weiAmt = web3.utils.toWei(amountInEth + "", "ether");
			//console.log('weiAmt1:'+weiAmt)
			weiAmt = await updateBalanceFromEighteenDecimalsIfNeeded(
				weiAmt,
				thisDepositingObj.address
			);
			//console.log('weiAmt2:'+weiAmt)
			if (thisDepositingObj.name == NativeTokenName) {
				// //console.log("WEI:"+thisDepositingObj.weiDepositing)
				avaxValue = weiAmt + "";
			} else {
				tokens.push(thisDepositingObj.address);
				amounts.push(weiAmt + "");
			}
		}
	}
	var shouldApprove = await shouldApproveDepositing(
		tokens,
		amounts,
		selectedProsperoWalletAddress
	); //UPDATE
	return shouldApprove;
}
async function deposit() {
	//await getInfoSubnetHelperContract();
	console.log("deposit");
	//TESTING
	var total = 0;
	var numberOfDeposits = 0;
	var tokens = [];
	var amounts = [];
	var avaxValue = 0;
	var foundOneAmtAboveZero = false;
	for (var i = 0; i < balancesInEoa.length; i++) {
		var thisDepositingObj = balancesInEoa[i];
		console.log(
			"thisDepositingObj:" + JSON.stringify(thisDepositingObj, null, 2)
		);
		var usdAmountEnteredByUser = thisDepositingObj["usdAmountEnteredByUser"];
		usdAmountEnteredByUser = Number(usdAmountEnteredByUser);
		if (usdAmountEnteredByUser > 0) {
			console.log("thisDepositingObj.name:" + thisDepositingObj.name);
			//var weiAmount = await getWeiAmount(usdAmountEnteredByUser, thisDepositingObj.address)
			var amountInEth = usdAmountEnteredByUser / thisDepositingObj.price;
			amountInEth = amountInEth.toFixed(16);
			console.log("amountInEth:" + amountInEth);
			var weiAmt = web3.utils.toWei(amountInEth + "", "ether");
			console.log("weiAmt1:" + weiAmt);
			weiAmt = await updateBalanceFromEighteenDecimalsIfNeeded(
				weiAmt,
				thisDepositingObj.address
			);
			console.log("weiAmt2:" + weiAmt);
			if (thisDepositingObj.name == NativeTokenName) {
				//console.log("WEI:"+thisDepositingObj.weiDepositing)
				avaxValue = weiAmt + "";
			} else {
				tokens.push(thisDepositingObj.address);
				amounts.push(weiAmt + "");
			}
			foundOneAmtAboveZero = true;
		}
	}
	if (!foundOneAmtAboveZero) {
		console.log("Use did not enter any amounts to be deposited.");
		return {
			success: false,
			error: "You did not enter any amounts to be deposited.",
		};
	}
	//await getAmountsDepositing();
	//add tokens and amountss
	var shouldApproveTheTokens = await shouldApprove();
	if (shouldApproveTheTokens) {
		console.log("SHOW APPROVE DIALOUGE");
		var status = await approveDepositing(
			tokens,
			amounts,
			selectedProsperoWalletAddress
		); //UPDATE
		if (!status.success) {
			return status;
		}
	} else {
		console.log("Nothing to approve, everything good");
	}

	var gasEstimate;
	var shouldJustDeposit = 0;
	var firstTimeString = "";
	var methodType = 0;
	console.log("tokens:" + tokens);
	console.log("amounts:" + amounts);
	console.log("avaxValue:" + avaxValue);
	console.log("methodType:" + methodType);
	try {
		var valueOfUsersPortfolioBefore = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		var status = await depositContract(
			tokens,
			amounts,
			methodType,
			avaxValue,
			selectedProsperoWalletAddress
		);
		if (!status.success) {
			return status;
		}
		/*var prosperoWalletInstance = await new ethers.Contract(selectedProsperoWalletAddress, ProsperoWalletJson.abi,  ethersSigner);
   //console.log("about to dep...")
    var tx = await prosperoWalletInstance.deposit(
      tokens,
      amounts,
      methodType,
      {
        value:avaxValue+""
      }
    );
   //console.log("dep tx 1:"+JSON.stringify(tx,null,2))
    var f = await tx.wait();
   //console.log("dep tx 2 :"+JSON.stringify(f,null,2))
    var cumulativeGasUsed = f.cumulativeGasUsed;
    var gasUsed = await calculateGasEstimate(cumulativeGasUsed);
   //console.log("gasUsed:"+JSON.stringify(gasUsed,null,2))
    */
		var valueOfUsersPortfolioAfter = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		var success = false;
		if (
			Number(valueOfUsersPortfolioAfter) >
			Number(valueOfUsersPortfolioBefore)
		) {
			success = true;
		}
		if (!success) {
			return {
				success: false,
				error:
					"Value of the portfolio is not more after the deposit, before value:" +
					valueOfUsersPortfolioBefore +
					" after:" +
					valueOfUsersPortfolioAfter,
			};
		}
		return status;
	} catch (exception) {
		console.error("exception deposit:" + JSON.stringify(exception, null, 2));
		console.error("exception deposit:" + exception);
		return { success: false, error: exception };
	}
}
async function depositContract(
	tokens,
	amounts,
	methodType,
	avaxValue,
	selectedProsperoWalletAddress
) {
	var gasUsed = {};
	try {
		var prosperoWalletInstance = await new ethers.Contract(
			selectedProsperoWalletAddress,
			ProsperoWalletJson.abi,
			ethersSigner
		);
		var tx = await prosperoWalletInstance.deposit(
			tokens,
			amounts,
			methodType,
			{
				value: avaxValue + "",
			}
		);
		console.log("dep tx 1:" + JSON.stringify(tx, null, 2));
		var f = await tx.wait();
		console.log("dep tx 2 :" + JSON.stringify(f, null, 2));
		var cumulativeGasUsed = f.cumulativeGasUsed;
		gasUsed = await calculateGasEstimate(cumulativeGasUsed);
		console.log("gasUsed:" + JSON.stringify(gasUsed, null, 2));
	} catch (exception) {
		console.error("exception depositContract:" + exception);
		return { success: false, error: exception };
	}
	return { success: true, gasUsed: gasUsed };
}

async function calculateGasEstimate(gasEstimate, gasPriceToUse) {
	////console.log'calculateGasEstimate')
	//console.log("gasEstimate:"+gasEstimate)
	var estimatedGasBigNumber = BigNumber(gasEstimate + "");
	if (gasPriceToUse != undefined) {
		GAS_PRICE = gasPriceToUse;
	} else {
		GAS_PRICE = await web3.eth.getGasPrice();
	}
	//serverResponse = await postData("https://api.avax.network/ext/bc/C/rpc", {method:"eth_baseFee", id:1});
	//feeHex = serverResponse.result
	//eth_baseFee = parseInt(feeHex,16)
	////console.log'eth_baseFee:'+eth_baseFee)

	//GAS_PRICE=eth_baseFee;
	//console.log("GAS_PRICE NOW:"+GAS_PRICE)
	var estimatedGasCostWei = estimatedGasBigNumber.multipliedBy(GAS_PRICE + "");
	console.log("Estimate calculateGasEstimate wei:" + estimatedGasCostWei);
	var estimatedCostInEth = ethers.utils.formatEther(estimatedGasCostWei + "");
	//console.log("AVAX PRICE:"+avaxPrice)
	var usdAmountOfGas = avaxPrice * estimatedCostInEth;
	console.log("Estimate calculateGasEstimate eth:" + estimatedCostInEth);
	return {
		estimatedGasCostWei: estimatedGasCostWei,
		estimatedCostInEth: estimatedCostInEth,
		usdAmountOfGas: usdAmountOfGas,
	};
}
async function shouldApproveDepositing(
	tokens,
	amounts,
	selectedProsperoWalletAddress
) {
	//console.log("shouldApproveDepositing")
	var zeroBn = BigNumber("0");
	for (var k = 0; k < tokens.length; k++) {
		var thisTokenInstance = await new ethers.Contract(
			tokens[k],
			ERC20Json["abi"],
			ethersSigner
		);
		var allowance = await thisTokenInstance.allowance(
			EOAAddress,
			selectedProsperoWalletAddress
		);
		var bnAllowance = BigNumber(allowance + "");
		var bnAmountInWeiToDeposit = BigNumber(amounts[k] + "");
		//console.log("dep:"+bnAmountInWeiToDeposit)
		//console.log("all:"+bnAllowance)

		if (bnAmountInWeiToDeposit.isGreaterThan(bnAllowance)) {
			//console.log("NOT ENOUGH APPROVED")
			return true;
		}
	}
	return false;
}

async function approveDepositing(
	tokens,
	amounts,
	selectedProsperoWalletAddress
) {
	//console.log("approveDepositing")
	var zeroBn = BigNumber("0");
	for (var k = 0; k < tokens.length; k++) {
		var thisTokenInstance = await new ethers.Contract(
			tokens[k],
			ERC20Json["abi"],
			ethersSigner
		);
		var allowance = await thisTokenInstance.allowance(
			EOAAddress,
			selectedProsperoWalletAddress
		);
		var bnAllowance = BigNumber(allowance + "");
		var bnAmountInWeiToDeposit = BigNumber(amounts[k] + "");
		//console.log("dep:"+bnAmountInWeiToDeposit)
		//console.log("all:"+bnAllowance)

		if (bnAmountInWeiToDeposit.isGreaterThan(bnAllowance)) {
			//console.log("NOT ENOUGH APPROVED")

			try {
				//  var amtToApproveToReachDiff = bnAmountInWeiToDeposit.minus(bnAllowance)
				var amtToApprove = ALOT_APPROVE; // can switch to amtToApprove
				//console.log("need to approve this much:"+amtToApproveToReachDiff+" going to approve:"+amtToApprove);
				//console.log("selectedProsperoWalletAddress:" + selectedProsperoWalletAddress)
				var tx = await thisTokenInstance.approve(
					selectedProsperoWalletAddress,
					amtToApprove + ""
				);
				var f = await tx.wait();
				//console.log("transaction approve returned:"+JSON.stringify(f,null,2)+" for "+thisToken.name)
			} catch (e) {
				return { success: false, error: e };
			}
		}
	}
	return { success: true };
}

async function getBalancesInEoa() {
	console.log("getBalancesInEoa");

	let thisBalancesInEoa = [];
	var totalValue = 0;
	var nativeTokenObj;
	for (var k = 0; k < tokenArray.length; k++) {
		var thisToken = tokenArray[k];

		var thisTokenInstance = await new ethers.Contract(
			tokenArray[k]["address"],
			ERC20Json.abi,
			ethersSigner
		);
		var balance = await thisTokenInstance.balanceOf(EOAAddress);
		var balanceNowBn = BigNumber(balance + "");
		var balanceInEth = ethers.utils.formatEther(balance + "");
		var usdValue = await getUSDValue_MINE(balance + "", thisToken.address);
		totalValue = totalValue + Number(usdValue);
		var thisTokenName = thisToken.name;
		var obj = {
			usdAmountEnteredByUser: 0,
			index: k,
			icon: thisToken.logoURI,
			name: thisTokenName,
			available: usdValue.toFixed(2) + "",
			balance: balance + "",
			balanceInEth: balanceInEth + "",
			price: thisToken.price.toFixed(2),
			address: thisToken.address,
			EOAAddress: EOAAddress,
			decimals: thisToken.decimals,
			isNativeToken: false,
		};
		//console.log("BAL OBJ:"+JSON.stringify(obj,null,2))
		thisBalancesInEoa.push(obj);
	}
	//NATIVE TOKEN, doesn't work with subnet yet
	/*
if (!isSubnet){
  var index = tokenArray.length;
  var balanceAvaxNow = await ethersProvider.getBalance(EOAAddress);
 //console.log('v-2')
  //var usdValueAvax = await getUSDValue_MINE(balanceAvaxNow+"", nativeTokenWrappedAddress)
  var balanceInEthAvax =  ethers.utils.formatEther(balanceAvaxNow+"")
 //console.log('avaxPrice:'+avaxPrice+' balanceInEthAvax:'+balanceInEthAvax)
  var usdValueAvax = avaxPrice * balanceInEthAvax;
 //console.log('usdValueAvax in getBalancesInEoa:'+usdValueAvax)
 //console.log("nativeTokenObj:"+JSON.stringify(nativeTokenObj,null,2))
  var obj = {
    usdAmountEnteredByUser:0,//TESTING - TO DO REMOVE ME....
    index:index,
    icon:nativeTokenObj.logoURI,
    name:NativeTokenName,
    available:usdValueAvax.toFixed(2)+"",
    balance:balance+"",
    balanceInEth:balanceInEth+"",
    price:(nativeTokenObj.price).toFixed(2),
    address:nativeTokenObj.address,
    EOAAddress:EOAAddress,
    decimals:nativeTokenObj.decimals,
    isNativeToken:true
  }
  balancesInEoa.push(obj)
}
*/
	//console.log("balancesInEoa:"+JSON.stringify(balancesInEoa,null,2))
	balancesInEoa = thisBalancesInEoa;
	return thisBalancesInEoa;
}

function updateSelectedWallet(prosperoWalletAddress) {
	console.log("updateSelectedWallet called with:" + prosperoWalletAddress);
	selectedProsperoWalletAddress = prosperoWalletAddress;
  var portfolio = getLeadersPortfolioForAddress(selectedProsperoWalletAddress);
  var leaderAddress = portfolio.leaderEOA;
  leaderAddress = leaderAddress.toLowerCase();
  var myEoaAddress = EOAAddress.toLowerCase();
  if (myEoaAddress == leaderAddress){
   //console.log("updateUIFieldValuesLeaderboard")
    //updateUIFieldValuesLeaderboard();
  }else{
   //console.log("updateUIFieldValuesMyPortfolioMyPortfolio")
    //updateUIFieldValuesMyPortfolioMyPortfolio();
  }
}

async function joinPortfolio() {
	console.log(
		"joingPortfolio called with selectedProsperoWalletAddress:" +
			selectedProsperoWalletAddress
	);
	try {
		var prosperoBeaconFactoryInstance = await new ethers.Contract(
			factoryAddress,
			ProsperoBeaconFactoryJson.abi,
			ethersSigner
		);
		var tx = await prosperoBeaconFactoryInstance.newTrailerWallet(
			selectedProsperoWalletAddress
		);
		var r = await tx.wait();
		console.log("receipt:" + JSON.stringify(r, null, 2));
		return { success: true };
	} catch (e) {
		console.log("Exception joinPortfolio: " + e);
		console.log("Exception joinPortfolio: " + JSON.stringify(e, null, 2));
		return { success: false, error: e };
	}
	return { success: false };
}
async function createPortfolio(walletName, fundFee) {
	console.log(
		"api createPortfolio walletName:" + walletName + " fundFee:" + fundFee
	);
	try {
		var prosperoBeaconFactoryInstance = await new ethers.Contract(
			factoryAddress,
			ProsperoBeaconFactoryJson.abi,
			ethersSigner
		);
		var tx = await prosperoBeaconFactoryInstance.newProsperoWallet(
			walletName
		);
		var r = await tx.wait();
		console.log(
			"created wallet success - tx returned:" + JSON.stringify(r, null, 2)
		);
		if (r.hasOwnProperty("events")) {
			var events = r.events;
			if (events.length > 0) {
				var finishedMethodEvent = events[events.length - 1];
				if (finishedMethodEvent.hasOwnProperty("args")) {
					var args = finishedMethodEvent["args"];
					var prosperoWalletAddressCreated = args[args.length - 1];
					//console.log("got prosperoWalletAddressCreated...")
					return {
						success: true,
						prosperoWalletAddressCreated: prosperoWalletAddressCreated,
					};
				}
			}
		}
		return { success: true, prosperoWalletAddressCreated: null };
	} catch (e) {
		console.log("Exception createPortfolio: " + e);
		console.log("Exception createPortfolio: " + JSON.stringify(e, null, 2));
		return { success: false, error: e };
	}
	return { success: false, error: null };
}
async function initLeaderBoardTableObject() {
	try {
		await createLeaderBoardDataObject();
		console.log(
			"leaderBoardData:" + JSON.stringify(leaderBoardData, null, 2)
		);
		var leaderBoardDataHere = leaderBoardData;
		var tableData = [];
		for (var i = 0; i < leaderBoardDataHere.length; i++) {
			var fee = leaderBoardDataHere[i]["leaderPercentageFee"];
			var profitLeader = leaderBoardDataHere[i]["profitLeader"];
			fee = fee / USD_SCALE;
			fee = fee * 100;
			fee = parseInt(fee);
			fee = fee + "%";
			profitLeader = profitLeader * 100;
			//profitLeader = parseInt(profitLeader);
			//profitLeader = profitLeader.toFixed(2);
			//profitLeader = profitLeader + "%";

			var prosperoWalletAddress =
				leaderBoardDataHere[i].prosperoWalletAddress;
			prosperoWalletAddress = prosperoWalletAddress.toLowerCase();
			var leaderObjForTable = {
				index: i,
				name: leaderBoardDataHere[i]["walletValues"]["walletName"],
				fee: fee,
				d7: 0,
				d30: 0,
				d90: 0,
				y1: profitLeader,
				prosperoWalletAddress: prosperoWalletAddress,
				portfolioObject: leaderBoardDataHere[i],
			};
			tableData.push(leaderObjForTable);
		}
		leaderBoardUITableObject = tableData;
	} catch (e) {
		return { success: false, error: e };
	}
	return { success: true };
}
async function getLeaderBoardDataForTable() {
	console.log(
		"ALL PORTFOLIOS:" +
			JSON.stringify(leaderBoardUITableObject, null, 2)
	);
	return leaderBoardUITableObject;
}

async function getMyPortfoliosDataForTable() {
	console.log(
		"MY PORTFOLIOS:" +
			JSON.stringify(myPortfolioDataForTable, null, 2)
	);
	return myPortfolioDataForTable;
}

async function createLeaderBoardDataObject() {
	//console.log("createLeaderBoardDataObject called");
	var prosperoBeaconFactoryInstance = await new ethers.Contract(
		factoryAddress,
		ProsperoBeaconFactoryJson.abi,
		ethersSigner
	);
	var allLeaderWallets =
		await prosperoBeaconFactoryInstance.getAllProsperoWallets();

	var leaderBoardDataHere = [];
	for (var i = 0; i < allLeaderWallets.length; i++) {
		//console.log("i:"+i)
		var thisLeaderWalletAddress = allLeaderWallets[i].toLowerCase();
		//console.log("***thisLeaderWalletAddress:"+thisLeaderWalletAddress);
		var leaderBoardObject = {};
		var thisLeaderAddress = allLeaderWallets[i];
		//console.log('thisLeaderAddress:'+thisLeaderAddress)
		var walletValues = await getWalletValues(thisLeaderAddress);
		//console.log('walletValues:'+JSON.stringify(walletValues,null,2))
		//var leaderEOA = leaderEOA
		var valueOfLeadersPortfolio = await getValueOfUsersPortfolio(
			thisLeaderAddress,
			leaderEOA
		);
		//async function getValueOfUsersPortfolio(prosperoWalletAddress, usersEOA){
		//console.log('valueOfLeadersPortfolio:'+valueOfLeadersPortfolio)
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			thisLeaderAddress
		);
		var totalUsdInvestedForLeader = await ProsperoWalletInstance.methods
			.getTotalUsdInvestedPerUser(leaderEOA)
			.call({
				from: EOAAddress,
			});
		var allTrailerWallets =
			await prosperoBeaconFactoryInstance.getTrailersFollowingProsperoWallet(
				thisLeaderWalletAddress
			);

		//console.log("allTrailerWallets:"+allTrailerWallets)
		var totalUsdInvestedForLeaderBN = BigNumber(
			totalUsdInvestedForLeader + ""
		);
		var usdScaleBN = BigNumber(USD_SCALE + "");
		var totalUsdInvestedForLeaderNumber = Number(
			totalUsdInvestedForLeaderBN.dividedBy(usdScaleBN) + ""
		);
		//console.log('valueOfLeadersPortfolio:'+valueOfLeadersPortfolio)

		//console.log('totalUsdInvestedForLeaderNumber:'+totalUsdInvestedForLeaderNumber)
		var profitLeader =
			valueOfLeadersPortfolio - totalUsdInvestedForLeaderNumber;
		//console.log('profitLeader:'+profitLeader)

		var leaderBoardObject =
			await getValueOfBalancesOfTokensInPortfolioForUser(
				null,
				leaderEOA,
				thisLeaderWalletAddress
			);

		var profitPercentage = 0;
		if (valueOfLeadersPortfolio != 0) {
			profitPercentage = profitLeader / valueOfLeadersPortfolio;
		}
		leaderBoardObject["prosperoWalletAddress"] = thisLeaderWalletAddress;
		leaderBoardObject["profitLeader"] = profitLeader;
		leaderBoardObject["walletValues"] = walletValues;
		leaderBoardObject["walletName"] = walletValues["walletName"];
		leaderBoardObject["leaderPercentageFee"] =
			walletValues["leaderPercentageFee"];
		leaderBoardObject["prosperoPercentageFeeOfLeader"] =
			walletValues["prosperoPercentageFeeOfLeader"];
		leaderBoardObject["numberOfTrailers"] = allTrailerWallets.length;
		leaderBoardObject["profitPercentage"] = profitPercentage;
		leaderBoardObject["prosperoWalletAddress"] = thisLeaderWalletAddress;
		//leaderBoardObject = {
		//  prosperoWalletAddress:thisLeaderWalletAddress,
		//  balancesValue:balancesValue,
		//  leaderProfit:profitLeader,
		//  walletValues:walletValues,
		//  numberOfTrailer:allTrailerWallets.length,
		//  profitPercentage:profitPercentage
		//}
		leaderBoardDataHere.push(leaderBoardObject);
	}
	leaderBoardDataHere.sort(function (a, b) {
		var keyA = a.profitPercentage,
			keyB = b.profitPercentage;
		// Compare the 2 dates
		if (keyA < keyB) return 1;
		if (keyA > keyB) return -1;
		return 0;
	});
	//console.log("leaderBoardData:"+JSON.stringify(leaderBoardData,null,2))
	leaderBoardData = leaderBoardDataHere;
}
async function getValueOfBalancesOfTokensInPortfolioForUser(
	balancesAndTokensObj,
	user,
	prosperoWalletAddress
) {
	//console.log('--getValueOfBalancesOfTokensInPortfolioForUser user:'+user+' prosperoWalletAddress:'+prosperoWalletAddress+' balancesAndTokensObj:'+JSON.stringify(balancesAndTokensObj,null,2))
	//console.log('balancesAndTokensObj:'+JSON.stringify(balancesAndTokensObj,null,2))
	if (balancesAndTokensObj == null) {
		//console.log('is null')
		balancesAndTokensObj =
			await getBalanacesOfTokensInPortfolioForUserContractCall(
				user,
				prosperoWalletAddress
			);
	}
	var balancesValue = await getValueOfBalancesOfTokensInPortfolio(
		balancesAndTokensObj
	);
	//console.log('balancesValue*:'+JSON.stringify(balancesValue,null,2))

	var ProsperoWalletInstance = new web3.eth.Contract(
		ProsperoWalletJson.abi,
		prosperoWalletAddress
	);
	ProsperoWalletInstance.defaultAccount = user;
	var totalUsd = await ProsperoWalletInstance.methods
		.getTotalUsdInvestedPerUser(user)
		.call({ from: user });
	var valueOfUsersPortfolio = await getValueOfUsersPortfolio(
		prosperoWalletAddress,
		user,
		false
	);
	var percentageUser = await ProsperoWalletInstance.methods
		.getPercentageOwnership(user)
		.call({ from: user });
	//console.log('percentageUser:'+percentageUser)
	percentageUser = percentageUser / USD_SCALE;
	//var percentageUserBn = BigNumber(percentageUser)
	//console.log('percentageUser with USD Scale:'+percentageUser)
	var balancesValueFinal = {};
	balancesValueFinal["totalValue"] = valueOfUsersPortfolio;
	balancesValueFinal["totalUsd"] = totalUsd / USD_SCALE;
	balancesValueFinal["profit"] =
		balancesValueFinal["totalValue"] - balancesValueFinal["totalUsd"];
	var percentageUserBn = BigNumber(percentageUser + "");
	//console.log('percentageUserBn:'+percentageUserBn)
	var totalUsdWholeWallet = 0;
	for (var key in balancesValue) {
		if (balancesValue.hasOwnProperty(key)) {
			//console.log(key + " -> " + balancesValue[key]);
			if (key != "totalValue") {
				var objCopy = {}; //JSON.parse(JSON.stringify(balancesValue[key]))
				var usdBn = BigNumber(balancesValue[key]["usdValue"] + "");
				var balBnScaled = BigNumber(
					balancesValue[key]["balance_scaled"] + ""
				);
				var balBn = BigNumber(balancesValue[key]["balance"] + "");
				//console.log('b*:'+balancesValue[key]['balance'])
				var balThisUserNum = balancesValue[key]["balance"] * percentageUser;
				balThisUserNum = parseInt(balThisUserNum);
				var balNoSciStr;
				if (balThisUserNum < 1) {
					//balNoSciStr = balThisUserNum.toFixed(balThisUserNum.toString().split('-')[1]); //where you split your number, see how many decimals it has and pass that number to .toFixed method
					var e = parseInt(balThisUserNum.toString().split("e-")[1]);
					if (e) {
						balNoSciStr *= Math.pow(10, e - 1);
						balNoSciStr =
							"0." + new Array(e).join("0") + x.toString().substring(2);
					}
				} else {
					balNoSciStr = await toPlainString(balThisUserNum);
				}
				//console.log("balThisUserNum:"+balThisUserNum)
				//console.log("balNoSciStr:"+balNoSciStr)

				var balThisUser = balBn.multipliedBy(percentageUser);
				//totalUsdWholeWallet=totalUsdWholeWallet+usdWholeWalletThisToken
				//console.log('balThisUser:'+balThisUser)
				//console.log('percentageUser:'+percentageUser)
				//console.log('balBnScaled:'+balBnScaled)

				var balThisUserScaled = balBnScaled.multipliedBy(percentageUser);
				balThisUserScaled = balThisUserScaled.integerValue();
				balThisUser = balThisUserScaled.integerValue();
				//console.log('balThisUser:'+balThisUser)

				//console.log('v-3')

				var usdThisUserThisToken = await getUSDValue_MINE(
					balancesValue[key]["balance"],
					key
				); //(usdBn.multipliedBy(percentageUserBn))+""
				//getUSDValue_MINE: async function  (amountInWei, address)
				//console.log('balThisUser:'+balThisUser)
				//console.log('usdThisUserThisToken:'+usdThisUserThisToken)
				objCopy["usdValue"] = Number(usdThisUserThisToken);
				//objCopy['balance_scaled']= balBnScaled.multipliedBy(percentageUserBn)
				//objCopy['balance_scaled']=(objCopy['balance_scaled']).integerValue()
				objCopy["balance"] = balancesValue[key]["balance"];
				if (balancesValueFinal["totalValue"] == 0) {
					objCopy["percentage"] = 0;
				} else {
					objCopy["percentage"] =
						objCopy["usdValue"] / balancesValueFinal["totalValue"];
				}
				//objCopy['percentage']=Number(objCopy['percentage'].toFixed(2))
				var tokenObj = await getTokenObject_newMine(key);
				objCopy["name"] = tokenObj.name;
				objCopy["symbol"] = tokenObj.symbol;
				objCopy["price"] = Number(tokenObj.price);
				objCopy["twentyFourHour"] = tokenObj.twentyFourHour;
				objCopy["image"] = tokenObj.logoURI;
				//objCopy['usdValueLeader']=usdWholeWalletThisToken

				//objCopy['percentage']=percentageUser;
				//objCopy['balancesAndTokensObj']=balancesAndTokensObj
				balancesValueFinal[key] = objCopy;
			}
		}
	}

	//console.log('balancesValueFinal:'+JSON.stringify(balancesValueFinal,null,2))
	return balancesValueFinal;
}
async function getValueOfUsersPortfolio(
	prosperoWalletAddress,
	usersEOA,
	shouldKeepAsBigNumber
) {
	// //console.log(
	//  "getValueOfUsersPortfolio pricesLibraryAddress: "+pricesLibraryAddress+
	//  " prosperoPricesAddress: "+prosperoPricesAddress+
	//  " prosperoWalletAddress: "+prosperoWalletAddress
	//  +" usersEOA: "+usersEOA
	//  +" PricesLibraryJson.abi:"+JSON.stringify(PricesLibraryJson.abi,null,2))
	try {
		var pricesLibraryInstance = new web3.eth.Contract(
			PricesLibraryJson.abi,
			pricesLibraryAddress
		);
		pricesLibraryInstance.defaultAccount = usersEOA;
		var totalValueOfPortfolio = await pricesLibraryInstance.methods
			.getTotalValueOfPortfolio(prosperoWalletAddress, prosperoPricesAddress)
			.call({
				from: usersEOA,
			});

		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			prosperoWalletAddress
		);
		ProsperoWalletInstance.defaultAccount = usersEOA;
		var usersValue = await ProsperoWalletInstance.methods
			.getUsersValue(usersEOA, totalValueOfPortfolio)
			.call({
				from: usersEOA,
			});
		//console.log("usersValue:"+usersValue);
		var bnUv = BigNumber(usersValue);
		if (shouldKeepAsBigNumber == true) {
			return bnUv;
		}
		bnUv = bnUv.dividedBy(USD_SCALE);
		var uvNumber = Number(bnUv + "");
		//console.log("USERS VALUE:"+uvNumber)
		return uvNumber;
	} catch (e) {
		//console.log('exception:'+e)
		return 0;
	}
}
async function getBalanacesOfTokensInPortfolioForUserContractCall(
	user,
	prosperoWalletAddress
) {
	//console.log("getBalanacesOfTokensInPortfolioForUserContractCall")
	try {
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			prosperoWalletAddress
		);
		var tokens = [];
		var balances = [];
		ProsperoWalletInstance.defaultAccount = EOAAddress;
		//console.log("1 calling getPortfolioTokensSize")

		var numberOfTokensInPortfolio = await ProsperoWalletInstance.methods
			.getPortfolioTokensSize()
			.call({ from: EOAAddress });
		//console.log("numberOfTokensInPortfolio:"+numberOfTokensInPortfolio)
		for (var i = 0; i < numberOfTokensInPortfolio; i++) {
			//console.log("I:"+i)
			tokens[i] = await ProsperoWalletInstance.methods
				.portfolioTokens(i)
				.call({ from: EOAAddress });
			//console.log("****TOKEN:"+tokens[i] )
			balances[i] = await ProsperoWalletInstance.methods
				.getBalanceOfTokenInPortfolioForUser(user, tokens[i])
				.call({ from: EOAAddress });
			//console.log("*****BAL:"+balances[i] )
		}
	} catch (e) {
		console.log(
			"error getBalancesOfTokensInPortfolioForUserContractCall - exception: " +
				e
		);
	}
	return { balances: balances, tokens: tokens };
}
async function initializeApi() {
	var status = await initializeBlockchainConnection();
	if (!status.success) {
		console.error(
			"error initializeBlockchainConnection error: " + status.error
		);
		return status;
	}
	await makeRandomColorArray();
	//Initialize functions
	await initializeDataObjects();
}

async function initializeDataObjects() {
 	console.log('gettingGraphData');
	var status = await getGraphData();
	if (!status.success) {
		console.error("error getGraphData: " + status.error);
		return status;
	}


 	//console.log('getBlockNumber');

	blockNumWhenWebAppLaunched = await web3.eth.getBlockNumber();
	//await initNewEventListener();
	//console.log('calling updatePrices');

	status = await updatePrices();
 	//console.log('got prices');
	 console.log('calling convertGraphDataToLeaderBoardAndMyWalletsData');
	 await convertGraphDataToLeaderBoardAndMyWalletsData()
	//console.log('done calling convertGraphDataToLeaderBoardAndMyWalletsData');
	if (!status.success) {
		console.error("error updatePrices: " + status.error);
		return status;
	}
	//status = await initLeaderBoardTableObject();
 	//console.log('got leaderBoardTableObject');

	//if (!status.success) {
	//		console.error("error initLeaderBoardTableObject: " + status.error);
	//		return status;
	//}
	//await createMyWalletsDataAndUIObject();
 	//console.log('called createMyWalletsDataAndUIObject ');

	var port = await getMyWallet();

	//await getHistoricalPricesUpdateChartsData();
 	//console.log('called getHistoricalPricesUpdateChartsData');

	//await getBalancesInEoa();
	console.log('done initializeApi');
	return { success: true };
}

async function initializeBlockchainConnection() {
	console.log("initializeApi");
	var provider = await detectEthereumProvider();
	if (provider !== window.ethereum) {
		// todo: handle multiple wallets
		console.error("Do you have multiple wallets installed?");
		return {
			success: false,
			error: "Do you have multiple wallets installed?",
		};
	}
	//console.log('got provider')
	if (provider) {
		try {
			var accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			if (accounts.length == 0) {
				alert("Accounts is blank - Create a new Metamask Account.");
				return {
					success: false,
					error: "Accounts is blank - Create a new Metamask Account.",
				};
			}
			EOAAddress = accounts[0];
			if (EOAAddress === null || EOAAddress === undefined) {
				alert("Can not connect to wallet");
				return { success: false, error: "Can not connect to wallet" };
			}
			EOAAddress = EOAAddress.toLowerCase();
		} catch (error) {
			if (error.code === 4001) {
				console.error("user rejected request");
				return { success: false, error: "user rejected request" };
			}
			console.error("ERROR:" + error);
			return { success: false, error: "error" };
		}
	} else {
		console.error("Could not find wallet");
		return { success: false, error: "Could not find wallet" };
	}
	//udates selectedProsperoWalletAddres to last wallet on init
	//getMyWallet();
	//console.log('set eoaAddress')
	ethersProvider = await new ethers.providers.Web3Provider(window.ethereum);
	ethersSigner = ethersProvider.getSigner();
	web3 = new Web3(window.ethereum);
	//console.log("got Web3 version", web3.version);

	ethereum.on("accountsChanged", (accounts) => {
		console.error("Accounts changed -- reloading....");
		window.location.reload();
	});
	ethereum.on("disconnect", () => {
		console.error("disconnect called...");
	});
	ethereum.on("connect", () => {
		console.error("connect called...");
	});
	ethereum.on("chainChanged", () => {
		console.error("chain changed...");
	});
	return { success: true };
}
async function updatePrices() {
	try {
		var allAvalancheAddresses = "";
		var allAddresses = [];
		for (var i = 0; i < tokenArray.length; i++) {
			var thisToken = tokenArray[i];
			//if (thisToken.hasOwnProperty("cChainAddress")){
			address = thisToken.cChainAddress;
			//}else{
			//  address = thisToken.address
			//}
			var thisAvalancheAddress = address;
			if (i == 0) {
				allAvalancheAddresses = thisAvalancheAddress;
			} else {
				allAvalancheAddresses =
					allAvalancheAddresses + "%2C" + thisAvalancheAddress;
			}
		}
		//}
		//console.log("allA:"+allAvalancheAddresses)
		var prices = {};
		var pricesUrl =
			"https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=" +
			allAvalancheAddresses +
			"&vs_currencies=usd&include_24hr_change=true";
		//console.log('pricesUrl:'+pricesUrl)
		var pricesResponse = await fetch(pricesUrl);
		prices = await pricesResponse.json();
		//console.log("PRICEs:"+JSON.stringify(prices,null,2))
		for (var i = 0; i < tokenArray.length; i++) {
			var thisToken = tokenArray[i];
			var address = "";
			if (thisToken.hasOwnProperty("cChainAddress")) {
				address = thisToken.cChainAddress;
			} else {
				address = thisToken.address;
			}
			//console.log('address:'+address);
			var anObj = hasOwnPropertyCaseInsensitive(prices, address);
			if (anObj != false) {
				//console.log("anObj:"+JSON.stringify(anObj,null,2))
				var usd = anObj["usd"];
				var twentyFourHour = anObj["usd_24h_change"];
				var twentyFourHourChange = twentyFourHour / 100;
				twentyFourHourChange = twentyFourHourChange * usd;
				if (address == nativeTokenWrappedAddress) {
					nativeTokenPrice = usd;
				}
				tokenArray[i]["twentyFourHour"] = twentyFourHourChange;
			} else {
				//alert('could not find price in coingecko')
				//console.log('***** coould not find price for:'+thisToken.name+" add:"+address)
				tokenArray[i]["coingecko_price"] = 1;
				tokenArray[i]["twentyFourHour"] = 1;
				tokenArray[i]["price"] = 1;
				nativeTokenPrice = 1;
			}
			allAddresses.push(address);
		}
		try {
			allAddresses = [];
			for (var i = 0; i < tokenArray.length; i++) {
				var thisToken = tokenArray[i];
				address = thisToken.address;
				allAddresses.push(address);
			}
			var prosperoPrices = new web3.eth.Contract(
				ProsperoPricesJson.abi,
				prosperoPricesAddress
			);
			var prosperoPrices = await prosperoPrices.methods
				.getPrices(allAddresses)
				.call({ from: EOAAddress });
			for (var i = 0; i < prosperoPrices.length; i++) {
				var prosperoPrice = BigNumber(prosperoPrices[i] + "");
				var usdBN = BigNumber(USD_SCALE + "");
				prosperoPrice = prosperoPrice.dividedBy(usdBN);
				tokenArray[i]["price"] = prosperoPrice;
				var lowerCaseCAdd = tokenArray[i]["cChainAddress"];
				var wavaxLowerC = WAVAX_COIN_ADDRESS.toLowerCase();
				//console.log("lowerCaseCAdd:"+lowerCaseCAdd)
				//console.log("wavaxLowerC  :"+wavaxLowerC)

				if (lowerCaseCAdd == wavaxLowerC) {
					//console.log('setting avax price');
					avaxPrice = prosperoPrice;
				}
			}
		} catch (e) {
			////console.log("updatePricesNew exception1:"+e);
			// alert('Could not get prices from ProsperoPrices, please reload page :'+e)
			return {
				success: false,
				error:
					"Could not get prices from ProsperoPrices, please reload page :" +
					e,
			};
		}
	} catch (e) {
		////console.log("updatePricesNew exception2:"+address)
		// alert('Could not get prices from coingecko, please reload page :'+e)
		return {
			success: false,
			error:
				"Could not get prices from ProsperoPrices, please reload page :" +
				e,
		};
	}
	return { success: true };
}
async function getWalletValues(prosperoWalletAddress) {
	try {
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			prosperoWalletAddress
		);
		var walletValues = await ProsperoWalletInstance.methods
			.getWalletValues()
			.call({
				from: EOAAddress,
			});
		//console.log(" walletValues:"+JSON.stringify(walletValues,null,2))
		var walletValuesJson = {
			ProsperoBeaconFactoryAddress: walletValues[0],
			leaderEOA: walletValues[1],
			prosperoPricesAddress: walletValues[2],
			prosperoDataAddress: walletValues[3],
			prosperoWalletAddress: walletValues[4],
			walletName: walletValues[5],
			profilePictureUrl: walletValues[6],
			totalSupply_percentageOwnership: walletValues[7],
			leaderPercentageFee: walletValues[8],
			prosperoPercentageFeeOfLeader: walletValues[9],
		};
	} catch (e) {
		//console.log('getWalletValues exception:'+e)
		return false;
	}
	return walletValuesJson;
}
function hasOwnPropertyCaseInsensitive(obj, property) {
	var props = [];
	for (var i in obj) if (obj.hasOwnProperty(i)) props.push(i);
	var prop;
	while ((prop = props.pop()))
		if (prop.toLowerCase() === property.toLowerCase()) return obj[prop];
	return false;
}
async function getValueOfBalancesOfTokensInPortfolio(balancesAndTokensObj) {
	//console.log('balancesAndTokensObj:'+JSON.stringify(balancesAndTokensObj,null,2))
	var tokens = balancesAndTokensObj.tokens;
	var balances = balancesAndTokensObj.balances;
	//console.log('tokens:'+JSON.stringify(tokens,null,2))
	var balanceValue = {};
	var totalValue = 0;
	for (var i = 0; i < tokens.length; i++) {
		var balValueObj = {};
		var thisToken = tokens[i];
		thisToken = thisToken.toLowerCase();
		//console.log('thisToken:'+thisToken)
		//var priceOfThisToken = await getUSDValueOfAddress(thisToken)
		//console.log('balances[i]:'+balances[i])
		//console.log("balUpdated:"+bal)
		var usdValue = await getUSDValue_MINE(balances[i], thisToken);
		//var amountInWeiUpScaledForLowDecimalPoints = await updateBalanceToEighteenDecimalsIfNeeded(amountInWei, address)
		//console
		balValueObj["usdValue"] = usdValue;
		balValueObj["balance"] = balances[i];
		balValueObj["balance_scaled"] =
			await updateBalanceToEighteenDecimalsIfNeeded(balances[i], thisToken);

		balanceValue[thisToken] = balValueObj;
		totalValue = totalValue + Number(usdValue + "");
	}
	for (var i = 0; i < tokens.length; i++) {
		var thisToken = tokens[i];
		thisToken = thisToken.toLowerCase();
		var balValueObj = balanceValue[thisToken];
		//console.log("balValueObj.usdValue:"+balValueObj.usdValue)
		balValueObj["percentage"] = balValueObj.usdValue / totalValue;
		balanceValue[thisToken] = balValueObj;
	}
	balanceValue["totalValue"] = totalValue;
	return balanceValue;
}
async function getUSDValue_MINE(amountInWei, address) {
	//console.log("getUSDValue_MINE amountInWei:"+amountInWei+" address:"+address)

	var amountInWeiUpScaledForLowDecimalPoints =
		await updateBalanceToEighteenDecimalsIfNeeded(amountInWei, address);

	var amountInEther = Number(
		ethers.utils.formatEther(amountInWeiUpScaledForLowDecimalPoints + "") + ""
	);
	//console.log("anountInEther:"+amountInEther)

	address = address.toLowerCase();
	//console.log('address:'+address)

	//console.log('amountInE:'+amountInEther)
	if (address == "0x1d308089a2d1ced3f1ce36b1fcaf815b07217be3") {
		return amountInEther * nativeTokenPrice;
	}
	if (address == nativeTokenWrappedAddress) {
		//console.log('isNativeToken')
		return amountInEther * nativeTokenPrice;
		//
	}
	for (var i = 0; i < tokenArray.length; i++) {
		var thisTObj = tokenArray[i];
		var thisAdd = thisTObj["address"];
		thisAdd = thisAdd.toLowerCase();
		//console.log('thisTObj:'+JSON.stringify(thisTObj,null,2))
		if (thisAdd == address) {
			//console.log('found add')
			var thisValue = amountInEther * thisTObj["price"];
			//console.log('thisValue'+thisValue)
			return thisValue;
		}
	}
	alert("COULD NOT FIND PRICE IN getUSDValue_MINE address:" + address);
	console.log("COULD NOT FIND PRICE IN getUSDValue_MINE" + address);
}
async function toPlainString(num) {
	return ("" + +num).replace(
		/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
		function (a, b, c, d, e) {
			return e < 0
				? b + "0." + Array(1 - e - c.length).join(0) + c + d
				: b + c + d + Array(e - d.length + 1).join(0);
		}
	);
}
async function getTokenObject_newMine(tokenAddress) {
	tokenAddress = tokenAddress.toLowerCase();
	if (
		tokenAddress == "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3".toLowerCase()
	) {
		tokenAddress = "0x3f226a80e63c859288b717db124d640c64e6fe66";
	}
	tokenAddress = tokenAddress.toLowerCase();
	for (var i = 0; i < tokenArray.length; i++) {
		var thisAdd = tokenArray[i].address;
		thisAdd = thisAdd.toLowerCase();
		if (thisAdd == tokenAddress) {
			return tokenArray[i];
		}
	}
	console.log(
		"ERROR - could not find token in getTokenObject_newMine tokenAddress:" +
			tokenAddress
	);
}
async function createMyWalletsDataAndUIObject() {
	//console.log('createMyWalletsDataObject factoryAddress:'+factoryAddress+' EOAAddress:'+EOAAddress)
	var prosperoBeaconFactoryInstance = await new ethers.Contract(
		factoryAddress,
		ProsperoBeaconFactoryJson["abi"],
		ethersSigner
	);
	//console.log("got p beacon..")
	var myWalletsFromContract = await prosperoBeaconFactoryInstance.getWallets(
		EOAAddress
	);
	var myWalletTypes = await prosperoBeaconFactoryInstance.getWalletTypes(
		EOAAddress
	);
	//console.log("myWallets***:"+JSON.stringify(myWalletsFromContract,null,2))
	//console.log("myWalletTypes:"+myWalletTypes.length)
	myWallets = {};
	var firstWallet = "";
	for (var i = 0; i < myWalletsFromContract.length; i++) {
		var thisWalletAddress = myWalletsFromContract[i].toLowerCase();
		if (i == 0) {
			firstWallet = thisWalletAddress;
		}
		//console.log('thisWalletAddress:'+thisWalletAddress)
		var thisWalletsObj = await getValueOfBalancesOfTokensInPortfolioForUser(
			null,
			EOAAddress,
			thisWalletAddress
		);
		var walletValues = await getWalletValues(thisWalletAddress);
		//console.log('walletValues:'+JSON.stringify(walletValues,null,2))
		thisWalletsObj["walletValues"] = walletValues;
		thisWalletsObj["wallet_type"] = "Leader";
		//thisWalletsObj['has_inited_event_listener']=false

		thisWalletsObj["prosperoWalletAddress"] = thisWalletAddress;
		//thisWalletsObj = getOtherDataFromLeaderboardObject(thisWalletsObj)
		if (myWalletTypes[i] == 0) {
			thisWalletsObj["wallet_type"] = "Trailer";
		}
		//console.log("thisWalletsObj:"+JSON.stringify(thisWalletsObj,null,2))
		myWallets[thisWalletAddress] = thisWalletsObj;
	}
	console.log("myWallets:" + JSON.stringify(myWallets, null, 2));
	console.log("setting first wallet to prosperoWalletAddress");
	selectedProsperoWalletAddress = firstWallet;
	//myWallets=myWallets;
	await updateMyPortfoliosDataForTable();
}

async function updateMyPortfoliosDataForTable() {
	console.log("updateMyPortfoliosDataForTable");
	//console.log("myPortfoliosDataOverTime:"+JSON.stringify(myPortfoliosDataOverTime,null,2))
	myPortfolioDataForTable = [];
	var cntr = 0;
	for (var prosperoWalletAddress in myWallets) {
		var thisPortfolio = myWallets[prosperoWalletAddress];
		var prospWalletAddressLower = prosperoWalletAddress.toLowerCase();
		//THIS FUNCTION IS WRONG...
		var valuesOfTimeObj = await getValuesOverTimeForMyPortfolioAddress(
			prospWalletAddressLower
		);
		//console.log("valuesOfTimeObj:"+JSON.stringify(valuesOfTimeObj,null,2))
		////console.log("TP:"+JSON.stringify(thisPortfolio,null,2))
		var walletValues = thisPortfolio["walletValues"];
		var name = walletValues["walletName"];
		//console.log("name:"+name)
		var fee = walletValues.leaderPercentageFee;
		fee = fee / USD_SCALE;
		fee = fee * 100;
		fee = fee.toFixed(2);
		var totalUsd = thisPortfolio.totalUsd;
		var profitPercAll = 0;
		if (totalUsd != 0 && thisPortfolio.profit > 0) {
			profitPercAll = thisPortfolio.profit / totalUsd;
			//profitPercAll = profitPercAll.toFixed(2);
			profitPercAll = profitPercAll * 100;
			//profitPercAll = profitPercAll.toFixed(2);
		}
		var prosperoWalletAddressLower = prosperoWalletAddress.toLowerCase();
		var leaderPortfolio = getLeadersPortfolioForAddress(
			prosperoWalletAddressLower
		);
		thisPortfolio["numberOfTrailers"] = leaderPortfolio["numberOfTrailers"];
		var objForTable = {
			index: cntr,
			name: name,
			fee: Number(fee),
			d7: 0,
			d30: 0,
			d90: 0,
			y1: profitPercAll,
			prosperoWalletAddress: prosperoWalletAddressLower,
			portfolioObject: thisPortfolio,
		};
		myPortfolioDataForTable.push(objForTable);
		cntr = cntr + 1;
	}
	//console.log('myPortfolioDataForTable:'+JSON.stringify(myPortfolioDataForTable,null,2))
	//return myPortfolioDataForTable
}

async function getSelectedWalletFromMyWallets_updateSelectedPrspWalletAdd() {
	//var selectedProsperoWalletAddress=selectedProsperoWalletAddress
	//console.log("getSelectedWalletFromMyWallets_updateSelectedPrspWalletAdd selectedProsperoWalletAddress:"+selectedProsperoWalletAddress)
	var thisPortfolio = null;
	if (
		selectedProsperoWalletAddress != undefined &&
		selectedProsperoWalletAddress != null &&
		selectedProsperoWalletAddress != ""
	) {
		if (myWallets.hasOwnProperty(selectedProsperoWalletAddress)) {
			//console.log('has it')
			thisPortfolio = myWallets[selectedProsperoWalletAddress];
		}
	}
	if (thisPortfolio == null) {
		//console.log("myWallets does not have:"+selectedProsperoWalletAddress+" going with the last one.")
		//console.log("myWallets:"+JSON.stringify(myWallets,null,2))

		for (var key in myWallets) {
			if (myWallets.hasOwnProperty(key)) {
				thisPortfolio = myWallets[key];
			}
			selectedProsperoWalletAddress = key.toLowerCase();
		}
	}
	//console.log("--selectedProsperoWalletAddress:"+selectedProsperoWalletAddress)
	//console.log('returning:'+JSON.stringify(thisPortfolio,null,2))
	return thisPortfolio;
}
async function updateBalanceToEighteenDecimalsIfNeeded(balance, tokenAddress) {
	if (tokenAddress == "0x1d308089a2d1ced3f1ce36b1fcaf815b07217be3") {
		return balance;
	}
	for (var i = 0; i < tokenArray.length; i++) {
		tokenAddress = tokenAddress.toLowerCase();
		var thisA = tokenArray[i]["address"].toLowerCase();
		var thisACChainAddress = tokenArray[i]["cChainAddress"].toLowerCase();

		if (thisA == tokenAddress || tokenAddress == thisACChainAddress) {
			if (tokenArray[i]["decimals"] == 18) {
				return balance;
			} else {
				var diff = 18 - tokenArray[i]["decimals"];
				var diffPower = Math.pow(10, diff);
				var diffPowerBn = BigNumber(diffPower + "");
				var balBn = BigNumber(balance);
				//console.log("diffPower:"+diffPower)
				var balDiff = diffPowerBn.multipliedBy(balBn);
				//console.log("balDiff:"+balDiff)
				return balDiff;
			}
		}
	}
	console.log(
		"ERROR - could not find token in updateBalanceToEighteenDecimalsIfNeeded for address: " +
			tokenAddress
	);
	alert(
		"ERROR - could not find token in updateBalanceToEighteenDecimalsIfNeeded for address: " +
			tokenAddress
	);
}
async function updateBalanceFromEighteenDecimalsIfNeeded(
	balance,
	tokenAddress
) {
	for (var i = 0; i < tokenArray.length; i++) {
		tokenAddress = tokenAddress.toLowerCase();
		if (tokenArray[i]["address"] == tokenAddress) {
			if (tokenArray[i]["decimals"] == 18) {
				return balance;
			} else {
				var diff = 18 - tokenArray[i]["decimals"];
				var diffPower = Math.pow(10, diff);
				var diffPowerBn = BigNumber(diffPower + "");
				var balBn = BigNumber(balance);
				//console.log("diffPower:"+diffPower)
				var balDiff = diffPowerBn.dividedBy(balBn);
				//console.log("balDiff:"+balDiff)
				balDiff = balDiff.integerValue();
				return balDiff;
			}
		}
	}
	console.log(
		"ERROR - could not find token in updateBalanceFromEighteenDecimalsIfNeeded for address: " +
			tokenAddress
	);
	alert(
		"ERROR - could not find token in updateBalanceFromEighteenDecimalsIfNeeded for address: " +
			tokenAddress
	);
}

function areTokensAndBalanacesDifferent(
	balancesAndTokensBefore,
	balancesAndTokensAfter
) {
	var balBefore = balancesAndTokensBefore.balances;
	var balAfter = balancesAndTokensAfter.balances;
	var tokBefore = balancesAndTokensBefore.tokens;
	var tokAfter = balancesAndTokensAfter.tokens;
	if (balBefore.length != balAfter.length) {
		return true;
	}
	if (tokBefore.length != tokAfter.length) {
		return true;
	}
	for (var j = 0; j < balBefore.length; j++) {
		if (balBefore[j] != balAfter[j]) {
			return true;
		}
		if (tokBefore[j] != tokAfter[j]) {
			return true;
		}
		//console.log("before Token:"+balancesAndTokensBefore['tokens'][j])
		//console.log("before   bal:"+balancesAndTokensBefore['balances'][j])
		//console.log("after  Token:"+balancesAndTokensAfter['tokens'][j])
		//console.log("after bal:"+balancesAndTokensAfter['balances'][j])
	}
	return false;
}

async function getBalanacesOfTokensInPortfolioForUser(
	user,
	thisProsperoWalletAddress
) {
	try {
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			thisProsperoWalletAddress
		);
		var tokens = [];
		var balances = [];
		ProsperoWalletInstance.defaultAccount = user;
		var numberOfTokensInPortfolio = await ProsperoWalletInstance.methods
			.getPortfolioTokensSize()
			.call({ from: accounts[1].address });
		//console.log("numberOfTokensInPortfolio:"+numberOfTokensInPortfolio)
		for (var i = 0; i < numberOfTokensInPortfolio; i++) {
			tokens[i] = await ProsperoWalletInstance.methods
				.portfolioTokens(i)
				.call({ from: accounts[1].address });
			//console.log("TOKEN:"+tokens[i] )
			balances[i] = await ProsperoWalletInstance.methods
				.getBalanceOfTokenInPortfolioForUser(user, tokens[i])
				.call({ from: accounts[1].address });
			//console.log("****BAL:"+balances[i] )
		}
	} catch (e) {
		console.log("exception getBalanacesOfTokensInPortfolioForUser:" + e);
		return { success: false, error: e };
	}
	return { balances: balances, tokens: tokens };
}

async function returnTrueIfPercentagesAreLessAndClose(
	balancesValue,
	goalPercentages,
	goalTokens
) {
	//console.log("balancesValue:"+JSON.stringify(balancesValue,null,2))
	//console.log('gp:'+goalPercentages)
	//console.log('gt:'+goalTokens)
	for (var i = 0; i < goalTokens.length; i++) {
		var thisToken = goalTokens[i];
		thisToken = thisToken.toLowerCase();
		//console.log('thisToken:'+thisToken)
		var thisPerc = goalPercentages[i];
		thisPerc = thisPerc / USD_SCALE;
		if (balancesValue.hasOwnProperty(thisToken)) {
			var thisObj = balancesValue[thisToken];
			var actualPercentage = thisObj["percentage"];
			//actualPercentage=actualPercentage/USD_SCALE
			var diff = thisPerc - actualPercentage;
			//console.log('thisPerc        :'+thisPerc)
			//console.log('actualPercentage:'+actualPercentage)
			diff = Math.abs(diff);
			//console.log('diff:'+diff)
			if (actualPercentage < thisPerc) {
				if (diff < 0.015) {
					//To do - get this number from constants in contract
					//return true
				} else {
					console.log(
						"**** Percentage for swap was off by more than 1.5%, difference is:" +
							diff +
							" for address:" +
							thisToken
					);
					alert(
						"**** Percentage for swap was off by more than 1.5%, difference is:" +
							diff +
							" for address:" +
							thisToken
					);
					return false;
				}
			}
		} else {
			console.log(
				"ERROR - could not find token returnTrueIfPercentagesAreLessAndClose"
			);
			return false;
		}
	}
	return true;
}
function returnTrueIfPercentagesAreDiff(
	balancesValue,
	goalPercentages,
	goalTokens
) {
	//console.log("balancesValue:"+JSON.stringify(balancesValue,null,2))
	//console.log('gp:'+goalPercentages)
	//console.log('gt:'+goalTokens)
	var areDiff = false;
	for (var i = 0; i < goalTokens.length; i++) {
		var thisToken = goalTokens[i];
		thisToken = thisToken.toLowerCase();
		//console.log('thisToken:'+thisToken)
		var thisPerc = goalPercentages[i];
		thisPerc = thisPerc / 100;
		if (balancesValue.hasOwnProperty(thisToken)) {
			var thisObj = balancesValue[thisToken];
			var actualPercentage = thisObj["percentage"];
			actualPercentage = Number(actualPercentage.toFixed(2));
			//actualPercentage=actualPercentage/USD_SCALE
			var diff = thisPerc - actualPercentage;
			//console.log('thisPerc        :'+thisPerc)
			//console.log('actualPercentage:'+actualPercentage)
			diff = Math.abs(diff);
			//console.log('diff:'+diff)
			if (actualPercentage != thisPerc) {
				//console.log("diff 1")
				areDiff = true;
			}
		} else {
			//console.log("diff 2")
			areDiff = true;
		}
	}
	//console.log("returning: "+areDiff)

	return areDiff;
}
async function makeRandomColorArray() {
	//var randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
	for (var i = 0; i < tokenArray.length; i++) {
		var randomRGB = `rgb(${Math.floor(
			Math.random() * (235 - 52 + 1) + 52
		)}, ${Math.floor(Math.random() * (235 - 52 + 1) + 52)}, ${Math.floor(
			Math.random() * (235 - 52 + 1) + 52
		)})`;
		tokenArray[i]["color"] = randomRGB;
		//console.log("COLOR:"+DApp.tokenArray[i]['color'])
	}
}
export {
	getLeadersPortfolioForAddress,
	getLeaderBoardDataForTable,
	initializeApi,
	joinPortfolio,
	createPortfolio,
	getBalancesInEoa,
	deposit,
	updateAmount,
	rebalance,
	withdraw,
	getGraphData,
	getHistoricalPricesUpdateChartsData,
	getWithdrawTableData,
	getChartDataSelectedMyPortfolio,
	getChartDataSelectedLeader,
	depositContract,
	getValuesOverTimeForLeaderAddress,
	getValuesOverTimeForMyPortfolioAddress,
	getValuesOverTimeForLinechartMyPortfolioAddress,
	getMyPortfoliosDataForTable,
	shouldApprove,
	createPortfolioThenDeposit,
	updateSelectedWallet,
	updateUIStatus,
	updateNewWalletVariables,
	handleDepositType,
	getTokenListForManageUI,
	updateApiTokenList,
};
