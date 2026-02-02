<template>
  <div class="flex flex-col rounded-[12px] border border-gray-200 p-[12px]">
    <div
      class="van-hairline--bottom flex items-center justify-between py-[12px] text-[30px] font-bold"
    >
      <span>{{ props.title }}</span>
      <div
        v-if="props.name"
        class="flex items-center gap-x-[4px]"
        @click="handleClick"
      >
        <span class="text-[24px] font-light">查看更多</span>
        <van-icon name="arrow" />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  defineOptions({
    name: 'DashboardCard',
  })
  const props = defineProps<{
    title: string
    name?: string
  }>()
  const router = useRouter()
  const handleClick = () => {
    if (props.name) {
      router.push({ name: props.name })
    }
  }
</script>

<style scoped>
  @reference '../../../../styles/tailwind.css';

  :deep(.van-icon) {
    @apply text-[24px] font-medium;
  }
</style>
