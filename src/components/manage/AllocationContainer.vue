<template>
	<div>
		<hr class="border-[#2D3035]" />
		<SelectPortfolio />
		<div class="flex items-center justify-between p-[10px]">
			<SelectToken />
			<!-- Change Fund fee -->
			<div class="flex items-center gap-[10px]">
				<label for="" class="uppercase text-white text-[12px]"
					>Fund <br />fee %</label
				>
				<input
					type="number"
					name=""
					id=""
					v-model="fundFee"
					class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
				/>
			</div>

			<!-- Accepting new investors -->
			<div
				class="flex gap-[12px] items-center p-[5px_10px] text-white"
				:class="switchChecked ? 'bg-[#005A57]' : 'bg-[#2D3035]'"
			>
				<label for="" class="uppercase text-[12px]"
					>Accepting <br />
					new investors</label
				>
				<div class="switch">
					<input
						type="checkbox"
						aria-label="djdn"
						:checked="switchChecked"
					/>
					<span class="slider round"></span>
				</div>
			</div>
		</div>

		<hr class="border-[#2D3035]" />

		<div class="min-h-[150px]">
			<table class="table-auto w-full my-[20px]">
				<thead>
					<tr
						class="text-[#868C9D] text-left border-b border-b-[#2D3035] px-[30px]"
					>
						<th class="pl-[16px]">ALLOCATION</th>
						<th>TOKEN</th>
						<th>PRICE</th>
						<th class="border-r border-r-[#2D3035]">MC</th>
						<th class="pl-[20px]">7D%</th>
						<th>30D%</th>
						<th>90D%</th>
						<th>1YR%</th>
					</tr>
				</thead>
				<tbody>
					<tr
						class="text-left mx-[28px] border-b border-b-[#2D3035] text-white"
						v-for="(token, i) in portfolioStore.allocationList"
						:key="i"
					>
						<td class="flex items-center gap-[20px] pl-[10px]">
							<!-- Delete token  -->
							<button @click="deleteToken(token)">
								<img src="@/assets/img/delete.svg" alt="" />
							</button>

							<!-- Input allocation  -->
							<input
								type="number"
								name=""
								id=""
								v-model="token.allocation"
								@keyup="newList($event.target.value, token.name)"
								class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
							/>
						</td>
						<td>{{ token.name }}</td>
						<td>${{ parseFloat(token.price) }}</td>
						<td class="border-r border-r-[#2D3035]">
							${{ parseFloat(token.mc) }}M
						</td>
						<td class="pl-[20px]">{{ token.d7 }}%</td>
						<td>{{ token.d30 }}%</td>
						<td>{{ token.d90 }}%</td>
						<td>{{ token.y1 }}%</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Save allocation -->
		<button
			v-if="!success && totalAllocation > 0"
			@click="openSaveAllocationModal"
			class="btn btn-primary uppercase w-full mt-[50px]"
			:class="
				disableSaveAllocation
					? 'opacity-50 cursor-text '
					: 'opacity-1 cursor-pointer hover:bg-transparent'
			"
			:disabled="disableSaveAllocation"
		>
			{{ totalAllocation }}% -
			<span v-if="!disableSaveAllocation"
				>Click here to save allocation</span
			>
			<span v-else-if="disableSaveAllocation && totalAllocation > 100"
				>Reduce total allocation to 100%</span
			>
			<span v-else-if="disableSaveAllocation && totalAllocation < 100"
				>Need {{ remAllocation }}% more allocation</span
			>
		</button>

		<!-- Saved display  -->
		<button
			v-if="success"
			disabled
			class="btn btn-primary uppercase w-full mt-[32px]"
		>
			100% - Allocation saved!
		</button>

		<!-- saveAllocationModal -->
		<Modal v-if="saveAllocationModal" @close="closeAllocationModal()">
			<!-- Loading  -->
			<div
				v-if="loading"
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<h1 class="text-[20px] text-center uppercase">Loading...</h1>
			</div>

			<!-- Error  -->
			<div
				v-else-if="error"
				class="flex flex-col justify-center items-center gap-[30px] text-white text-center my-[20px]"
			>
				<h1 class="text-[20px] text-center uppercase">
					Unable to save allocation
				</h1>
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
				<h1 class="text-[20px] uppercase">You're All set!</h1>

				<p class="text-[16px]">
					Your porfolio allocation was successfully saved.
				</p>

				<button
					@click="closeAllocationModal"
					class="btn btn-primary uppercase mx-auto"
				>
					Thanks
				</button>
			</div>
		</Modal>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import SelectToken from "./SelectToken.vue";
import Modal from "../Modal.vue";

import SelectPortfolio from "./SelectPortfolio.vue";
import { usePortfolios } from "@/stores/Portfolios";

const portfolioStore = usePortfolios();

const loading = ref(false);

const error = ref(false);

const success = ref(false);

const switchChecked = ref(true);

const saveAllocationModal = ref(false);

const fundFee = ref(1.5);

const disableSaveAllocation = computed(
	() => totalAllocation.value < 100 || totalAllocation.value > 100
);

const remAllocation = computed(() => {
	return 100 - totalAllocation.value;
});

const totalAllocation = computed(() => {
	return portfolioStore.allocationList.reduce((accumulator, currentValue) => {
		if (!(parseFloat(currentValue.allocation) > 0)) {
			return accumulator + 0;
		} else {
			return accumulator + parseFloat(currentValue.allocation);
		}
	}, 0);
});

function openSaveAllocationModal() {
	saveAllocationModal.value = true;
	success.value = true;
}

function closeAllocationModal() {
	saveAllocationModal.value = false;
}

function newList(amt, name) {
	let newTokenList = portfolioStore.tokenList.map((token) => {
		if (token.name === name) {
			token = { ...token, allocation: parseFloat(amt) };
		}
		return token;
	});
	portfolioStore.tokenList = newTokenList;
	t;
}

function deleteToken(item) {
	portfolioStore.allocationList.splice(item, 1);
	portfolioStore.tokenList.push(item);
}
</script>

<style>
.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

.slider:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: 0.4s;
	transition: 0.4s;
}

input:checked + .slider {
	background-color: #04ce04;
}

input:focus + .slider {
	box-shadow: 0 0 1px #04ce04;
}

input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
	border-radius: 34px;
}

.slider.round:before {
	border-radius: 50%;
}
</style>
