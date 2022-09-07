<template>
	<Modal @close="$emit('close')" v-if="props.firstView">
		<div class="mx-[20px] my-[16px]">
			<WithdrawalOverview />
			<!-- Form  -->
			<form class="w-full mt-[32px]">
				<!-- Enter amount  -->
				<div class="mb-[28px] relative">
					<label
						for="amount"
						class="-top-[12px] z-50 absolute ml-[14px] uppercase text-white text-[10px] bg-black px-[8px] py-[4px] -mb-[16px] w-max"
						>Enter Amount</label
					>
					<input
						type="text"
						:value="amount"
						@input="$emit('update:amount', $event.target.value)"
						placeholder="$0"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					/>
				</div>

				<!-- SELECT THE SINGLE TOKEN YOU ARE WITHDRAWING INTO  -->
				<div class="mb-[28px] relative" v-if="props.mode === 'swap'">
					<label
						for="token"
						class="-top-[12px] z-50 absolute ml-[14px] uppercase text-white text-[10px] bg-black px-[8px] py-[4px] -mb-[16px]"
						>SELECT THE SINGLE TOKEN YOU ARE WITHDRAWING INTO</label
					>

					<select
						:value="singleToken"
						@input="$emit('update:singleToken', $event.target.value)"
						class="pt-[16px] pb-[6px] pl-[16px] w-full bg-black text-white text-[14px] border border-black focus:outline-none focus:border-[#00ff00]"
					>
						<option
							v-for="token in portfolioStore.tokenList"
							:value="token.address"
						>
							{{ token.name }}
						</option>
					</select>
				</div>

				<!-- Withdraw  -->
				<!-- :disabled="disableWithdraw" -->
				<!-- :class="
						disableWithdraw
							? 'opacity-50 cursor-text '
							: 'opacity-1 cursor-pointer hover:bg-transparent'
					" -->
				<button
					@click.prevent="$emit('doWithdraw')"
					class="btn btn-primary bg-[#005A57] w-full cursor-pointer hover:bg-transparent"
				>
					Withdraw
				</button>
			</form>
		</div>
	</Modal>

	<Modal @close="$emit('close')" v-if="props.secondView">
		<!-- Loading  -->
		<div
			v-if="props.loading"
			class="flex flex-col justify-center items-center gap-[30px] text-center my-[20px]"
		>
			<!-- Logo  -->
			<img
				src="https://i.postimg.cc/tJMqnqDk/image.png"
				alt=""
				class="mx-auto max-w-[130px] object-contain animate-pulse"
			/>
			<h1 class="text-white text-center text-[20px] uppercase">
				Pending transaction. Please wait for confirmation...
			</h1>
		</div>

		<!-- Error  -->
		<div
			v-else-if="props.error"
			class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
		>
			<h1 class="text-[20px] text-center uppercase">Unable to withdraw</h1>
		</div>

		<!-- Successful -->
		<div
			v-else
			class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
		>
			<img
				src="https://i.postimg.cc/Y2vdsnZW/image.png"
				alt=""
				class="max-w-[65%]"
			/>
			<h1 class="text-[20px] uppercase">withdrawal successful!</h1>

			<!-- todo: replace this w real values -->
			<p class="text-[16px]">
				${{ props.amount }} has been sent to you. Wait a few moments for the
				tokens to transfer and reflect in your wallet. Gas used ${{
					props.usdAmountOfGas
				}}
			</p>

			<button
				@click="$emit('close')"
				class="btn btn-primary uppercase w-full"
			>
				Take me to home
			</button>
		</div>
	</Modal>
</template>

<script setup>
import { onMounted } from "vue";
import Modal from "../Modal.vue";
import WithdrawalOverview from "../withdrawal/WithdrawalOverview.vue";
import { usePortfolios } from "@/stores/Portfolios";

async function testFun(){
	console.log("testFun......")
}

const portfolioStore = usePortfolios();

const props = defineProps({
	amount: String,
	singleToken: String,
	mode: String,
	firstView: Boolean,
	secondView: Boolean,
	usdAmountofGas: Number,
	loading: Boolean,
	error: Boolean,
});

defineEmits(["update:amount", "update:singleToken", "close", "doWithdraw"]);

onMounted(() => {
	//portfolioStore.getTokenList();
	console.log(portfolioStore.tokenList);
});
</script>
