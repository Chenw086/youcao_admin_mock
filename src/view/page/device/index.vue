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
            <span class="text-[28px] font-medium">机器数量：</span>
            <span class="text-[28px] font-medium">{{ total }}</span>
            <span class="text-[28px] font-medium">（下拉刷新数据，上拉加载更多）</span>
          </div>

          <!-- 设备列表 -->
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
              v-for="value in deviceOptions"
              :key="value.value"
            >
              <span class="text-[24px] font-medium">{{ value.label + ':' }}</span>
              <span class="text-[22px] font-medium">
                {{ item[value.value as keyof DeviceItemType] }}
              </span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex w-full items-center justify-end gap-x-[24px]">
              <van-button
                type="default"
                size="small"
                @click="
                  generateQrCode({
                    hotelId: item.hotelId,
                    roomNumber: item.roomNumber,
                  })
                "
              >
                生成二维码
              </van-button>
              <van-button
                type="primary"
                size="small"
                @click="openLock(item.id)"
              >
                开锁
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model:show="showQrCode"
      title="长按保存"
    >
      <div class="mt-[24px] mb-[24px] flex items-center justify-center">
        <QRCode :value="codeUrl"></QRCode>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from 'vue'
  import { openLock as openLockApi } from '@/api/device'
  import type { DeviceItemType } from '@/api/model/deviceModel'
  import { deviceStatusOptions, deviceOptions } from './options'
  import type { TagType } from 'vant'
  import { QRCode } from 'tdesign-mobile-vue'
  import { showConfirmDialog } from 'vant'
  import { stringifyQuery } from '@/utils/queryString'
  import deviceData from '@/data/device.json'

  const baseUrl = ref('https://youchaoapp.com/h5/index.html#/')
  const baseUrlFormat = computed(() => {
    const { mode } = import.meta.env
    let url = `${baseUrl.value}test?`
    if (mode === 'production') {
      url = `${baseUrl.value}prod?`
    }
    return url
  })

  const queryList = async () => {
    return {
      list: deviceData.slice(
        (pageOptions.pageNo - 1) * pageOptions.pageSize,
        pageOptions.pageNo * pageOptions.pageSize,
      ),
      total: deviceData.length,
      current: pageOptions.pageNo,
      pages: Math.ceil(deviceData.length / pageOptions.pageSize),
    }
  }

  const codeUrl = ref('')
  const showQrCode = ref(false)
  const loading = ref(false)
  const finished = ref(false)
  const listLoading = ref(false)
  const total = ref(0)
  const currentPage = ref(0)
  const pageOptions = reactive({
    pageNo: 0,
    pageSize: 5,
  })
  const list = ref<DeviceItemType[]>([])
  const formatList = computed(() => {
    return list.value.map((item) => {
      return {
        ...item,
        status: deviceStatusOptions[item.status]?.theme as TagType,
        statusLabel: deviceStatusOptions[item.status]?.label,
      }
    })
  })
  const onRefresh = async () => {
    finished.value = false
    loading.value = true
    pageOptions.pageNo = 1
    const res = await queryList()
    list.value = res.list as unknown as DeviceItemType[]
    total.value = res.total
    currentPage.value = res.current
    loading.value = false
  }
  const onLoad = async () => {
    pageOptions.pageNo++
    const res = await queryList()
    total.value = res.total
    list.value = [...list.value, ...res.list] as unknown as DeviceItemType[]
    currentPage.value = res.current
    listLoading.value = false
    if (res.current === res.pages) {
      finished.value = true
    }
  }
  const generateQrCode = ({ hotelId, roomNumber }: { hotelId: string; roomNumber: string }) => {
    codeUrl.value = `${baseUrlFormat.value}${stringifyQuery({
      hotelId,
      roomNumber,
    })}`
    showQrCode.value = true
  }
  const openLock = async (id: number) => {
    await showConfirmDialog({
      title: '开锁',
      message: '确定要开锁吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    await openLockApi(id)

    onRefresh()
  }
  defineOptions({
    name: 'DeviceIndex',
  })
</script>

<style scoped></style>
