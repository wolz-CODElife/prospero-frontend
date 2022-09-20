<template>
	<div>
		<table class="table-auto w-full absolute top-[65px]">
			<thead>
				<tr
					class="text-[#868C9D] text-left py-[5px] px-[30px] bg-[#191A20]"
				>
					<th class="pl-[20px]">
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</th>
					<th>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</th>
					<th class="pl-[20px]">
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</th>
					<th>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</th>
					<th>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</th>
					<th class="pr-[30px]">
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</th>
				</tr>
			</thead>

			<tbody>
				<tr
					v-for="i in [1, 2, 3, 4]"
					key="portfolio"
					class="text-left py-[4px] mx-[28px]"
				>
					<td class="pl-[20px]">
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</td>
					<td>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</td>
					<td>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</td>
					<td>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</td>
					<td>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</td>
					<td>
						<div class="p-[10px] bg-[#FFFFFF0A] animate-pulse"></div>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Bottom -->
		<div class="grid grid-cols-12 absolute bottom-[10px] inset-x-[20px]">
			<!-- Search -->
			<div class="col-span-5">
				<div
					class="py-[9px] pl-[28px] pr-[12px] bg-[#FFFFFF0A] animate-pulse"
				></div>
			</div>

			<!-- Pagination  -->
			<div
				class="col-span-6 col-end-13 py-[16px] bg-[#FFFFFF0A] animate-pulse"
			></div>
		</div>
	</div>
</template>

<script setup></script>

<style lang="postcss" scoped>
td,
th {
	@apply py-[8px] text-[13px];
}

td:not(:first-child),
th:not(:first-child) {
	@apply px-[14px];
}
</style>
