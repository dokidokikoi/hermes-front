<script setup>
import { RouterLink, RouterView } from "vue-router";
import Loading from '@/components/Loading/index.vue'

import { useGlobalStore } from '@/stores/global'
import { storeToRefs } from 'pinia'
import { ref } from "vue";
import { ElNotification } from 'element-plus'

console.log("Starting connection to WebSocket Server");
const connection = ref(new WebSocket("ws://127.0.0.1:19876/notify/scrap"))
connection.value.onmessage = function (event) {
  console.log("look, I got something from server");
  console.log(event.data);
  ElNotification({
    title: 'Title',
    message: event.data,
    type: 'success',
    duration: 5000,
  })
};
connection.value.onopen = function (event) {
  console.log(event);
  console.log("Successfully connected to the echo websocket server...");
};
connection.value.onclose = function (event) {
  console.log("Connection closed.");
  ElNotification({
    title: 'Title',
    message: "Connection closed.",
    type: 'error',
    duration: 5000,
  })
};

const globalStore = useGlobalStore()
const { loading } = storeToRefs(globalStore)
const right = ref(100)
const bottom = ref(100)
window.addEventListener('resize', function() {
  // 在窗口大小变化时执行的代码
  // 可以在这里处理响应式布局、调整元素大小、重新渲染等操作
  const windowWidth = window.innerWidth;
  if (windowWidth <= 800) {
    right.value = 20
    bottom.value = 50
  } else {
    right.value = 100
    bottom.value = 100
  }
})
const windowWidth = window.innerWidth;
if (windowWidth <= 800) {
  right.value = 20
  bottom.value = 50
} else {
  right.value = 100
  bottom.value = 100
}
</script>

<template>
  <RouterView />
  <Loading v-show="loading" />
  <el-backtop :visibility-height="400" :right="right" :bottom="bottom" />
</template>

<style scoped>
</style>
