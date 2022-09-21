// import connect from "./connect/index";
// const { state, err } = connect();

// const changeMetaMask = async () => {
// 	if (typeof window.ethereum !== "undefined") {
//         try {
//             let accounts = await provider.send("eth_requestAccounts", []);
//             let account = accounts[0];
//             if (account) {
//                 state.status = true;
//                 state.address = account;
//             }    
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
