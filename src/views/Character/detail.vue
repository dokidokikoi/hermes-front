<script setup>
import { getCharacter } from '@/api/character'
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { imageUrl } from "@/utlis/image"
import { Link, Edit } from '@element-plus/icons-vue'
import { formatDay } from "@/utlis/time"

const route = useRoute()
const router = useRouter()

const character = ref({})
function get() {
  getCharacter(route.params.id).then(res => {
    character.value = res.data

    let images = [character.value.cover]
    if (character.value.images) {
      images.push(...character.value.images)
    }
    character.value.images = images
  })
}

const carousel = ref({})
function switchCarousel(idx) {
  carousel.value.setActiveItem(idx)
}

function jumpTo(path, query) {
  router.push({
    path: path,
    query: query
  })
}

get()
</script>

<template>
  <div style="margin-bottom: 10px;display: flex;align-items: center;">
    <p style="font-size: 1.4em;font-weight: 500;"> {{ character.name }} </p>
    <!-- <el-button size="small" type="primary" @click="jumpTo('/scraper/game', {'game_id': g.id})"><el-icon><Edit /></el-icon></el-button> -->
  </div>
  <div style="display: flex;">
    <div class="images">
      <el-carousel ref="carousel" motion-blur indicator-position="none" :autoplay="false">
        <el-carousel-item v-for="image in character.images" :key="image">
          <el-image :src="imageUrl(image)"></el-image>
        </el-carousel-item>
      </el-carousel>
      <div style="display: flex;overflow-x: auto;margin-top: 10px;">
        <el-image
          style="height: 80px;width: 120px;flex-grow:0;flex-shrink: 0;"
          v-for="(image, index) in character.images"
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
          <col width="75px">
        </colgroup>
        <tr>
          <td>别名:</td>
          <td>
            <p v-for="a in character.alias">
              {{ a }}
            </p>
          </td>
        </tr>
        <tr>
          <td>性别:</td>
          <td>
            <span>{{ character.gender }}</span>
          </td>
        </tr>
        <tr>
          <td>CV:</td>
          <td><span v-if="character.cv">{{ character.cv.name }}</span></td>
        </tr>
        <tr>
          <td>简介:</td>
          <td><pre><p v-html="character.summary"></p></pre></td>
        </tr>
        <tr>
          <td>出现作品:</td>
          <td>
            <template v-if="character.games">
              <div v-for="g in character.games" :key="g.id">
                <el-link type="primary" :href="`/game/${g.id}`">{{ g.name }}</el-link>
                <el-button size="small" style="margin-left: 5px;" type="primary" @click="jumpTo('/scraper/game', {'game_id': g.id})"><el-icon><Edit /></el-icon></el-button>
              </div>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.images {
  width: 30%;
}
tr td:nth-child(1) {
  text-align: start;
  vertical-align: top;
}
</style>