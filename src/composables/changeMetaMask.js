import connect from "./connect/index";
const { state, err } = connect();

const changeMetaMask = async () => {
	if (typeof window.ethereum !== "undefined") {
		const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		});

		const chainId = await ethereum.request({ method: "eth_chainId" });
		const account = accounts[0];

		if (account) {
			state.status = true;
			state.address = account;
			state.chainId = chainId;
			window.location.replace("dashboard");
		}
	} else {
		err.value = {
			msg: "Install Metamask",
			type: "error",
		};
	}
};

export default changeMetaMask;
