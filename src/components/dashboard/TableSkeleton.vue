<template>
    <div class="min-h-[220px]">
        <table class="table-auto w-full my-[20px]">
            <thead>
                <tr class="text-[#868C9D] text-left border-b border-b-[#2D3035] py-[10px] px-[30px]">
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
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                    <td class="p-[10px]"><div class="p-[10px] rounded-[20px] bg-[#FFFFFF0A] animate-pulse"></div></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="grid grid-cols-12 px-[20px] my-[25px]">
        <!-- Search -->
        <div class="col-span-5">
            <div class="p-[20px_10px] w-full rounded-[5px] bg-[#000000] animate-pulse"></div>
        </div>

        <!-- Pagination  -->
        <div class="col-span-6 col-end-13">
            <div class="flex justify-end items-center gap-[15px]">
                <span class="text-[#C3C7CD] text-[14px]">Page</span>

                <!-- Current page  -->
                <div class="p-[20px_10px] w-[50px] rounded-[5px] bg-[#000000] animate-pulse"></div>
                <!-- Total pages count  -->
                <span class="text-[#C3C7CD] text-[14px]" >of
                    <span class="p-[10px_20px] ml-[10px] rounded-[5px] bg-[#FFFFFF0A] animate-pulse"></span>
                </span>

                <!-- Prev & Next  -->
                <div class="flex gap-0">
                    <div class="p-[5px] rounded-[5px] bg-[#005A57] animate-pulse">
                        <img src="@/assets/img/left-angle.svg" alt="" />
                    </div>
                    <div class="p-[5px] rounded-[5px] bg-[#005A57] animate-pulse">
                        <img src="@/assets/img/left-angle.svg" alt="" class="transform rotate-180" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>