import { ethers } from "ethers";
import connect from "./connect/index";
const { state, err } = connect();

const changeMetaMask = async () => {
    console.log("Switching metamask");
	if (typeof window.ethereum !== "undefined") {
        // const chainId = await ethereum.request({ method: "eth_chainId" });
        // console.log(chainId);
        try {
            const accounts = await window.ethereum.request({ method: "wallet_switchEthereumChain", param: { chainId: ethers.utils.hexlify("0xa869")}})
            console.log(accounts);
            // const accounts = await ethereum.request({
            //     method: "wallet_switchEthereumChain",
            //     param: [{ chainId: ethers.utils.hexlify(chainId) }],
            // });
            // const account = accounts[0];
            // if (account) {
            //     state.status = true;
            //     state.address = account;
            //     state.chainId = chainId;
            // }
        } catch(error) {

        }
	} else {
		err.value = {
			msg: "Install Metamask",
			type: "error",
		};
	}
	return err;
};

export default changeMetaMask;
