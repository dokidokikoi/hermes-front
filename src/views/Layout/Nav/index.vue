<template>
  <div style="height: 60px;display: flex;justify-content: center; align-items: center;">
    <h1 style="font-size: 1.5em;font-weight: 800; color: aliceblue;">Haru Admin</h1>
  </div>
  <el-menu
    router
    :collapse-transition="true"
    :default-active="$route.path"
    :unique-opened="true"
    class="el-menu-vertical-demo"
    background-color="#304156"
    text-color="#fff"
  >
    <el-menu-item index="/">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-sub-menu index="/system">
      <template #title>
        <el-icon><Lock /></el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/system/setting">
        <el-icon><WindPower /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
      <el-menu-item index="/system/tag">
        <el-icon><WindPower /></el-icon>
        <span>标签管理</span>
      </el-menu-item>
      <el-menu-item index="/system/category">
        <el-icon><WindPower /></el-icon>
        分类管理
      </el-menu-item>
      <el-menu-item index="/system/series">
        <el-icon><WindPower /></el-icon>
        系列管理
      </el-menu-item>
      <el-menu-item index="/system/person">
        <el-icon><WindPower /></el-icon>
        人员管理
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/game">
      <template #title>
        <el-icon><Notebook /></el-icon>
        <span>游戏</span>
      </template>
      <el-menu-item index="/game">
        <el-icon><WindPower /></el-icon>
        游戏列表
      </el-menu-item>
      <el-menu-item index="/game/character">
        <el-icon><WindPower /></el-icon>
        角色列表
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/scraper">
      <template #title>
        <el-icon><Notebook /></el-icon>
        <span>刮削</span>
      </template>
      <el-menu-item index="/scraper/game">
        <el-icon><DataLine /></el-icon>
        <span>游戏</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {HomeFilled, Notebook, WindPower, Message, Link, Lock, User, DataLine} from '@element-plus/icons-vue'
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu.el-menu--collapse span{
  display: none !important;
}

::-webkit-scrollbar {
  display: none;
}
</style>
