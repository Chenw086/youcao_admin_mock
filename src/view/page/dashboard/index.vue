<template>
  <div class="flex w-full flex-col gap-y-[24px]">
    <DashboardCard title="收益情况">
      <div class="flex flex-wrap gap-[12px] py-[12px]">
        <div
          class="gap-y-p-[12px] box-border flex w-[220px] flex-col rounded-[12px] p-[12px]"
          :class="item.style.backgroundColor"
          v-for="item in overviewDataFormat"
          :key="item.title"
        >
          <div class="flex items-center">
            <span class="text-[28px] font-medium">{{ item.title }}</span>
          </div>
          <div class="text-[22px] font-light">{{ item.number }}</div>
        </div>
      </div>
    </DashboardCard>

    <DashboardCard title="订单">
      <div class="flex flex-col gap-y-[12px] py-[12px] pr-[12px]">
        <div
          class="relative flex flex-col gap-y-[12px] p-[12px] pb-[24px]"
          :class="{ 'van-hairline--bottom': index < orderList.length - 1 }"
          v-for="(item, index) in orderList"
          :key="item.id"
        >
          <div class="absolute top-0 right-0">
            <van-tag type="primary">{{ item.orderStatusDesc }}</van-tag>
          </div>
          <div class="text-[28px] font-medium">{{ item.productName }}</div>
          <div class="flex items-center gap-x-[6px] text-[26px]">
            <span class="text-black">加盟商：</span>
            <span class="text-[22px] text-gray-500">{{ item.franchiseeName }}</span>
          </div>
          <div class="flex items-center gap-x-[6px] text-[26px]">
            <span class="text-black">酒店：</span>
            <span class="text-[22px] text-gray-500">{{ item.hotelName }}</span>
          </div>
          <div class="flex items-center gap-x-[6px] text-[26px]">
            <span class="text-black">房间号：</span>
            <span class="text-[22px] text-gray-500">{{ item.roomNumber }}</span>
          </div>
          <div class="flex items-center gap-x-[6px] text-[26px]">
            <span class="text-black">支付时间：</span>
            <span class="text-[22px] text-gray-500">{{ item.payTime || item.createTime }}</span>
          </div>
          <div class="flex items-center gap-x-[6px] text-[26px]">
            <span class="text-black">商品价格:</span>
            <span class="text-[22px] text-gray-500">{{ item.price }}</span>
            <span class="ml-[20px] text-black">押金价格:</span>
            <span class="text-[22px] text-gray-500">{{ item.depositAmount }}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import type { UserStatisticsResult } from '@/api/model/userModel'
  import { INCOME_LIST } from './config'
  import DashboardCard from './component/card.vue'
  import type { OrderListItem } from '@/api/model/orderModel'
  import summary from '@/data/summary.json'
  import top5 from '@/data/top5.json'
  defineOptions({
    name: 'DashboardPage',
  })
  const overviewData = ref({} as UserStatisticsResult['overview'])
  const orderList = ref<OrderListItem[]>([])
  const userStore = useUserStore()
  const role = computed(() => userStore.role)
  const overviewDataFormat = computed(() => {
    return INCOME_LIST.map((item) => ({
      ...item,
      number:
        overviewData.value[
          item[role.value as keyof typeof item] as keyof UserStatisticsResult['overview']
        ] || 0,
    }))
  })
  onMounted(async () => {
    if (role.value === 'admin') {
      overviewData.value = summary as any
    }

    if (role.value === 'admin') {
      orderList.value = top5 as any
    }
  })
</script>

<style scoped></style>
