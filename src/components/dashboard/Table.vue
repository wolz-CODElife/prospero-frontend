<template>
	<div class="row-span-3 bg-[#191A20] py-[20px]">
		<!-- Join / Deposit View -->
		<div v-if="tableView">
			<!-- Toggle Tabs  -->
			<div class="flex justify-between mx-[20px]">
				<!-- All / My -->
				<div class="p-[10px] bg-black">
					<ul class="flex">
						<li
							v-for="tab in tabs"
							:key="tab"
							@click="
								portfolioStore.changeActivePortfolioType(),
									(disabled = true)
							"
							class="py-[8px] px-[15px] text-[14px] w-[160px] uppercase cursor-pointer"
							:class="[
								portfolioStore.activePortfolioType === tab.text
									? 'bg-[#2D3035] text-white'
									: 'bg-black text-[#868C9D] shadow-[0px_0px_5px_rgba(0,0,0,0.5);]',
							]"
						>
							{{ tab.text }}
						</li>
					</ul>
				</div>

				<!-- Join / create  -->
				<div
					class="flex items-center gap-[12px]"
					v-if="portfolioStore.activePortfolioType === 'All Portfolios'"
				>
					<button
						@click="$emit('doDeposit')"
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
						@click="portfolioStore.showCreate(), (tableView = false)"
						class="btn btn-primary-outline w-[125px]"
					>
						Create
					</button>
				</div>

				<!-- Deposit / withdraw  -->
				<div class="flex items-center gap-[12px]" v-else>
					<button
						@click="$emit('doDeposit')"
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
							<td class="border-r border-r-[#2D3035] pr-[30px]">
								{{ portfolio.fee }}
							</td>
							<td class="pl-[20px]">{{ portfolio.d7 }}</td>
							<td>{{ portfolio.d30 }}</td>
							<td>{{ portfolio.d90 }}</td>
							<td class="mr-[20px] pr-[18px]">{{ portfolio.y1 }}</td>
						</tr>
					</tbody>

					<!-- My Portfolios  -->
					<tbody
						v-if="portfolioStore.activePortfolioType === 'My Portfolios'"
					>
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
								{{ portfolio.fee }}
							</td>
							<td class="pl-[20px]">{{ portfolio.d7 }}</td>
							<td>{{ portfolio.d30 }}</td>
							<td>{{ portfolio.d90 }}</td>
							<td class="mr-[20px] pr-[18px]">{{ portfolio.y1 }}</td>
						</tr>
						<td class="text-white text-[12px] ml-[16px]" v-else>
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
			<!-- Top -->
			<div class="p-[10px]">
				<!-- Go back - Create first view -->
				<button
					v-if="firstView"
					class="button text-[#00FF00] uppercase flex gap-[14px] items-center"
					pro
					@click="
						portfolioStore.showJoin(),
							(tableView = true),
							(firstView = true)
					"
				>
					<img src="@/assets/img/direction.svg" alt="" />
					Go BACK
				</button>

				<!-- Go back - Create second view -->
				<button
					v-else
					class="button text-[#00FF00] uppercase flex gap-[14px] items-center mb-[16px]"
					@click="firstView = true"
				>
					<img src="@/assets/img/direction.svg" alt="" />
					Go BACK
				</button>

				<div class="p-[10px] bg-black" v-if="!firstView">
					<div class="flex">
						<div
							class="py-[8px] px-[15px] text-[14px] uppercase cursor-text bg-black text-[#868C9D]"
						>
							Manage portfolio
						</div>

						<div
							class="py-[8px] px-[15px] text-[14px] uppercase cursor-pointer bg-[#2D3035] text-white"
						>
							{{ portfolioName }}
						</div>
					</div>
				</div>
			</div>

			<hr class="border-[#2D3035]" />

			<div v-if="firstView" class="">
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

					<button
						@click="$emit('doDeposit'), assignName()"
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

			<div v-else>
				<table class="table-auto w-full mt-[32px]">
					<thead>
						<tr
							class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[10px] px-[30px]"
						>
							<th class="pl-[20px]">ALLOCATION</th>
							<th>TOKEN</th>
							<th>PRICE</th>
							<th class="border-r border-r-[#2D3035]">MC</th>
							<th class="pl-[20px]">7D%</th>
							<th>30D%</th>
							<th>90D%</th>
							<th class="pr-[30px]">1YR%</th>
						</tr>
					</thead>

					<tbody>
						<tr
							class="text-left py-[20px] mx-[28px] border-b border-b-[#2D3035] text-white hover:bg-[#003D3B]"
						>
							<td class="flex items-center gap-[20px]">
								<img src="@/assets/img/delete.svg" alt="" /><input
									type="text"
									name=""
									id=""
									v-model="allocation"
								/>
							</td>
							<td></td>
							<td></td>
							<td class="border-r border-r-[#2D3035] pr-[30px]"></td>
							<td class="pl-[20px]"></td>
							<td></td>
							<td></td>
							<td class="mr-[20px] pr-[18px]"></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePortfolios } from "@/stores/Portfolios";

onMounted(() => {
	portfolioStore.getAllPortfolios();
});

const portfolioStore = usePortfolios();

const disabled = ref(true);

const tableView = ref(true);

const firstView = ref(true);

const portfolioName = ref("KachiBTC");

const fundFee = ref("1.0");

const tabs = ref([
	{
		text: "All Portfolios",
	},
	{
		text: "My Portfolios",
	},
]);

const disabledDepToPortfolio = computed(
	() => !portfolioName.value || !fundFee.value
);

const placeholder = ref(25);

const allocation = computed(() => {
	return placeholder.value + "%";
});

function toggleDisabled() {
	disabled.value = false;
}

function assignName() {
	portfolioStore.selectedPortfolio.name = portfolioName.value;
}
</script>

<style lang="postcss">
.btn {
	@apply py-[8px] px-[15px] uppercase text-white;
}

.btn-primary {
	@apply bg-[#005A57] border border-[#005A57];
}
.btn-primary-outline {
	@apply bg-transparent border border-[#005A57] hover:bg-[#005A57];
}

label {
	@apply block;
}
</style>
