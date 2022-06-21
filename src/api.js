const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);
const ethers = require('ethers')
//const ethers = new Ethers(window.ethereum);
var leaderBoardData={data:[],selectedLeaderIndex:0}//leader board portfolios

var ethersProvider;
var ethersSigner;
var USD_SCALE = 1000000000000000000;//await ProsperoWalletLibConstants.methods.USD_SCALE().call()
var factoryAddress="0x0a82054efCf045ED8A84bB8CedD593554BB95B76"
var prosperoPricesAddress="0xee2d7D2Fb1c0ed021F5035A1c156Cd067203AfF0";
var pricesLibraryAddress="0x0a3b0EfCD2dF87640fFb58b1B3593A50a37efa29"
var tokenArray =require('./apiLib/TokensMainnet.json');
var ProsperoPricesJson =require('./apiLib/ProsperoPrices.json')
var ProsperoBeaconFactoryJson=require('./apiLib/ProsperoBeaconFactory.json')
var ProsperoWalletJson=require('./apiLib/ProsperoWallet.json')
var PricesLibraryJson=require('./apiLib/PricesLibrary.json')
var WAVAX_COIN_ADDRESS="0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
var nativeTokenPrice;
var EOAAddress="0xeeca92f4eb0b3102a62a414f1ff6290fFE23B67d";
async function tFun(){
  //console.log('ssss')
  return "ssssss"
};
var testM="fff";

async function getLeaderBoardDataForTable(){
  await createLeaderBoardDataObject();
  //console.log('leaderBoardData:'+JSON.stringify(leaderBoardData,null,2))
  var leaderBoardDataHere = leaderBoardData.data
  var tableData = []
  for (var i =0;i<leaderBoardDataHere.length;i++){
    var fee =leaderBoardDataHere[i]['leaderPercentageFee'];
    var profitLeader=leaderBoardDataHere[i]['profitLeader'];
    fee = fee / USD_SCALE;
    fee = fee * 100;
    fee = parseInt(fee)
    fee = fee + "%"
    profitLeader = profitLeader * 100;
    profitLeader= parseInt(profitLeader)
    profitLeader = profitLeader + "%"

    var leaderObjForTable = {
      name:leaderBoardDataHere[i]['walletValues']['walletName'],
      fee:fee,
      d7: 0,
      d30: 0,
      d90: 0,
      y1: profitLeader,
    };
    tableData.push(leaderObjForTable);
  }
/*
  var testD =
  [
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
]
*/
  return tableData;
}
async function createLeaderBoardDataObject(){
  //console.log("createLeaderBoardDataObject called");
  var leaderTrailerFactoryInstance = await new ethers.Contract(factoryAddress, ProsperoBeaconFactoryJson.abi, ethersSigner);
  var allLeaderWallets = await leaderTrailerFactoryInstance.getAllProsperoWallets();

  var leaderBoardDataHere=[]
  for (var i=0;i<allLeaderWallets.length;i++){
    //console.log("i:"+i)
    var thisLeaderWalletAddress = allLeaderWallets[i].toLowerCase();
    //console.log("***thisLeaderWalletAddress:"+thisLeaderWalletAddress);
    var leaderBoardObject = {}
    var thisLeaderAddress = allLeaderWallets[i];
    //console.log('thisLeaderAddress:'+thisLeaderAddress)
    var walletValues = await getWalletValues(thisLeaderAddress)
    //console.log('walletValues:'+JSON.stringify(walletValues,null,2))
    //var leaderEOA = walletValues.leaderEOA
    var valueOfLeadersPortfolio = await getValueOfUsersPortfolio(thisLeaderAddress, walletValues.leaderEOA)
    //async function getValueOfUsersPortfolio(ProsperoWalletAddress, usersEOA){
    //console.log('valueOfLeadersPortfolio:'+valueOfLeadersPortfolio)
    var ProsperoWalletInstance = new web3.eth.Contract(
      ProsperoWalletJson.abi,
      thisLeaderAddress
    );
    var totalUsdInvestedForLeader = await ProsperoWalletInstance.methods.getTotalUsdInvestedPerUser(walletValues.leaderEOA).call({
      from: EOAAddress
    });
    var allTrailerWallets = await leaderTrailerFactoryInstance.getTrailersFollowingProsperoWallet(thisLeaderWalletAddress)

    //console.log("allTrailerWallets:"+allTrailerWallets)
    var totalUsdInvestedForLeaderBN = BigNumber(totalUsdInvestedForLeader+"")
    var usdScaleBN = BigNumber(USD_SCALE+"")
    var totalUsdInvestedForLeaderNumber = Number((totalUsdInvestedForLeaderBN.dividedBy(usdScaleBN))+"")
    //console.log('valueOfLeadersPortfolio:'+valueOfLeadersPortfolio)

    //console.log('totalUsdInvestedForLeaderNumber:'+totalUsdInvestedForLeaderNumber)
    var profitLeader = (valueOfLeadersPortfolio - totalUsdInvestedForLeaderNumber)
    //console.log('profitLeader:'+profitLeader)

    var leaderBoardObject = await getValueOfBalancesOfTokensInPortfolioForUser(null, walletValues.leaderEOA, thisLeaderWalletAddress)

    var profitPercentage = 0;
    if (valueOfLeadersPortfolio!=0){
      profitPercentage=(profitLeader / valueOfLeadersPortfolio)
    }
    leaderBoardObject['prosperoWalletAddress']=thisLeaderWalletAddress
    leaderBoardObject['profitLeader']=profitLeader
    leaderBoardObject['walletValues']=walletValues
    leaderBoardObject['walletName']=walletValues['walletName']
    leaderBoardObject['leaderPercentageFee']=walletValues['leaderPercentageFee']
    leaderBoardObject['prosperoPercentageFeeOfLeader']=walletValues['prosperoPercentageFeeOfLeader']
    leaderBoardObject['numberOfTrailers']=allTrailerWallets.length
    leaderBoardObject['profitPercentage']=profitPercentage
    leaderBoardObject['prosperoWalletAddress']=thisLeaderWalletAddress

    //leaderBoardObject = {
    //  prosperoWalletAddress:thisLeaderWalletAddress,
    //  balancesValue:balancesValue,
    //  leaderProfit:profitLeader,
    //  walletValues:walletValues,
    //  numberOfTrailer:allTrailerWallets.length,
    //  profitPercentage:profitPercentage
    //}
    leaderBoardDataHere.push(leaderBoardObject)
  }
  leaderBoardDataHere.sort(function(a, b) {
    var keyA = a.profitPercentage,
    keyB = b.profitPercentage;
    // Compare the 2 dates
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
  });
  //console.log("leaderBoardData:"+JSON.stringify(leaderBoardData,null,2))
  leaderBoardData['data']=leaderBoardDataHere
}
async function getValueOfBalancesOfTokensInPortfolioForUser(balancesAndTokensObj, user, ProsperoWalletAddress){
  //console.log('--getValueOfBalancesOfTokensInPortfolioForUser')
  //console.log('balancesAndTokensObj:'+JSON.stringify(balancesAndTokensObj,null,2))
  if (balancesAndTokensObj==null){
    balancesAndTokensObj = await getBalanacesOfTokensInPortfolioForUserContractCall(user, ProsperoWalletAddress)
  }
  var balancesValue = await getValueOfBalancesOfTokensInPortfolio(balancesAndTokensObj)
  //console.log('balancesValue*:'+JSON.stringify(balancesValue,null,2))

  var ProsperoWalletInstance = new web3.eth.Contract(
    ProsperoWalletJson.abi,
    ProsperoWalletAddress
  );
  ProsperoWalletInstance.defaultAccount=user
  var totalUsd = await ProsperoWalletInstance.methods.getTotalUsdInvestedPerUser(user).call({from: user})
  var valueOfUsersPortfolio = await getValueOfUsersPortfolio(ProsperoWalletAddress, user, false);
  var percentageUser = await  ProsperoWalletInstance.methods.getPercentageOwnership(user).call({from: user})
  //=console.log('percentageUser:'+percentageUser)
  percentageUser=(percentageUser / USD_SCALE)
  //var percentageUserBn = BigNumber(percentageUser)
  //console.log('percentageUser with USD Scale:'+percentageUser)
  var balancesValueFinal={}
  balancesValueFinal['totalValue']=valueOfUsersPortfolio
  balancesValueFinal['totalUsd']=(totalUsd / USD_SCALE)
  balancesValueFinal['profit']=(balancesValueFinal['totalValue'] - balancesValueFinal['totalUsd'])
  var percentageUserBn = BigNumber(percentageUser+"")
  //console.log('percentageUserBn:'+percentageUserBn)
  var totalUsdWholeWallet=0
  for (var key in balancesValue) {
    if (balancesValue.hasOwnProperty(key)) {
      //console.log(key + " -> " + balancesValue[key]);
      if (key != "totalValue"){
        var objCopy = {};//JSON.parse(JSON.stringify(balancesValue[key]))
        var usdBn = BigNumber(balancesValue[key]['usdValue']+"")
        var balBnScaled = BigNumber(balancesValue[key]['balance_scaled']+"")
        var balBn = BigNumber(balancesValue[key]['balance']+"")
        //console.log('b*:'+balancesValue[key]['balance'])
        var balThisUserNum = balancesValue[key]['balance'] * percentageUser;
        balThisUserNum=parseInt(balThisUserNum)
        var balNoSciStr;
        if (balThisUserNum<1){
          //balNoSciStr = balThisUserNum.toFixed(balThisUserNum.toString().split('-')[1]); //where you split your number, see how many decimals it has and pass that number to .toFixed method
          var e = parseInt(balThisUserNum.toString().split('e-')[1]);
          if (e) {
            balNoSciStr *= Math.pow(10,e-1);
            balNoSciStr = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
          }
        }else{
          balNoSciStr = await toPlainString(balThisUserNum)
        }
        //console.log("balThisUserNum:"+balThisUserNum)
        //console.log("balNoSciStr:"+balNoSciStr)

        var balThisUser = balBn.multipliedBy(percentageUser)
        //totalUsdWholeWallet=totalUsdWholeWallet+usdWholeWalletThisToken
        //console.log('balThisUser:'+balThisUser)
        //console.log('percentageUser:'+percentageUser)
        //console.log('balBnScaled:'+balBnScaled)

        var balThisUserScaled = balBnScaled.multipliedBy(percentageUser)
        balThisUserScaled=balThisUserScaled.integerValue();
        balThisUser=balThisUserScaled.integerValue();
        //console.log('balThisUser:'+balThisUser)

        //console.log('v-3')

        var usdThisUserThisToken = await getUSDValue_MINE(balancesValue[key]['balance'], key)//(usdBn.multipliedBy(percentageUserBn))+""
        //getUSDValue_MINE: async function  (amountInWei, address)
        //console.log('balThisUser:'+balThisUser)
        //console.log('usdThisUserThisToken:'+usdThisUserThisToken)
        objCopy['usdValue']=Number(usdThisUserThisToken)
        //objCopy['balance_scaled']= balBnScaled.multipliedBy(percentageUserBn)
        //objCopy['balance_scaled']=(objCopy['balance_scaled']).integerValue()
        objCopy['balance']=balancesValue[key]['balance'];
        if (balancesValueFinal['totalValue']==0){
          objCopy['percentage']= 0;

        }else{
          objCopy['percentage']= (objCopy['usdValue'] / balancesValueFinal['totalValue']);
        }
        //objCopy['percentage']=Number(objCopy['percentage'].toFixed(2))
        var tokenObj = await getTokenObject_newMine(key)
        objCopy['name'] = tokenObj.name;
        objCopy['symbol'] = tokenObj.symbol;
        objCopy['price'] = Number(tokenObj.price);
        objCopy['twentyFourHour'] = tokenObj.twentyFourHour;
        objCopy['image'] = tokenObj.logoURI;
        //objCopy['usdValueLeader']=usdWholeWalletThisToken


        //objCopy['percentage']=percentageUser;
        //objCopy['balancesAndTokensObj']=balancesAndTokensObj
        balancesValueFinal[key]=objCopy
      }
    }
  }

  //console.log('balancesValueFinal:'+JSON.stringify(balancesValueFinal,null,2))
  return balancesValueFinal
}
async function getValueOfUsersPortfolio(ProsperoWalletAddress, usersEOA, shouldKeepAsBigNumber){
//  console.log(
//  "getValueOfUsersPortfolio pricesLibraryAddress: "+pricesLibraryAddress+
//  " prosperoPricesAddress: "+prosperoPricesAddress+
//  " ProsperoWalletAddress: "+ProsperoWalletAddress
//  +" usersEOA: "+usersEOA
//  +" PricesLibraryJson.abi:"+JSON.stringify(PricesLibraryJson.abi,null,2))
  try{
    var pricesLibraryInstance = new web3.eth.Contract(
      PricesLibraryJson.abi,
      pricesLibraryAddress
    );
    pricesLibraryInstance.defaultAccount=usersEOA
    var totalValueOfPortfolio =  await pricesLibraryInstance.methods.getTotalValueOfPortfolio(ProsperoWalletAddress, prosperoPricesAddress).call({
      from: usersEOA
    });

    var ProsperoWalletInstance = new web3.eth.Contract(
      ProsperoWalletJson.abi,
      ProsperoWalletAddress
    );
    ProsperoWalletInstance.defaultAccount=usersEOA
    var usersValue = await ProsperoWalletInstance.methods.getUsersValue(usersEOA, totalValueOfPortfolio).call({
      from: usersEOA
    });
    //console.log("usersValue:"+usersValue);
    var bnUv = BigNumber(usersValue)
    if (shouldKeepAsBigNumber==true){
      return bnUv;
    }
    bnUv = bnUv.dividedBy(USD_SCALE)
    var uvNumber =Number(bnUv+"")
    //console.log("USERS VALUE:"+uvNumber)
    return uvNumber;
  }catch(e){
    //console.log('exception:'+e)
    return 0;
  }
}
async function getBalanacesOfTokensInPortfolioForUserContractCall(user, ProsperoWalletAddress){
  //console.log("getBalanacesOfTokensInPortfolioForUserContractCall")
  try{
    var ProsperoWalletInstance = new web3.eth.Contract(
      ProsperoWalletJson.abi,
      ProsperoWalletAddress
    );
    var tokens=[]
    var balances=[]
    ProsperoWalletInstance.defaultAccount=EOAAddress
    //console.log("1 calling getPortfolioTokensSize")

    var numberOfTokensInPortfolio = await ProsperoWalletInstance.methods.getPortfolioTokensSize().call({from: EOAAddress})
    //console.log("numberOfTokensInPortfolio:"+numberOfTokensInPortfolio)
    for (var i = 0;i < numberOfTokensInPortfolio;i++) {
      //console.log("I:"+i)
      tokens[i] = await ProsperoWalletInstance.methods.portfolioTokens(i).call({from: EOAAddress})
      //console.log("****TOKEN:"+tokens[i] )
      balances[i] = await ProsperoWalletInstance.methods.getBalanceOfTokenInPortfolioForUser(user,tokens[i]).call({from: EOAAddress})
      //console.log("*****BAL:"+balances[i] )
    }
  }catch(e){
    //console.log('getBalanacesOfTokensInPortfolioForUserContractCall - exception:'+e)
  }
  return {balances:balances,tokens:tokens}

}
async function initializeApi(){
  await updatePricesNew();
  ethersProvider = await new ethers.providers.Web3Provider(window.ethereum);
  ethersSigner = ethersProvider.getSigner();
}
async function updatePricesNew(){
  try{
    var allAvalancheAddresses=""
    var allAddresses=[]
    for (var i=0;i<tokenArray.length;i++){
      var thisToken = tokenArray[i];
      //if (thisToken.hasOwnProperty("cChainAddress")){
      address = thisToken.cChainAddress
      //}else{
      //  address = thisToken.address
      //}
      var thisAvalancheAddress = address
      if (i==0){
        allAvalancheAddresses=thisAvalancheAddress
      }else{
        allAvalancheAddresses=allAvalancheAddresses+"%2C"+thisAvalancheAddress
      }
    }
    //}
    //console.log("allA:"+allAvalancheAddresses)
    var prices={}
    var pricesUrl =
    "https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses="
    + allAvalancheAddresses
    +"&vs_currencies=usd&include_24hr_change=true"
    //console.log('pricesUrl:'+pricesUrl)
    var pricesResponse = await fetch(pricesUrl);
    prices = await pricesResponse.json();
    //console.log("PRICEs:"+JSON.stringify(prices,null,2))
    for (var i=0;i<tokenArray.length;i++){
      var thisToken = tokenArray[i];
      var address =""
      if (thisToken.hasOwnProperty("cChainAddress")){
        address = thisToken.cChainAddress
      }else{
        address = thisToken.address
      }
      //console.log('address:'+address);
      var anObj = hasOwnPropertyCaseInsensitive(prices, address);
      if (anObj!=false){
        //console.log("anObj:"+JSON.stringify(anObj,null,2))
        var usd = anObj['usd']
        var twentyFourHour = anObj['usd_24h_change']
        var twentyFourHourChange = twentyFourHour/100
        twentyFourHourChange = twentyFourHourChange * usd
        if (address == WAVAX_COIN_ADDRESS){
          nativeTokenPrice=usd;
        }
        tokenArray[i]['twentyFourHour'] = twentyFourHourChange;
      }else{
        //alert('could not find price in coingecko')
        //console.log('***** coould not find price for:'+thisToken.name+" add:"+address)
        tokenArray[i]['coingecko_price'] = 1;
        tokenArray[i]['twentyFourHour'] = 1;
        tokenArray[i]['price'] = 1;
        nativeTokenPrice=1;
      }
      allAddresses.push(address)
    }
    try{
      allAddresses=[]
      for (var i=0;i<tokenArray.length;i++){
        var thisToken = tokenArray[i];
        address = thisToken.address
        allAddresses.push(address)
      }
      var prosperoPrices = new web3.eth.Contract(
        ProsperoPricesJson.abi,
        prosperoPricesAddress
      );
      //console.log('allAddresses:'+allAddresses)

      var prosperoPrices = await prosperoPrices.methods.getPrices(allAddresses).call({from:EOAAddress});
      for (var i =0;i<prosperoPrices.length;i++){
        var prosperoPrice = BigNumber(prosperoPrices[i]+"")
        var usdBN = BigNumber(USD_SCALE+"")
        prosperoPrice = prosperoPrice.dividedBy(usdBN)
        tokenArray[i]['price']=prosperoPrice;
      }
    }catch(e){
      console.log("updatePricesNew exception1:"+e);
      alert('Could not get prices from ProsperoPrices, please reload page :'+e)
    }
  }catch(e){
    console.log("updatePricesNew exception2:"+address)
    alert('Could not get prices from coingecko, please reload page :'+e)
  }
}
async function getWalletValues(ProsperoWalletAddress){
  try{
    var ProsperoWalletInstance = new web3.eth.Contract(
      ProsperoWalletJson.abi,
      ProsperoWalletAddress
    );
    var walletValues = await ProsperoWalletInstance.methods.getWalletValues().call({
      from: EOAAddress
    });
    //console.log(" walletValues:"+JSON.stringify(walletValues,null,2))
    var walletValuesJson = {
      ProsperoBeaconFactoryAddress : walletValues[0],
      leaderEOA : walletValues[1],
      prosperoPricesAddress : walletValues[2],
      prosperoDataAddress : walletValues[3],
      ProsperoWalletAddress : walletValues[4],
      walletName : walletValues[5],
      profilePictureUrl : walletValues[6],
      totalSupply_percentageOwnership : walletValues[7],
      leaderPercentageFee : walletValues[8],
      prosperoPercentageFeeOfLeader : walletValues[9]
    }
  }catch(e){
    //console.log('getWalletValues exception:'+e)
    return false;
  }
  return walletValuesJson;
}
function hasOwnPropertyCaseInsensitive(obj, property) {
  var props = [];
  for (var i in obj) if (obj.hasOwnProperty(i)) props.push(i);
  var prop;
  while (prop = props.pop()) if (prop.toLowerCase() === property.toLowerCase()) return obj[prop];
  return false;
}
async function getValueOfBalancesOfTokensInPortfolio(balancesAndTokensObj){
  //console.log('balancesAndTokensObj:'+JSON.stringify(balancesAndTokensObj,null,2))
  var tokens=balancesAndTokensObj.tokens;
  var balances=balancesAndTokensObj.balances;
  //console.log('tokens:'+JSON.stringify(tokens,null,2))
  var balanceValue = {}
  var totalValue = 0;
  for (var i =0;i<tokens.length;i++){
    var balValueObj = {}
    var thisToken = tokens[i]
    thisToken = thisToken.toLowerCase();
    //console.log('thisToken:'+thisToken)
    //var priceOfThisToken = await getUSDValueOfAddress(thisToken)
    //console.log('balances[i]:'+balances[i])
    //console.log("balUpdated:"+bal)
    var usdValue = await getUSDValue_MINE(balances[i], thisToken)
    //var amountInWeiUpScaledForLowDecimalPoints = await updateBalanceToEighteenDecimalsIfNeeded(amountInWei, address)
    //console
    balValueObj['usdValue']=usdValue
    balValueObj['balance']=balances[i]
    balValueObj['balance_scaled'] = await updateBalanceToEighteenDecimalsIfNeeded(balances[i], thisToken)

    balanceValue[thisToken] = balValueObj;
    totalValue = totalValue + Number(usdValue+"");

  }
  for (var i =0;i<tokens.length;i++){
    var thisToken = tokens[i]
    thisToken = thisToken.toLowerCase();
    var balValueObj = balanceValue[thisToken]
    //console.log("balValueObj.usdValue:"+balValueObj.usdValue)
    balValueObj['percentage'] = (balValueObj.usdValue / totalValue)
    balanceValue[thisToken] = balValueObj;
  }
  balanceValue['totalValue']=totalValue
  return balanceValue;
}
async function  getUSDValue_MINE(amountInWei, address){
  //console.log("getUSDValue_MINE amountInWei:"+amountInWei+" address:"+address)
  var amountInWeiUpScaledForLowDecimalPoints = await updateBalanceToEighteenDecimalsIfNeeded(amountInWei, address)

  var amountInEther= Number(ethers.utils.formatEther(amountInWeiUpScaledForLowDecimalPoints+"")+"")
  //console.log("anountInEther:"+amountInEther)

  address = address.toLowerCase();
  //console.log('address:'+address)

  //console.log('amountInE:'+amountInEther)
  if (address == WAVAX_COIN_ADDRESS){
    //console.log('isNativeToken')
    return (amountInEther * nativeTokenPrice)
    //
  }
  for (var i =0; i<tokenArray.length;i++){
    var thisTObj = tokenArray[i]
    var thisAdd = thisTObj['address']
    thisAdd=thisAdd.toLowerCase();
    //console.log('thisTObj:'+JSON.stringify(thisTObj,null,2))
    if (thisAdd == address){
      //console.log('found add')
      var thisValue = (amountInEther * thisTObj['price'])
      //console.log('thisValue'+thisValue)
      return thisValue
    }
  }
  alert("COULD NOT FIND PRICE IN getUSDValue_MINE address:"+address)
  //console.log("COULD NOT FIND PRICE IN getUSDValue_MINE")
}
async function toPlainString(num) {
  return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
  function(a,b,c,d,e) {
    return e < 0
    ? b + '0.' + Array(1-e-c.length).join(0) + c + d
    : b + c + d + Array(e-d.length+1).join(0);
  });
}
async function getTokenObject_newMine(tokenAddress){
  tokenAddress = tokenAddress.toLowerCase();
  for (var i =0; i<tokenArray.length;i++){
    var thisAdd = tokenArray[i].address
    thisAdd=thisAdd.toLowerCase();
    if (thisAdd == tokenAddress){
      return tokenArray[i]
    }
  }
  console.log("ERROR - could not find token in getTokenObject_newMine")
}
async function createMyWalletsDataObject(){
  var leaderTrailerFactoryInstance = await new ethers.Contract(factoryAddress, ProsperoBeaconFactoryJson["abi"],  accounts[1]);
  var myWalletsFromContract = await leaderTrailerFactoryInstance.getWallets(EOAAddress);
  var myWalletTypes = await leaderTrailerFactoryInstance.getWalletTypes(EOAAddress);
  //console.log("myWallets***:"+JSON.stringify(myWalletsFromContract,null,2))
  //console.log("myWalletTypes:"+myWalletTypes.length)
  myWallets = {}
  for (var i=0;i<myWalletsFromContract.length;i++){
    var thisWalletAddress = myWalletsFromContract[i].toLowerCase();
    //console.log('thisWalletAddress:'+thisWalletAddress)
    var thisWalletsObj = await getValueOfBalancesOfTokensInPortfolioForUser(null, EOAAddress, thisWalletAddress)
    var walletValues = await getWalletValues(thisWalletAddress)
    //console.log('walletValues:'+JSON.stringify(walletValues,null,2))
    thisWalletsObj['walletValues']=walletValues
    thisWalletsObj['wallet_type']="Leader"
    thisWalletsObj['has_inited_event_listener']=false

    thisWalletsObj['prosperoWalletAddress']=thisWalletAddress
    if (myWalletTypes[i]==0){
      thisWalletsObj['wallet_type']="Trailer"
    }
    //console.log("thisWalletsObj:"+JSON.stringify(thisWalletsObj,null,2))
    myWallets[thisWalletAddress]=thisWalletsObj
  }
  //console.log("myWallets:"+JSON.stringify(myWallets,null,2))
  //myWallets=myWallets;
}
async function handleLeaderOrTrailerView(){
  if (selectedProsperoWalletAddress!=undefined){
    if ((leaderBoardData['data']).lenth>0){
      leaderIndex = leaderBoardData['selectedLeaderIndex']
      var portfolio =leaderBoardData['data'][leaderIndex]
      //  var portfolio =DApp['leaderBoardData']['data'][leaderIndex]

      if (selectedProsperoWalletAddress == portfolio['prosperoWalletAddress']){
        //console.log("Leader looking to manage portfolio")
      }else{
        //console.log("NOT Leader looking to manage portfolio")
      }
    }
  }
}
async function getSelectedWalletFromMyWalletsOrLastOneIfNone(){
  //var selectedProsperoWalletAddress=selectedProsperoWalletAddress
  //console.log("getSelectedWalletFromMyWalletsOrLastOneIfNone selectedProsperoWalletAddress:"+selectedProsperoWalletAddress)
  var thisPortfolio=null;
  if (selectedProsperoWalletAddress!=undefined && selectedProsperoWalletAddress!=null && selectedProsperoWalletAddress!=""){
    if(myWallets.hasOwnProperty(selectedProsperoWalletAddress)){
      //console.log('has it')
      thisPortfolio = myWallets[selectedProsperoWalletAddress]
    }
  }
  if (thisPortfolio==null){
    //console.log("myWallets does not have:"+selectedProsperoWalletAddress+" going with the last one.")
    //console.log("myWallets:"+JSON.stringify(myWallets,null,2))

    for (var key in myWallets) {
      if (myWallets.hasOwnProperty(key)) {
        thisPortfolio=myWallets[key]
      }
      selectedProsperoWalletAddress = key.toLowerCase();
    }
  }
  //console.log("--selectedProsperoWalletAddress:"+selectedProsperoWalletAddress)
  //console.log('returning:'+JSON.stringify(thisPortfolio,null,2))
  return thisPortfolio
}
async function updateTokenFields(anAddress, cChainAddress){
  var thisObj={}
  thisObj['address']=anAddress.toLowerCase();//wavax
  thisObj['decimals']=await getDecimals(anAddress);
  thisObj['name']=await getName(anAddress);
  thisObj['symbol']=await getSymbol(anAddress);
  thisObj['cChainAddress']=cChainAddress;

  return thisObj;
}
async function updateBalanceToEighteenDecimalsIfNeeded(balance, tokenAddress){
  for (var i =0;i<tokenArray.length;i++){
    tokenAddress=tokenAddress.toLowerCase();
    var thisA=(tokenArray[i]['address']).toLowerCase()
    if (thisA == tokenAddress){
      if (tokenArray[i]['decimals'] == 18){
        return balance
      }else{
        var diff = 18 - tokenArray[i]['decimals'];
        var diffPower = Math.pow(10, diff);
        var diffPowerBn = BigNumber(diffPower+"")
        var balBn = BigNumber(balance)
        //console.log("diffPower:"+diffPower)
        var balDiff = diffPowerBn.multipliedBy(balBn);
        //console.log("balDiff:"+balDiff)
        return balDiff;
      }
    }
  }
  console.log("ERROR - could not find token in updateBalanceToEighteenDecimalsIfNeeded for address: "+tokenAddress)

}
//uses tokenArray.decimal to revert back from say Bitcoin being scaled up
async function updateBalanceFromEighteenDecimalsIfNeeded(balance, tokenAddress){
  for (var i =0;i<tokenArray.length;i++){
    tokenAddress=tokenAddress.toLowerCase();
    if (tokenArray[i]['address']==tokenAddress){
      if (tokenArray[i]['decimals'] == 18){
        return balance
      }else{
        var diff = 18 - tokenArray[i]['decimals'];
        var diffPower = Math.pow(10, diff);
        var diffPowerBn = BigNumber(diffPower+"")
        var balBn = BigNumber(balance)
        //console.log("diffPower:"+diffPower)
        var balDiff = diffPowerBn.dividedBy(balBn);
        //console.log("balDiff:"+balDiff)
        balDiff = balDiff.integerValue()
        return balDiff;
      }
    }
  }
  console.log("ERROR - could not find token in updateBalanceFromEighteenDecimalsIfNeeded for address: "+tokenAddress)
}
async function getDecimals(tokenAddress){
  try{

    var tokenInst= new web3.eth.Contract(
      ERCExtendedJson.abi,
      tokenAddress
    );
    var decimals = await tokenInst.methods.decimals().call({from: accounts[0].address})
    //console.log('*decimals:'+decimals);
    return decimals
  }catch(e){console.log("exception - getDecimals:"+e)}
}
async function getName(tokenAddress){
  var tokenInst= new web3.eth.Contract(
    ERCExtendedJson.abi,
    tokenAddress
  );
  var name = await tokenInst.methods.name().call({from: accounts[0].address})
  //console.log('name:'+name);
  return name
}
async function getSymbol(tokenAddress){
  var tokenInst= new web3.eth.Contract(
    ERCExtendedJson.abi,
    tokenAddress
  );
  var symbol = await tokenInst.methods.symbol().call({from: accounts[0].address})
  //console.log('symbol:'+symbol);
  return symbol
}

export { testM, tFun, updatePricesNew, tokenArray, getLeaderBoardDataForTable, initializeApi };
