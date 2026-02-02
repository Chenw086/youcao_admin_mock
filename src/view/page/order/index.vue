<template>
  <div class="h-full w-full">
    <van-pull-refresh
      v-model="loading"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="listLoading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="flex flex-col gap-y-[24px] px-[12px] py-[24px]">
          <!-- 数量信息 -->
          <div class="flex items-center gap-x-[12px]">
            <span class="text-[28px] font-medium">订单数量：</span>
            <span class="text-[28px] font-medium">{{ total }}</span>
            <span class="text-[28px] font-medium">（下拉刷新数据，上拉加载更多）</span>
          </div>

          <div
            class="relative box-border flex flex-col gap-y-[12px] rounded-[12px] border border-gray-200 p-[12px]"
            v-for="item in formatList"
            :key="item.id"
          >
            <div class="absolute top-[12px] right-[12px]">
              <van-tag :type="item.status">{{ item.statusLabel }}</van-tag>
            </div>

            <div
              class="flex items-center gap-x-[12px]"
              v-for="value in orderOptions"
              :key="value.value"
            >
              <span class="text-[24px] font-medium">{{ value.label + ':' }}</span>
              <span class="text-[22px] font-medium">
                {{ item[value.value as keyof OrderListItem] }}
              </span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import type { OrderListItem } from '@/api/model/orderModel'
  import { orderOptions, orderStatusOptions } from './options'
  import type { TagType } from 'vant'
  import output from '@/data/output.json'
  defineOptions({
    name: 'OrderPage',
  })
  const pageOptions = reactive({
    pageNo: 0,
    pageSize: 20,
  })

  const queryList = async () => {
    return {
      list: output.slice(
        (pageOptions.pageNo - 1) * pageOptions.pageSize,
        pageOptions.pageNo * pageOptions.pageSize,
      ),
      total: output.length,
      current: pageOptions.pageNo,
      pages: Math.ceil(output.length / pageOptions.pageSize),
    }
  }

  const list = ref<OrderListItem[]>([])
  const currentPage = ref(0)
  const loading = ref(false)
  const listLoading = ref(false)
  const finished = ref(false)
  const total = ref(0)
  const onLoad = async () => {
    pageOptions.pageNo++
    const res = await queryList()
    total.value = res.total
    list.value = [...list.value, ...res.list] as OrderListItem[]
    currentPage.value = res.current
    listLoading.value = false
    if (res.current === res.pages) {
      finished.value = true
    }
  }
  const onRefresh = async () => {
    finished.value = false
    loading.value = true
    pageOptions.pageNo = 1
    const res = await queryList()
    total.value = res.total
    list.value = res.list as OrderListItem[]
    currentPage.value = res.current
    loading.value = false
  }

  const formatList = computed(() => {
    return list.value.map((item) => {
      return {
        ...item,
        status: orderStatusOptions[item.orderStatus]?.theme as TagType,
        statusLabel: orderStatusOptions[item.orderStatus]?.label,
      }
    })
  })
</script>

<style scoped></style>
