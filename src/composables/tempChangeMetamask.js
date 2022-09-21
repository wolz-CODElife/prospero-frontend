// import { ethers } from "ethers";
// import connect from "./connect/index";
// const { state, err } = connect();

// const changeMetaMask = async () => {
//     console.log("Switching metamask");
// 	if (typeof window.ethereum !== "undefined") {
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//             // let accounts = await provider.send("eth_requestAccounts", []);
//             // let account = accounts[0];
//             // console.log("First address", account);
//             provider.on("disconnect")
//             await provider.send("eth_requestAccounts", []);
    
//             provider.on('accountsChanged', function (accounts) {
//                 let account = accounts[0];
//                 console.log(account);
//                 if (account) {
//                     state.status = true;
//                     state.address = account;
//                 }
//             });
//             const signer = provider.getSigner();
//             const address = await signer.getAddress();

//             console.log(address);
    
//         } catch(error) {

//         }
// 	} else {
// 		err.value = {
// 			msg: "Install Metamask",
// 			type: "error",
// 		};
// 	}
// 	return err;
// };

// export default changeMetaMask;
