<template>
	<div
		class="fixed top-0 z-[100] inset-0 overflow-y-hidden bg-black/80"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-end justify-center min-h-screen lg:pt-[24px] lg:px-[24px] lg:pb-[20px] text-center sm:block sm:p-0"
		>
			<div class="fixed inset-0" aria-hidden="true"></div>
			<span
				class="hidden sm:inline-block sm:align-middle sm:h-screen"
				aria-hidden="true"
				>&#8203;</span
			>
			<div
				class="relative inline-block align-bottom bg-[#1F2127] rounded-lg text-left overflow-hidden shadow-[0_4px_50px_rgba(0,0,0,0.1)] transform transition-all sm:my-[8px] sm:align-middle sm:max-w-[398px] sm:w-full"
			>
				<div
					class="bg-[#1F2127] px-[16px] pt-[20px] pb-[24px] sm:p-[24px] sm:pb-[16px]"
				>
					<!-- close button  -->
					<button @click="$emit('close')" class="float-right">
						<img src="@/assets/img/close.svg" alt="" />
					</button>

					<!-- Body  -->
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style></style>
