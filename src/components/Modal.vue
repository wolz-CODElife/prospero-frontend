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
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.243 6.243L11.486 11.486M1 11.486L6.243 6.243L1 11.486ZM11.486 1L6.242 6.243L11.486 1ZM6.242 6.243L1 1L6.242 6.243Z"
                stroke="#C3C7CD"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
