<template>
	<div class="row-span-3 bg-[#191A20] py-[20px]">
		<!-- Join / Deposit View -->
		<div v-if="portfolioStore.tableView">
			<!-- Toggle Tabs  -->
			<div class="flex justify-between mx-[20px]">
				<!-- All / My -->
				<div class="p-[10px] bg-black">
					<div class="flex">
						<button
							v-for="tab in tabs"
							:key="tab"
							@click="
								portfolioStore.changeActivePortfolioType(),
									(disabled = true)
							"
							class="py-[8px] px-[15px] text-[14px] w-[160px] uppercase cursor-pointer"
							:class="[
								portfolioStore.activePortfolioType === tab
									? 'bg-[#2D3035] text-white'
									: 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
							]"
						>
							{{ tab }}
						</button>
					</div>
				</div>

				<!-- Join / create  -->
				<div
					class="flex items-center gap-[12px]"
					v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
				>
					<button
						@click="$emit('doJoin')"
						class="btn btn-primary w-[125px]"
						:class="
							disabled
								? 'opacity-50 cursor-text'
								: 'opacity-1 cursor-pointer'
						"
						:disabled="disabled"
					>
						Join
					</button>

					<button
						@click="
							portfolioStore.showCreate(),
								(portfolioStore.tableView = false)
						"
						class="btn btn-primary-outline w-[125px]"
					>
						Create
					</button>
				</div>

				<!-- Deposit / withdraw  -->
				<div class="flex items-center gap-[12px]" v-else>
					<button
						class="btn btn-primary w-[125px]"
						:class="
							disabled
								? 'opacity-50 cursor-text'
								: 'opacity-1 cursor-pointer'
						"
						:disabled="disabled"
					>
						Deposit
					</button>

					<button
						class="btn btn-primary-outline w-[125px]"
						:class="
							disabled
								? 'opacity-50 cursor-text hover:bg-transparent'
								: 'opacity-1 cursor-pointer'
						"
						:disabled="disabled"
					>
						Withdraw
					</button>
				</div>
			</div>

			<!-- All Portfolios / My Portfolios Tables -->
			<div class="my-[20px]">
				<table class="table-auto w-full">
					<thead>
						<tr
							class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[10px] px-[30px]"
						>
							<th class="pl-[20px]">SELECT</th>
							<th>NAME</th>
							<th class="border-r border-r-[#2D3035]">FEE</th>
							<th class="pl-[20px]">7D%</th>
							<th>30D%</th>
							<th>90D%</th>
							<th class="pr-[30px]">1YR%</th>
						</tr>
					</thead>

					<!-- All Portfolios -->
					<tbody
						v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
					>
						<tr
							v-for="portfolio in portfolioStore.allPortfolios"
							key="portfolio"
							@click="
								portfolioStore.doSelectPortfolio(portfolio),
									toggleDisabled()
							"
							class="text-left py-[20px] mx-[28px] border-b border-b-[#2D3035] text-white hover:bg-[#003D3B]"
							:class="[
								portfolioStore.selectedPortfolio.name === portfolio.name
									? 'bg-[#003D3B] '
									: 'bg-transparent',
							]"
						>
							<td class="ml-[20px] pl-[20px]">
								<input
									type="radio"
									:name="portfolio.name"
									:id="portfolio.name"
									@onchange="
										portfolioStore.doSelectPortfolio(portfolio),
											toggleDisabled()
									"
								/>
							</td>
							<td>{{ portfolio.name }}</td>
							<td class="border-r border-r-[#2D3035]">
								{{ portfolio.fee }}%
							</td>
							<td>{{ portfolio.d7 }}%</td>
							<td>{{ portfolio.d30 }}%</td>
							<td>{{ portfolio.d90 }}%</td>
							<td>{{ portfolio.y1 }}%</td>
						</tr>
					</tbody>

					<!-- My Portfolios  -->
					<tbody
						class="w-full"
						v-if="portfolioStore.activePortfolioType === 'My Portfolios'"
					>
						<!-- !empty -->
						<tr
							v-if="portfolioStore.myPortfolios.length > 0"
							v-for="portfolio in portfolioStore.myPortfolios"
							key="portfolio"
							@click="
								portfolioStore.doSelectPortfolio(portfolio),
									toggleDisabled()
							"
							class="text-left py-[20px] mx-[28px] border-b border-b-[#2D3035] text-white hover:bg-[#003D3B]"
							:class="[
								portfolioStore.selectedPortfolio.name === portfolio.name
									? 'bg-[#003D3B] '
									: 'bg-transparent',
							]"
						>
							<td class="ml-[20px] pl-[20px]">
								<input
									type="radio"
									:name="portfolio.name"
									:id="portfolio.name"
									@onchange="
										portfolioStore.doSelectPortfolio(portfolio),
											toggleDisabled()
									"
								/>
							</td>
							<td>{{ portfolio.name }}</td>
							<td class="border-r border-r-[#2D3035] pr-[30px]">
								{{ portfolio.fee }}%
							</td>
							<td>{{ portfolio.d7 }}%</td>
							<td>{{ portfolio.d30 }}%</td>
							<td>{{ portfolio.d90 }}%</td>
							<td>{{ portfolio.y1 }}%</td>
						</tr>

						<!-- empty  -->
						<td
							class="text-white text-[12px] ml-[16px] text-right w-full mx-auto"
							v-else
						>
							Join or create a portfolio to deposit or withdraw
						</td>
					</tbody>
				</table>

				<!-- Search  -->

				<!-- Pagination  -->
			</div>
		</div>

		<!-- Create / Withdraw View  -->
		<div v-else>
			<!-- Top  -->
			<!-- Go back-->
			<div class="px-[10px]">
				<button
					class="button text-[#00FF00] uppercase flex gap-[14px] items-center mb-[16px]"
					@click="goBack()"
				>
					<img src="@/assets/img/direction.svg" alt="" />
					Go Back
				</button>
			</div>

			<div v-if="!portfolioStore.firstCreateView">
				<hr class="border-[#2D3035]" />

				<!-- Manage Portfolio  -->
				<div class="p-[10px]">
					<div class="p-[10px] bg-black w-max">
						<div class="flex">
							<div
								class="py-[8px] px-[15px] text-[14px] uppercase cursor-text bg-black text-[#868C9D]"
							>
								Manage portfolio
							</div>

							<div
								class="py-[8px] px-[15px] text-[14px] uppercase cursor-pointer bg-[#2D3035] text-white"
							>
								{{ portfolioStore.createdPortfolios[0].name }}
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom  -->
				<hr class="border-[#2D3035]" />
			</div>
			<!-- End of top  -->

			<!-- Create view  -->
			<div v-if="portfolioStore.firstCreateView" class="">
				<h4
					class="text-[16px] text-center uppercase text-white mt-[40px] mb-[28px]"
				>
					Create new portfolio
				</h4>
				<!-- Form  -->
				<div class="w-2/3 mx-auto">
					<!-- Portfolio name  -->
					<div class="mb-[28px] relative">
						<label
							for="p-name"
							class="-top-[12px] z-50 absolute ml-[24px] uppercase text-white text-[12px] bg-black px-[8px] py-[4px] -mb-[16px] w-max"
							>Enter Portfolio name</label
						>
						<input
							type="text"
							name="p-name"
							id="p-name"
							v-model="portfolioName"
							class="pt-[28px] pb-[14px] pl-[24px] w-full bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00]"
						/>
					</div>

					<!-- Fund fee  -->
					<div class="mb-[28px] relative">
						<label
							for="p-fee"
							class="-top-[12px] z-50 absolute ml-[24px] uppercase text-white text-[12px] bg-black px-[8px] py-[4px] -mb-[16px]"
							>Fund fee</label
						>
						<!-- span % here  -->
						<input
							type="text"
							name="p-fee"
							id="p-fee"
							v-model="fundFee"
							class="pt-[28px] pb-[14px] pl-[24px] w-full bg-black text-white text-[16px] border border-black focus:outline-none focus:border-[#00ff00]"
						/>
					</div>

					<!-- Open Deposit Modal  -->
					<button
						@click="$emit('doCreate'), assignName()"
						class="btn btn-primary"
						:class="
							disabledDepToPortfolio
								? 'opacity-50 cursor-text '
								: 'opacity-1 cursor-pointer hover:bg-transparent'
						"
						:disabled="disabledDepToPortfolio"
					>
						Deposit to Portfolio
					</button>
				</div>
			</div>

			<!-- Allocation view  -->
			<div v-else>
				<div class="flex items-center gap-[28px] p-[10px]">
					<!-- + Add new token-->
					<button
						class="button text-[#00FF00] uppercase mr-auto"
						@click="$emit('doCreate')"
					>
						+ Add new token
					</button>

					<!-- Change Fund fee -->
					<div class="flex items-center gap-[10px]">
						<label for="" class="uppercase text-white text-[12px]"
							>Fund fee %</label
						>
						<input
							type="number"
							name=""
							id=""
							v-model.lazy="fundFee"
							class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
						/>
					</div>

					<!-- Accepting new investors ? -->
					<div class="flex items-center gap-[10px]">
						<label for="" class="uppercase text-white text-[12px]"
							>Accepting new investors</label
						>
						<div class="switch">
							<input type="checkbox" aria-label="djdn" checked />
							<span class="slider round"></span>
						</div>
					</div>
				</div>

				<hr class="border-[#2D3035]" />

				<table class="table-auto w-full">
					<thead>
						<tr
							class="token text-[#868C9D] text-left border-b border-b-[#2D3035] py-[10px] px-[30px]"
						>
							<!-- <th></th> -->
							<th class="pl-[10px]">ALLOCATION</th>
							<th>TOKEN</th>
							<th>PRICE</th>
							<th class="border-r border-r-[#2D3035]">MC</th>
							<th>7D%</th>
							<th>30D%</th>
							<th>90D%</th>
							<th>1YR%</th>
						</tr>
					</thead>

					<tbody>
						<tr
							class="token text-left py-[20px] mx-[28px] border-b border-b-[#2D3035] text-white"
							v-for="(token, i) in tokenList"
							:key="i"
						>
							<td class="flex items-center gap-[20px] pl-[10px]">
								<!-- Delete token  -->
								<button>
									<img src="@/assets/img/delete.svg" alt="" />
								</button>

								<!-- Input allocation  -->
								<input
									type="number"
									name=""
									id=""
									v-model.lazy="token.allocation"
									@keyup="newList($event.target.value, token.name)"
									class="py-[4px] pl-[12px] w-[55px] bg-black text-white text-[16px] border border-[#003D3B] focus:outline-none"
									:disabled="disableInput"
								/>
							</td>
							<td>{{ token.name }}</td>
							<td>${{ parseFloat(token.price) }}</td>
							<td class="border-r border-r-[#2D3035]">
								${{ parseFloat(token.mc) }}M
							</td>
							<td>{{ token.d7 }}%</td>
							<td>{{ token.d30 }}%</td>
							<td>{{ token.d90 }}%</td>
							<td>{{ token.y1 }}%</td>
						</tr>
					</tbody>
				</table>

				<!-- Save allocation -->
				<button
					v-if="!success"
					@click="openSaveAllocationModal"
					class="btn btn-primary uppercase w-full mt-[32px]"
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
					<span v-else>Need {{ remAllocation }}% more allocation</span>
				</button>

				<!-- Saved display  -->
				<button
					v-else
					disabled
					class="btn btn-primary uppercase w-full mt-[32px]"
				>
					100% - Allocation saved!
				</button>
			</div>
		</div>
	</div>

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
</template>

<script setup>
import { ref, computed } from "vue";
import { usePortfolios } from "@/stores/Portfolios";
import Modal from "../Modal.vue";

const portfolioStore = usePortfolios();

const tokenList = ref([
	{
		name: "Wrapped",
		price: 12,
		mc: 340,
		allocation: 33,
		d7: 10,
		d30: 20,
		d90: 30,
		y1: 120,
	},
	{
		name: " Test",
		price: 19,
		mc: 340,
		allocation: 33,
		d7: 10,
		d30: 20,
		d90: 30,
		y1: 120,
	},
	{
		name: "KBTC ",
		price: 120,
		mc: 340,
		allocation: 33,
		d7: 10,
		d30: 20,
		d90: 30,
		y1: 120,
	},
]);

const disabled = ref(true);

const loading = ref(false);

const error = ref(false);

const success = ref(false);

const saveAllocationModal = ref(false);

const portfolioName = ref("");

const fundFee = ref("1.0");

const tabs = ref(["All Portfolios", "My Portfolios"]);

const placeholder = ref(25);

const disabledDepToPortfolio = computed(
	() => !portfolioName.value || !fundFee.value
);

const disableSaveAllocation = computed(
	() => totalAllocation.value < 100 || totalAllocation.value > 100
);

const disableInput = computed(() => totalAllocation.value === 100);

const totalAllocation = computed(() => {
	return tokenList.value.reduce((accumulator, currentValue) => {
		if (!(parseFloat(currentValue.allocation) > 0)) {
			return accumulator + 0;
		} else {
			return accumulator + parseFloat(currentValue.allocation);
		}
	}, 0);
});

const remAllocation = computed(() => {
	return 100 - totalAllocation.value;
});

function openSaveAllocationModal() {
	saveAllocationModal.value = true;
	success.value = true;
}

function newList(amt, name) {
	let newTokenList = tokenList.value.map((token) => {
		if (token.name === name) {
			token = { ...token, allocation: parseFloat(amt) };
		}
		return token;
	});

	tokenList.value = newTokenList;

	console.log(tokenList.value);
}

function toggleDisabled() {
	disabled.value = false;
}

function assignName() {
	portfolioStore.selectedPortfolio.name = portfolioName.value;
}

function closeAllocationModal() {
	saveAllocationModal.value = false;
}

function goBack() {
	portfolioStore.tableView = true;
	// portfolioStore.activePortfolioType = "My Portfolios";
}
</script>

<style lang="postcss" scoped>
td,
th {
	@apply py-[10px];
}

td:not(:first-child),
th:not(:first-child) {
	@apply px-[14px];
}

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
