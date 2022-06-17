<template>
  <div
    class="border border-t-0 border-white w-full grid grid-cols-12 gap-[10px] h-[800px] pt-[10px]"
  >
    <div class="col-span-5 grid grid-rows-6 gap-[10px]">
      <!-- Pie chart  -->
      <PieChartContainer />

      <!--Social Media  -->
      <div class="row-span-2 bg-[#191A20]"></div>
    </div>

    <div class="col-span-7 grid grid-rows-5 gap-[10px]">
      <!-- Line chart  -->
      <div class="row-span-2 bg-[#191A20]"></div>

      <!--Table  -->
      <div class="row-span-3 bg-[#191A20]"></div>
    </div>
  </div>
</template>

<script setup>
import PieChartContainer from "@/components/dashboard/PieChartContainer.vue";
</script>
