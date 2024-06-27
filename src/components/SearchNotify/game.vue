<script setup>
import { ref } from 'vue';
import { searchGame } from "@/api/game"
import { imageUrl } from "@/utlis/image"

const emit = defineEmits(['select'])
const props = defineProps(['size'])

const name = ref("")
const data = ref([

])
function search() {
  if (name.value === "") {
    data.value=[]
    return
  }
  searchGame({
    keyword: name.value,
    full_text: false
  }, {page: 1, page_size: 100}).then(res => {
    data.value = res.data.list
  })
}
function select(item) {
  emit("select", item)
}
</script>

<template>
  <div class="search">
    <el-input @input="search" :size="size" v-model="name" clearable></el-input>
    <div class="body" v-if="data.length">
      <div class="card" v-for="item in data" :key="item.id">
        <div @click="select(item)" class="cover">
          <el-image style="height: 100%;width: 100%;" :src="imageUrl(item.cover)" fit="contain" />
        </div>
        <div class="info">
          <h3 @click="select(item)">{{ item.name }}</h3>
          <p> {{ item.story }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search {
  width: 100%;
  position: relative;
}
.body {
  z-index: 1000;
  background-color: aliceblue;
  width: 100%;
  position: absolute;
  left: 0;
  top: 35px;
  max-height: 50vh;
  overflow-y: auto;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.card {
  display: flex;
  height: 160px;
  margin: 10px;
}
.cover {
  width: 35%;
  cursor: pointer;
}
.info {
  width: 65%;
  margin-left: 10px;
}
.info h3:hover {
  color: red;
  cursor: pointer;
}
.info p {
  margin-top: 10px;
  color: gray;
  display: -webkit-box; /* 针对Webkit浏览器的属性 */
  display: -moz-box; /* 针对Firefox浏览器的属性 */
  -webkit-line-clamp: 5; /* 限制最大行数为5 */
  -moz-line-clamp: 5; /* 限制最大行数为5 */
  -webkit-box-orient: vertical;
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 省略号 */
}
</style>