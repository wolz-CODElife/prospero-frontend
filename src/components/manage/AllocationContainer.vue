<template>
	<div>
		<hr class="border-[#2D3035]" />
		<SelectPortfolio />
		<div class="flex items-center gap-[28px] p-[10px]">
			<SelectToken />
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

			<!-- Accepting new investors -->
			<div class="flex items-center gap-[10px] bg-[#005A57] p-[5px_10px]">
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

		<table class="table-auto w-full mb-auto">
			<thead>
				<tr
					class="token text-[#868C9D] text-left border-b border-b-[#2D3035] px-[30px]"
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
					class="token text-left mx-[28px] border-b border-b-[#2D3035] text-white"
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
</template>

<script setup>
import SelectToken from "./SelectToken.vue";
import SelectPortfolio from "./SelectPortfolio.vue";
</script>
