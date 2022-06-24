//CONTRACTS VARIABLES:
var wavaxAddressFakeFuji="0x686bdcc79ec7f849669f3f908feb767f7c8d5b56"
var factoryAddress="0x8c333B6dF83c551f6f738946344E31021Fe0807e"
var prosperoPricesAddress="0xbd90c371c3524e86659291892B76820599633da9"
var pricesLibraryAddress="0x81D8Ed70151e7Ce3d36D2256F629f6862aC2A457"
var subnetHelperContractAddress="0x4A6cc169c359Fc340bAc1aEb973625CD64CEFdf7"

//END CONTRACT VARIABLES
var selectedProsperoWalletAddress="0x4cc4b88c622ee9b2c9007a6aea014a093c2fefc5"//CHANGE

const BigNumber = require('bignumber.js');
const Web3 = require('web3');
import detectEthereumProvider from '@metamask/detect-provider';
const ethers = require('ethers')
var web3;
//const ethers = new Ethers(window.ethereum);
var leaderBoardData={data:[],selectedLeaderIndex:0}//leader board portfolios

var ethersProvider;
var ethersSigner;
var USD_SCALE = 1000000000000000000;//await ProsperoWalletLibConstants.methods.USD_SCALE().call()

//ABIS
var tokenArray =require('./apiLib/Tokens.json');
var ProsperoPricesJson =require('./apiLib/ProsperoPrices.json')
var ProsperoBeaconFactoryJson=require('./apiLib/ProsperoBeaconFactory.json')
var SubnetHelperContractJson=require('./apiLib/SubnetHelperContract.json')
var ProsperoWalletJson=require('./apiLib/ProsperoWallet.json')
var PricesLibraryJson=require('./apiLib/PricesLibrary.json')
var ERC20Json=require('./apiLib/ERC20.json')
var WAVAX_COIN_ADDRESS="0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";

var nativeTokenWrappedAddress=WAVAX_COIN_ADDRESS;
var nativeTokenPrice;
var EOAAddress;
var isSubnet=false;//To Do - change me to something automatic by checking network
var balancesInEoa=[];
var NativeTokenName="Avax"
var ALOT_APPROVE=ethers.utils.parseEther("100000000000000");
var avaxPrice;
var GAS_PRICE;
//To do - update amount in balancesInEoa object when user updates USD amount in table
async function updateAmount(amount){}
/*
async function getInfoSubnetHelperContract(){
  var sub = await new ethers.Contract(subnetHelperContractAddress, SubnetHelperContractJson["abi"],  ethersSigner);
  console.log("about to dep...")
  var f = await sub.getAllTokensOnSubnet();
  console.log('sub helper:'+f)
}
*/
async function deposit(){
  //await getInfoSubnetHelperContract();
  console.log("deposit")
  //TESTING
  var total=0
  var numberOfDeposits =0
  var tokens=[]
  var amounts=[]
  var avaxValue = 0;

  for (var i =0;i<balancesInEoa.length;i++){
    var thisDepositingObj=  balancesInEoa[i]
    console.log('thisDepositingObj:'+JSON.stringify(thisDepositingObj,null,2))
    var usdAmountEnteredByUser=thisDepositingObj['usdAmountEnteredByUser']
    usdAmountEnteredByUser = Number(usdAmountEnteredByUser)
    if (usdAmountEnteredByUser>0){
      console.log('thisDepositingObj.name:'+thisDepositingObj.name)
        //var weiAmount = await getWeiAmount(usdAmountEnteredByUser, thisDepositingObj.address)
        var amountInEth = usdAmountEnteredByUser/thisDepositingObj.price;
        amountInEth = amountInEth.toFixed(16)
        console.log('amountInEth:'+amountInEth)
        var weiAmt = web3.utils.toWei(amountInEth+"", 'ether')
        console.log('weiAmt1:'+weiAmt)

        weiAmt = await updateBalanceFromEighteenDecimalsIfNeeded(weiAmt, thisDepositingObj.address)
          console.log('weiAmt2:'+weiAmt)


        if (thisDepositingObj.name==NativeTokenName){
        //  console.log("WEI:"+thisDepositingObj.weiDepositing)
          avaxValue=weiAmt+""
        }else{
          tokens.push(thisDepositingObj.address)
          amounts.push(weiAmt+"")
        }
    }
  }

  //await getAmountsDepositing();
  //add tokens and amountss
  var status = await approveDepositing(tokens,amounts, selectedProsperoWalletAddress);//UPDATE
  if (!status.success){
    return status
  }

  var gasEstimate;
  var shouldJustDeposit=0
  var firstTimeString=""
  var methodType = 0;
  console.log("tokens:"+tokens)
  console.log("amounts:"+amounts)
  console.log("avaxValue:"+avaxValue)
  console.log("methodType:"+methodType)

  try{
    var prosperoWalletInstance = await new ethers.Contract(selectedProsperoWalletAddress, ProsperoWalletJson["abi"],  ethersSigner);
    console.log("about to dep...")
    var tx = await prosperoWalletInstance.deposit(
      tokens,
      amounts,
      methodType,
      {
        value:avaxValue+""
      }
    );
    console.log("dep tx 1:"+JSON.stringify(tx,null,2))

    var f = await tx.wait();
    console.log("dep tx 2 :"+JSON.stringify(f,null,2))

    var cumulativeGasUsed = f.cumulativeGasUsed;
    var gasUsed = await calculateGasEstimate(cumulativeGasUsed);
    console.log("gasUsed:"+JSON.stringify(gasUsed,null,2))
  }catch(exception){
    console.log("eeeee")
    console.error("exception:"+JSON.stringify(exception,null,2))
    console.error("exception:"+exception)
    return {success:false, error:exception}
  }
}
async function calculateGasEstimate (gasEstimate, gasPriceToUse){
  ////console.log'calculateGasEstimate')
  //console.log("gasEstimate:"+gasEstimate)
  var estimatedGasBigNumber = BigNumber(gasEstimate+"")
  if (gasPriceToUse!=undefined){
    GAS_PRICE = gasPriceToUse;
  }else{
    GAS_PRICE=await web3.eth.getGasPrice();
  }
  //serverResponse = await postData("https://api.avax.network/ext/bc/C/rpc", {method:"eth_baseFee", id:1});
  //feeHex = serverResponse.result
  //eth_baseFee = parseInt(feeHex,16)
  ////console.log'eth_baseFee:'+eth_baseFee)
  //GAS_PRICE=eth_baseFee;
  //console.log("GAS_PRICE NOW:"+GAS_PRICE)
  var estimatedGasCostWei = estimatedGasBigNumber.multipliedBy(GAS_PRICE+"");
  //console.log("Estimate calculateGasEstimate wei:"+estimatedGasCostWei)
  var estimatedCostInEth=ethers.utils.formatEther(estimatedGasCostWei+"")
  var usdAmountOfGas = avaxPrice * estimatedCostInEth
  //console.log("Estimate calculateGasEstimate eth:"+estimatedCostInEth)
  return {
    estimatedGasCostWei:estimatedGasCostWei,
    estimatedCostInEth:estimatedCostInEth,
    usdAmountOfGas:usdAmountOfGas
  }
}
async function approveDepositing(tokens, amounts, selectedProsperoWalletAddress){
 console.log("approveDepositing")
  var zeroBn = BigNumber("0")
  for (var k=0;k<tokens.length;k++){
    var thisTokenInstance = await new ethers.Contract(tokens[k], ERC20Json["abi"],  ethersSigner);
    var allowance = await thisTokenInstance.allowance(EOAAddress, selectedProsperoWalletAddress);
    var bnAllowance = BigNumber(allowance+"")
    var bnAmountInWeiToDeposit = BigNumber(amounts[k]+"")
    console.log("dep:"+bnAmountInWeiToDeposit)
    console.log("all:"+bnAllowance)

    if (bnAmountInWeiToDeposit.isGreaterThan(bnAllowance)){
      console.log("NOT ENOUGH APPROVED")

            try{


            //  var amtToApproveToReachDiff = bnAmountInWeiToDeposit.minus(bnAllowance)
              var amtToApprove = ALOT_APPROVE // can switch to amtToApprove
              //console.log("need to approve this much:"+amtToApproveToReachDiff+" going to approve:"+amtToApprove);
              //console.log("selectedProsperoWalletAddress:" + selectedProsperoWalletAddress)
              var tx = await thisTokenInstance.approve(selectedProsperoWalletAddress, amtToApprove+"");
              var f = await tx.wait();
              //console.log("transaction approve returned:"+JSON.stringify(f,null,2)+" for "+thisToken.name)
            }catch(e){
              return {success:false, error:e}
            }
          }
        }
        return {success:true}
      }
async function getAmountsDepositing(){
  console.log("getAmountsDepositing..")
  //console.log("usdAmountToDepositForEachTokenForEachToken:"+usdAmountToDepositForEachTokenForEachToken)
  var depositingObj=[]
  for (var k=0;k<balancesInEoa.length;k++){
    var usdAmountToDepositForEachTokenForEachToken=   Number(balancesInEoa[k]['usdAmountEnteredByUser']);
   console.log("*** usdAmountToDepositForEachTokenForEachToken:"+usdAmountToDepositForEachTokenForEachToken)
    var usdAmountToDepositForEachTokenForEachTokenBn= BigNumber(usdAmountToDepositForEachTokenForEachToken+'');
    var thisToken = balancesInEoa[k]

    var bnBal = BigNumber(thisToken.balance+"")
    var zeroBn = BigNumber("0")
    //console.log("bnBal:"+bnBal+"zeroBn"+zeroBn)
    var obj;
    var balancsInEoa=[]
    console.log("token:"+thisToken.name)
    console.log("This Token:"+JSON.stringify(thisToken,null,2))
    //console.log("bnBal:"+bnBal)
      if (bnBal.isGreaterThan(zeroBn)){
        console.log("greter than zero")

        var amountInEthToDepositHelper = usdAmountToDepositForEachTokenForEachToken / Number(thisToken.price);
        console.log("thisToken.price:"+thisToken.price)
        console.log("usdAmountToDepositForEachTokenForEachToken:"+usdAmountToDepositForEachTokenForEachToken)

        console.log("amountInEthToDepositHelper:"+amountInEthToDepositHelper)

        console.log("thisToken.decimals:"+thisToken.decimals)
        amountInEthToDepositHelper=amountInEthToDepositHelper.toFixed(thisToken.decimals)
        console.log("amountInEthToDepositHelper:"+amountInEthToDepositHelper+" p:"+Number(thisToken.price))
        var amountInEthToDeposit = amountInEthToDepositHelper;// / Number(thisToken.price)
        console.log("amountInEthToDeposit:"+amountInEthToDeposit)
        var amountInWeiToDeposit = ethers.utils.parseEther(amountInEthToDeposit+"")
        console.log("amountInWeiToDeposit:"+amountInWeiToDeposit)

        var thisAddress = thisToken.address
        //console.log("ThisAddress:"+thisAddress)
        //if (thisToken.address="AVAX"){
        //  thisAddress
        //}
        obj={
          //totalUSDAmountToDeposit:totalUSDAmountToDeposit,
          usdAmountEnteredByUser:Number(balancesInEoa[k]['usdAmountEnteredByUser']),
          weiDepositing:amountInWeiToDeposit+"",
          usdDepositing:usdAmountToDepositForEachTokenForEachToken+"",
          ethDepositing:amountInEthToDeposit+"",
          name: thisToken.name,
          usdAmount:thisToken.usdAmount,
          balance: thisToken.balance,
          balanceInEth:thisToken.balanceInEth,
          address:thisToken.address,
          currentPercentageInPortfolio:thisToken.currentPercentageInPortfolio
        }
      }else{
        obj={
          //totalUSDAmountToDeposit:totalUSDAmountToDeposit,
          usdAmountEnteredByUser:0,
          weiDepositing:0+"",
          usdDepositing:0+"",
          ethDepositing:0+"",
          name: thisToken.name,
          usdAmount:thisToken.usdAmount,
          balance: thisToken.balance,
          balanceInEth:thisToken.balanceInEth,
          address:thisToken.address,
          currentPercentageInPortfolio:thisToken.currentPercentageInPortfolio
        }

    }
    balancesInEoa[k]['ethDepositing']=obj['ethDepositing']
    balancesInEoa[k]['weiDepositing']=obj['weiDepositing']
    balancesInEoa[k]['usdAmountEnteredByUser']=Number(obj['usdAmountEnteredByUser'])

    depositingObj.push(obj)
  }
  balancesInEoa=depositingObj
  //await initDepositWithdraw()
  //console.log("depositingObj:"+JSON.stringify(depositingObj,null,2))
}
async function getBalancesInEoa(){
  console.log("getBalancesInEoa - to do: call me when deposit tab is opened")
  var totalValue = 0;
  var nativeTokenObj;
  for (var k=0;k<tokenArray.length;k++){
    var thisToken=tokenArray[k];
    var thisTokenInstance = await new ethers.Contract(tokenArray[k]["address"], ERC20Json.abi,  ethersSigner);
    var balance = await thisTokenInstance.balanceOf(EOAAddress)
    var balanceNowBn = BigNumber(balance+"")
    var balanceInEth = ethers.utils.formatEther(balance+"")
    var usdValue = await getUSDValue_MINE(balance+"", thisToken.address)
    totalValue=totalValue+Number(usdValue);
    var thisTokenName =  thisToken.name
    if ((thisToken.address).toLowerCase() == (wavaxAddressFakeFuji).toLowerCase()){
      nativeTokenObj=thisToken;
    }
    //TESTING - REMOVE ME
    /*if (thisToken.symbol =="WETH.e"){
      console.log("updating..")
      var obj = {
        usdAmountEnteredByUser:100,
        index:k,
        icon:thisToken.logoURI,
        name:thisTokenName,
        available:usdValue.toFixed(2)+"",
        balance:balance+"",
        balanceInEth:balanceInEth+"",
        price:(thisToken.price).toFixed(2),
        address:thisToken.address,
        EOAAddress:EOAAddress,
        decimals:thisToken.decimals,
        isNativeToken:false
      }
    }else{*/
    var obj = {
      usdAmountEnteredByUser:0,
      index:k,
      icon:thisToken.logoURI,
      name:thisTokenName,
      available:usdValue.toFixed(2)+"",
      balance:balance+"",
      balanceInEth:balanceInEth+"",
      price:(thisToken.price).toFixed(2),
      address:thisToken.address,
      EOAAddress:EOAAddress,
      decimals:thisToken.decimals,
      isNativeToken:false
    }
  //}
    balancesInEoa.push(obj)
  }
  //NATIVE TOKEN, doesn't work with subnet yet
  if (!isSubnet){
    var index = tokenArray.length;
    var balanceAvaxNow = await ethersProvider.getBalance(EOAAddress);
    console.log('v-2')
    //var usdValueAvax = await getUSDValue_MINE(balanceAvaxNow+"", nativeTokenWrappedAddress)
    var balanceInEthAvax =  ethers.utils.formatEther(balanceAvaxNow+"")
    console.log('avaxPrice:'+avaxPrice+' balanceInEthAvax:'+balanceInEthAvax)
    var usdValueAvax = avaxPrice * balanceInEthAvax;
    console.log('usdValueAvax in getBalancesInEoa:'+usdValueAvax)

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
  console.log("balancesInEoa:"+JSON.stringify(balancesInEoa,null,2))
  return balancesInEoa;
  //balancesInEoa = balancesInEoa
  //console.log("balancesInEoa:"+balancesInEoa)
  //if (shouldInitDepositingObject){
  //depositingObject=balancesInEoa;
  //}
}
function updateActiveLeaderboardRow(row){
  leaderBoardData["selectedLeaderIndex"]=row
}
async function joinPortfolio(){
  var selectedLeaderBoardAddress=leaderBoardData["data"][leaderBoardData["selectedLeaderIndex"]]["prosperoWalletAddress"];
  try{
    var prosperoBeaconFactoryInstance = await new ethers.Contract(factoryAddress, ProsperoBeaconFactoryJson.abi,  ethersSigner);
    var tx = await prosperoBeaconFactoryInstance.newTrailerWallet(
      selectedLeaderBoardAddress
    );
    var r = await tx.wait();
    return {success:true}
  }catch(e){
   console.log("Exception joinPortfolio: "+e)
   console.log("Exception joinPortfolio: "+JSON.stringify(e,null,2))
   return {success:false, error:e}
  }
  return {success:false}

}
async function createPortfolio(walletName){
  try{
    var prosperoBeaconFactoryInstance = await new ethers.Contract(factoryAddress, ProsperoBeaconFactoryJson.abi,  ethersSigner);
    var tx = await prosperoBeaconFactoryInstance.newProsperoWallet(
      walletName
    );
    var r = await tx.wait();
    console.log('created wallet success - tx returned:'+JSON.stringify(r,null,2))
    if (r.hasOwnProperty("events")){
      var events = r.events;
      if (events.length>0){
        var finishedMethodEvent = events[events.length-1];
        if (finishedMethodEvent.hasOwnProperty("args")){
          var args = finishedMethodEvent['args']
          var prosperoWalletAddressCreated = args[args.length-1]
          //console.log("got prosperoWalletAddressCreated...")
          return {success:true, prosperoWalletAddressCreated:prosperoWalletAddressCreated}
        }
      }
    }
    return {success:true, prosperoWalletAddressCreated:null}
}catch(e){
 console.log("Exception createPortfolio: "+e)
 console.log("Exception createPortfolio: "+JSON.stringify(e,null,2))
 return {success:false, error:e}
}
return {success:false, error:null}
}
async function getLeaderBoardDataForTable(){
  try{
  await createLeaderBoardDataObject();
  console.log('leaderBoardData:'+JSON.stringify(leaderBoardData,null,2))
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
  return tableData;
}catch(e){
  return {error:e}
}
}
async function createLeaderBoardDataObject(){
  //console.log("createLeaderBoardDataObject called");
  var prosperoBeaconFactoryInstance = await new ethers.Contract(factoryAddress, ProsperoBeaconFactoryJson.abi, ethersSigner);
  var allLeaderWallets = await prosperoBeaconFactoryInstance.getAllProsperoWallets();

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
    var allTrailerWallets = await prosperoBeaconFactoryInstance.getTrailersFollowingProsperoWallet(thisLeaderWalletAddress)

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
  var provider = await detectEthereumProvider();
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
  if (provider) {
    try {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length==0){
        alert("Accounts is blank - Create a new Metamask Account.");
        return;
      }
      EOAAddress = accounts[0];
      if (EOAAddress===null || EOAAddress===undefined){
        alert("Can not connect to wallet");
        return;
      }
    } catch (error) {
      if (error.code === 4001) {
        console.error("user rejected request")
        return;
      }
      console.error("ERROR:"+error);
    }
  }else{
    console.error("Could not find wallet");
  }
  ethersProvider = await new ethers.providers.Web3Provider(window.ethereum);
  ethersSigner = ethersProvider.getSigner();
  web3 = new Web3(window.ethereum);

  ethereum.on('accountsChanged', (accounts) => {
    console.error("Accounts changed -- reloading....")
    window.location.reload();
  })

  ethereum.on('disconnect', () =>{
    console.error("disconnect called...")
  })
  ethereum.on('connect', () =>{
    console.error("connect called...")
  })

  ethereum.on('chainChanged', () =>{
    console.error("chain changed...")
  })
  await updatePrices();
  //await getBalancesInEoa();

}
async function updatePrices(){
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
        if (address == nativeTokenWrappedAddress){
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
      var prosperoPrices = await prosperoPrices.methods.getPrices(allAddresses).call({from:EOAAddress});
      for (var i =0;i<prosperoPrices.length;i++){
        var prosperoPrice = BigNumber(prosperoPrices[i]+"")
        var usdBN = BigNumber(USD_SCALE+"")
        prosperoPrice = prosperoPrice.dividedBy(usdBN)
        tokenArray[i]['price']=prosperoPrice;
        var lowerCaseCAdd = tokenArray[i]['cChainAddress']
        var wavaxLowerC = WAVAX_COIN_ADDRESS.toLowerCase();
        //console.log("lowerCaseCAdd:"+lowerCaseCAdd)
        //console.log("wavaxLowerC  :"+wavaxLowerC)

        if (lowerCaseCAdd==wavaxLowerC){
          avaxPrice = prosperoPrice;
        }
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
async function getUSDValue_MINE(amountInWei, address){
  //console.log("getUSDValue_MINE amountInWei:"+amountInWei+" address:"+address)

  var amountInWeiUpScaledForLowDecimalPoints = await updateBalanceToEighteenDecimalsIfNeeded(amountInWei, address)

  var amountInEther= Number(ethers.utils.formatEther(amountInWeiUpScaledForLowDecimalPoints+"")+"")
  //console.log("anountInEther:"+amountInEther)

  address = address.toLowerCase();
  //console.log('address:'+address)

  //console.log('amountInE:'+amountInEther)
  if (address == "0x1d308089a2d1ced3f1ce36b1fcaf815b07217be3"){
    return (amountInEther * nativeTokenPrice)
  }
  if (address == nativeTokenWrappedAddress){
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
  console.log("COULD NOT FIND PRICE IN getUSDValue_MINE"+address)
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
  if (tokenAddress == ("0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3").toLowerCase()){
    tokenAddress ="0x3f226a80e63c859288b717db124d640c64e6fe66"
  }
  tokenAddress = tokenAddress.toLowerCase();
  for (var i =0; i<tokenArray.length;i++){
    var thisAdd = tokenArray[i].address
    thisAdd=thisAdd.toLowerCase();
    if (thisAdd == tokenAddress){
      return tokenArray[i]
    }
  }
  console.log("ERROR - could not find token in getTokenObject_newMine tokenAddress:"+tokenAddress)
}
async function createMyWalletsDataObject(){
  var prosperoBeaconFactoryInstance = await new ethers.Contract(factoryAddress, ProsperoBeaconFactoryJson["abi"],  accounts[1]);
  var myWalletsFromContract = await prosperoBeaconFactoryInstance.getWallets(EOAAddress);
  var myWalletTypes = await prosperoBeaconFactoryInstance.getWalletTypes(EOAAddress);
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
  if (tokenAddress=="0x1d308089a2d1ced3f1ce36b1fcaf815b07217be3"){
    return balance;
  }
  for (var i =0;i<tokenArray.length;i++){
    tokenAddress=tokenAddress.toLowerCase();
    var thisA=(tokenArray[i]['address']).toLowerCase()
    var thisACChainAddress=(tokenArray[i]['cChainAddress']).toLowerCase()

    if (thisA == tokenAddress || tokenAddress == thisACChainAddress){
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
  alert("ERROR - could not find token in updateBalanceToEighteenDecimalsIfNeeded for address: "+tokenAddress)

}
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
  alert("ERROR - could not find token in updateBalanceFromEighteenDecimalsIfNeeded for address: "+tokenAddress)

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

export {  getLeaderBoardDataForTable, initializeApi, joinPortfolio, createPortfolio, updateActiveLeaderboardRow, getBalancesInEoa, deposit };
