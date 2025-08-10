<script setup>
import { searchGame } from "@/api/game"
import { listDeveloper } from "@/api/developer"
import { listPublisher } from "@/api/publisher"
import { listSeries } from "@/api/series"
import { listTag } from "@/api/tag"
import { listCategory } from "@/api/category"
import { ref, reactive } from "vue";
import { imageUrl } from "@/utlis/image"
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router';
import { Search, Clock } from '@element-plus/icons-vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import loading from '@/assets/images/loading.png'
import error from '@/assets/images/error.png'
import { useRouter } from "vue-router";
import { formatDay } from '@/utlis/time'
import BScrollBox from '@/components/BScrollBox/index.vue'

const router = useRouter()
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

const searchParam = ref({
  keyword: "",
  tags: [],
  series: 0,
  category: 0,
  publisher: 0,
  developer: 0,
  full_text: false,
  page: 1,
  page_size: 20
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
async function search() {
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
  return searchGame(searchParam.value).then(res => {
    games.value.push(...res.data.list)
    total.value = res.data.total
  })
}

function searchAll() {
  games.value = []
  searchParam.value.page = 1
  search()
}

searchAll()

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

async function pageChange(current) {
  searchParam.value.page = current
  return search()
}

function chooseTag(tag) {
  if (tag) {
    keyword.value += ` #${tag}`
  }
}

function imageError(url) {
  console.error(`${url}: 加载失败`)
}

function goto(id) {
  router.push(`game/${id}`)
}

function searchTag(tag) {
  keyword.value += " #"+tag
  searchAll()
}

var totalItem = 0
var pulling = false
const bs = ref(null)
async function pullingUp() {
  if (pulling) {
    return
  }
  if (total.value <= games.value.length) {
    return
  }
  pulling = true
  searchParam.value.page += 1
  await pageChange(searchParam.value.page)
  if (bs.value) {
    bs.value.finishPullUp()
    pulling = false
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
          @keyup.enter="searchAll"
          size="large"
          clearable
        >
          <template #append>
            <el-button :icon="Search" @click="searchAll" />
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
  <BScrollBox ref="bs" @pullingUp="pullingUp" style="height: 80vh;margin-top: 30px;padding-right: 20px;">
    <Waterfall
      :list="games"
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
          <div style="color: aliceblue;display: flex;flex-direction: row-reverse;margin-right: 10px;align-items: center;margin-top: 5px;">
            <span>{{ formatDay(item.issue_date) }}</span>
            <el-icon style="margin-right: 5px;"><Clock /></el-icon>
          </div>
          <div class="overflow-hidden" style="margin: 6px;margin-top: 2px;">
            <a :href="`/game/${item.id}`">
              <LazyImg :url="imageUrl(item.cover)" class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105" @load="imageLoad" @error="imageError" @success="imageSuccess" />
            </a>
          </div>
          <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
            <el-tooltip
              placement="top-end"
              effect="light"
            >
              <template #content>
                <p style="font-size: 1.2rem;">{{ item.name }}</p>
              </template>
              <h2 class="text-gray-50 group-hover:text-yellow-300" 
              style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
              >
                {{ item.name }}
              </h2>
            </el-tooltip>
            <div style="margin-top: 7px;">
              <a
                v-for="(tag) in item.tags.slice(0,20)"
                :key="tag.id"
                class="tag"
                @click="searchTag(tag.name)"
              >
                #{{ tag.name }}
              </a>
            </div>
          </div>
        </div>
      </template>
    </Waterfall>
    
  </BScrollBox>
<el-backtop :right="100" :bottom="100" :target="bs" />
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
.tag {
  font-size: 18px;
  margin: 0;
  color: aqua;
}
.tag:hover {
  color: orange;
  cursor: pointer;
  text-decoration: underline;
}
</style>