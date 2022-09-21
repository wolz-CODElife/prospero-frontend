import connect from "./index";

const autoConnect = () => {
  const { state, connectWalletConnect } = connect();
  if (state.status) {
    if (localStorage.getItem("walletconnect") == null) {
      state.status = false;
      state.address = "";
      localStorage.removeItem("userState");
    }
    if (localStorage.getItem("walletconnect")) {
      (async () => {
        connectWalletConnect();
      })();
    }
  }
};

export default autoConnect;
