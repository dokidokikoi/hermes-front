<script setup>
import { getGame } from "@/api/game"
import { ref, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { imageUrl } from "@/utlis/image"
import { Link, Edit } from '@element-plus/icons-vue'
import { formatDay } from "@/utlis/time"

const route = useRoute()
const router = useRouter()
const g = ref({})

const carousel = ref({})
function switchCarousel(idx) {
  carousel.value.setActiveItem(idx)
}
function turnImageUrl(arr) {
  if (!arr) {
    return
  }
  let urls = []
  for (let url of arr) {
    urls.push(imageUrl(url))
  }
  return urls
}

function get() {
  getGame(route.params.id).then(res => {
    g.value = res.data

    let images = [g.value.cover]
    if (g.value.images) {
      images.push(...g.value.images)
    }
    g.value.images = images
  })
}

function jumpTo(path, query) {
  router.push({
    path: path,
    query: query
  })
}

watch(carousel, (newQuestion) => {
  switchCarousel(0)
})

get()
</script>

<template>
  <div style="margin-bottom: 10px;display: flex;align-items: center;">
    <p style="font-size: 1.4em;font-weight: 500;"> {{ g.name }} </p>
    <el-button size="small" type="primary" style="margin-left: 5px;" @click="jumpTo('/scraper/game', {'game_id': g.id})"><el-icon><Edit /></el-icon></el-button>
  </div>
  <div class="inline">
    <div class="images">
      <el-carousel ref="carousel" v-if="g && g.images" height="auto" indicator-position="none" :autoplay="false">
        <el-carousel-item v-for="image in g.images" :key="image" style="height: initial;">
          <el-image :src="imageUrl(image)" style="width: 100%;height: 100px;height: auto;" fit="contains"></el-image>
        </el-carousel-item>
      </el-carousel>
      <div style="display: flex;overflow-x: auto;margin-top: 10px;">
        <el-image
          style="height: 80px;width: 120px;flex-grow:0;flex-shrink: 0;"
          v-for="(image, index) in g.images"
          :key="index"
          :src="imageUrl(image)"
          fit="contain"
          @click="switchCarousel(index)"
        >
        </el-image>
      </div>
    </div>
    <div class="info">
      <table>
        <colgroup>
          <col width="70px">
        </colgroup>
        <tr>
          <td>别名:</td>
          <td>
            <p v-for="a in g.alias">
              {{ a }}
            </p>
          </td>
        </tr>
        <tr>
          <td>分类:</td>
          <td>
            <el-link v-if="g.category" :href="`/game?category_id=${g.category.id}`" type="primary">{{ g.category.name }}</el-link>
          </td>
        </tr>
        <tr>
          <td>系列:</td>
          <td>
            <p v-for="s in g.series">
              <el-link :href="`/game?category_id=${s.id}`" type="primary"> {{ s }}</el-link>
            </p>
          </td>
        </tr>
        <tr>
          <td>jan code:</td>
          <td><span>{{ g.jan_code }}</span></td>
        </tr>
        <tr>
          <td>code:</td>
          <td><span>{{ g.code }}</span></td>
        </tr>
        <tr>
          <td>开发商:</td>
          <td><el-link :href="`/game?developer_id=${g.developer.id}`" type="primary" v-if="g.developer">{{ g.developer.name }}</el-link></td>
        </tr>
        <tr>
          <td>发行商:</td>
          <td><el-link :href="`/game?publisher_id=${g.publisher.id}`" type="primary" v-if="g.publisher">{{ g.publisher.name }}</el-link></td>
        </tr>
        <tr>
          <td>发行日期:</td>
          <td><span>{{ formatDay(g.issue_date) }}</span></td>
        </tr>
        <tr>
          <td>tags:</td>
          <td>
            <el-tag
              v-for="(tag) in g.tags"
              :key="tag.id"
              size="small"
              style="margin-right: 5px;margin-bottom: 5px;flex: 0,0,70px;cursor: pointer;"
              @click="jumpTo('/game', {tag: tag.name})"
            >
              {{ tag.name }}
            </el-tag>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div>
    <div class="card story">
      <h2>故事</h2>
      <pre class="warp">
        <p v-html="g.story"></p>
      </pre>
    </div>
    <div class="card character">
      <h2>角色</h2>
      <div class="character-item" v-for="c in g.characters" :key="c.id">
        <div class="cover">
          <el-image style="height: 100%;width: 100%;" :src="imageUrl(c.cover)" fit="contain" />
        </div>
        <div class="info">
          <h3>{{ c.name }}</h3>
          <p>CV: <span v-if="c.cv">{{ c.cv.name }}</span></p>
          <div>
            <el-tag
              v-for="(tag) in c.tags"
              :key="tag.id"
              size="small"
              style="margin-right: 5px;margin-bottom: 5px;flex: 0,0,70px;"
            >
              {{ tag.name }}
            </el-tag>
          </div>
          <pre class="warp">
            <p style="margin-top: 10px;" v-html="c.summary"></p>
          </pre>
        </div>
        <el-image
          v-if="c.images && c.images.length>0"
          style="width: 160px;align-self: center;"
          :src="imageUrl(c.images[0])"
          fit="contain"
          :preview-src-list="turnImageUrl(c.images)"
        ></el-image>
      </div>
    </div>
    <div class="card links">
      <h2>相关链接</h2>
      <div v-for="l in g.links">
        <el-link :href="l.url" target="_blank" type="primary">{{ l.name }}<el-icon><Link /></el-icon></el-link>
      </div>  
    </div>
    <div class="card staff">
      <h2>相关人员</h2>
      <div v-for="s in g.staff" style="display: flex;margin-bottom: 10px;">
        <div @click="select(item)" class="cover">
          <el-image style="height: 100%;width: 100%;" :src="imageUrl(s.cover)" fit="contain" />
        </div>
        <div class="info" style="margin-left: 10px;">
          <h3 @click="select(item)">{{ s.name }}</h3>
          <p><span>性别:</span> {{ s.gender }}</p>
          <p><span>分工:</span> {{ s.relation }}</p>
          <p><span>简介:</span> {{ s.summary }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inline {
  display: flex;
}
.inline .images {
  width: 50%;
}
.inline .info {
  width: 50%;
  padding-left: 20px;
}
.inline .info tr td:nth-child(1) {
  text-align: start;
  vertical-align: top;
}
.card {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.card h2 {
  border-bottom: 1px solid black;
  margin-bottom: 10px;
}
.character {
  width: 100%;
}
.character  .cover {
  width: 200px;
  flex-grow: 0;
  flex-shrink: 0;
}
.character .info {
  margin-left: 10px;
  width: 100px;
  flex-grow: 1;
  padding: 0 10px;
}

.warp p {
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
}

.character-item {
  display: flex;
  padding-bottom: 10px;
  width: 100%;
  /* color: antiquewhite; */
  background: linear-gradient(to bottom, rgb(252, 248, 244), #fff);
}
.staff  .cover {
  width: 200px;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>