<template>
	<div class="w-full bg-[#000] text-left p-[20px] mb-[20px]">
		<h2 class="text-[#868C9D] text-[12px] mb-[10px] uppercase">
			Connected Wallet
		</h2>
		<h3 class="text-white text-[12px]">
			{{ walletAddress }}
		</h3>
		<div class="mt-[20px] flex justify-between items-center">
			<!-- snowtrace  -->
			<a
				class="util uppercase text-[#868C9D] hover:text-white text-[10px] flex gap-[4px] items-center"
				href="#"
				target="_blank"
			>
				VIEW ON THE SNOWTRACE EXPLORER
				<span
					><svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.5 6.875C12.3342 6.875 12.1753 6.94085 12.0581 7.05806C11.9408 7.17527 11.875 7.33424 11.875 7.5V11.25C11.875 11.4158 11.8092 11.5747 11.6919 11.6919C11.5747 11.8092 11.4158 11.875 11.25 11.875H3.75C3.58424 11.875 3.42527 11.8092 3.30806 11.6919C3.19085 11.5747 3.125 11.4158 3.125 11.25V3.75C3.125 3.58424 3.19085 3.42527 3.30806 3.30806C3.42527 3.19085 3.58424 3.125 3.75 3.125H7.5C7.66576 3.125 7.82473 3.05915 7.94194 2.94194C8.05915 2.82473 8.125 2.66576 8.125 2.5C8.125 2.33424 8.05915 2.17527 7.94194 2.05806C7.82473 1.94085 7.66576 1.875 7.5 1.875H3.75C3.25272 1.875 2.77581 2.07254 2.42417 2.42417C2.07254 2.77581 1.875 3.25272 1.875 3.75V11.25C1.875 11.7473 2.07254 12.2242 2.42417 12.5758C2.77581 12.9275 3.25272 13.125 3.75 13.125H11.25C11.7473 13.125 12.2242 12.9275 12.5758 12.5758C12.9275 12.2242 13.125 11.7473 13.125 11.25V7.5C13.125 7.33424 13.0592 7.17527 12.9419 7.05806C12.8247 6.94085 12.6658 6.875 12.5 6.875Z"
							fill="#868C9D"
						/>
						<path
							d="M9.99996 3.125H10.9875L7.05621 7.05C6.99763 7.1081 6.95114 7.17723 6.9194 7.25339C6.88767 7.32955 6.87134 7.41124 6.87134 7.49375C6.87134 7.57626 6.88767 7.65795 6.9194 7.73411C6.95114 7.81027 6.99763 7.8794 7.05621 7.9375C7.11431 7.99608 7.18344 8.04258 7.2596 8.07431C7.33576 8.10604 7.41745 8.12237 7.49996 8.12237C7.58247 8.12237 7.66416 8.10604 7.74032 8.07431C7.81648 8.04258 7.88561 7.99608 7.94371 7.9375L11.875 4.0125V5C11.875 5.16576 11.9408 5.32473 12.058 5.44194C12.1752 5.55915 12.3342 5.625 12.5 5.625C12.6657 5.625 12.8247 5.55915 12.9419 5.44194C13.0591 5.32473 13.125 5.16576 13.125 5V2.5C13.125 2.33424 13.0591 2.17527 12.9419 2.05806C12.8247 1.94085 12.6657 1.875 12.5 1.875H9.99996C9.8342 1.875 9.67523 1.94085 9.55802 2.05806C9.44081 2.17527 9.37496 2.33424 9.37496 2.5C9.37496 2.66576 9.44081 2.82473 9.55802 2.94194C9.67523 3.05915 9.8342 3.125 9.99996 3.125Z"
							fill="#868C9D"
						/>
					</svg>
				</span>
			</a>

			<!-- copy address  -->
			<button
				class="util uppercase text-[#868C9D] hover:text-white text-[10px] flex gap-[4px] items-center"
				@click="copyToClipboard(walletAddress)"
			>
				Copy address
				<span
					><svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_364_18870)">
							<path
								d="M12.2917 2.91602H4.375C4.20924 2.91602 4.05027 2.98186 3.93306 3.09907C3.81585 3.21628 3.75 3.37526 3.75 3.54102V13.541C3.75 13.7068 3.81585 13.8657 3.93306 13.983C4.05027 14.1002 4.20924 14.166 4.375 14.166H12.2917C12.4574 14.166 12.6164 14.1002 12.7336 13.983C12.8508 13.8657 12.9167 13.7068 12.9167 13.541V3.54102C12.9167 3.37526 12.8508 3.21628 12.7336 3.09907C12.6164 2.98186 12.4574 2.91602 12.2917 2.91602ZM12.0833 13.3327H4.58333V3.74935H12.0833V13.3327Z"
								fill="#868C9D"
							/>
							<path
								d="M10.8334 1.45898C10.8334 1.29322 10.7676 1.13425 10.6504 1.01704C10.5331 0.899832 10.3742 0.833984 10.2084 0.833984H2.29175C2.12599 0.833984 1.96702 0.899832 1.84981 1.01704C1.7326 1.13425 1.66675 1.29322 1.66675 1.45898V11.459C1.66675 11.6247 1.7326 11.7837 1.84981 11.9009C1.96702 12.0181 2.12599 12.084 2.29175 12.084H2.50008V1.66732H10.8334V1.45898Z"
								fill="#868C9D"
							/>
						</g>
						<defs>
							<clipPath id="clip0_364_18870">
								<rect width="15" height="15" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</span>
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import connect from "@/composables/connect/index";

const { state } = connect();

const walletAddress = ref(state.address);

function copyToClipboard(str) {
	const el = document.createElement("textarea");
	el.value = str;
	el.setAttribute("readonly", "");
	el.style.position = "absolute";
	el.style.left = "-9999px";
	document.body.appendChild(el);
	const selected =
		document.getSelection().rangeCount > 0
			? document.getSelection().getRangeAt(0)
			: false;
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
	if (selected) {
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(selected);
	}
	alert("copied", walletAddress.value);
	// this.$notify({
	//   type: 'success',
	//   text: 'Copied!',
	//   duration: 5000,
	// })
}
</script>
