<template>
  <AppAlert :type="err.type" v-if="err.msg"
    ><p class="slot">{{ err.msg }}</p></AppAlert
  >
  <div class="bg-landing w-full text-white pb-[60px] fixed" v-if="loaded">
    <!-- Nav  -->
    <nav class="flex items-center justify-end gap-16 pt-[24px] pr-28">
      <RouterLink to="/history" class="btn text-white text-[16px] uppercase"
        >Docs</RouterLink
      >
      <button
        @click="toggleWallet"
        class="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#00FF00] uppercase py-[8px] px-[48px]"
      >
        Launch App
      </button>
    </nav>

    <!-- Logo background   -->
    <img
      src="https://i.postimg.cc/HkYbXP84/Prospero-logo-alone-4x-1hero-logo.png"
      alt=""
      class="w-[582px] h-[400px] fixed top-[40px] left-[27%]"
    />

    <main class="relative">
      <!-- Hero -->
      <Hero tagline="Profits To The People" @open="toggleWallet" />
    </main>

    <!-- Connect WalletModal  -->
    <Modal v-if="walletConnectModal" @close="walletConnectModal = false">
      <div class="text-white">
        <!-- Logo  -->
        <img
          src="https://i.postimg.cc/tJMqnqDk/image.png"
          alt=""
          class="mx-auto w-[85px]"
        />

        <!-- Prospero Text -->
        <img
          src="@/assets/img/prospero.svg"
          alt="Prospero Logo Text"
          class="w-[103px] mx-auto mt-[14px] mb-[28px]"
        />

        <p class="text-center text-[16px] mb-[30px]">
          Please connect your wallet
        </p>

        <Wallet
          wallet="Metamask"
          logo="https://i.postimg.cc/vHLKfmGX/image.png"
          @connect="connectMetaMaskWallet"
        />

        <Wallet
          wallet="Coinbase Wallet"
          logo="https://i.postimg.cc/3xBrW7yD/image.png"
          @connect="useWalletConnect"
        />

        <Wallet
          wallet="Coin 98"
          logo="https://i.postimg.cc/52V2mJ6n/image.png"
          @connect="connectCoin98"
        />

        <Wallet
          wallet="Fortmatic"
          logo="https://i.postimg.cc/nV45DtfH/image.png"
          @connect="useWalletConnect"
        />

        <Wallet
          wallet="Wallet Connect"
          logo="https://i.postimg.cc/sXXXZJvz/image.png"
          @connect="connectWalletConnect"
        />
      </div>
    </Modal>
  </div>

  <div
    class="h-screen w-full flex flex-col justify-center align-center bg-black"
    v-else
  >
    <!-- Logo  -->
    <img
      src="https://i.postimg.cc/tJMqnqDk/image.png"
      alt=""
      class="mx-auto max-w-[50vw] animate-pulse"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Hero from "@/components/landing/Hero.vue";
import Modal from "@/components/Modal.vue";
import Wallet from "../components/landing/Wallet.vue";
import connect from "../composables/connect/index";
import AppAlert from "@/components/AppAlert.vue";

const walletConnectModal = ref(false);
const err = ref({
  msg: "",
  type: "",
});

const loaded = ref(false);
const { connectWalletConnect, state } = connect();

onBeforeMount(() => {
  setTimeout(() => {
    loaded.value = true;
  }, 2000);
});

function toggleWallet() {
  walletConnectModal.value = !walletConnectModal.value;
}

// TODO:
//
// Implement a proper redirect after authentication
async function connectMetaMaskWallet() {
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
}
async function connectCoin98() {
  if (window.coin98 || window.ethereum?.isCoin98) {
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
      msg: "Coin98 Extension is not installed!",
      type: "error",
    };
  }
}

async function connectCoinbase() {}

async function useWalletConnect() {
  connectWalletConnect().then((data) => {
    if (data.error) {
      err.value = {
        msg: "Coin98 Extension is not installed!",
        type: "error",
      };
    } else {
      window.location.replace("dashboard");
    }
  });
}
</script>

<style>
.bg-landing {
  background: #000 url("../assets/img/bg-landing.png") repeat;
}
</style>
