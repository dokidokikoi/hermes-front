<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { listLibrary } from "@/api/library"
import { SwitchFilled } from '@element-plus/icons-vue'
import { Document, Select } from '@element-plus/icons-vue'

const library = ref("/run/media/doki/TOSHIBA EXT/TG") 
const libraries = ref([])
const items = ref({})

function list(path) {
  listLibrary({path: path}).then(res => {
    libraries.value = res.data.list.filter(e => {
      return e.is_dir
    })
  })
}

function getItem(path) {
  if (!items.value[path]) {
    listLibrary({path: path}).then(res => {
      items.value[path] = res.data.list
    })
  }
}

function getName(path) {
  return path.split("/")[path.split("/").length-1]
}

list(library.value)


</script>
<template>
  <el-input label="库" v-model="library" clearable size="large" style="font-size: 18px;" placeholder="" @keyup.enter="list(library)"/>
  <el-collapse v-model="activeNames" @change="handleChange" style="margin-top: 20px;font-weight: 400;padding-left: 10px;">
      <el-collapse-item v-for="item in libraries" :title="item.path" :name="item.path" @click="getItem(item.path)">
        <template #title="{ isActive }" style="display: flex;align-items: center;">
          <el-icon :size="20" style="margin-right: 6px;"><SwitchFilled /></el-icon>
          <span style="font-size: 20px;">{{ getName(item.path) }}</span>
            <a style="" :href="`/scraper/game?keyword=${getName(item.path)}&path=${item.path}`"><el-icon class="check"><Select /></el-icon></a>
        </template>
        <p 
        style="font-size: 16px;background-color: bisque;padding-left: 16px;" 
        v-for="i in items[item.path]">
          <el-icon><Document /></el-icon>
          {{ i.path.split("/")[i.path.split("/").length-1] }}
        </p>
      </el-collapse-item>
    </el-collapse>
</template>
<style scoped>
.check {
  font-size: 20px;
  margin-left: 20px;
  text-align: center;
}

.check:hover {
  color:greenyellow;
}
</style>