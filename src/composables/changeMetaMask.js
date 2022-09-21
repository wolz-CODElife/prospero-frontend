import { ethers } from "ethers";
import connect from "./connect/index";
const { state, err } = connect();

const changeMetaMask = async () => {
	try {
		await ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "43113" }],
		});
	} catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			alert("switch network");
		}
	}
};

export default changeMetaMask;
