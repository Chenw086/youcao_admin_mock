<template>
  <div class="flex min-h-screen w-full flex-col bg-white">
    <van-nav-bar
      :title="title"
      fixed
      placeholder
      safe-area-inset-top
    />
    <div class="box-border flex-1 p-[12px]">
      <router-view v-slot="{ Component, route }">
        <transition
          name="fade"
          mode="out-in"
        >
          <keep-alive>
            <component
              :is="Component"
              :key="route.name"
              :route="route"
            />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <van-tabbar
      v-model="active"
      fixed
      route
      placeholder
      safe-area-inset-bottom
    >
      <van-tabbar-item
        replace
        icon="home-o"
        to="/dashboard"
      >
        主页
      </van-tabbar-item>
      <van-tabbar-item
        replace
        icon="birthday-cake-o"
        to="/device"
      >
        设备
      </van-tabbar-item>
      <van-tabbar-item
        replace
        icon="balance-list-o"
        to="/order"
      >
        订单
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  defineOptions({
    name: 'AppLayout',
  })
  const active = ref(0)
  const route = useRoute()
  const title = computed(() => route.meta.title as string)
</script>

<style lang="less" scoped>
  .fade-leave-active,
  .fade-enter-active {
    transition: opacity 0.2s cubic-bezier(0.38, 0, 0.24, 1);
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
