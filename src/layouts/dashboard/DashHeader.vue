<template>
  <div>
    <div class="grid grid-cols-12 h-full text-[#868C9D]">
      <div
        class="col-span-8 bg-black py-[30px] pl-[30px] border"
        :class="[
          active === 'holdings'
            ? 'border-white border-b-0'
            : 'border-black border-b-white',
        ]"
      >
        <div class="flex items-center justify-between font-medium uppercase">
          <!-- Types of asset -->
          <div class="w-[130px] p-[10px] bg-[#2D3035]">
            <ul>
              <li
                v-for="tab in tabs"
                :key="tab"
                @click="changeTab(tab.text)"
                class="p-[6px] flex gap-[10px] items-center"
                :class="[
                  activeTab === tab.text
                    ? 'bg-black text-white shadow-[0px_0px_5px_rgba(0,0,0,0.5);]'
                    : 'bg-[#2D3035] text-[#868C9D]',
                ]"
              >
                <span>
                  <img :src="tab.icon" alt="" class="w-[20px] h-[20px]"
                /></span>
                {{ tab.text }}
              </li>
            </ul>
          </div>

          <!-- Left stats -->
          <div class="flex-1 ml-[30px]">
            <h2 class="text-[#868C9D] text-[14px]">My holdings</h2>
            <h3 class="text-white text-[24px]">$0</h3>
            <hr class="my-[12px] border-[#2D3035]" />
            <h2 class="text-[#868C9D] text-[14px]">ROI</h2>
            <h3 class="text-white text-[24px]">
              +$0 <span class="text-[14px]">0% <span>^</span></span>
            </h3>
          </div>

          <!--Toggler  -->
          <button @click="toggleActive" class="mx-[10px]">
            <img
              src="@/assets/img/green-toggle.svg"
              alt=""
              v-if="active === 'holdings'"
            />
            <img src="@/assets/img/white-toggle.svg" alt="" v-else />
          </button>

          <!-- Right stats -->
          <div class="flex-1">
            <div class="border-l border-[#2D3035] pl-[10px]">
              <h2 class="text-[#868C9D] text-[14px]">Deposits</h2>
              <h3 class="text-white text-[16px]">$0</h3>
            </div>

            <hr class="my-[12px] border-[#2D3035]" />
            <div class="border-l border-[#2D3035] pl-[10px]">
              <h2 class="text-[#868C9D] text-[14px]">Withdrawals</h2>
              <h3 class="text-white text-[16px]">$0</h3>
            </div>
          </div>
        </div>
      </div>

      <div
        class="col-span-4 bg-black border"
        :class="[
          active === 'holdings'
            ? 'border-black border-b-white'
            : 'border-white border-b-0',
        ]"
      >
        <div
          class="h-full flex flex-col gap-y-[24px] justify-center items-center"
        >
          <h2 class="text-center text-[14px] uppercase">{{ props.cmd }}</h2>
          <svg
            width="34"
            height="33"
            viewBox="0 0 34 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.1561 15.7656C33.0605 15.5381 32.8997 15.344 32.6939 15.2078C32.4881 15.0715 32.2467 14.9992 31.9999 15H25.7499V11.25C25.7499 10.9185 25.6182 10.6005 25.3838 10.3661C25.1493 10.1317 24.8314 10 24.4999 10H9.49988C9.16836 10 8.85042 10.1317 8.616 10.3661C8.38158 10.6005 8.24988 10.9185 8.24988 11.25V15H1.99988C1.7531 14.9992 1.51161 15.0715 1.30585 15.2078C1.10008 15.344 0.939256 15.5381 0.843629 15.7656C0.753572 15.9965 0.730725 16.2482 0.777733 16.4915C0.82474 16.7348 0.939679 16.9599 1.10925 17.1406L16.1093 32.1406C16.3482 32.3717 16.6675 32.5008 16.9999 32.5008C17.3322 32.5008 17.6516 32.3717 17.8905 32.1406L32.8905 17.1406C33.0601 16.9599 33.175 16.7348 33.222 16.4915C33.269 16.2482 33.2462 15.9965 33.1561 15.7656ZM16.9999 29.4844L5.0155 17.5H9.49988C9.8314 17.5 10.1493 17.3683 10.3838 17.1339C10.6182 16.8995 10.7499 16.5815 10.7499 16.25V12.5H23.2499V16.25C23.2499 16.5815 23.3816 16.8995 23.616 17.1339C23.8504 17.3683 24.1684 17.5 24.4999 17.5H28.9843L16.9999 29.4844ZM8.24988 1.25C8.24988 0.918479 8.38158 0.600537 8.616 0.366117C8.85042 0.131696 9.16836 0 9.49988 0H24.4999C24.8314 0 25.1493 0.131696 25.3838 0.366117C25.6182 0.600537 25.7499 0.918479 25.7499 1.25C25.7499 1.58152 25.6182 1.89946 25.3838 2.13388C25.1493 2.3683 24.8314 2.5 24.4999 2.5H9.49988C9.16836 2.5 8.85042 2.3683 8.616 2.13388C8.38158 1.89946 8.24988 1.58152 8.24988 1.25ZM8.24988 6.25C8.24988 5.91848 8.38158 5.60054 8.616 5.36612C8.85042 5.1317 9.16836 5 9.49988 5H24.4999C24.8314 5 25.1493 5.1317 25.3838 5.36612C25.6182 5.60054 25.7499 5.91848 25.7499 6.25C25.7499 6.58152 25.6182 6.89946 25.3838 7.13388C25.1493 7.3683 24.8314 7.5 24.4999 7.5H9.49988C9.16836 7.5 8.85042 7.3683 8.616 7.13388C8.38158 6.89946 8.24988 6.58152 8.24988 6.25Z"
              fill="#868C9D"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  cmd: {
    type: String,
    default: "Select First Portfolio to Join",
  },
});

const active = ref("holdings");

function toggleActive() {
  if (active.value === "holdings") {
    active.value = "portfolio";
  } else {
    active.value = "holdings";
  }
}

const activeTab = ref("USD");

const tabs = ref([
  {
    icon: "https://i.postimg.cc/Mpmky9Ms/image.png",
    text: "USD",
  },
  {
    icon: "https://i.postimg.cc/MGnDWTSy/image.png",
    text: "BTC",
  },
  {
    icon: "https://i.postimg.cc/br1T18qh/image.png",
    text: "AVAX",
  },
]);

function changeTab(tab) {
  activeTab.value = tab;
}
</script>
