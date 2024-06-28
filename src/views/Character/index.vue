<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from "vue";
import { useRoute } from 'vue-router';
import { searchCharacter } from '@/api/character'
import { imageUrl } from "@/utlis/image"

const page = ref({
  "page":1, 
  "page_size":20,
  "order_by": "created_at desc"
})
const searchParam = ref({
  keyword: "",
  tags: [],
  full_text: false
})

const route = useRoute()
const keyword = ref("")

const characters = ref([])
const total = ref(0)
function search() {
  searchCharacter(searchParam.value, page.value).then(res => {
    characters.value = res.data.list
    total.value = res.data.total
  })
}

function pageChange(current) {
  searchParam.value.keyword = keyword.value
  page.value.page = current
  search()
}

search()
</script>

<template>
  <div style="margin-bottom: 30px;margin-top: 20px;">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input
          v-model="keyword"
          placeholder="Please input"
          @keyup.enter="search"
          size="large"
          clearable
        >
          <template #append>
            <el-button :icon="Search" @click="search" />
          </template>
        </el-input>
      </el-col>
    </el-row>
    <ul style="margin-top: 20px;" class="character-list"> 
      <li class="character" v-for="c in characters" :key="c.id">
        <a :href="`/character/${c.id}`">
          <el-image class="cover-inner" :src="imageUrl(c.cover)" fit="contain" />
        </a>
        <p class="title">{{ c.name }}</p>
      </li>
    </ul>
  </div>
  <el-pagination 
    style="margin-top: 20px;" 
    v-model:current-page="page.page" 
    v-model:page-size="page.page_size" 
    :pager-count="15" 
    @current-change="pageChange" 
    background layout="prev, pager, next" 
    :size="page.page_size" 
    :total="total" />
</template>

<style scoped>
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.character-list::after {
  display: table;
  content: '';
  clear: both;
}
.character {
  height: 235px;
  width: 180px;
  background-color:rgb(228, 239, 235);
  position: relative;
  float: left;
  margin: 0 40px 30px 0;
  padding: 3px 1px 1px 0;
}
.cover-inner {
  height: 210px;
  width: 180px;
}
.title {
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>