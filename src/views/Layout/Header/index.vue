<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter()
</script>

<template>
  <div class="contanier">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">
        homepage
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ router.currentRoute.value.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <UserInfo />
  </div>
</template>

<style scoped>
.contanier {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
}
</style>