//CONTRACTS VARIABLES:
var contractVariables = require("./apiLib/ContractVariables.json");
var wavaxAddressFakeFuji = contractVariables.wavaxAddressFakeFuji;
var factoryAddress = contractVariables.factoryAddress;
var prosperoPricesAddress = contractVariables.prosperoPricesAddress;
var pricesLibraryAddress = contractVariables.pricesLibraryAddress;
var subnetHelperContractAddress = contractVariables.subnetHelperContractAddress;
var SnowtraceDeploymentLocation = "https://testnet.snowtrace.io/tx/"; //To do - automatically set
//OBJECTS
var leaderBoardData = []; //leader board portfolios
var myWallets = {}; //my wallets either as a portfolio manager or investor
var historicalPricesObject = {}; //historical prices for tokens
var tokenArray = require("./apiLib/Tokens.json"); //set of tokens we use
var balancesInEoa = []; //used in deposits
var eventBlocksAlreadyHandledLatestBalances = [];
var eventBlocksAlreadyHandledFinishedMethod = []; //to do - remove me?  Unused?
var depositsAndWithdrawals = [];
var withdrawTableData = []; //for withdraw table
var leaderBoardDataOverTime = {}; //historical chart data leaderboard
var myPortfoliosDataOverTime = {}; //historical chart data my portfolios
var latestPrices = {}; //tokens address : price
var withdrawDepositDataForHistory = [];
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
var myHoldingsTotal = 0; //My Holdings - what everything I have is worth
var myUSDDepositsTotal = 0;
var myROITotal = 0;
var myROITotalPercentage = 0;
var myWithdrawTotals = 0;
var ShouldShowConsoleOutput = true;
//UI Objects - keys changed and formatted for UI
var leaderBoardUITableObject;
var myPortfolioDataForTable;
var newWalletObject;
var prosperoFactoryEventsInstance = null;
const appropriateChainId = "0xa869";

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

function getIndexIgnoreCase(str, arrOfStrs) {
	str = str.toLowerCase();
	for (var i = 0; i < arrOfStrs.length; i++) {
		var thisStr = arrOfStrs[i];
		thisStr = thisStr.toLowerCase();
		if (thisStr == str) {
			return i;
		}
	}
	return -1;
}

//FUNCTIONS
//TO DO:
//get rid of warnings solidity
//recent transactions (see image )
//account history (see image )
//contracts - add no more investors and change % fee for leader
async function convertGraphDataToLeaderBoardAndMyWalletsData() {
	var leaderBoardDataNew = {};
	var leaderBoardDataFinal = [];
	var myWalletsDataFinal = {};

	myPortfolioDataForTable = [];
	//leaderBoardUITableObject=[];
	//leaderBoardData=[];
	var lastUsdDepositedForWithdrawDeposit = 0;
	withdrawDepositDataForHistory = [];
	myWithdrawTotals = 0;
	myHoldingsTotal = 0;

	graphData.sort(function (a, b) {
		var intVarsA = a["intVars"];
		var timeSecondsA = intVarsA[4];
		var intVarsB = b["intVars"];
		var timeSecondsB = intVarsB[4];

		// Compare the 2 dates
		if (timeSecondsA < timeSecondsB) return -1;
		if (timeSecondsA > timeSecondsB) return 1;
		return 0;
	});

	for (var i = 0; i < graphData.length; i++) {
		var graphItem = graphData[i];
		var intVars = graphItem["intVars"];
		var usdInvested = graphItem["usdInvested"];

		//WITHDRAW TOTAL
		var methodType = intVars[0];

		var users = graphItem["users"];
		var msgSender = graphItem["addressVars"][0];
		var leaderAddressHere = graphItem["addressVars"][1];
		var prospWalletAddressHere = graphItem["addressVars"][2];
		prospWalletAddressHere = prospWalletAddressHere.toLowerCase();
		leaderAddressHere = leaderAddressHere.toLowerCase();
		msgSender = msgSender.toLowerCase();
		var eoaALower = EOAAddress.toLowerCase();
		var indexOfUser = -1;

		if (prospWalletAddressHere == selectedProsperoWalletAddress) {
			var lastUsdDepositedUser = BigNumber(0 + "");
			var totalAmountDepositedUser = BigNumber(0 + "");
			var indexOfUserHere = getIndexIgnoreCase(eoaALower, users);
			if (indexOfUserHere != -1) {
				var usdDeposited = BigNumber(usdInvested[indexOfUserHere] + "");
				if (usdDeposited.isGreaterThan(lastUsdDepositedUser)) {
					var amtDeposited = usdDeposited.minus(lastUsdDepositedUser);
					totalAmountDepositedUser = BigNumber(
						amtDeposited.plus(totalAmountDepositedUser) + ""
					);
					//totalAmountDepositedUser = totalAmountDepositedUser;
				}
				//graphItem['totalAmountDepositedUser']=totalAmountDepositedUser;
				lastUsdDepositedUser = BigNumber(usdInvested[indexOfUserHere] + "");
			}
			graphItem["totalAmountDepositedUser"] =
				totalAmountDepositedUser.dividedBy(USD_SCALE) + "";

			if (
				methodType == LEADER_SWAP ||
				methodType == LEADER_STRAIGHT_DEPOSIT
			) {
				var rebalType = "";
				if (methodType == LEADER_SWAP) {
					rebalType = "Manager Rebalance";
				} else if (methodType == LEADER_STRAIGHT_DEPOSIT) {
					rebalType = "Manager Deposit";
				}

				var tx = graphItem["id"];
				tx = tx.substring(0, tx.length - 2);
				tx = SnowtraceDeploymentLocation + tx;
				var t = formatTimeForHistory(graphItem["intVars"][4]);
				var withdrawalDepObject = {
					portfolioName: graphItem["walletName"],
					type: rebalType,
					unixTime: graphItem["intVars"][4],
					time: t.time,
					date: t.date,
					snowtraceLink: tx,
					amount: "-",
					numberOfSwaps: intVars[intVars.length - 2],
					numberOfTransfer: intVars[intVars.length - 1],
				};
				withdrawDepositDataForHistory.push(withdrawalDepObject);
			} else if (msgSender == eoaALower) {
				if (users.indexOf(eoaALower) != -1) {
					indexOfUser = users.indexOf(eoaALower);
				}
				if (users.indexOf(EOAAddress) != -1) {
					indexOfUser = users.indexOf(EOAAddress);
				}
				if (methodType == DEPOSIT_THEN_REBALANCE) {
					if (indexOfUser == -1) {
						// alert("Error - index of user is -1");
					}
					var rebalType = "Deposit";
					//if (indexOfUser != -1) {
					var usdDeposited = usdInvested[indexOfUser];
					//if (usdDeposited > lastUsdDepositedForWithdrawDeposit) {
					//myHoldingsTotal =
					//	myHoldingsTotal + (usdDeposited - lastUsdDepositedForWithdrawDeposit);
					var tx = graphItem["id"];
					tx = tx.substring(0, tx.length - 2);
					tx = SnowtraceDeploymentLocation + tx;

					var t = formatTimeForHistory(graphItem["intVars"][4]);
					var amt =
						(usdDeposited - lastUsdDepositedForWithdrawDeposit) /
						USD_SCALE;
					if (amt < 0) {
						amt = Math.abs(amt);
						amt = "-$" + amt.toFixed(2);
					} else {
						amt = "+$" + amt.toFixed(2);
					}
					var intVars = graphItem["intVars"];
					var withdrawalDepObject = {
						portfolioName: graphItem["walletName"],
						type: rebalType,
						unixTime: graphItem["intVars"][4],
						time: t.time,
						date: t.date,
						snowtraceLink: tx,
						amount: amt,
						numberOfSwaps: intVars[intVars.length - 2],
						numberOfTransfer: intVars[intVars.length - 1],
					};
					withdrawDepositDataForHistory.push(withdrawalDepObject);
					lastUsdDepositedForWithdrawDeposit = usdDeposited;
					//}
					//}
				} else if (
					methodType == WITHDRAW_SWAP ||
					methodType == WITHDRAW_ALL
				) {
					if (indexOfUser == -1) {
						// alert("Error - index of user is -1");
					}
					//if (indexOfUser != -1) {
					var usdDeposited = usdInvested[indexOfUser];
					//if (usdDeposited < lastUsdDepositedForWithdrawDeposit) {
					myWithdrawTotals =
						myWithdrawTotals +
						(lastUsdDepositedForWithdrawDeposit - usdDeposited);
					var tx = graphItem["id"];
					tx = tx.substring(0, tx.length - 2);
					tx = SnowtraceDeploymentLocation + tx;
					var t = formatTimeForHistory(graphItem["intVars"][4]);
					var amt =
						(lastUsdDepositedForWithdrawDeposit - usdDeposited) /
						USD_SCALE;
					if (amt < 0) {
						amt = Math.abs(amt);
						amt = "-$" + amt.toFixed(2);
					} else {
						amt = "+$" + amt.toFixed(2);
					}
					var withdrawalDepObject = {
						portfolioName: graphItem["walletName"],
						type: "Withdrawal",
						unixTime: graphItem["intVars"][4],
						time: t.time,
						date: t.date,
						snowtraceLink: tx,
						amount: amt,
						numberOfSwaps: intVars[intVars.length - 2],
						numberOfTransfer: intVars[intVars.length - 1],
					};
					withdrawDepositDataForHistory.push(withdrawalDepObject);
					lastUsdDepositedForWithdrawDeposit = usdDeposited;

					//}

					//}
				}
			}
		}

		//var methodType = intVars[]
		var thisProsperoWalletAddress = graphItem["addressVars"][2];
		thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
		if (!leaderBoardDataNew.hasOwnProperty(thisProsperoWalletAddress)) {
			leaderBoardDataNew[thisProsperoWalletAddress] = graphItem;
		} else {
			var graphItemWeHaveAlready =
				leaderBoardDataNew[thisProsperoWalletAddress];
			var timeOfOneWeHave = graphItemWeHaveAlready["intVars"][4];
			var timeOfThisOne = graphItem["intVars"][4];

			if (timeOfThisOne > timeOfOneWeHave) {
				leaderBoardDataNew[thisProsperoWalletAddress] = graphItem;
			} else {
			}
		}
	}
	myWithdrawTotals = myWithdrawTotals / USD_SCALE;
	myHoldingsTotal = myHoldingsTotal / USD_SCALE;

	withdrawDepositDataForHistory.sort((a, b) =>
		a.unixTime < b.unixTime ? -1 : 1
	);

	var cntrLB = 0;
	var cntrMyWallets = 0;
	var firstWallet = "";
	myHoldingsTotal = 0;
	myUSDDepositsTotal = 0;
	myROITotal = 0;

	for (var key in leaderBoardDataNew) {
		var leaderBoardDataObject = {};
		var thisProsperoWalletAddress = key;
		var thisGraphItem = leaderBoardDataNew[key];
		var addressVars = thisGraphItem["addressVars"];
		var tokens = thisGraphItem["tokens"];
		var tokenBalances = thisGraphItem["balances"];

		var intVars = thisGraphItem["intVars"];
		var leaderFundFee = intVars[6];

		var prosperoFundFee = intVars[7];
		leaderFundFee = leaderFundFee / USD_SCALE;

		leaderFundFee = leaderFundFee * 100;

		leaderFundFee = parseInt(leaderFundFee);

		prosperoFundFee = prosperoFundFee / USD_SCALE;
		prosperoFundFee = prosperoFundFee * 100;
		prosperoFundFee = parseInt(prosperoFundFee);

		var acceptingNewInvestors = intVars[8];

		if (acceptingNewInvestors == 1) {
			acceptingNewInvestors = true;
		} else {
			acceptingNewInvestors = false;
		}

		var usersInPortfolio = thisGraphItem["users"];
		var leaderAddress = addressVars[1];
		var indexOfLeader = getIndexOfUser(thisGraphItem["users"], leaderAddress);
		leaderAddress = leaderAddress.toLowerCase();
		if (indexOfLeader != 0) {
			console.error("ERROR - Index of leader is not zero - problem....");
			return;
		}

		var leadersUsdInvested =
			thisGraphItem["usdInvested"][indexOfLeader] / USD_SCALE;
		var usersUsdInvested = 0;
		var indexOfUser = getIndexOfUser(thisGraphItem["users"], EOAAddress);
		if (indexOfUser == -1) {
			//user not in this portfolio
		} else {
			usersUsdInvested =
				thisGraphItem["usdInvested"][indexOfUser] / USD_SCALE;
			myUSDDepositsTotal = myUSDDepositsTotal + usersUsdInvested;
			//use IS in this portfolio...to do, add to my wallets.  If user is same as leader, it should be the same object in my
			//wallets
		}

		//var leadersValue = thisGraphItem["usersValues"][indexOfLeader] /  USD_SCALE
		//var profitUsd = leadersValue - leadersUsdInvested;
		var percentageOwnership = thisGraphItem["percentageOwnerships"];
		var leaderPercentage = percentageOwnership[indexOfLeader];
		leaderPercentage = leaderPercentage / USD_SCALE;
		var portfolioObject = {};
		var leadersValue = 0;
		//first calculate leaders value and total value all users for leaderboard
		var usersValue = 0;
		var totalValueAllUsers = 0;
		for (var i = 0; i < tokens.length; i++) {
			//var bal = tokenBalances[i] * leaderPercentage + "";
			//bal=parseInt(bal);
			var bal = multipleBN(tokenBalances[i], leaderPercentage);

			var totalBal = tokenBalances[i];
			var thisTokenAddress = tokens[i];

			var usdThisUserThisToken = await getUSDValue_MINE(
				bal,
				thisTokenAddress
			);

			var totalUsdThisToken = await getUSDValue_MINE(
				totalBal,
				thisTokenAddress
			);
			//usdThisUserThisToken = usdThisUserThisToken * leaderPercentage;
			leadersValue = leadersValue + usdThisUserThisToken;
			totalValueAllUsers = totalValueAllUsers + totalUsdThisToken;
		}

		//only calculate if user is a follower here (not the leader)
		var userPercentage;
		if (indexOfUser >= 0) {
			userPercentage = percentageOwnership[indexOfUser];
			userPercentage = userPercentage / USD_SCALE;
		}
		if (indexOfUser >= 0 && indexOfUser != indexOfLeader) {
			for (var i = 0; i < tokens.length; i++) {
				//var bal = tokenBalances[i] * userPercentage + "";
				//bal=parseInt(bal);
				var bal = multipleBN(tokenBalances[i], userPercentage);
				var thisTokenAddress = tokens[i];

				var usdThisUserThisToken = await getUSDValue_MINE(
					bal,
					thisTokenAddress
				);

				usersValue = usersValue + usdThisUserThisToken;
			}
		}

		//myHoldingsTotal

		if (indexOfUser >= 0) {
			for (var i = 0; i < tokens.length; i++) {
				//var bal = tokenBalances[i] * userPercentage + "";
				var bal = multipleBN(tokenBalances[i], userPercentage);

				var thisTokenAddress = tokens[i];
				var usdThisUserThisToken = await getUSDValue_MINE(
					bal,
					thisTokenAddress
				);

				//usdThisUserThisToken = usdThisUserThisToken * userPercentage;
				myHoldingsTotal = myHoldingsTotal + usdThisUserThisToken;
			}
		}

		for (var i = 0; i < tokens.length; i++) {
			var tokenObj = {};
			var thisTokenAddress = tokens[i];
			thisTokenAddress = thisTokenAddress.toLowerCase();
			//tokenObj["balance"] = tokenBalances[i] * leaderPercentage + "";
			tokenObj["balance"] = multipleBN(tokenBalances[i], leaderPercentage);

			//tokenObj["balance"]=parseInt(tokenObj["balance"])
			var aTokenObject = await getTokenObject_newMine(thisTokenAddress);

			var usdThisUserThisToken = await getUSDValue_MINE(
				tokenObj["balance"],
				thisTokenAddress
			);
			//usdThisUserThisToken = usdThisUserThisToken * leaderPercentage;
			tokenObj["name"] = aTokenObject["name"];
			tokenObj["price"] = aTokenObject["price"];
			tokenObj["usdValue"] = usdThisUserThisToken;
			tokenObj["symbol"] = aTokenObject["symbol"];
			tokenObj["color"] = aTokenObject["color"];
			tokenObj["twentyFourHour"] = aTokenObject["twentyFourHour"];
			tokenObj["image"] = aTokenObject["logoURI"];
			tokenObj["decimals"] = aTokenObject["decimals"];
			tokenObj["percentage"] = tokenObj["usdValue"] / leadersValue;

			if (indexOfUser >= 0 && indexOfUser != indexOfLeader) {
				//only calculate if user is diff than leader and user exists in port
				//tokenObj["balance"] = tokenBalances[i] * userPercentage + "";
				tokenObj["balance"] = multipleBN(tokenBalances[i], userPercentage);

				//tokenObj["balance"]=parseInt(tokenObj["balance"])
				usdThisUserThisToken = await getUSDValue_MINE(
					tokenObj["balance"],
					thisTokenAddress
				);

				//var usdThisUserThisToken = usdThisUserThisToken * userPercentage;

				tokenObj["usdValue"] = usdThisUserThisToken;
				tokenObj["percentage"] = tokenObj["usdValue"] / usersValue;
			}
			portfolioObject[thisTokenAddress] = tokenObj;
		}

		var profitUsd = leadersValue - leadersUsdInvested;
		leaderBoardDataObject["leadersUsdInvested"] = leadersUsdInvested;
		leaderBoardDataObject["leadersValue"] = leadersValue;
		var profitPercentage;
		if (leadersUsdInvested < 1) {
			profitPercentage = 0;
		} else {
			profitPercentage = profitUsd / leadersUsdInvested;
		}
		portfolioObject["totalValue"] = leadersValue;
		portfolioObject["totalUsd"] = leadersUsdInvested;

		var profitLeader = profitUsd;
		var profitPercentageLeader = profitPercentage;

		if (indexOfUser >= 0 && indexOfUser != indexOfLeader) {
			if (usersUsdInvested < 1) {
				profitUsd = 0;
				profitPercentage = 0;
				portfolioObject["totalValue"] = usersValue;
				portfolioObject["totalUsd"] = usersUsdInvested;
				portfolioObject["usersUsdInvested"] = usersUsdInvested;
			} else {
				profitUsd = usersValue - usersUsdInvested;
				profitPercentage = profitUsd / usersUsdInvested;
				portfolioObject["totalValue"] = usersValue;
				portfolioObject["totalUsd"] = usersUsdInvested;
				portfolioObject["usersUsdInvested"] = usersUsdInvested;
			}
		}

		portfolioObject["profit"] = profitUsd;
		if (profitPercentage == 0) {
			leaderBoardDataObject["y1"] = 0;
			leaderBoardDataObject["profitPercentage"] =
				leaderBoardDataObject["y1"];
		} else {
			leaderBoardDataObject["y1"] = profitPercentage.toFixed(2);
			leaderBoardDataObject["profitPercentage"] = profitPercentage;
		}
		leaderBoardDataObject["y1"] = leaderBoardDataObject["y1"] + "%";

		leaderBoardDataObject["name"] = thisGraphItem["walletName"];
		leaderBoardDataObject["fee"] = leaderFundFee; //TO DO - need to add this

		leaderBoardDataObject["d7"] = 0;
		leaderBoardDataObject["d30"] = 0;
		leaderBoardDataObject["d90"] = 0;
		leaderBoardDataObject["prosperoWalletAddress"] =
			thisProsperoWalletAddress;
		leaderBoardDataObject["portfolioObject"] = portfolioObject;
		//Right Here
		leaderBoardDataNew[key]["portfolioObject"] = portfolioObject;

		leaderBoardDataObject["profitLeader"] = profitUsd;
		leaderBoardDataObject["leaderEOA"] = leaderAddress;
		leaderBoardDataObject["walletName"] = thisGraphItem["walletName"];
		leaderBoardDataObject["leaderPercentageFee"] = leaderFundFee; //TO DO - need to add this
		leaderBoardDataObject["leaderPercentageFeeOriginal"] = leaderFundFee; //TO DO - need to add this

		leaderBoardDataObject["prosperoPercentageFeeOfLeader"] = prosperoFundFee; //TO DO - need to add this
		leaderBoardDataObject["numberOfTrailers"] = usersInPortfolio.length;
		leaderBoardDataObject["acceptingNewInvestors"] = acceptingNewInvestors;
		leaderBoardDataObject["acceptingNewInvestorsOriginal"] =
			acceptingNewInvestors;

		//Set leader/trailer/or empty if just a leader wallet that you are not a part of
		if (indexOfUser == indexOfLeader) {
			//EOA is Leader
			leaderBoardDataObject["wallet_type"] = "Leader";
			//leaderBoardDataObject["index"] = cntrMyWallets;//TO DO - need to add this
			//cntrMyWallets=cntrMyWallets+1;
		} else if (indexOfUser > 0) {
			//EOA is trailer
			leaderBoardDataObject["wallet_type"] = "Trailer";
			//leaderBoardDataObject["index"] = cntrMyWallets;//TO DO - need to add this
			//cntrMyWallets=cntrMyWallets+1;
		} else {
			//EOA is not part of this wallet
			leaderBoardDataObject["wallet_type"] = "";
		}

		if (leadersValue > 0) {
			if (firstWallet == "") {
				firstWallet = thisProsperoWalletAddress;
			}
			leaderBoardDataObject["index"] = cntrLB; //TO DO - need to add this
			cntrLB = cntrLB + 1;

			var leaderBoardDataObjectCOPY = JSON.parse(
				JSON.stringify(leaderBoardDataObject)
			);
			leaderBoardDataObjectCOPY["portfolioObject"]["profit"] = profitLeader;
			leaderBoardDataObjectCOPY["portfolioObject"]["totalValue"] =
				totalValueAllUsers;
			//portfolioObject["totalUsd"] = leadersUsdInvested;
			//var profitLeader = profitUsd;
			//var profitPercentageLeader = profitPercentage;
			if (profitPercentageLeader != "-") {
				leaderBoardDataObjectCOPY["y1"] = profitPercentageLeader.toFixed(2);
			}
			//leaderBoardDataObjectCOPY["y1"]  = leaderBoardDataObjectCOPY["y1"]  + "%";
			leaderBoardDataObjectCOPY["profitPercentage"] = profitPercentageLeader;
			//leaderBoardDataObject
			//RIGHT HERE ***
			//if (leaderPercentage == 0){
			//	leaderBoardDataObjectCOPY["portfolioObject"] = {}
			//}
			leaderBoardDataFinal.push(leaderBoardDataObjectCOPY);
		} else {
		}

		if (indexOfUser >= 0) {
			if (userPercentage == 0) {
				leaderBoardDataObjectCOPY["portfolioObject"] = {};
			}
			myWalletsDataFinal[thisProsperoWalletAddress] = leaderBoardDataObject;
			myPortfolioDataForTable.push(leaderBoardDataObject);
		}
	}
	//selectedProsperoWalletAddress = firstWallet;

	myWallets = myWalletsDataFinal;

	//leaderBoardUITableObject = leaderBoardDataFinal;
	leaderBoardData = leaderBoardDataFinal;

	var dupesCheck = [];

	for (var i = 0; i < leaderBoardData.length; i++) {
		var thisObj = leaderBoardData[i];

		var prospAd = thisObj.prosperoWalletAddress;
		prospAd = prospAd.toLowerCase();
		if (dupesCheck.indexOf(prospAd) > -1) {
			console.error("Error - DUPE!!!!");
		}
		dupesCheck.push(prospAd);
	}
	dupesCheck = [];

	for (var i = 0; i < myPortfolioDataForTable.length; i++) {
		var thisObj = myPortfolioDataForTable[i];

		var prospAd = thisObj.prosperoWalletAddress;
		prospAd = prospAd.toLowerCase();
		if (dupesCheck.indexOf(prospAd) > -1) {
			console.error("DUPE!!!!");
		}
		dupesCheck.push(prospAd);
	}

	myROITotal = myHoldingsTotal - myUSDDepositsTotal;
	myROITotalPercentage = myROITotal / myUSDDepositsTotal;
}

async function calcNewProfitsForLeaders() {
	for (var i = 0; i < graphData.length; i++) {
		var thisGraphItem = graphData[i];
		var addressVars = thisGraphItem["addressVars"];
		var tokens = thisGraphItem["tokens"];
		var tokenBalances = thisGraphItem["balances"];
		var intVars = thisGraphItem["intVars"];
		var thisTime = intVars[4];
		var date = new Date(thisTime * 1000);
		var datePart = date.toLocaleDateString("en-US");
		datePart = datePart.replaceAll("/", "-");

		thisGraphItem["date"] = datePart;
		for (var j = 0; j < tokens.length; j++) {
			var addLowerCase = tokens[j];
			addLowerCase = addLowerCase.toLowerCase();
			var priceNowOfToken = historicalPricesObject[addLowerCase][datePart];
		}
	}
}

//Variables just used below, to do, fix?
var lastUsdInvested = 0;
var lastBalancesInPort = [];
var lastAddressInPort = [];
var lineGraphCalcData = {};
async function getHistoricalPricesUpdateChartsData() {
	lastUsdInvested = 0;
	lastBalancesInPort = [];
	lastAddressInPort = [];
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

	var now = new Date(formatter.format(new Date()));
	var nowFloored = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	nowFloored = nowFloored.getTime() / 1000;

	//Only get Coingecko data if we need it, then store it in local storage so we don't have to keep getting it.
	var foundNullStorageForToken = false;
	for (var i = 0; i < tokenArray.length; i++) {
		var thisToken = tokenArray[i];
		var theStorage = localStorage.getItem(thisToken.id);
		if (theStorage == null) {
			foundNullStorageForToken = true;
		}
	}

	if (nowFloored > maxDate || foundNullStorageForToken == true) {
		//if (true){
		//if (true){
		for (var i = 0; i < tokenArray.length; i++) {
			var thisToken = tokenArray[i];
			localStorage.removeItem(thisToken.id);

			var hUrl =
				"https://api.coingecko.com/api/v3/coins/" +
				thisToken.id +
				"/market_chart?vs_currency=usd&days=365&interval=daily";
			var historicalPricesResponseHere = await fetch(hUrl);
			var priceObjHere = await historicalPricesResponseHere.json();
			var marketCaps = priceObjHere.market_caps;

			priceObjHere = priceObjHere.prices;
			//return;

			for (var k = 0; k < priceObjHere.length; k++) {
				var theDate = new Date(priceObjHere[k][0]);

				var justDate =
					theDate.getMonth() +
					1 +
					"-" +
					theDate.getDate() +
					"-" +
					theDate.getFullYear();

				priceObjHere[k].push(justDate);
				var maxDateThisObj = priceObjHere[k][0] / 1000;
				if (maxDateThisObj > maxDate) {
					maxDateHere = new Date(
						theDate.getFullYear(),
						theDate.getMonth(),
						theDate.getDate()
					);
				}
			}
			//market_caps
			var tokenAddressLower = thisToken.address;
			tokenAddressLower = tokenAddressLower.toLowerCase();

			var key = tokenAddressLower + "_market_cap";

			localStorage.setItem(key, marketCaps[marketCaps.length - 1][1]);
			localStorage.setItem(thisToken.id, JSON.stringify(priceObjHere));
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

	var now = new Date(formatter.format(new Date()));
	//var nowFloored = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	//nowFloored = nowFloored.getTime() / 1000;

	//While we are converting coingecko to dates mm-dd-yyyy, add it to a dates array for later
	for (var i = 0; i < tokenArray.length; i++) {
		dates = [];
		var thisToken = tokenArray[i];

		var theStorage = localStorage.getItem(thisToken.id);
		theStorage = JSON.parse(theStorage);

		//var tokenHistory = JSON.parse(theStorage);

		var addLowerCase = thisToken.address;
		addLowerCase = addLowerCase.toLowerCase();
		historicalPricesObject[addLowerCase] = {};
		for (var k = 0; k < theStorage.length; k++) {
			var justDateHere = theStorage[k][2];
			justDateHere = justDateHere.trim();
			var justDateHereD = new Date(justDateHere);
			justDateHereD = justDateHereD.getTime() / 1000;

			//if (justDateHereD < nowFloored){
			if (!dates.includes(justDateHere)) {
				dates.push(justDateHere);
			} else {
			}

			//var justDateHere = (theDate.getMonth()+1) +"-"+ theDate.getDate() +"-"+ theDate.getFullYear();

			historicalPricesObject[addLowerCase][justDateHere] = theStorage[k][1];
			//}else{

			//}
		}
	}

	//Find the value of the portfolio for all the graph data at that date
	for (var i = 0; i < graphData.length; i++) {
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
					// console.log(
					// 	"****** NEED TO REDEPLOY THE GRAPH ****** error - NO DATE getHistoricalPricesUpdateChartsData:" +
					// 		justDateTheGraph +
					// 		" thisAddObj:" +
					// 		addLowerCase
					// );
				}
			} else {
				// console.log(
				// 	"****** NEED TO REDEPLOY THE GRAPH ****** error - NO ADDRESS getHistoricalPricesUpdateChartsData:" +
				// 		justDateTheGraph +
				// 		" thisAddObj:" +
				// 		addLowerCase
				// );
			}
		}
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
	//This is the leader board
	for (var i = 0; i < lbData.length; i++) {
		var thisProsperoWalletAddressLB = lbData[i].prosperoWalletAddress;
		leaderBoardDataOverTime[thisProsperoWalletAddressLB] = [];
	}

	//Each token in token array gets updated with price 7d, 30d...
	await updateTokenValuesOverTime();

	var tempTokenAddressToHistoricalPrices = {};
	for (var i = 0; i < tokenArray.length; i++) {
		tokenArray[i]["d7"] = calcPercChangeForToken(
			tokenArray[i]["d7"],
			tokenArray[i]["price"]
		);
		tokenArray[i]["d30"] = calcPercChangeForToken(
			tokenArray[i]["d30"],
			tokenArray[i]["price"]
		);
		tokenArray[i]["d90"] = calcPercChangeForToken(
			tokenArray[i]["d90"],
			tokenArray[i]["price"]
		);
		tokenArray[i]["y1"] = calcPercChangeForToken(
			tokenArray[i]["y1"],
			tokenArray[i]["price"]
		);
		//var p=tokenArray[i]['price']
		//p = p.toFixed(2)
		//tokenArray[i]['price']=p;
		var tokenAddress = tokenArray[i]["address"];
		var taLower = tokenAddress.toLowerCase();
		taLower = taLower + "_market_cap";
		var mc = localStorage.getItem(taLower);
		mc = mc / 1000000;

		tokenArray[i]["mc"] = mc.toFixed(2);
		tempTokenAddressToHistoricalPrices[tokenArray[i]["address"]] =
			tokenArray[i];
	}

	for (var i = 0; i < myPortfolioDataForTable.length; i++) {
		var port = myPortfolioDataForTable[i]["portfolioObject"];
		for (var tokenAddress in port) {
			if (tokenAddress.length == 42) {
				//if (myPortfolioDataForTable[i]['portfolioObject'][tokenAddress]['price']!=0){
				myPortfolioDataForTable[i]["portfolioObject"][tokenAddress]["d7"] =
					tempTokenAddressToHistoricalPrices[tokenAddress]["d7"];
				myPortfolioDataForTable[i]["portfolioObject"][tokenAddress]["d30"] =
					tempTokenAddressToHistoricalPrices[tokenAddress]["d30"]; //calcPercChangeForToken(tempTokenAddressToHistoricalPrices[tokenAddress]['d30'] , myPortfolioDataForTable[i]['portfolioObject'][tokenAddress]['price']);
				myPortfolioDataForTable[i]["portfolioObject"][tokenAddress]["d90"] =
					tempTokenAddressToHistoricalPrices[tokenAddress]["d90"]; //calcPercChangeForToken(tempTokenAddressToHistoricalPrices[tokenAddress]['d90'] , myPortfolioDataForTable[i]['portfolioObject'][tokenAddress]['price']);
				myPortfolioDataForTable[i]["portfolioObject"][tokenAddress]["y1"] =
					tempTokenAddressToHistoricalPrices[tokenAddress]["y1"]; //calcPercChangeForToken(tempTokenAddressToHistoricalPrices[tokenAddress]['y1'] , myPortfolioDataForTable[i]['portfolioObject'][tokenAddress]['price']);
				var taLower = tokenAddress.toLowerCase();
				taLower = taLower + "_market_cap";
				var mc = localStorage.getItem(taLower);
				mc = mc / 1000000;

				myPortfolioDataForTable[i]["portfolioObject"][tokenAddress]["mc"] =
					mc.toFixed(2);
			}
			//"+JSON.stringify(myPortfolioDataForTable[i]['portfolioObject'][tokenAddress],null,2));
		}
	}

	//Go through every date (gotten earlier) and make the chart data.  3 scenarios:
	//1) found in graph data.
	//2) not found in graph data and there has never been any graph data on it, profit is 0.
	//3) already found in graph data, not found now, use last usdInvested and lastBalanacesInPort to determine value of port with the price of the tokens on that day.

	var d = new Date();
	var todaysDateFormatted =
		d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getFullYear();

	for (var i = 0; i < lbData.length; i++) {
		//To Do function:
		var thisAddObj = {};
		var thisProsperoWalletAddressLB = lbData[i]["prosperoWalletAddress"];
		thisProsperoWalletAddressLB = thisProsperoWalletAddressLB.toLowerCase();
		var thisLeaderEOA = lbData[i]["leaderEOA"];
		var walletName = lbData[i]["walletName"];

		var finalValueLeader = lbData[i]["portfolioObject"]["totalValue"];
		var finalUsdInvestedLeader = lbData[i]["portfolioObject"]["totalUsd"];
		var finalProfitLeader = lbData[i]["portfolioObject"]["profit"];
		var leadersGraphData = [];
		//To Do Function:
		for (var p = 0; p < graphData.length; p++) {
			var thisGraphData = JSON.parse(JSON.stringify(graphData[p]));
			var thisProsperoWalletAddress = thisGraphData["addressVars"][2];
			thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
			var indexOfUser = getIndexOfUser(
				thisGraphData["users"],
				thisLeaderEOA
			);
			if (
				indexOfUser != -1 &&
				thisProsperoWalletAddress == thisProsperoWalletAddressLB
			) {
				leadersGraphData.push(thisGraphData);
			} else {
			}
		}
		var latestTimeOfThatDay = 0;
		var datesWithDataSorted = [];
		var datesWithDataSortedOBJ = {};
		for (var p = 0; p < dates.length; p++) {
			var dateFromDatesArray = dates[p];
			var oneToAdd = null;
			for (var f = 0; f < leadersGraphData.length; f++) {
				var thisGraphD = JSON.parse(JSON.stringify(leadersGraphData[f]));

				var thisDateFormatted = thisGraphD["date"];
				if (thisDateFormatted == dateFromDatesArray) {
					if (leadersGraphData[f]["intVars"][4] > latestTimeOfThatDay) {
						oneToAdd = JSON.parse(JSON.stringify(leadersGraphData[f]));
					}

					latestTimeOfThatDay = leadersGraphData[f]["intVars"][4];
				}
			}
			if (oneToAdd != null) {
				datesWithDataSorted.push(oneToAdd);
				datesWithDataSortedOBJ[dateFromDatesArray] = oneToAdd;
			}
		}

		var datesWithDataNew = [];
		var lastBalancesNew = [];
		var lastTokensNew = [];
		var lastUsdInvestedNew = 0;
		var lastUsersNew = [];
		var leaderAddressHere = "";
		var lineGraphCalcDataSub = [];
		var lastPercentages = [];
		for (var p = 0; p < dates.length; p++) {
			var dateFromDatesArray = dates[p];
			if (datesWithDataSortedOBJ.hasOwnProperty(dateFromDatesArray)) {
				lastBalancesNew =
					datesWithDataSortedOBJ[dateFromDatesArray]["balances"];
				lastTokensNew =
					datesWithDataSortedOBJ[dateFromDatesArray]["tokens"];
				lastUsdInvestedNew =
					datesWithDataSortedOBJ[dateFromDatesArray]["usdInvested"];
				lastPercentages =
					datesWithDataSortedOBJ[dateFromDatesArray][
						"percentageOwnerships"
					];
				lastUsersNew = datesWithDataSortedOBJ[dateFromDatesArray]["users"];
				leaderAddressHere =
					datesWithDataSortedOBJ[dateFromDatesArray]["addressVars"][1];
				leaderAddressHere = leaderAddressHere.toLowerCase();
			}
			var profitCalc = calcProfitWithDate(
				lastBalancesNew,
				lastTokensNew,
				lastUsersNew,
				lastPercentages,
				lastUsdInvestedNew,
				leaderAddressHere,
				dateFromDatesArray,
				todaysDateFormatted,
				lbData[i]
			);
			profitCalc["date"] = dateFromDatesArray;
			lineGraphCalcDataSub.push(profitCalc);
		}

		lineGraphCalcData[thisProsperoWalletAddressLB] = lineGraphCalcDataSub;
	}
}

async function updateD7D30D909FromHistoricalPrices() {
	//right here
	//leaderBoardDataOverTime = {};
	//myWallets
	//leaderBoardData
	var dnow = new Date();
	dnow = new Date(dnow.getTime());
	var date = new Date();
	date.setDate(dnow.getDate() - 7);
	var d7 =
		date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

	date.setDate(dnow.getDate() - 30);
	var d30 =
		date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
	date.setDate(dnow.getDate() - 90);
	var d90 =
		date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
	var y1 =
		dnow.getMonth() +
		1 +
		"-" +
		dnow.getDate() +
		"-" +
		(dnow.getFullYear() - 1);

	for (var i = 0; i < leaderBoardData.length; i++) {
		var thisProsperoWalletAddress = leaderBoardData[i].prosperoWalletAddress;
		if (!lineGraphCalcData.hasOwnProperty(thisProsperoWalletAddress)) {
			console.error(
				"error - lineGraphCalcData does not has prospWalletAddress"
			);
			return;
		}
		var thisLineGraphCalcDataObj =
			lineGraphCalcData[thisProsperoWalletAddress];
		for (var j = 0; j < thisLineGraphCalcDataObj.length; j++) {
			var thisObj = thisLineGraphCalcDataObj[j];
			if (thisObj.date == d7) {
				leaderBoardData[i]["d7"] = formatPerc(thisObj.profitPercLeader);
				if (myWallets.hasOwnProperty(thisProsperoWalletAddress)) {
					myWallets[thisProsperoWalletAddress]["d7"] = formatPerc(
						thisObj.profitPercUser
					);
				}
				//myWallets
			} else if (thisObj.date == d30) {
				leaderBoardData[i]["d30"] = formatPerc(thisObj.profitPercLeader);
				if (myWallets.hasOwnProperty(thisProsperoWalletAddress)) {
					myWallets[thisProsperoWalletAddress]["d30"] = formatPerc(
						thisObj.profitPercUser
					);
				}
			} else if (thisObj.date == d90) {
				leaderBoardData[i]["d90"] = formatPerc(thisObj.profitPercLeader);
				if (myWallets.hasOwnProperty(thisProsperoWalletAddress)) {
					myWallets[thisProsperoWalletAddress]["d90"] = formatPerc(
						thisObj.profitPercUser
					);
				}
			} else if (thisObj.date == y1) {
				leaderBoardData[i]["y1"] = formatPerc(thisObj.profitPercLeader);
				if (myWallets.hasOwnProperty(thisProsperoWalletAddress)) {
					myWallets[thisProsperoWalletAddress]["y1"] = formatPerc(
						thisObj.profitPercUser
					);
				}
			}
		}

		/*
		 "0x18af9b818619cb1c12c2982027212416653a016a": [
    {
      "profitLeader": 0,
      "profitPercLeader": 0,
      "profitUser": 0,
      "profitPercUser": 0,
      "totalValueUser": 0,
      "totalValueLeader": 0,
      "date": "9-14-2021"
    },
    {
		*/
	}
}

function formatPerc(f) {
	if (f == "-") {
		f = 0;
	}

	if (f != 0) {
		f = f.toFixed(2);
	}
	f = f + "%";
	return f;
}

function getProfitPercLineGraphCalcData(date, thisLineGraphCalcDataObj) {
	for (var i = 0; i < thisLineGraphCalcDataObj.length; i++) {
		var thisObj = thisLineGraphCalcDataObj[i];
		if (thisObj.date == date) {
			return thisObj;
		}
	}
}

function printIt(msg) {
	if (ShouldShowConsoleOutput) {
	}
}

function calcPercChangeForToken(priceDaysAgo, priceToday) {
	if (priceDaysAgo == priceToday) {
		return 0;
	} else if (priceDaysAgo == 0) {
		return 0;
	} else if (priceDaysAgo > priceToday) {
		var t = 1 - priceToday / priceDaysAgo;
		t = t * 100;
		t = t.toFixed(2);
		t = "-" + t;
	} else {
		var t = 1 - priceDaysAgo / priceToday;
		t = t * 100;

		t = t.toFixed(2);
	}
	return t;
}

async function updateTokenValuesOverTime() {
	var dnow = new Date();
	dnow = new Date(dnow.getTime());
	//var dnow= (date.getMonth() + 1) + '-' + date.getDate() + '-' +  date.getFullYear();
	var date = new Date();
	date.setDate(dnow.getDate() - 7);
	var d7 =
		date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

	date.setDate(dnow.getDate() - 30);
	var d30 =
		date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

	date.setDate(dnow.getDate() - 90);
	var d90 =
		date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

	var y1 =
		dnow.getMonth() +
		1 +
		"-" +
		dnow.getDate() +
		"-" +
		(dnow.getFullYear() - 1);

	for (var i = 0; i < tokenArray.length; i++) {
		var addLowerCase = tokenArray[i]["address"];
		addLowerCase = addLowerCase.toLowerCase();

		var price = historicalPricesObject[addLowerCase][d7];
		tokenArray[i]["d7"] = price;
		price = historicalPricesObject[addLowerCase][d30];
		tokenArray[i]["d30"] = price;
		price = historicalPricesObject[addLowerCase][d90];
		tokenArray[i]["d90"] = price;
		price = historicalPricesObject[addLowerCase][y1];
		tokenArray[i]["y1"] = price;
		price = historicalPricesObject[addLowerCase][dnow];
		tokenArray[i]["today"] = price;
	}
}

function getAllTxns() {
	return withdrawDepositDataForHistory;
}

function formatTimeForHistory(thisTime) {
	var date = new Date(thisTime * 1000);
	var datePart = date.toLocaleDateString("en-US");
	var timePart = date.toLocaleTimeString("en-US");
	var amOrPm = timePart.substring(timePart.length - 2, timePart.length);
	timePart = timePart.substring(0, timePart.length - 6);
	//timePart=timePart.substring(-2)

	// Hours part from the timestamp
	/*
	 var hours = date.getHours();
	 var minutes = "0" + date.getMinutes();
	 var seconds = "0" + date.getSeconds();
	 var formattedTime = hours + ':' + minutes.substr(-2)
	 */
	return {
		time: timePart + " " + amOrPm,
		date: datePart,
	};
}

function calcProfitWithDate(
	balances,
	tokens,
	users,
	percentages,
	usdInvested,
	leaderAddress,
	thisDate,
	todaysDateFormatted,
	portfolioObj
) {
	var profitLeader = 0;
	var profitPercLeader = 0;
	var profitUser = 0;
	var profitPercUser = 0;
	if (users.length == 0) {
		var objToReturn = {
			profitLeader: profitLeader,
			profitPercLeader: profitPercLeader,
			profitUser: profitUser,
			profitPercUser: profitPercUser,
			totalValueUser: 0,
			totalValueLeader: 0,
		};
		return objToReturn;
	} else {
		var indexOfUser = getIndexOfUser(users, EOAAddress);
		var indexOfLeader = getIndexOfUser(users, leaderAddress);
		var objToReturn = {};
		if (indexOfUser != -1) {
			if (todaysDateFormatted == thisDate) {
				var userPortObj = myWallets[portfolioObj.prosperoWalletAddress];
				if (
					userPortObj["portfolioObject"]["totalUsd"] < 1 &&
					userPortObj["portfolioObject"]["totalValue"] > 0
				) {
					userPortObj["portfolioObject"]["totalUsd"] =
						userPortObj["portfolioObject"]["totalUsd"];
					objToReturn["profitUser"] = 0;
					objToReturn["totalValueUser"] =
						userPortObj["portfolioObject"]["totalValue"];
					objToReturn["usdInvestedUser"] =
						userPortObj["portfolioObject"]["totalUsd"];
					objToReturn["profitPercUser"] = 0;
				} else if (userPortObj["portfolioObject"]["totalValue"] == 0) {
					userPortObj["portfolioObject"]["totalUsd"] =
						userPortObj["portfolioObject"]["totalUsd"];
					objToReturn["profitUser"] = 0;
					objToReturn["totalValueUser"] = 0;
					objToReturn["profitPercUser"] = 0;
				} else {
					objToReturn["profitUser"] = userPortObj.profit;
					objToReturn["totalValueUser"] =
						userPortObj["portfolioObject"]["totalValue"];
					objToReturn["usdInvestedUser"] =
						userPortObj["portfolioObject"]["totalUsd"];
					objToReturn["profitPercUser"] = userPortObj.profitPercentage;
				}
			} else {
				var userPercentage = percentages[indexOfUser] / USD_SCALE;
				var usdInvestedUser = usdInvested[indexOfUser];
				usdInvestedUser = usdInvestedUser / USD_SCALE;
				var profitCalcObjUser = calcJustProfitObj(
					tokens,
					balances,
					userPercentage,
					usdInvestedUser,
					thisDate,
					todaysDateFormatted
				);
				objToReturn["profitUser"] = profitCalcObjUser.profit;
				objToReturn["totalValueUser"] = profitCalcObjUser.totalValue;
				objToReturn["usdInvestedUser"] = usdInvestedUser;
				objToReturn["profitPercUser"] = profitCalcObjUser.profitPerc;
			}
		} else {
			objToReturn["profitUser"] = 0;
			objToReturn["profitPercUser"] = 0;
			objToReturn["totalValueUser"] = 0;
		}
		if (indexOfLeader != -1) {
			/*if (todaysDateFormatted == thisDate) {

				objToReturn["profitLeader"] = portfolioObj.profit;
				objToReturn["totalValueLeader"] =
					portfolioObj["portfolioObject"]["totalValue"];
				objToReturn["usdInvestedLeader"] =
					portfolioObj["portfolioObject"]["totalUsd"];
				objToReturn["profitPercLeader"] = portfolioObj.profit;
			} else {
				*/

			var userPercentage = percentages[indexOfLeader] / USD_SCALE;
			var usdInvestedUser = usdInvested[indexOfLeader];
			usdInvestedUser = usdInvestedUser / USD_SCALE;
			var profitCalcObj = calcJustProfitObj(
				tokens,
				balances,
				userPercentage,
				usdInvestedUser,
				thisDate,
				todaysDateFormatted
			);
			objToReturn["profitLeader"] = profitCalcObj.profit;
			objToReturn["totalValueLeader"] = profitCalcObj.totalValue;
			objToReturn["usdInvestedLeader"] = usdInvestedUser;
			objToReturn["profitPercLeader"] = profitCalcObj.profitPerc;
			//}
		} else {
			objToReturn["profitLeader"] = 0;
			objToReturn["profitPercLeader"] = 0;
			objToReturn["totalValueLeader"] = 0;
		}

		return objToReturn;
	}
}

function calcJustProfitObj(
	tokens,
	balances,
	userPercentage,
	usdInvested,
	thisDate,
	todaysDateFormatted
) {
	if (userPercentage == 0 || balances.length == 0) {
		return {
			profit: 0,
			profitPerc: 0,
			totalValue: 0,
		};
	}
	var valueOfEachToken = [];
	var totalValue = 0;

	for (var i = 0; i < tokens.length; i++) {
		var addLowerCase = tokens[i];
		addLowerCase = addLowerCase.toLowerCase();

		var price = historicalPricesObject[addLowerCase][thisDate];
		//if (todaysDateFormatted == thisDate){
		//alert("have to get price here")
		//var price = getUSDValue_MINE()
		//}
		var priceNow = latestPrices[tokens[i]];
		if (price == null || price == undefined || price == "") {
			//alert("NO PRICE");
			//return;
		}
		var thisBal = balances[i];
		thisBal = thisBal / USD_SCALE;
		var value = price * thisBal * userPercentage;
		valueOfEachToken.push(value);
		totalValue = totalValue + value;
	}
	var profit = totalValue - usdInvested;
	var profitPerc; // = profit / usdInvested;

	if (usdInvested < 1) {
		profitPerc = "-";
	} else {
		profitPerc = profit / usdInvested;
	}

	return {
		profit: profit,
		profitPerc: profitPerc,
		totalValue: totalValue,
	};
}

function compare_time(a, b) {
	if (a["intVars"][4] < b["intVars"][4]) {
		return -1;
	}
	if (a["intVars"][4] > b["intVars"][4]) {
		return 1;
	}
	return 0;
}

async function updateHistoryChartsDataObject(
	walletAddress,
	dataForHistoryChart,
	thisDate,
	userAddress
) {
	var thisPercentage = 0;
	var foundIt = false;
	for (var p = 0; p < graphData.length; p++) {
		var thisGraphData = graphData[p];
		var indexOfUser = getIndexOfUser(thisGraphData["users"], userAddress);
		thisPercentage = thisGraphData["percentageOwnerships"][indexOfUser];
		thisPercentage = thisPercentage / USD_SCALE;

		if (!foundIt) {
			//  addressVars[2] = ProsperoWalletAddress;
			var thisProsperoWalletAddress = thisGraphData["addressVars"][2];
			thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
			if (
				thisProsperoWalletAddress == walletAddress &&
				thisGraphData["date"] == thisDate
			) {
				if (indexOfUser == -1) {
					//console.error("updateHistoryChartsDataObject indexOfUser==-1")
					//alert("can not find user")
					dataForHistoryChart[walletAddress].push({
						date: thisDate,
						profit: 0,
						value: 0,
						usdInvested: 0,
					});
					lastUsdInvested = 0;
					lastAddressInPort = []; //thisGraphData["tokens"];
					lastBalancesInPort = []; // JSON.parse(JSON.stringify(thisGraphData["balances"]));
					break;
				} else if (indexOfUser >= 0) {
					var theseAddresses = thisGraphData["tokens"];
					var theseBalances = JSON.parse(
						JSON.stringify(thisGraphData["balances"])
					);

					var thisUV = 0;
					for (var f = 0; f < theseAddresses.length; f++) {
						var addLowerCase = theseAddresses[f];
						addLowerCase = addLowerCase.toLowerCase();

						var balance = theseBalances[f];
						var price = historicalPricesObject[addLowerCase][thisDate];
						var value = balance * price;
						value = value * thisPercentage;
						thisUV = thisUV + value;
					}

					//thisUV  = thisUV / USD_SCALE;
					lastUsdInvested = thisGraphData["usdInvested"][indexOfUser];
					lastAddressInPort = thisGraphData["tokens"];
					lastBalancesInPort = JSON.parse(
						JSON.stringify(thisGraphData["balances"])
					);

					if (thisUV < 0.0001) {
						thisUV = 0;
					}
					var thisUsdInvested = lastUsdInvested; //lastUsdInvestedthisGraphData["usdInvested"][indexOfUser];
					if (thisUsdInvested < 0.0001) {
						thisUsdInvested = 0;
					}
					var profit = thisUV - thisUsdInvested;

					foundIt = true;

					dataForHistoryChart[walletAddress].push({
						date: thisDate,
						profit: profit / USD_SCALE,
						value: thisUV / USD_SCALE,
						usdInvested: thisUsdInvested / USD_SCALE,
					});
					break;
				}
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
	} else if (!foundIt && lastUsdInvested > 0) {
		var totalValue = 0;
		for (var f = 0; f < lastAddressInPort.length; f++) {
			var addLowerCase = lastAddressInPort[f];
			addLowerCase = addLowerCase.toLowerCase();

			var balance = lastBalancesInPort[f];
			var price = historicalPricesObject[addLowerCase][thisDate];
			var value = balance * price;
			value = value * thisPercentage;
			if (value < 0.0001) {
				value = 0;
			} else {
				//value = noNotation(value);
			}

			totalValue = totalValue + value;
		}
		var profit = totalValue - lastUsdInvested;
		profit = noNotation(profit);

		dataForHistoryChart[walletAddress].push({
			date: thisDate,
			profit: profit / USD_SCALE,
			value: totalValue / USD_SCALE,
			usdInvested: lastUsdInvested / USD_SCALE,
		});
	}
}

function getLineChartData(whichPortfolios, prosperoWalletAddressSelected) {
	if (whichPortfolios == "all my holdings") {
		var chartDataToReturnLabels = [];
		var chartDataToReturnYAxis = [];
		var firstOne = true;
		for (let prospWalletAddress in lineGraphCalcData) {
			var thisPort = lineGraphCalcData[prospWalletAddress];

			var allPortValuBefore = -1;
			var myPortValueBefore = -1;

			if (firstOne == true) {
				for (var i = 0; i < thisPort.length; i++) {
					chartDataToReturnLabels.push(thisPort[i].date);
					chartDataToReturnYAxis.push(thisPort[i].totalValueUser);
				}
				firstOne = false;
			} else {
				for (var i = 0; i < thisPort.length; i++) {
					chartDataToReturnYAxis[i] =
						chartDataToReturnYAxis[i] + thisPort[i].totalValueUser;
					//chartDataToReturnYAxis.push(thisPort[i].totalValueUser);
				}
			}
		}
	} else {
		whichPortfolios = whichPortfolios.toLowerCase();
		whichPortfolios = whichPortfolios.trim();
		prosperoWalletAddressSelected =
			prosperoWalletAddressSelected.toLowerCase();
		var chartDataToUse;
		if (whichPortfolios == "all portfolios") {
			chartDataToUse = leaderBoardDataOverTime;
		} else if (whichPortfolios == "my portfolios") {
			chartDataToUse = myPortfoliosDataOverTime;
		} else {
			console.error("wrong whichPortfolios used.");
			alert("wrong whichPortfolios used.");
			return;
		}
		if (!chartDataToUse.hasOwnProperty(prosperoWalletAddressSelected)) {
			console.error(
				"Error: chartDataToUse does not have prosperoWalletAddressSelected"
			);
			alert(
				"Error: chartDataToUse does not have prosperoWalletAddressSelected"
			);

			return;
		}
		var chartDataToReturnLabels = [];
		var chartDataToReturnYAxis = [];

		var thisPort = lineGraphCalcData[prosperoWalletAddressSelected];
		var justGotAZero = true;

		var allPortValuBefore = -1;
		var myPortValueBefore = -1;

		for (var i = 0; i < thisPort.length; i++) {
			if (whichPortfolios == "all portfolios") {
				chartDataToReturnLabels.push(thisPort[i].date);
				chartDataToReturnYAxis.push(thisPort[i].profitPercLeader);
				allPortValuBefore = thisPort[i].profitPercLeader;
			} else if (whichPortfolios == "my portfolios") {
				chartDataToReturnLabels.push(thisPort[i].date);
				chartDataToReturnYAxis.push(thisPort[i].totalValueUser);
			}
		}
	}

	var chartData = {
		labels: chartDataToReturnLabels,
		datasets: [
			{
				label: "ALL",
				backgroundColor: "#00ff00",
				borderColor: "#00ff00",
				data: chartDataToReturnYAxis,
				tension: 0.3,
				hoverRadius: 5,
				pointHoverBackgroundColor: "#000",
				pointHoverBorderWidth: 6,
				pointRadius: 0,
				pointHitRadius: 4,
				pointHoverRadius: 4,
			},
		],
	};
	return chartData;
}

function multipleBN(valOne, valTwo) {
	var valOne = BigNumber(valOne);
	var valTwo = BigNumber(valTwo);
	var valFinal = valOne.multipliedBy(valTwo);
	valFinal = valFinal.integerValue();
	return valFinal + "";
}

async function getMyHoldings() {
	myHoldingsTotal = Number(myHoldingsTotal + "");
	myHoldingsTotal = myHoldingsTotal.toFixed(2);
	return formatNegPositiveWithDollar(myHoldingsTotal);
	//myHoldingsTotal = "$" + myHoldingsTotal + ""
	//return myHoldingsTotal;
}

async function getTotalWithdrawals() {
	myWithdrawTotals = Number(myWithdrawTotals + "");
	myWithdrawTotals = Math.abs(myWithdrawTotals);
	myWithdrawTotals = myWithdrawTotals.toFixed(2);
	return "$" + myWithdrawTotals;

	//myUSDDepositsTotal = "$" + myUSDDepositsTotal + ""
	//return myUSDDepositsTotal;
}

async function getMyUSDDepositsTotal() {
	myUSDDepositsTotal = Number(myUSDDepositsTotal + "");
	myUSDDepositsTotal = Math.abs(myUSDDepositsTotal);
	myUSDDepositsTotal = myUSDDepositsTotal.toFixed(2);
	return "$" + myUSDDepositsTotal;

	//myUSDDepositsTotal = "$" + myUSDDepositsTotal + ""
	//return myUSDDepositsTotal;
}

async function getMyROITotal() {
	myROITotal = Number(myROITotal + "");
	myROITotal = myROITotal.toFixed(2);
	return formatNegPositiveWithDollar(myROITotal);
	//myROITotal = "$" + myROITotal + ""
	//return myROITotal;
}

async function getMyROITotalPercentage() {
	myROITotalPercentage = Number(myROITotalPercentage + "");
	myROITotalPercentage = myROITotalPercentage.toFixed(2);
	myROITotalPercentage = myROITotalPercentage + "%";
	return myROITotalPercentage;
}

function formatNegPositiveWithDollar(amt) {
	var absAmt = Math.abs(amt);
	if (amt > 0) {
		return "+$" + absAmt;
	} else if (amt < 0) {
		return "-$" + absAmt;
	} else return "$0";
}

async function updateNewInvestors(prosperoWalletAddress, allowNewInvestors) {
	try {
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			prosperoWalletAddress
		);
		var tx = await ProsperoWalletInstance.methods
			.updateAllowNewInvestors(allowNewInvestors)
			.send({
				from: EOAAddress,
			})
			.on("error", function (error, receipt) {})
			.on("transactionHash", function (transactionHash) {})
			.on("receipt", function (receipt) {})
			.on("confirmation", function (confirmationNumber, receipt) {});
	} catch (e) {
		return { success: false, error: e };
	}
	return { success: true };
}

async function updatePercentageFee(prosperoWalletAddress, newPercFee) {
	newPercFee = newPercFee / 100;
	newPercFee = multipleBN(newPercFee, USD_SCALE);
	newPercFee = noNotation(newPercFee);
	try {
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			prosperoWalletAddress
		);
		var tx = await ProsperoWalletInstance.methods
			.updatePercentageFee(newPercFee + "")
			.send({
				from: EOAAddress,
			})
			.on("error", function (error, receipt) {})
			.on("transactionHash", function (transactionHash) {})
			.on("receipt", function (receipt) {})
			.on("confirmation", function (confirmationNumber, receipt) {});
	} catch (e) {
		return { success: false, error: e };
	}
	return { success: true };
}

//manage - kachi
function getTokenListForManageUI() {
	if (
		selectedProsperoWalletAddress == null ||
		selectedProsperoWalletAddress == undefined
	) {
		return [{}];
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
      "ProsperoBeaconFactoryAddress": "0x5E6eFBEcEb565dB7e3660B2B27690EE687Dc9Fb3",
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

function getTokenArray() {
	return tokenArray;
}

function getTokenListForManagePortfolio() {
	var tokens = [];
	for (var i = 0; i < tokenArray.length; i++) {
		var thisToken = tokenArray[i];
		thisToken["icon"] = thisToken["logoURI"];
		tokens.push(thisToken);
	}
	return tokens;
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
	UIStatus = newUIStatusType;
}

function updateNewWalletVariables(walletName, fundFee) {
	newWalletObject = { walletName: walletName, fundFee: fundFee };
}
async function shouldShowApprove() {}

function getDepositStatus() {
	return UIStatus;
}

async function getDepositMessageOne() {
	var msg = "";
	if (UIStatus == UI_CREATE_THEN_DEPOSIT) {
		msg =
			"Before you can deposit, you need to 'create' a wallet on the blockchain.";
	} else if (UIStatus == UI_JOIN_THEN_DEPOSIT) {
		msg =
			"Before you can deposit, you need to 'follow' a wallet on the blockchain.";
	} else if (UIStatus == UI_DEPOSIT_MY_PORTFOLIO) {
	} else {
	}
}

async function getDepositMessageTwo() {
	var msg = "";
	if (UIStatus == UI_CREATE_THEN_DEPOSIT) {
		msg =
			"Before you can deposit, you need to 'create' a wallet on the blockchain.";
	} else if (UIStatus == UI_JOIN_THEN_DEPOSIT) {
		msg =
			"Before you can deposit, you need to 'follow' a wallet on the blockchain.";
	} else if (UIStatus == UI_DEPOSIT_MY_PORTFOLIO) {
	} else {
	}
}

async function handleDepositType() {
	if (UIStatus == UI_CREATE_THEN_DEPOSIT) {
		var res = await createPortfolioThenDeposit();
	} else if (UIStatus == UI_JOIN_THEN_DEPOSIT) {
		var res = await joinPortfolioThenDeposit();
	} else if (UIStatus == UI_DEPOSIT_MY_PORTFOLIO) {
		var res = await deposit();
	} else {
	}

	return res;
}

async function createPortfolioHelper() {
	var status = await createPortfolio(
		newWalletObject.walletName,
		newWalletObject.fundFee
	);
	if (!status.success) {
		//walletWaitingForEOA="";
		return status;
	}
	if (status.prosperoWalletAddressCreated == null) {
		// console.log(
		// 	"****** prosperoWalletAddressCreated is null - problem ***** "
		// );
	} else {
		selectedProsperoWalletAddress = status.prosperoWalletAddressCreated;
	}
	return status;
}

async function depositHelper() {
	var status = await deposit();
	return status;
}

async function createPortfolioThenDeposit() {
	//walletWaitingForEOA=EOAAddress;
	//walletWaitingForEOA=walletWaitingForEOA.toLowerCase();
	var status = await createPortfolio(
		newWalletObject.walletName,
		newWalletObject.fundFee
	);
	if (!status.success) {
		//walletWaitingForEOA="";
		return status;
	}
	if (status.prosperoWalletAddressCreated == null) {
	} else {
		selectedProsperoWalletAddress = status.prosperoWalletAddressCreated;
	}
	//reset it if it was set
	status = await deposit();
	//walletWaitingForEOA="";
	return status;
}

async function joinPortfolioThenDeposit() {
	var status = await joinPortfolio();
	if (!status.success) {
		return status;
	}
	//reset it if it was set
	status = await deposit();
	//walletWaitingForEOA="";
	return status;
}

async function getValuesOverTimeForLeaderAddress(prosperoWalletAddress) {
	var returned = getValuesOverTimeHelper(
		leaderBoardDataOverTime,
		prosperoWalletAddress
	);
	return returned;
}
async function getValuesOverTimeForMyPortfolioAddress(prosperoWalletAddress) {
	var returned = getValuesOverTimeHelper(
		myPortfoliosDataOverTime,
		prosperoWalletAddress
	);
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
			for (var i = 0; i < dataOverTimeObjCopy.length; i++) {
				//var val = dataOverTimeObjCopy[i]['value']/USD_SCALE
				//var usdInvested = dataOverTimeObjCopy[i]['usdInvested']/USD_SCALE
				//var profit = val - usdInvested
				var profit = dataOverTimeObjCopy[i]["profit"] / USD_SCALE;
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
	return valuesOverTime;
}
//numberOfDays = number of days (number)
async function getValuesOverTimeForLinechartLeaderboardAddress(
	prosperoWalletAddress,
	numberOfDays
) {
	var returned = getValuesOverTimeForLineChartHelper(
		leaderBoardDataOverTime,
		prosperoWalletAddress,
		numberOfDays
	);
	return returned;
}
async function getValuesOverTimeForLinechartMyPortfolioAddress(
	prosperoWalletAddress,
	numberOfDays
) {
	var returned = getValuesOverTimeForLineChartHelper(
		myPortfoliosDataOverTime,
		prosperoWalletAddress,
		numberOfDays
	);
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
	// var portfolio = await getMyWallet(); TAKEN OUT KACHI
	for (var key in portfolio) {
		if (keyIsTokenAddress(key)) {
			var thisObj = portfolio[key];
			thisObj["address"] = key;
			withdrawTableData.push(thisObj);
		}
	}
	return withdrawTableData;
}
async function getChartDataSelectedMyPortfolio() {
	// var portfolio = await getMyWallet(); TAKEN OUT KACHI
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
	return dataToReturn;
}
function getLeadersPortfolioForAddress(prosperoWalletAddress) {
	for (var i = 0; i < leaderBoardData.length; i++) {
		var thisProsperoWalletAddress =
			leaderBoardData[i]["prosperoWalletAddress"];
		thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
		prosperoWalletAddress = prosperoWalletAddress.toLowerCase();

		if (thisProsperoWalletAddress == prosperoWalletAddress) {
			return leaderBoardData[i];
		}
	}
	for (var i = 0; i < myPortfolioDataForTable.length; i++) {
		var thisProsperoWalletAddress =
			myPortfolioDataForTable[i]["prosperoWalletAddress"];
		thisProsperoWalletAddress = thisProsperoWalletAddress.toLowerCase();
		prosperoWalletAddress = prosperoWalletAddress.toLowerCase();

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

//TAKEN OUT KACHI
// function getMyWallet() {
// 	if (
// 		selectedProsperoWalletAddress == null ||
// 		selectedProsperoWalletAddress == undefined ||
// 		selectedProsperoWalletAddress == ""
// 	) {
// 		console.error("** error selectedProsperoWalletAddress is empty **");
// 		return;
// 	}
// 	return myWallets[selectedProsperoWalletAddress];
// }

//Left side header - Kachi
async function updateUIFieldValuesMyPortfolioMyPortfolio() {
	// var portfolio = getMyWallet(); TAKEN OUT KACHI
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
		var addressVars = graphItem.addressVars;
		var intVars = graphItem.intVars;
		var users = graphItem.users;
		var usersValues = graphItem.usersValues;
		var methodType = intVars[0];
		var msgSender = addressVars[0];
		var indexOfUser = -1;
		var usdInvested = graphItem.usdInvested;
		msgSender = msgSender.toLowerCase();
		var eoaALower = EOAAddress.toLowerCase();
		if (msgSender == EOAAddress) {
			if (methodType == WITHDRAW_SWAP || methodType == WITHDRAW_ALL) {
				for (var f = 0; f < users.length; f++) {
					var thisUsersAddress = users[f];
					thisUsersAddress = thisUsersAddress.toLowerCase();
					if (thisUsersAddress == eoaALower) {
						indexOfUser = f;
					}
				}

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
	selectedProsperoWalletAddress = address;
	//await convertGraphDataToLeaderBoardAndMyWalletsData();
}
/*
async function initNewEventListener() {
	if (prosperoFactoryEventsInstance == null) {
		alreadyListeningToFactoryEvents = true;
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
				var methodType = intVars[0];
				var eoaAddressMsgSender = addressVars[0];
				eoaAddressMsgSender = eoaAddressMsgSender.toLowerCase();
				var myEoaAddress = EOAAddress.toLowerCase();

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
			
				if (methodType == LEADER_SWAP) {
					alertString =
						"A rebalance has just completed on a Prospero wallet, refreshing page now.";
				} else if (methodType == DEPOSIT_THEN_REBALANCE) {
					if (EOAAddress == eoaAddressMsgSender) {
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

				var alertString = "Error - no methodType found.";
				if (methodType == CREATE_WALLET) {
					if (EOAAddress == eoaAddressMsgSender) {
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
*/
async function getGraphData() {
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
		graphData = result.data.data.latestBalancesFactories;
		for (var i = 0; i < graphData.length; i++) {
			var graphItem = graphData[i];
		}
	} catch (err) {
		return { success: false, error: err };
	}
	return { success: true };
	//}
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

const delay = (n) => new Promise((r) => setTimeout(r, n * 1000));
//withdraw - kachi
//tokenSwappingInto is an array of addresses swapping into, can only be of length 1 or 0.  So if you are
//not swapping into any tokens, just have an empty array - []
async function withdraw(tokenSwappingInto, amountToWithdraw) {
	//amountToWithdraw="1"
	try {
		var valueOfUsersPortfolioBefore = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		amountToWithdraw = amountToWithdraw * USD_SCALE;
		amountToWithdraw = noNotation(amountToWithdraw);
		amountToWithdraw = parseInt(amountToWithdraw);
		amountToWithdraw = noNotation(amountToWithdraw);

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
				return { success: false, error: error };
			})
			.on("transactionHash", function (transactionHash) {})
			.on("receipt", function (receipt) {})
			.on("confirmation", function (confirmationNumber, receipt) {});
		var cumulativeGasUsed = web3Tx.cumulativeGasUsed;
		var gasUsed = await calculateGasEstimate(cumulativeGasUsed);
		var valueOfUsersPortfolioAfter = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		await sleep(4500);

		var success = false;
		if (
			Number(valueOfUsersPortfolioAfter) >=
			Number(valueOfUsersPortfolioBefore)
		) {
			console.error(
				"Error withdraw - Value of the portfolio is not less after the withdraw, before value:" +
					valueOfUsersPortfolioBefore +
					" after:" +
					valueOfUsersPortfolioAfter
			);
		}
		return {
			success: true,
			gasUsed: gasUsed,
		};

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
				var msg =
					"Withdraw swap was not successfull, balances did not change.";
				return { success: false, error: msg };
			}
		}
		return { success: true, gasUsed: gasUsed };
	} catch (e) {
		return { success: false, error: e };
	}
}

//for manage portfolio (rebalanceing) - kachi
//tokenAddressesToRemix is an array of string token addresses
//percentages is an array of percentages allocations [33, 67]
async function rebalance(
	percentages,
	tokenAddressesToRemix,
	selectedProsperoWalletAddressToRemix
) {
	var thisWalletsObjBefore =
		await getValueOfBalancesOfTokensInPortfolioForUser(
			null,
			EOAAddress,
			selectedProsperoWalletAddressToRemix
		);
	var areDiff = returnTrueIfPercentagesAreDiff(
		thisWalletsObjBefore,
		percentages,
		tokenAddressesToRemix
	);
	if (!areDiff) {
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
		return { success: false, error: msg };
	}
	try {
		for (var x = 0; x < percentages.length; x++) {
			percentages[x] = percentages[x] / 100;
			var thisPercBn = BigNumber(percentages[x] + "");
			var percScaleBn = BigNumber(USD_SCALE + "");
			var thisFinalPerc = thisPercBn.multipliedBy(percScaleBn);
			percentages[x] = thisFinalPerc;
		}
		var prosperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			selectedProsperoWalletAddressToRemix
		);
		var web3Tx = await prosperoWalletInstance.methods
			.rebalancePortfolio(tokenAddressesToRemix, percentages)
			.send({
				from: EOAAddress,
			})
			.on("error", function (error, receipt) {
				return { success: false, error: error };
			})
			.on("transactionHash", function (transactionHash) {})
			.on("receipt", function (receipt) {})
			.on("confirmation", function (confirmationNumber, receipt) {});
		var cumulativeGasUsed = web3Tx.cumulativeGasUsed;
		var gasUsed = await calculateGasEstimate(cumulativeGasUsed);

		var thisWalletsObj = await getValueOfBalancesOfTokensInPortfolioForUser(
			null,
			EOAAddress,
			selectedProsperoWalletAddressToRemix
		);
		var areGoalPercentagesAndActualClose =
			await returnTrueIfPercentagesAreLessAndClose(
				thisWalletsObj,
				percentages,
				tokenAddressesToRemix
			);
		if (!areGoalPercentagesAndActualClose) {
			console.error("Current percentages do not match goal percentages.");
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
	var total = 0;
	var tokens = [];
	var amounts = [];
	var avaxValue = 0;
	for (var i = 0; i < balancesInEoa.length; i++) {
		var thisDepositingObj = balancesInEoa[i];
		var usdAmountEnteredByUser = thisDepositingObj["usdAmountEnteredByUser"];
		usdAmountEnteredByUser = Number(usdAmountEnteredByUser);
		if (usdAmountEnteredByUser > 0) {
			//var weiAmount = await getWeiAmount(usdAmountEnteredByUser, thisDepositingObj.address)
			var amountInEth = usdAmountEnteredByUser / thisDepositingObj.price;
			amountInEth = amountInEth.toFixed(16);
			var weiAmt = web3.utils.toWei(amountInEth + "", "ether");
			weiAmt = await updateBalanceFromEighteenDecimalsIfNeeded(
				weiAmt,
				thisDepositingObj.address
			);

			if (thisDepositingObj.name == NativeTokenName) {
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

async function approveAndDeposit(shouldTryToApprove) {
	//await getInfoSubnetHelperContract();
	//TESTING
	var total = 0;
	var tokens = [];
	var amounts = [];
	var avaxValue = 0;
	var foundOneAmtAboveZero = false;
	for (var i = 0; i < balancesInEoa.length; i++) {
		var thisDepositingObj = balancesInEoa[i];
		var usdAmountEnteredByUser = thisDepositingObj["usdAmountEnteredByUser"];
		usdAmountEnteredByUser = Number(usdAmountEnteredByUser);
		if (usdAmountEnteredByUser > 0) {
			//var weiAmount = await getWeiAmount(usdAmountEnteredByUser, thisDepositingObj.address)
			var amountInEth = usdAmountEnteredByUser / thisDepositingObj.price;
			amountInEth = amountInEth.toFixed(16);
			var weiAmt = web3.utils.toWei(amountInEth + "", "ether");
			weiAmt = await updateBalanceFromEighteenDecimalsIfNeeded(
				weiAmt,
				thisDepositingObj.address
			);
			if (thisDepositingObj.name == NativeTokenName) {
				avaxValue = weiAmt + "";
			} else {
				tokens.push(thisDepositingObj.address);
				amounts.push(weiAmt + "");
			}
			foundOneAmtAboveZero = true;
		}
	}
	if (!foundOneAmtAboveZero) {
		return {
			success: false,
			error: "You did not enter any amounts to be deposited.",
		};
	}
	//await getAmountsDepositing();
	//add tokens and amountss
	if (shouldTryToApprove == true) {
		var shouldApproveTheTokens = await shouldApprove();
		if (shouldApproveTheTokens) {
			var status = await approveDepositing(
				tokens,
				amounts,
				selectedProsperoWalletAddress
			); //UPDATE
			return status;
		} else {
			return { success: true };
		}
	}

	var gasEstimate;
	var shouldJustDeposit = 0;
	var firstTimeString = "";
	var methodType = 0;
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

		await sleep(4000);
		var valueOfUsersPortfolioAfter = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		if (
			Number(valueOfUsersPortfolioAfter) <=
			Number(valueOfUsersPortfolioBefore)
		) {
			console.error(
				"Value of the portfolio is not more after the deposit.   Before value:" +
					valueOfUsersPortfolioBefore +
					" after:" +
					valueOfUsersPortfolioAfter +
					" This may be because the transaction is still pending."
			);
		}
		/*var success = false;
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
		}*/
		return status;
	} catch (exception) {
		console.error("exception deposit:" + JSON.stringify(exception, null, 2));
		console.error("exception deposit:" + exception);
		return { success: false, error: exception };
	}
}

async function deposit() {
	//await getInfoSubnetHelperContract();
	//TESTING
	var total = 0;
	var tokens = [];
	var amounts = [];
	var avaxValue = 0;
	var foundOneAmtAboveZero = false;
	for (var i = 0; i < balancesInEoa.length; i++) {
		var thisDepositingObj = balancesInEoa[i];
		var usdAmountEnteredByUser = thisDepositingObj["usdAmountEnteredByUser"];
		usdAmountEnteredByUser = Number(usdAmountEnteredByUser);
		if (usdAmountEnteredByUser > 0) {
			//var weiAmount = await getWeiAmount(usdAmountEnteredByUser, thisDepositingObj.address)
			var amountInEth = usdAmountEnteredByUser / thisDepositingObj.price;
			amountInEth = amountInEth.toFixed(16);
			var weiAmt = web3.utils.toWei(amountInEth + "", "ether");
			weiAmt = await updateBalanceFromEighteenDecimalsIfNeeded(
				weiAmt,
				thisDepositingObj.address
			);
			if (thisDepositingObj.name == NativeTokenName) {
				avaxValue = weiAmt + "";
			} else {
				tokens.push(thisDepositingObj.address);
				amounts.push(weiAmt + "");
			}
			foundOneAmtAboveZero = true;
		}
	}
	if (!foundOneAmtAboveZero) {
		return {
			success: false,
			error: "You did not enter any amounts to be deposited.",
		};
	}
	//await getAmountsDepositing();
	//add tokens and amountss
	var shouldApproveTheTokens = await shouldApprove();
	if (shouldApproveTheTokens) {
		var status = await approveDepositing(
			tokens,
			amounts,
			selectedProsperoWalletAddress
		); //UPDATE
		if (!status.success) {
			return status;
		}
	} else {
	}

	var gasEstimate;
	var shouldJustDeposit = 0;
	var firstTimeString = "";
	var methodType = 0;
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

		await sleep(4000);
		var valueOfUsersPortfolioAfter = await getValueOfUsersPortfolio(
			selectedProsperoWalletAddress,
			EOAAddress,
			false
		);
		if (
			Number(valueOfUsersPortfolioAfter) <=
			Number(valueOfUsersPortfolioBefore)
		) {
			alert(
				"Value of the portfolio is not more after the deposit.   Before value:" +
					valueOfUsersPortfolioBefore +
					" after:" +
					valueOfUsersPortfolioAfter +
					" This may be because the transaction is still pending."
			);
		}
		/*var success = false;
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
		}*/
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
		var f = await tx.wait();
		var cumulativeGasUsed = f.cumulativeGasUsed;
		gasUsed = await calculateGasEstimate(cumulativeGasUsed);
	} catch (exception) {
		console.error("exception depositContract:" + exception);
		return { success: false, error: exception };
	}
	return { success: true, gasUsed: gasUsed };
}

async function calculateGasEstimate(gasEstimate, gasPriceToUse) {
	var estimatedGasBigNumber = BigNumber(gasEstimate + "");
	if (gasPriceToUse != undefined) {
		GAS_PRICE = gasPriceToUse;
	} else {
		GAS_PRICE = await web3.eth.getGasPrice();
	}
	//serverResponse = await postData("https://api.avax.network/ext/bc/C/rpc", {method:"eth_baseFee", id:1});
	//feeHex = serverResponse.result
	//eth_baseFee = parseInt(feeHex,16)

	//GAS_PRICE=eth_baseFee;
	var estimatedGasCostWei = estimatedGasBigNumber.multipliedBy(GAS_PRICE + "");
	var estimatedCostInEth = ethers.utils.formatEther(estimatedGasCostWei + "");
	var usdAmountOfGas = avaxPrice * estimatedCostInEth;
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

		if (bnAmountInWeiToDeposit.isGreaterThan(bnAllowance)) {
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

		if (bnAmountInWeiToDeposit.isGreaterThan(bnAllowance)) {
			try {
				//  var amtToApproveToReachDiff = bnAmountInWeiToDeposit.minus(bnAllowance)
				var amtToApprove = ALOT_APPROVE; // can switch to amtToApprove
				var tx = await thisTokenInstance.approve(
					selectedProsperoWalletAddress,
					amtToApprove + ""
				);
				var f = await tx.wait();
			} catch (e) {
				return { success: false, error: e };
			}
		}
	}
	return { success: true };
}

const sleep = (waitTimeInMs) =>
	new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

async function getBalancesInEoa() {
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
		/*var obj = {
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
		*/
		var p = Number(thisToken.price + "");
		thisToken["usdAmountEnteredByUser"] = 0;
		thisToken["index"] = k;
		thisToken["icon"] = thisToken.logoURI;
		thisToken["name"] = thisTokenName;
		thisToken["available"] = usdValue.toFixed(2) + "";
		thisToken["balance"] = balance + "";
		thisToken["price"] = p;
		thisToken["balanceInEth"] = balanceInEth + "";
		thisToken["EOAAddress"] = EOAAddress;
		thisToken["isNativeToken"] = false;

		thisBalancesInEoa.push(thisToken);
	}
	//NATIVE TOKEN, doesn't work with subnet yet
	/*
if (!isSubnet){
  var index = tokenArray.length;
  var balanceAvaxNow = await ethersProvider.getBalance(EOAAddress);
  //var usdValueAvax = await getUSDValue_MINE(balanceAvaxNow+"", nativeTokenWrappedAddress)
  var balanceInEthAvax =  ethers.utils.formatEther(balanceAvaxNow+"")
  var usdValueAvax = avaxPrice * balanceInEthAvax;
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
	balancesInEoa = thisBalancesInEoa;
	return thisBalancesInEoa;
}
async function updateSelectedWallet(prosperoWalletAddress) {
	selectedProsperoWalletAddress = prosperoWalletAddress;
	var portfolio = getLeadersPortfolioForAddress(selectedProsperoWalletAddress);
	var leaderAddress = portfolio.leaderEOA;
	leaderAddress = leaderAddress.toLowerCase();
	var myEoaAddress = EOAAddress.toLowerCase();
	if (myEoaAddress == leaderAddress) {
		//updateUIFieldValuesLeaderboard();
	} else {
		//updateUIFieldValuesMyPortfolioMyPortfolio();
	}
	await convertGraphDataToLeaderBoardAndMyWalletsData();
}

async function joinPortfolio() {
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
		return { success: true };
	} catch (e) {
		return { success: false, error: e };
	}
	return { success: false };
}
async function createPortfolio(walletName, fundFee) {
	fundFee = fundFee * (USD_SCALE / 100);
	try {
		var prosperoBeaconFactoryInstance = await new ethers.Contract(
			factoryAddress,
			ProsperoBeaconFactoryJson.abi,
			ethersSigner
		);
		var tx = await prosperoBeaconFactoryInstance.newProsperoWallet(
			walletName,
			fundFee + ""
		);
		var r = await tx.wait();
		if (r.hasOwnProperty("events")) {
			var events = r.events;
			if (events.length > 0) {
				var finishedMethodEvent = events[events.length - 1];
				if (finishedMethodEvent.hasOwnProperty("args")) {
					var args = finishedMethodEvent["args"];
					var prosperoWalletAddressCreated = args[args.length - 1];
					return {
						success: true,
						prosperoWalletAddressCreated: prosperoWalletAddressCreated,
					};
				}
			}
		}
		return { success: true, prosperoWalletAddressCreated: null };
	} catch (e) {
		return { success: false, error: e };
	}
	return { success: false, error: null };
}

async function getLeaderBoardDataForTable() {
	return leaderBoardData;
}

async function getMyPortfoliosDataForTable() {
	return myPortfolioDataForTable;
}

async function createLeaderBoardDataObject() {
	var prosperoBeaconFactoryInstance = await new ethers.Contract(
		factoryAddress,
		ProsperoBeaconFactoryJson.abi,
		ethersSigner
	);
	var allLeaderWallets =
		await prosperoBeaconFactoryInstance.getAllProsperoWallets();

	var leaderBoardDataHere = [];
	for (var i = 0; i < allLeaderWallets.length; i++) {
		var thisLeaderWalletAddress = allLeaderWallets[i].toLowerCase();
		var leaderBoardObject = {};
		var thisLeaderAddress = allLeaderWallets[i];
		var walletValues = await getWalletValues(thisLeaderAddress);
		//var leaderEOA = leaderEOA
		var valueOfLeadersPortfolio = await getValueOfUsersPortfolio(
			thisLeaderAddress,
			leaderEOA
		);
		//async function getValueOfUsersPortfolio(prosperoWalletAddress, usersEOA){
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

		var totalUsdInvestedForLeaderBN = BigNumber(
			totalUsdInvestedForLeader + ""
		);
		var usdScaleBN = BigNumber(USD_SCALE + "");
		var totalUsdInvestedForLeaderNumber = Number(
			totalUsdInvestedForLeaderBN.dividedBy(usdScaleBN) + ""
		);

		var profitLeader =
			valueOfLeadersPortfolio - totalUsdInvestedForLeaderNumber;

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

	leaderBoardData = leaderBoardDataHere;
}
async function getValueOfBalancesOfTokensInPortfolioForUser(
	balancesAndTokensObj,
	user,
	prosperoWalletAddress
) {
	if (balancesAndTokensObj == null) {
		balancesAndTokensObj =
			await getBalanacesOfTokensInPortfolioForUserContractCall(
				user,
				prosperoWalletAddress
			);
	}
	var balancesValue = await getValueOfBalancesOfTokensInPortfolio(
		balancesAndTokensObj
	);

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
	percentageUser = percentageUser / USD_SCALE;
	//var percentageUserBn = BigNumber(percentageUser)
	var balancesValueFinal = {};
	balancesValueFinal["totalValue"] = valueOfUsersPortfolio;
	balancesValueFinal["totalUsd"] = totalUsd / USD_SCALE;
	balancesValueFinal["profit"] =
		balancesValueFinal["totalValue"] - balancesValueFinal["totalUsd"];
	var percentageUserBn = BigNumber(percentageUser + "");
	var totalUsdWholeWallet = 0;
	for (var key in balancesValue) {
		if (balancesValue.hasOwnProperty(key)) {
			if (key != "totalValue") {
				var objCopy = {}; //JSON.parse(JSON.stringify(balancesValue[key]))
				var usdBn = BigNumber(balancesValue[key]["usdValue"] + "");
				var balBnScaled = BigNumber(
					balancesValue[key]["balance_scaled"] + ""
				);
				var balBn = BigNumber(balancesValue[key]["balance"] + "");
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

				var balThisUser = balBn.multipliedBy(percentageUser);
				//totalUsdWholeWallet=totalUsdWholeWallet+usdWholeWalletThisToken

				var balThisUserScaled = balBnScaled.multipliedBy(percentageUser);
				balThisUserScaled = balThisUserScaled.integerValue();
				balThisUser = balThisUserScaled.integerValue();

				var usdThisUserThisToken = await getUSDValue_MINE(
					balancesValue[key]["balance"],
					key
				); //(usdBn.multipliedBy(percentageUserBn))+""
				//getUSDValue_MINE: async function  (amountInWei, address)
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

	return balancesValueFinal;
}
async function getValueOfUsersPortfolio(
	prosperoWalletAddress,
	usersEOA,
	shouldKeepAsBigNumber
) {
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
		var bnUv = BigNumber(usersValue);
		if (shouldKeepAsBigNumber == true) {
			return bnUv;
		}
		bnUv = bnUv.dividedBy(USD_SCALE);
		var uvNumber = Number(bnUv + "");
		return uvNumber;
	} catch (e) {
		return 0;
	}
}
async function getBalanacesOfTokensInPortfolioForUserContractCall(
	user,
	prosperoWalletAddress
) {
	try {
		var ProsperoWalletInstance = new web3.eth.Contract(
			ProsperoWalletJson.abi,
			prosperoWalletAddress
		);
		var tokens = [];
		var balances = [];
		ProsperoWalletInstance.defaultAccount = EOAAddress;

		var numberOfTokensInPortfolio = await ProsperoWalletInstance.methods
			.getPortfolioTokensSize()
			.call({ from: EOAAddress });
		for (var i = 0; i < numberOfTokensInPortfolio; i++) {
			tokens[i] = await ProsperoWalletInstance.methods
				.portfolioTokens(i)
				.call({ from: EOAAddress });
			balances[i] = await ProsperoWalletInstance.methods
				.getBalanceOfTokenInPortfolioForUser(user, tokens[i])
				.call({ from: EOAAddress });
		}
	} catch (e) {}
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
	var status = await getGraphData();
	if (!status.success) {
		console.error("error getGraphData: " + status.error);
		return status;
	}

	blockNumWhenWebAppLaunched = await web3.eth.getBlockNumber();
	//await initNewEventListener();

	status = await updatePrices();
	await convertGraphDataToLeaderBoardAndMyWalletsData();
	if (!status.success) {
		console.error("error updatePrices: " + status.error);
		return status;
	}
	//status = await initLeaderBoardTableObject();

	//if (!status.success) {
	//		console.error("error initLeaderBoardTableObject: " + status.error);
	//		return status;
	//}
	//await createMyWalletsDataAndUIObject();

	// var port = await getMyWallet(); TAKEN OUT KACHI

	//await getHistoricalPricesUpdateChartsData();

	//await getBalancesInEoa();
	await getHistoricalPricesUpdateChartsData();
	// await updateProfitPercentages();TAKEN OUT KACHI	await calcNewProfitsForLeaders();

	//await calcNewProfitsForLeaders();

	await updateD7D30D909FromHistoricalPrices();
	return { success: true };
}

async function initializeBlockchainConnection() {
	var provider = await detectEthereumProvider();
	if (provider !== window.ethereum) {
		// todo: handle multiple wallets
		console.error("Do you have MetaMask installed?");
		return {
			success: false,
			error: "Do you have MetaMask installed?",
		};
	}
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
	ethersProvider = await new ethers.providers.Web3Provider(window.ethereum);
	ethersSigner = ethersProvider.getSigner();
	web3 = new Web3(window.ethereum);

	ethereum.on("accountsChanged", (accounts) => {
		console.error("Accounts changed -- reloading....");
		window.location.reload();
	});
	ethereum.on("disconnect", () => {
		//reset state
		console.error("disconnect called...");
	});
	ethereum.on("connect", () => {
		console.error("connect called...");
	});
	ethereum.on("chainChanged", handleChainChanged);
	return { success: true };
}
async function handleChainChanged() {
	let chainId = await ethereum.request({ method: "eth_chainId" });
	if (chainId !== appropriateChainId) {
		alert("switch chain to fuji");
	}
	window.location.reload();
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
		var prices = {};
		var pricesUrl =
			"https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=" +
			allAvalancheAddresses +
			"&vs_currencies=usd&include_24hr_change=true";
		var pricesResponse = await fetch(pricesUrl);
		prices = await pricesResponse.json();
		for (var i = 0; i < tokenArray.length; i++) {
			var thisToken = tokenArray[i];
			var address = "";
			if (thisToken.hasOwnProperty("cChainAddress")) {
				address = thisToken.cChainAddress;
			} else {
				address = thisToken.address;
			}

			var anObj = hasOwnPropertyCaseInsensitive(prices, address);
			if (anObj != false) {
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
				latestPrices[tokenArray[i]["address"]] = prosperoPrice;
				var lowerCaseCAdd = tokenArray[i]["cChainAddress"];
				var wavaxLowerC = WAVAX_COIN_ADDRESS.toLowerCase();

				if (lowerCaseCAdd == wavaxLowerC) {
					avaxPrice = prosperoPrice;
				}
			}
		} catch (e) {
			// alert('Could not get prices from ProsperoPrices, please reload page :'+e)
			return {
				success: false,
				error:
					"Could not get prices from ProsperoPrices, please reload page :" +
					e,
			};
		}
	} catch (e) {
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
	var tokens = balancesAndTokensObj.tokens;
	var balances = balancesAndTokensObj.balances;
	var balanceValue = {};
	var totalValue = 0;
	for (var i = 0; i < tokens.length; i++) {
		var balValueObj = {};
		var thisToken = tokens[i];
		thisToken = thisToken.toLowerCase();
		//var priceOfThisToken = await getUSDValueOfAddress(thisToken)
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
		balValueObj["percentage"] = balValueObj.usdValue / totalValue;
		balanceValue[thisToken] = balValueObj;
	}
	balanceValue["totalValue"] = totalValue;
	return balanceValue;
}
async function getUSDValue_MINE(amountInWei, address) {
	amountInWei = noNotation(amountInWei);

	var amountInWeiUpScaledForLowDecimalPoints =
		await updateBalanceToEighteenDecimalsIfNeeded(amountInWei, address);

	var amountInEther = Number(
		ethers.utils.formatEther(amountInWeiUpScaledForLowDecimalPoints + "") + ""
	);

	address = address.toLowerCase();
	if (address == "0x1d308089a2d1ced3f1ce36b1fcaf815b07217be3") {
		return amountInEther * nativeTokenPrice;
	}
	if (address == nativeTokenWrappedAddress) {
		return amountInEther * nativeTokenPrice;
		//
	}
	for (var i = 0; i < tokenArray.length; i++) {
		var thisTObj = tokenArray[i];
		var thisAdd = thisTObj["address"];
		thisAdd = thisAdd.toLowerCase();
		if (thisAdd == address) {
			var thisValue = amountInEther * thisTObj["price"];
			return thisValue;
		}
	}
	alert("COULD NOT FIND PRICE IN getUSDValue_MINE address:" + address);
}

function noNotation(x) {
	if (Math.abs(x) < 1.0) {
		var e = parseInt(x.toString().split("e-")[1]);
		if (e) {
			x *= Math.pow(10, e - 1);
			x = "0." + new Array(e).join("0") + x.toString().substring(2);
		}
	} else {
		var e = parseInt(x.toString().split("+")[1]);
		if (e > 20) {
			e -= 20;
			x /= Math.pow(10, e);
			x += new Array(e + 1).join("0");
		}
	}
	return x;
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
}
async function createMyWalletsDataAndUIObject() {
	var prosperoBeaconFactoryInstance = await new ethers.Contract(
		factoryAddress,
		ProsperoBeaconFactoryJson["abi"],
		ethersSigner
	);
	var myWalletsFromContract = await prosperoBeaconFactoryInstance.getWallets(
		EOAAddress
	);
	var myWalletTypes = await prosperoBeaconFactoryInstance.getWalletTypes(
		EOAAddress
	);
	myWallets = {};
	var firstWallet = "";
	for (var i = 0; i < myWalletsFromContract.length; i++) {
		var thisWalletAddress = myWalletsFromContract[i].toLowerCase();
		if (i == 0) {
			firstWallet = thisWalletAddress;
		}
		var thisWalletsObj = await getValueOfBalancesOfTokensInPortfolioForUser(
			null,
			EOAAddress,
			thisWalletAddress
		);
		var walletValues = await getWalletValues(thisWalletAddress);
		thisWalletsObj["walletValues"] = walletValues;
		thisWalletsObj["wallet_type"] = "Leader";
		//thisWalletsObj['has_inited_event_listener']=false

		thisWalletsObj["prosperoWalletAddress"] = thisWalletAddress;
		//thisWalletsObj = getOtherDataFromLeaderboardObject(thisWalletsObj)
		if (myWalletTypes[i] == 0) {
			thisWalletsObj["wallet_type"] = "Trailer";
		}
		myWallets[thisWalletAddress] = thisWalletsObj;
	}
	//selectedProsperoWalletAddress = firstWallet;
	//myWallets=myWallets;
	await updateMyPortfoliosDataForTable();
}

async function updateMyPortfoliosDataForTable() {
	myPortfolioDataForTable = [];
	var cntr = 0;
	for (var prosperoWalletAddress in myWallets) {
		var thisPortfolio = myWallets[prosperoWalletAddress];
		var prospWalletAddressLower = prosperoWalletAddress.toLowerCase();
		//THIS FUNCTION IS WRONG...
		var valuesOfTimeObj = await getValuesOverTimeForMyPortfolioAddress(
			prospWalletAddressLower
		);
		var walletValues = thisPortfolio["walletValues"];
		var name = walletValues["walletName"];
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
	//return myPortfolioDataForTable
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
				var balDiff = diffPowerBn.multipliedBy(balBn);
				return balDiff;
			}
		}
	}
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
				var balDiff = diffPowerBn.dividedBy(balBn);
				balDiff = balDiff.integerValue();
				return balDiff;
			}
		}
	}
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
		for (var i = 0; i < numberOfTokensInPortfolio; i++) {
			tokens[i] = await ProsperoWalletInstance.methods
				.portfolioTokens(i)
				.call({ from: accounts[1].address });
			balances[i] = await ProsperoWalletInstance.methods
				.getBalanceOfTokenInPortfolioForUser(user, tokens[i])
				.call({ from: accounts[1].address });
		}
	} catch (e) {
		return { success: false, error: e };
	}
	return { balances: balances, tokens: tokens };
}

async function returnTrueIfPercentagesAreLessAndClose(
	balancesValue,
	goalPercentages,
	goalTokens
) {
	for (var i = 0; i < goalTokens.length; i++) {
		var thisToken = goalTokens[i];
		thisToken = thisToken.toLowerCase();
		var thisPerc = goalPercentages[i];
		thisPerc = thisPerc / USD_SCALE;
		if (balancesValue.hasOwnProperty(thisToken)) {
			var thisObj = balancesValue[thisToken];
			var actualPercentage = thisObj["percentage"];
			//actualPercentage=actualPercentage/USD_SCALE
			var diff = thisPerc - actualPercentage;
			diff = Math.abs(diff);
			if (actualPercentage < thisPerc) {
				if (diff < 0.015) {
					//To do - get this number from constants in contract
					//return true
				} else {
					//alert(
					//	"**** Percentage for swap was off by more than 1.5%, difference is:" +
					//		diff +
					//		" for address:" +
					//		thisToken
					//);
					return false;
				}
			}
		} else {
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
	var areDiff = false;
	for (var i = 0; i < goalTokens.length; i++) {
		var thisToken = goalTokens[i];
		thisToken = thisToken.toLowerCase();
		var thisPerc = goalPercentages[i];
		thisPerc = thisPerc / 100;
		if (balancesValue.hasOwnProperty(thisToken)) {
			var thisObj = balancesValue[thisToken];
			var actualPercentage = thisObj["percentage"];
			actualPercentage = Number(actualPercentage.toFixed(2));
			//actualPercentage=actualPercentage/USD_SCALE
			var diff = thisPerc - actualPercentage;
			diff = Math.abs(diff);
			if (actualPercentage != thisPerc) {
				areDiff = true;
			}
		} else {
			areDiff = true;
		}
	}

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
	}
}
function getUsdScale() {
	return USD_SCALE;
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
	createPortfolioThenDeposit,
	updateSelectedWallet,
	updateUIStatus,
	updateNewWalletVariables,
	handleDepositType,
	getTokenListForManageUI,
	updateApiTokenList,
	getTokenListForManagePortfolio,
	getTokenArray,
	getMyHoldings,
	getMyUSDDepositsTotal,
	getMyROITotal,
	getMyROITotalPercentage,
	updateNewInvestors,
	updatePercentageFee,
	getLineChartData,
	getAllTxns,
	getTotalWithdrawals,
	getDepositStatus,
	createPortfolioHelper,
	depositHelper,
	shouldApprove,
	approveAndDeposit,
};
