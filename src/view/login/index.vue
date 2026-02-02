<template>
  <div class="flex min-h-screen w-full flex-col items-center justify-center gap-y-[24px]">
    <div
      class="from-primary to-accent mb-[10px] bg-linear-to-r bg-clip-text text-[30px] font-bold text-transparent"
    >
      诱巢科技管理系统
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="mt-[16px]">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useUserStore } from '@/store'
  import { showToast } from 'vant'
  import { useRoute, useRouter } from 'vue-router'
  defineOptions({
    name: 'LoginPage',
  })
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const onSubmit = async () => {
    await userStore.login({
      phone: username.value,
      password: password.value,
      loginType: 1,
    })

    await userStore.getUserInfo()

    showToast('登录成功')
    const redirect = route.query.redirect as string
    const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard'
    router.replace(redirectUrl)
  }
</script>

<style scoped lang="less"></style>
