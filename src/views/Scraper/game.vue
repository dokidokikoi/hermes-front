<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { Get, Search, Bind, GetRef } from "@/api/scraper"
import { imageUrl } from "@/utlis/image"
import { ElMessage } from 'element-plus'
import Scraper from "./scrape.vue";
import { useRoute } from 'vue-router';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import loading from '@/assets/images/loading.png'
import error from '@/assets/images/error.png'

const options = reactive({
  // 唯一key值
  rowKey: 'id',
  // 卡片之间的间隙
  gutter: 10,
  // 是否有周围的gutter
  hasAroundGutter: true,
  // 卡片在PC上的宽度
  width: 320,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    1200: {
      // 当屏幕宽度小于等于1200
      rowPerView: 4,
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
  // 动画效果
  animationEffect: 'animate__fadeInUp',
  // 动画时间
  animationDuration: 1000,
  // 动画延迟
  animationDelay: 300,
  // 背景色
  // backgroundColor: '#2C2E3A',
  // imgSelector
  imgSelector: 'src.original',
  // 加载配置
  loadProps: {
    loading,
    error,
  },
  // 是否懒加载
  lazyload: false,
  crossOrigin: true,
})


const gameID = ref(0)
const route = useRoute()

const scraper = ref([
  "all", "2dfan", "bangumi", "ggbases", "getchu", "dlsite"
])
const param = ref({
  name: "",
  keyword: "",
  page: 1,
  request_id: ""
})
if (route.query.keyword) {
  param.value.keyword = route.query.keyword
}
const requestID = ref("")
const source = ref("")
function search() {
  param.value.request_id = requestID.value
  Search(param.value).then(res => {
    requestID.value = res.data
    ElMessage({
      message: '成功',
      type: 'success',
    })
  })
}

const useList = function() {
  const sources = ref([])
  const searchItems = ref({
    "": []
  })

  // 加载更多
  function handleLoadMore() {
    return Get({"request_id": requestID.value}).then(res => {
      if (!res.data) {
        ElMessage.info("暂无结果")
        return
      }
      sources.value = []
      for (let k in res.data) {
        sources.value.push(k)
      }
      searchItems.value = res.data
      console.log(searchItems.value)
    })
  }

  return {
    searchItems,
    sources,
    handleLoadMore,
  }
}

const {
  searchItems,
  sources,
  handleLoadMore,
} = useList()

const list = computed(() => {
  console.log(source.value)
  console.log(searchItems.value)
  console.log(searchItems.value[source.value])
  if (searchItems.value[source.value]) {
    return searchItems.value[source.value]
  }
  return []
})

const selectMapSet = ref(new Map())
function selectItem(idx) {
  if (selectMapSet.value.has(source.value)) {
    let s = selectMapSet.value.get(source.value)
    if (s.has(idx)) {
      s.delete(idx)
    } else {
      s.add(idx)
    }
    selectMapSet.value.set(source.value, s) 
  } else {
    let s = new Set()
    s.add(idx)
    selectMapSet.value.set(source.value, s)
  }
}
function isSelected(idx) {
  if (selectMapSet.value.has(source.value)) {
    let s = selectMapSet.value.get(source.value)
    if (s.has(idx)) {
      return true
    }
  }
  return false
}
const selectedItems = computed(() => {
  let items = []
  selectMapSet.value.forEach((v, k) => {
    for (let idx of v.keys()) {
      if (searchItems.value[k] && searchItems.value[k][idx]) {
        items.push(searchItems.value[k][idx])
      }
    }
  })
  return items
})

const bindVisible = ref(false)
const bindData = ref({
  request_id: "",
  path: "",
  version: ""
})
function showBindGame() {
  GetRef({"request_id": requestID.value}).then(res => {
      bindData.value = res.data
      if (!bindData.value.path) {
        bindData.value.path = route.query.path
      }
      bindVisible.value = true
      return
  }).catch(err => {
    if (err.code === 10100) {
      bindData.value = {
        request_id: requestID.value,
      }
      if (!bindData.value.path) {
        bindData.value.path = route.query.path
      }
      bindVisible.value = true
      return
    }
  })
}
function bindGame() {
  Bind(bindData.value).then(res => {
    if (!res.code) {
      ElMessage({
        message: '成功',
        type: 'success',
      })
      bindVisible.value = false
      return
    }
    ElMessage.error(res.message)
  })
}

const showScraper = ref(false)
const scrapeRequestID = ref("")
function setScrapeRequestID(id) {
  scrapeRequestID.value = id
}
if (route.query.game_id) {
  gameID.value = route.query.game_id
  showScraper.value = true
}

function imageError(url) {
  console.error(`${url}: 加载失败`)
}
</script>

<template>
  <el-row>
    <el-col :span="22">
      <div>
        <el-input v-model="param.keyword" size="large" style="width: 440px" placeholder="关键字" />
        <el-select
          v-model="param.name"
          placeholder="刮削器"
          size="large"
          style="width: 180px;margin-left: 10px;"
        >
          <el-option
            v-for="item in scraper"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input v-model.number="param.page" size="large" style="width: 80px; margin-left: 10px;" placeholder="页数" />
        <el-button type="primary" size="large" style="margin-left: 10px;" @click="search">搜索</el-button>
      </div>
      <div style="margin-top: 20px;">
        <el-input v-model="requestID" clearable size="large" style="width: 440px" placeholder="request id" />
        <el-button type="primary" size="large" style="margin-left: 10px;" @click="handleLoadMore">获取</el-button>
        <el-button type="success" size="large" style="margin-left: 10px;" @click="showBindGame">绑定</el-button>
        <el-select
          v-model="source"
          placeholder="数据源"
          size="large"
          style="width: 180px;margin-left: 10px;"
        >
          <el-option
            v-for="item in sources"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button color="#626aef" size="large" style="margin-left: 10px;" :dark="isDark" @click="showScraper = true">开始刮削</el-button>
      </div>

      <!-- <ul class="item-list">
        <li class="top" :class="isSelected(index) ? 'selected':''" v-for="(item, index) in searchItems[source]" :key="index">
          <div class="item" @click="selectItem(index)">
            <div class="cover" :title="item.summary">
              <el-image class="game-cover" :src="imageUrl(item.cover)" fit="contain" lazy/>
            </div>
            <div class="name">
              <p class="name-inline" :title="item.name">{{ item.name }}</p>
            </div>
          </div>
        </li>
      </ul> -->
      <div style="height: 80vh;margin-top: 30px;padding-right: 20px;">
        <Waterfall
          :list="list"
          :row-key="options.rowKey"
          :gutter="options.gutter"
          :has-around-gutter="options.hasAroundGutter"
          :width="options.width"
          :breakpoints="options.breakpoints"
          :img-selector="options.imgSelector"
          :background-color="options.backgroundColor"
          :lazyload="options.lazyload"
          :load-props="options.loadProps"
        >
          <template #default="{ item, index }">
            <div class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group">
              <div class="overflow-hidden">
                <LazyImg :url="imageUrl(item.cover)" @click="selectItem(index)" class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105" @load="imageLoad" @error="imageError" @success="imageSuccess" />
              </div>
              <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
                <h2 class="pb-4 text-gray-50 group-hover:text-yellow-300">
                  {{ item.name }}
                  {{ imageUrl(item.cover) }}
                </h2>
              </div>
            </div>
          </template>
        </Waterfall>
      </div>
    </el-col>
    <el-col :span="2">
      <ul class="preview">
        <li class="preview-item" v-for="(item, index) in selectedItems" :title="item.name" :key="index">
          <el-image class="preview-cover" :src="imageUrl(item.cover)" fit="scale-down" lazy/>
        </li>
      </ul>
    </el-col>
  </el-row>
  

  <el-dialog v-model="bindVisible" title="绑定" width="500">
    <el-form :model="bindData">
      <el-form-item label="request id" :label-width="100">
        <el-input v-model="bindData.request_id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="path" :label-width="100">
        <el-input v-model="bindData.path" autocomplete="off" />
      </el-form-item>
      <el-form-item label="version" :label-width="100">
        <el-input v-model="bindData.version" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="bindVisible = false">Cancel</el-button>
        <el-button type="primary" @click="bindGame">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <Scraper v-if="showScraper" :gameID="gameID" :showScraper="showScraper" :scrapeRequestID="scrapeRequestID" :selectedItems="selectedItems" :bindData="{'path': bindData.path, 'version': bindData.version}" @setScrapeRequestID="setScrapeRequestID" @close="showScraper = false"/>
</template>

<style scoped>
.item-list, .top, .preview, .preview-item {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item-list {
  /* display: flex; */
  width: 100%;
}
.item-list::after {
  content: "";
  display: table;
  clear: both;
}
.top {
  margin: 10px 5px 0 5px;
  float: left;
  width: 200px;
  overflow: hidden;
}
.item {
  border-radius: 5px;
  box-sizing: border-box;
}
.item:hover {
  cursor: pointer;
}
.cover {
  border-radius: 10px;
  padding: 4px;
  overflow: hidden;
  width: 100%;
}
.game-cover {
  background-color: azure;
}
.game-cover, .cover {
  width: 100%;
  height: 260px;
}
.top.selected {
  border-radius: 5px;
  background-color: antiquewhite;
}
.name {
  font-size: 0.7em;
  color: gray;
  padding: 5px;
  padding-bottom: 0;
}
.name-inline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview {
  background-color: rgb(243, 240, 234);
  padding: 5px;
  position: fixed;
  overflow-y: auto;
  margin-right: 20px;
  height: 94vh;
}
.preview-cover {
  box-shadow: 3px 3px 3px rgb(211, 216, 221);
}
.preview::-webkit-scrollbar { width: 0 !important }

</style>