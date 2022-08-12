<template>
	<div class="min-h-[220px]">
		<table class="table-auto w-full my-[20px]">
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
			<tbody>
				<tr v-for="i in [1, 2, 3, 4]">
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
					<td class="p-[10px]">
						<div
							class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"
						></div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup></script>
