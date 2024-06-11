<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { Get, Scrape, Search, Bind, GetRef } from "@/api/scraper"
import { imageUrl } from "@/utlis/image"
import { ElMessage } from 'element-plus'
import Scraper from "./scrape.vue";

const scraper = ref([
  "all", "2dfan", "bangumi", "ggbases", "getchu", "dlsite"
])
const param = ref({
  name: "",
  keyword: "",
  page: 1,
  request_id: ""
})
const requestID = ref("af3d644a-aa39-4883-a5fd-dc3ee8c51b69")
const searchItems = ref({})
const source = ref("")
const sources = ref([])
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

function get() {
  Get({"request_id": requestID.value}).then(res => {
    sources.value = []
    for (let k in res.data) {
      sources.value.push(k)
    } 
    source.value =  sources.value.length > 0 ? sources.value[0] : ""
    searchItems.value = res.data
  })
}

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
      items.push(searchItems.value[k][idx])
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
      bindVisible.value = true
      return
  }).catch(err => {
    if (err.code === 10100) {
      bindData.value = {
        request_id: requestID.value,
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
        <el-input v-model="requestID" size="large" style="width: 440px" placeholder="request id" />
        <el-button type="primary" size="large" style="margin-left: 10px;" @click="get">获取</el-button>
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

      <ul class="item-list">
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
      </ul>
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

  <Scraper v-if="showScraper" :showScraper="showScraper" :scrapeRequestID="scrapeRequestID" :selectedItems="selectedItems" :bindData="{'path': bindData.path, 'version': bindData.version}" @setScrapeRequestID="setScrapeRequestID" @close="showScraper = false"/>
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
  height: 100%;
}
.preview-cover {
  box-shadow: 3px 3px 3px rgb(211, 216, 221);
}
</style>