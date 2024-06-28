<script setup>
import { searchGame } from "@/api/game"
import { listDeveloper } from "@/api/developer"
import { listPublisher } from "@/api/publisher"
import { listSeries } from "@/api/series"
import { listTag } from "@/api/tag"
import { listCategory } from "@/api/category"
import { ref } from "vue";
import { imageUrl } from "@/utlis/image"
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router';
import { Search } from '@element-plus/icons-vue'

const page = ref({
  "page":1, 
  "page_size":20
})
const searchParam = ref({
  keyword: "",
  tags: [],
  series: 0,
  category: 0,
  publisher: 0,
  developer: 0,
  full_text: false
})

const route = useRoute()
const keyword = ref("")
if (route.query.tag) {
  keyword.value += ` #${route.query.tag}`
}
if (route.query.category_id) {
  searchParam.value.category = parseInt(route.query.category_id)
}
if (route.query.series_id) {
  searchParam.value.series = parseInt(route.query.series_id)
}
if (route.query.publisher_id) {
  searchParam.value.publisher = parseInt(route.query.publisher_id)
}
if (route.query.developer_id) {
  searchParam.value.developer = parseInt(route.query.developer_id)
}

const total = ref(0)
const games = ref([])
function search() {
  let tags = []
  searchParam.value.keyword = ""
  keyword.value.split(" ").forEach(e => {
    if (e && e.slice(0,1) === '#') {
      tags.push(e.slice(1))
    } else if (!searchParam.value.keyword) {
      searchParam.value.keyword = e
    }
  })
  searchParam.value.tags = tags
  searchGame(searchParam.value,page.value).then(res => {
    games.value = res.data.list
    total.value = res.data.total
  })
}
search()

const allDevelopers = ref([])
const allPublishers = ref([])
const allSeries = ref([])
const allTags = ref([])
const allCategory = ref([])
function getOptions() {
  listDeveloper().then(res => {
    allDevelopers.value = res.data.list
  })
  listPublisher().then(res => {
    allPublishers.value = res.data.list
  })
  listSeries().then(res => {
    allSeries.value = res.data.list
  })
  listTag().then(res => {
    allTags.value = res.data.list
  })
  listCategory().then(res => {
    allCategory.value = res.data.list
  })
}
getOptions()

function pageChange(current) {
  page.value.page = current
  search()
}

function chooseTag(tag) {
  if (tag) {
    keyword.value += ` #${tag}`
  }
}
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
      <el-col :span="12">
        <el-select
          placeholder="标签"
          style="width: 100%"
          size="large"
          clearable
          filterable
          @change="chooseTag"
        >
          <el-option
            v-for="item in allTags"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="6">
        <el-select
          v-model="searchParam.category"
          placeholder="分类"
          style="width: 100%"
          filterable
          clearable
        >
          <el-option
            v-for="item in allCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="searchParam.series"
          placeholder="系列"
          style="width: 100%"
          filterable
          clearable
        >
          <el-option
            v-for="item in allSeries"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="searchParam.publisher"
          placeholder="发行"
          style="width: 100%"
          filterable
          clearable
        >
          <el-option
            v-for="item in allPublishers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="searchParam.developer"
          placeholder="开发"
          style="width: 100%"
          filterable
          clearable
        >
          <el-option
            v-for="item in allDevelopers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
  <ul class="game-list">
    <li class="game" v-for="g in games" :key="g.id">
      <a class="cover" :href="`/game/${g.id}`">
        <el-image class="cover-inner" :src="imageUrl(g.cover)" fit="contain" />
      </a>
      <div class="content">
        <h4 class="title">{{ g.name }}</h4>
        <p style="font-size: 0.9em;color:gray;margin-top: 4px;">发行: <el-tag type="warning" v-if="g.publisher">{{ g.publisher.name }}</el-tag></p>
        <p style="font-size: 0.9em;color:gray;margin-top: 4px;">分类: <el-tag type="success" v-if="g.category">{{ g.category.name }}</el-tag></p>
        <div style="margin-top: 7px">
          <el-tag
            v-for="(tag) in g.tags.slice(0,20)"
            :key="tag.id"
            size="small"
            style="margin-right: 5px;margin-bottom: 5px;flex: 0,0,70px;"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </li>
  </ul>
  <el-pagination style="margin-top: 20px;" v-model:current-page="page.page" v-model:page-size="page.page_size" :pager-count="15" @current-change="pageChange" background layout="prev, pager, next" :size="page.page_size" :total="total" />

</template>

<style scoped>
.game-list, .game {
  list-style: none;
  margin: 0;
  padding: 0;
}
.game-list::after{
  content: "";
  display: table;
  clear: both;
}
.game {
  float: left;
  margin: 10px;
  width: 376px;
  /* min-width: 370px; */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  /* align-items: center; */
  /* box-sizing: border-box; */
  overflow: hidden;
  border-radius: 5px;
  height: 228px;
}
.game .cover-inner {
  width: 154px;
  height: 220px;
}
.game .cover {
  display: block;
  background-color: rgb(244, 244, 244);
  margin: 4px
}
.game .content {
  height: 100%;
  width: 220px;
  flex-flow:column;
  padding: 4px
}
.title {
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>