<script setup>
import { ref, watch } from "vue";
import { CircleCloseFilled, Select, Refresh, Plus, Back, Link, Minus, Check, EditPen, Delete } from '@element-plus/icons-vue'
import { Get, Scrape, Bind, GetRef } from "@/api/scraper"
import { createTag, listTag } from "@/api/tag"
import { createCategory, listCategory } from "@/api/category"
import { createSeries, listSeries } from "@/api/series"
import { createDeveloper, listDeveloper } from "@/api/developer"
import { createPublisher, listPublisher } from "@/api/publisher"
import { upsertPerson } from "@/api/person"
import { createGame, getGame, updateGame } from "@/api/game"
import { imageUrl } from "@/utlis/image"
import { copy } from "@/utlis/text"
import { formatDay } from "@/utlis/time"
import { getItem, setItem, removeItem } from "@/utlis/localStorage"
import PersonSearch from "@/components/SearchNotify/person.vue";
import CharacterSearch from "@/components/SearchNotify/character.vue";
import { ElMessage } from 'element-plus'

const props = defineProps(['showScraper', 'scrapeRequestID', 'selectedItems', 'bindData', 'gameID'])
const emit = defineEmits(['close', 'setScrapeRequestID'])
const showScraper = ref(props.showScraper)
const scrapeRequestID = ref(props.scrapeRequestID)
function scrape() {
  let objs = []
  for (let i of props.selectedItems) {
    objs.push({
      name: i.scraper_name,
      url: i.url
    })
  }
  Scrape({request_id: scrapeRequestID.value, path: props.bindData.path, version: props.bindData.version, objs: objs}).then(res => {
    emit('setScrapeRequestID', res.data)
    scrapeRequestID.value = res.data
    get()
  })
}
scrape()

const bindVisible = ref(false)
const bindData = ref({})
function showBindGame() {
  GetRef({"request_id": scrapeRequestID.value}).then(res => {
    bindData.value = res.data
    bindVisible.value = true
    return
  }).catch(err => {
    if (err.code === 10100) {
      bindData.value = {
        request_id: scrapeRequestID.value,
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

const allTags = ref([])
const allCategory = ref([])
const allSeries = ref([])
const allPublisher = ref([])
const allDeveloper = ref([])
function listAllTag() {
  return listTag().then(res => {
    allTags.value = res.data.list
  })
}
function listAllCategory() {
  return listCategory().then(res => {
    allCategory.value = res.data.list
  })
}
function listAllSeries() {
  return listSeries().then(res => {
    allSeries.value = res.data.list
  })
}
function listAllPublisher() {
  return listPublisher().then(res => {
    allPublisher.value = res.data.list
  })
}
function listAllDeveloper() {
  return listDeveloper().then(res => {
    allDeveloper.value = res.data.list
  })
}
listAllTag()
listAllCategory()
listAllSeries()
listAllPublisher()
listAllDeveloper()

const scrapeItems = ref([])
const game = ref({})
function get() {
  Get({"request_id": scrapeRequestID.value}).then(res => {
    if (res.data) {
      scrapeItems.value = res.data.list
      game.value = res.data.game
    }
  })
}
const scrapeIndex = ref(-1)

const form = ref({})
function initForm() {
  form.value = {
    alias: [],
    category: {
      name: ""
    },
    cover: "",
    tags: [],
    series: [],
    images: [],
    publisher: {
      name: ""
    },
    developer: {
      name: ""
    }
  }
}
initForm()

watch(form, (newQuestion) => {
  setItem("scrapeItem", form.value)
},{ deep: true })
const currentItem = ref({
  alias: [],
  cover: "",
  category: {
    name: ""
  },
  cover: "",
  tags: [],
  series: [],
  images: [],
  publisher: {
    id: 0
  },
  developer: {
    id: 0
  }
})
watch(scrapeIndex, (newQuestion) => {
  if (scrapeItems.value && scrapeItems.value[newQuestion]) {
    currentItem.value = scrapeItems.value[newQuestion]
  }
},{ immediate: true })

const developerId = ref(0)
const publisherId = ref(0)

function cleanGame() {
  removeItem("scrapeItem")
  initForm()
}
function removeAlias(alias) {
  if (form.value.alias) {
    form.value.alias = form.value.alias.filter(e => {
      return e != alias
    });
  }
}
const aliasInputVisible = ref(false)
const aliasValue = ref("")
function handleAliasInputConfirm() {
  if (!form.value.alias) {
    form.value.alias = []
  }
  if (aliasValue.value) {
    form.value.alias.push(aliasValue.value)
    aliasValue.value = ""
  }
  aliasInputVisible.value = false
}

function removeTag(tag) {
  if (form.value.tags) {
    form.value.tags = form.value.tags.filter(e => {
      return e.name != tag
    });
  }
}
const tagInputVisible = ref(false)
const tagValue = ref('')
function handleTagInputConfirm() {
  if (!form.value.tags) {
    form.value.tags = []
  }
  if (tagValue.value) {
    createTag({name: tagValue.value}).then(res => {
      form.value.tags.push({name: tagValue.value})
      listAllTag()
    }).finally(() => {
      tagValue.value = ""
    })
  }
  tagInputVisible.value = false
}

function tagChange(tag) {
  if (!form.value.tags) {
    form.value.tags = [tag]
    return
  }
  form.value.tags.push(tag)
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

function toggleAlias(alias) {
  let set = new Set()
  if (!form.value.alias) {
    form.value.alias = [alias]
    return
  }
  form.value.alias.forEach(e => {
    set.add(e)
  })
  if (!set.has(alias)) {
    form.value.alias.push(alias)
  }
}
function toggleImage(image) {
  if (!form.value.images) {
    form.value.images = [image]
    return
  }
  form.value.images.push(image)
}
function rmImage(image) {
  if (!form.value.images) {
    return
  }
  form.value.images = form.value.images.filter(e => {
    return e != image
  })
}
async function toggleTag(tag) {
  let set = new Set()
  if (!form.value.tags) {
    form.value.tags = [{
      name: tag
    }]
    return
  }
  form.value.tags.forEach(e => {
    set.add(e.name)
  })
  if (!set.has(tag)) {
    await createTag({name: tag})
    listAllTag().then(res => {
      for (let t of allTags.value) {
        if (t.name == tag) {
          form.value.tags.push(t)
          break
        }
      }
    })
  }
}

function toggleCharacter(character) {
  if (!form.value.characters) {
    form.value.characters = []
  }
  form.value.characters.push(character)
}
function toggleStaff(staff) {
  if (!form.value.staff) {
    form.value.staff = []
  }
  form.value.staff.push(staff)
}
function toggleLink(link) {
  if (!form.value.links) {
    form.value.links = []
  }
  form.value.links.push(link)
}

function tranCover() {
  form.value.cover = currentItem.value.cover
}
function tranImages() {
  form.value.images = currentItem.value.images
}
function tranName() {
  form.value.name = currentItem.value.name
}
function tranAlias() {
  let set = new Set()
  if (!form.value.alias) {
    form.value.alias = currentItem.value.alias
    return
  }
  if (!currentItem.value.alias) {
    return
  }
  form.value.alias.forEach(e => {
    set.add(e)
  })
  currentItem.value.alias.forEach(e => {
    if (!set.has(e)) {
      set.add(e)
      form.value.alias.push(e)
    }
  })
}
function tranCode() {
  form.value.code = currentItem.value.code
}
function tranJanCode() {
  form.value.jan_code = currentItem.value.jan_code
}
function tranIssueDate() {
  form.value.issue_date = currentItem.value.issue_date
}
function tranCategory() {

  if (currentItem.value.category) {
    form.value.category = { 
      name: currentItem.value.category.name
    }
  }
}
function tranSeries() {
  if (currentItem.value.series) {
    form.value.series = []
    for (let s of currentItem.value.series) {
      form.value.series.push({
        name: s.name
      })
    }
  }
}
async function tranTags() {
  let set = new Set()
  if (currentItem.value.tags) {
    if (!form.value.tags) {
      form.value.tags = []
    } else {
      form.value.tags.forEach(e => {
        set.add(e.name)
      })
    }
    for (let t of currentItem.value.tags) {
      if (set.has(t.name)) {
        continue
      }
      set.add(t.name)
      await createTag({name: t.name})
    }
    listAllTag().then(res => {
      for (let tag of allTags.value) {
        if (set.has(tag.name)) {
          form.value.tags.push(tag)
        }
      }
    })
  }
}
function tranStory() {
  form.value.story = currentItem.value.story
}
function tranPublisher() {
  if (currentItem.value.publisher) {
    form.value.publisher = {
      name: currentItem.value.publisher.name
    }
  }
}
function tranDeveloper() {
  if (currentItem.value.developer) {
    form.value.developer = {
      name: currentItem.value.developer.name
    }
  }
}
function tranCharacters() {
  if (currentItem.value.characters) {
    form.value.characters = []
    for (let c of currentItem.value.characters) {
      form.value.characters.push(JSON.parse(JSON.stringify(c)))
    }
  }
}
function tranStaff() {
  if (currentItem.value.staff) {
    form.value.staff = []
    for (let s of currentItem.value.staff) {
      form.value.staff.push(JSON.parse(JSON.stringify(s)))
    }
  }
}
function tranLinks() {
  if (!form.value.links) {
    form.value.links = []
  }
  for (let l of currentItem.value.links) {
    form.value.links.push({
      name: l.name,
      url: l.url
    })
  }
}
function tranPrice() {
  form.value.price = currentItem.value.price
}
function tranOtherInfo() {
  form.value.other_info = currentItem.value.other_info
}

const characterVisible = ref({})
function characterAliasInputVisible(index) {
  if (!characterVisible.value[index]) {
    characterVisible.value[index]={
      aliasVisible: true,
      aliasModel: ""
    }
  } else {
    characterVisible.value[index].aliasVisible = true
    characterVisible.value[index].aliasModel = ""
  }
}
function handleCharacterAliasInputConfirm(index) {
  if (characterVisible.value[index] && characterVisible.value[index].aliasModel) {
    if (!form.value.characters[index].alias) {
      form.value.characters[index].alias = []
    }
    form.value.characters[index].alias.push(characterVisible.value[index].aliasModel)
  }
  characterVisible.value[index].aliasVisible = false
  characterVisible.value[index].aliasModel = ""
}
function removeCharacterAlias(index, alias) {
  if (form.value.characters[index]) {
    form.value.characters[index].alias = form.value.characters[index].alias.filter(e => {
      return e != alias
    });
  }
}
function characterImageInputVisible(index) {
  if (!characterVisible.value[index]) {
    characterVisible.value[index]={
      imageVisible: true,
      imageModel: ""
    }
  } else {
    characterVisible.value[index].imageVisible = true
    characterVisible.value[index].imageModel = ""
  }
}
function handleCharacterImageInputConfirm(index) {
  if (characterVisible.value[index] && characterVisible.value[index].imageModel) {
    if (!form.value.characters[index].images) {
      form.value.characters[index].images = []
    }
    form.value.characters[index].images.push(characterVisible.value[index].imageModel)
  }
  characterVisible.value[index].imageVisible = false
  characterVisible.value[index].imageModel = ""
}
function removeCharacterImage(index, image) {
  if (form.value.characters[index] && form.value.characters[index].images) {
    form.value.characters[index].images = form.value.characters[index].images.filter(e => {
      return e != image
    });
  }
}
function addCharacter() {
  if (!form.value.characters) {
    form.value.characters = []
  }
  form.value.characters.push({})
}
function selectCharacter(c) {
  if (!form.value.characters) {
    form.value.characters = []
  }
  form.value.characters.push(c)
}
function rmCharacter(index) {
  form.value.characters = [...form.value.characters.slice(0, index), ...form.value.characters.slice(index+1)]
}

function addStaff() {
  if (!form.value.staff) {
    form.value.staff = []
  }
  form.value.staff.push({})
}
function selectStaff(s) {
  if (!form.value.staff) {
    form.value.staff = []
  }
  form.value.staff.push(s)
}
function submitStaff(index) {
  upsertPerson(form.value.staff[index]).then(res => {
    form.value.staff[index].id = res.data
    ElMessage({
      message: '成功',
      type: 'success',
    })
  })
}
function rmStaff(index) {
  form.value.staff = [...form.value.staff.slice(0, index), ...form.value.staff.slice(index+1)]
}
function addLink() {
  if (!form.value.links) {
    form.value.links = []
  }
  form.value.links.push({})
}
function rmLink(index) {
  form.value.links = [...form.value.links.slice(0, index), ...form.value.links.slice(index+1)]
}

const imageVisible = ref(false)
const imageModel = ref("")
function addImage() {
  imageVisible.value = true
}
function inputImageConfirm() {
  if (imageModel.value) {
    if (!form.value.images) {
      form.value.images = [imageModel.value]
    } else {
      form.value.images.push(imageModel.value)
    }
  }
  
  imageModel.value = ""
  imageVisible.value = false
}

const categoryVisible = ref(false)
const categoryModel = ref("")
async function handleCategoryInputConfirm() {
  if (categoryModel.value) {
    await createCategory({name: categoryModel.value})
    listAllCategory()
    categoryModel.value = ""
  }
  categoryVisible.value = false
}
const seriesVisible = ref(false)
const seriesModel = ref("")
const selectedSeries = ref([])
async function handleSeriesInputConfirm() {
  if (seriesModel.value) {
    await createSeries({name: seriesModel.value})
    listAllSeries()
    seriesModel.value = ""
  }
  seriesVisible.value = false
}
const publisherVisible = ref(false)
const publisherModel = ref("")
async function handlePublisherInputConfirm() {
  if (publisherModel.value) {
    await createPublisher({name: publisherModel.value})
    listAllPublisher()
    publisherModel.value = ""
  }
  publisherVisible.value = false
}
const developerVisible = ref(false)
const developerModel = ref("")
async function handleDeveloperInputConfirm() {
  if (developerModel.value) {
    await createDeveloper({name: developerModel.value})
    listAllDeveloper()
    developerModel.value = ""
  }
  developerVisible.value = false
}

if (props.gameID) {
  GetGame(props.gameID)
} else if (getItem("scrapeItem")) {
  form.value = getItem("scrapeItem")
  form.value.developer && (developerId.value = form.value.developer.id)
  form.value.publisher && (publisherId.value = form.value.publisher.id)
  selectedSeries.value = []
  if (form.value.series) {
    form.value.series.forEach(e => {
      selectedSeries.value.push(e.id)
    })
  }
}

function confirm() {
  form.value.series = []
  selectedSeries.value.forEach(e => {
    form.value.series.push({
      id: e
    })
  })
  if (form.value.id) {
    updateGame(form.value).then(res => {
      ElMessage({
        message: '更新成功',
        type: 'success',
      })

      GetGame(form.value.id)
    })
  } else {
    createGame(form.value, {"request_id": scrapeRequestID.value}).then(res => {
      ElMessage({
        message: '创建成功',
        type: 'success',
      })

      GetGame(res.data)
    })
  }
}

function GetGame(id) {
  getGame(id).then(res => {
    form.value = res.data
    if (!form.value.category) {
      form.value.category = {}
    }
    if (!form.value.characters) {
      form.value.characters = []
    }
    if (!form.value.developer) {
      form.value.developer = {}
    }
    if (!form.value.publisher) {
      form.value.publisher = {}
    }
    selectedSeries.value = []
    if (form.value.series) {
      form.value.series.forEach(e => {
        selectedSeries.value.push(e.id)
      })
    }
    console.log(form.value)
  })
}

function selectCharacterCV(cv, index) {
    form.value.characters[index].cv = {
      id: cv.id,
      name: cv.name,
    }
}
function clearCharacterCV(index) {
  form.value.characters[index].cv = undefined
}

function selectPublisher(val) {
  console.log(val)
  form.value.publisher = val
}
function selectDeveloper(val) {
  console.log(val)
  form.value.developer = val
}
</script>

<template>
  <el-dialog
    v-model="showScraper"
    title="刮削"
    fullscreen
    destroy-on-close
    :show-close="false"
    :close-on-press-escape="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <div>{{ scrapeRequestID }} <el-button type="primary" style="margin-left: 7px;" @click="get" :icon="Refresh" size="small" circle />
          <el-button type="primary" style="margin-left: 7px;" @click="showBindGame" :icon="EditPen" size="small" circle />
          <el-button type="danger" style="margin-left: 7px;" @click="cleanGame" :icon="Delete" size="small" circle />
        </div>
        <div>
          <el-select
            v-model="scrapeIndex"
            placeholder="刮削结果"
            style="margin-right: 13px;"
          >
            <el-option
              v-for="(item, index) in scrapeItems"
              :key="index"
              :label="`${item.scraper_name} - ${item.name}`"
              :value="index"
            />
          </el-select>
          <el-button type="danger" @click="$emit('close')">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            Close
          </el-button>
          <el-button type="success" @click="confirm">
            <el-icon class="el-icon--left"><Select /></el-icon>
            Confirm
          </el-button>
        </div>
      </div>
    </template>

    <el-form :model="form" label-width="auto">
      <table class="info" style="width: 100%">
        <tr>
          <td style="width: 45%;">
            <el-form-item label="封面">
              <el-image
                style="height: 160px;width: auto;"
                :src="imageUrl(form.cover)"
                :preview-src-list="turnImageUrl(form.images)"
                fit="contain"
              >
              </el-image>
            </el-form-item>
          </td>
          <td style="width: 10%;">
            <div>
              <el-button type="success" :icon="Back" @click="tranCover" circle />
            </div>
          </td>
          <td style="width: 45%;">
            <div class="tr" style="height: 160px;">
              <div class="table-label">
                  封面
              </div>
              <div>
                <el-image
                  style="height: 160px;width: auto;"
                  :src="imageUrl(currentItem.cover)"
                  fit="contain"
                  :preview-src-list="turnImageUrl(currentItem.images)"
                >
                </el-image>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="图片">
              <el-image
                v-for="(image, index) in form.images"
                :key="index"
                style="height: 60px;width: 60px;"
                :src="imageUrl(image)"
                fit="contain"
                @click="rmImage(image)"
              >
              </el-image>
              <div>
                <el-button v-if="!imageVisible" type="success" :icon="Plus" @click="addImage" circle />
                <el-input v-else v-model="imageModel" @keyup.enter="inputImageConfirm" @blur="inputImageConfirm"></el-input>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranImages" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                  图片
              </div>
              <div>
                <el-image
                  v-for="(image, index) in currentItem.images"
                  :key="index"
                  style="height: 60px;width: 60px;"
                  :src="imageUrl(image)"
                  fit="contain"
                  @click="toggleImage(image)"
                >
                </el-image>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranName" circle />
            </div>
          </td>
          <td>
            <div class="tr" >
              <div class="table-label">
                  名称
              </div>
              <div class="inline">
                <el-text>
                  {{ currentItem.name }}
                </el-text>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr style="vertical-align:auto;">
          <td>
            <el-form-item label="别名">
              <div style="display: flex; flex-wrap: wrap; width: 100%;">
                <el-tag
                  v-for="(alias, index) in form.alias"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="removeAlias(alias)"
                  style="margin-right: 5px;"
                >
                  {{ alias }}
                </el-tag>
                <el-input
                  v-if="aliasInputVisible"
                  ref="InputRef"
                  v-model="aliasValue"
                  size="small"
                  style="display: inline-block;width: 120px;"
                  @keyup.enter="handleAliasInputConfirm"
                  @blur="handleAliasInputConfirm"
                  autofocus
                />
                <el-button v-else class="button-new-tag" size="small" @click="aliasInputVisible = true">
                  + New Alias
                </el-button>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranAlias" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                  别名
              </div>
              <div>
                <div style="display: flex; flex-wrap: wrap; width: 100%;">
                  <el-tag
                    v-for="(alias, index) in currentItem.alias"
                    :key="index"
                    :disable-transitions="false"
                    style="margin-right: 5px;"
                    @click="toggleAlias(alias)"
                  >
                    {{ alias }}
                  </el-tag>
                </div>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="code">
              <el-input v-model="form.code" />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranCode" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                  code
              </div>
              <div style="font-weight: 500;">
                {{ currentItem.code }}
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="jan code">
              <el-input v-model="form.jan_code" />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranJanCode" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                  jan code
              </div>
              <div style="font-weight: 500;">
                {{ currentItem.jan_code }}
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="发售日期">
              <el-date-picker
                v-model="form.issue_date"
                type="date"
                placeholder="Select date and time"
              />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranIssueDate" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                发售日期
              </div>
              <div style="font-weight: 500;">
                {{ formatDay(currentItem.issue_date) }}
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="分类">
              <div style="display: flex; flex-wrap: nowrap; width: 100%;">
                <el-select
                  v-model="form.category.id"
                  placeholder="分类"
                  filterable
                >
                  <el-option
                    v-for="category in allCategory"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                  />
                </el-select>
                <el-button v-if="!categoryVisible" type="primary" :icon="Plus" style="margin-left: 10px;" @click="categoryVisible = true" />
                <el-input v-else v-model="categoryModel" @keyup.enter="handleCategoryInputConfirm" @blur="handleCategoryInputConfirm"></el-input>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <!-- <el-button type="success" :icon="Back" @click="tranCategory" circle /> -->
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                分类
              </div>
              <div>
                <span style="font-weight: 500;" v-if="currentItem.category">{{ currentItem.category.name }}</span>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="系列">
              <div style="display: flex;">
                <el-select
                  v-model="selectedSeries"
                  placeholder="系列"
                  filterable
                  multiple
                >
                  <el-option
                    v-for="series in allSeries"
                    :key="series.id"
                    :label="series.name"
                    :value="series.id"
                  />
                </el-select>
                <el-button v-if="!seriesVisible" type="primary" :icon="Plus" style="margin-left: 10px;" @click="seriesVisible = true" />
                <el-input v-else v-model="seriesModel" @keyup.enter="handleSeriesInputConfirm" @blur="handleSeriesInputConfirm"></el-input>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <!-- <el-button type="success" :icon="Back" @click="tranSeries" circle /> -->
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                系列
              </div>
              <div>
                <span v-for="(s, index) in currentItem.series" style="font-weight: 500;">{{ s.name }}</span>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="tag">
              <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;">
                <el-tag
                  v-for="(tag, index) in form.tags"
                  :key="tag.name"
                  closable
                  :disable-transitions="false"
                  @close="removeTag(tag.name)"
                  style="margin-right: 5px;margin-bottom: 5px;"
                >
                  {{ tag.name }}
                </el-tag>
                <el-input
                  v-if="tagInputVisible"
                  ref="InputRef"
                  v-model="tagValue"
                  size="small"
                  style="display: inline-block;width: 120px;margin-bottom: 5px;"
                  @keyup.enter="handleTagInputConfirm"
                  @blur="handleTagInputConfirm"
                  autofocus
                />
                <el-button v-else size="small" style="margin-bottom: 5px;" @click="tagInputVisible = true">
                  + New Tag
                </el-button>
                <el-select
                  placeholder="tag"
                  style="margin-left: 10px;margin-bottom: 5px;"
                  size="small"
                  @change="tagChange"
                  filterable
                >
                  <el-option
                    v-for="tag in allTags"
                    :label="tag.name"
                    :value="tag"
                  />
                </el-select>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranTags" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                tags
              </div>
              <div>
                <el-tag
                  v-for="(tag, index) in currentItem.tags"
                  :key="index"
                  :disable-transitions="false"
                  style="margin-right: 5px;margin-bottom: 5px;"
                  @click="toggleTag(tag.name)"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="故事">
              <el-input
                v-model="form.story"
                :rows="10"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranStory" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                故事
              </div>
              <el-input
                v-model="currentItem.story"
                :rows="10"
                type="textarea"
                placeholder="Please input"
                readonly
              ></el-input>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="发行商">
              <div style="display: flex; flex-wrap: nowrap; width: 100%;">
                <el-select
                  v-model="form.publisher.id"
                  placeholder="发行商"
                  filterable
                >
                  <el-option
                    v-for="publisher in allPublisher"
                    :key="publisher.id"
                    :label="publisher.name"
                    :value="publisher.id"
                  />
                </el-select>
                <el-button v-if="!publisherVisible" type="primary" :icon="Plus" style="margin-left: 10px;" @click="publisherVisible = true" />
                <el-input v-else v-model="publisherModel" @keyup.enter="handlePublisherInputConfirm" @blur="handlePublisherInputConfirm"></el-input>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <!-- <el-button type="success" :icon="Back" @click="tranPublisher" circle /> -->
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                发行商
              </div>
              <div>
                <p v-if="currentItem.publisher">{{ currentItem.publisher.name }}</p>
                <!-- <el-tag v-if="currentItem.publisher">
                  {{ currentItem.publisher.name }}
                </el-tag> -->
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="开发商">
              <div style="display: flex; flex-wrap: nowrap; width: 100%;">
                <el-select
                  v-model="form.developer.id"
                  placeholder="开发商"
                  filterable
                >
                  <el-option
                    v-for="developer in allDeveloper"
                    :key="developer.id"
                    :label="developer.name"
                    :value="developer.id"
                  />
                </el-select>
                <el-button v-if="!developerVisible" type="primary" :icon="Plus" style="margin-left: 10px;" @click="developerVisible = true" />
                <el-input v-else v-model="developerModel" @keyup.enter="handleDeveloperInputConfirm" @blur="handleDeveloperInputConfirm"></el-input>
              </div>
            </el-form-item>
          </td>
          <td>
            <div>
              <!-- <el-button type="success" :icon="Back" @click="tranDeveloper" circle /> -->
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                开发商
              </div>
              <div>
                <el-tag v-if="currentItem.developer">
                  {{ currentItem.developer.name }}
                </el-tag>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td style="display: flex;width: 100%;">
            <el-form-item label="角色" style="width: 100%;">
              <details style="width: 100%;">
                <div v-for="(character, index) in form.characters" :key="index">
                  <el-card style="width: 100%;margin-top: 5px;position: relative;">
                    <div style="display: flex;">
                      <el-image style="flex: 0 0 100px;width: 100px;height: 100px;border: 1px #606266 solid; border-radius: 3px" :src="imageUrl(character.cover)" fit="cover" />
                      <div style="flex-grow: 1; margin-left: 10px">
                        <el-input size="small" v-model="form.characters[index].name"></el-input>
                        <div style="display: flex; flex-wrap: wrap; width: 100%;">
                          <el-tag
                            v-for="(alias, idx) in character.alias"
                            :key="idx"
                            closable
                            :disable-transitions="false"
                            @close="removeCharacterAlias(index, alias)"
                            style="margin-right: 5px;"
                          >
                            {{ alias }}
                          </el-tag>
                          <el-input
                            v-if="characterVisible[index]&&characterVisible[index].aliasVisible"
                            v-model="characterVisible[index].aliasModel"
                            size="small"
                            style="display: inline-block;width: 120px;"
                            @keyup.enter="handleCharacterAliasInputConfirm(index)"
                            @blur="handleCharacterAliasInputConfirm(index)"
                            autofocus
                          />
                          <el-button v-else size="small" @click="characterAliasInputVisible(index)">
                            + New Alias
                          </el-button>
                        </div>
                        <el-select v-model="form.characters[index].gender" placeholder="gender" size="small" clearable>
                          <el-option
                            label="男"
                            value="男"
                          />
                          <el-option
                            label="女"
                            value="女"
                          />
                          <el-option
                            label="扶她"
                            value="扶她"
                          />
                        </el-select>
                        <el-select v-model="form.characters[index].relation" placeholder="relation" size="small" clearable>
                          <el-option
                            label="主角"
                            value="主角"
                          />
                          <el-option
                            label="配角"
                            value="配角"
                          />
                          <el-option
                            label="路人"
                            value="路人"
                          />
                        </el-select>
                      </div>
                    </div>
                    <div style="display: flex;margin-top: 5px">
                      <el-input v-model="form.characters[index].cover" size="small" placeholder="cover"></el-input>
                      <el-button type="primary" size="small" plain :icon="Plus" style="margin-left: 10px;" @click="characterImageInputVisible(index)"></el-button>
                    </div>
                    <el-input style="margin-top: 5px" v-if="characterVisible[index]&&characterVisible[index].imageVisible" size="small" placeholder="image" v-model="characterVisible[index].imageModel" @keyup.enter="handleCharacterImageInputConfirm(index)" />
                    <div style="display: flex;margin-top: 5px" v-for="(image, idx) in form.characters[index].images" :key="idx">
                      <el-input v-model="form.characters[index].images[idx]" size="small" placeholder="image"></el-input>
                      <el-button type="danger" size="small" plain :icon="Minus" style="margin-left: 10px;" @click="removeCharacterImage(index, image)"></el-button>
                    </div>
                    <PersonSearch v-if="!form.characters[index].cv" size="small" @select="selectCharacterCV($event, index)" />
                    <div v-else>  
                      <span>cv: </span>
                      <span>{{ form.characters[index].cv.name }}</span>
                      <el-button type="danger" size="small" :icon="Minus"  @click="clearCharacterCV(index)"></el-button>
                    </div>
                    <el-input v-model="form.characters[index].summary" type="textarea" :autosize="{minRows: 2, maxRows: 10}"></el-input>
                    <el-button type="danger" size="small" :icon="Minus" style="position: absolute;top: 0;right: 0;" @click="rmCharacter(index)"></el-button>
                  </el-card>
                </div>
              </details>
              <el-button type="primary" class="detail-plus" :icon="Plus" size="small" @click="addCharacter" circle />
              <CharacterSearch size="small" class="detail-search" @select="selectCharacter" />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranCharacters" circle />
            </div>
          </td>
          <td style="display: flex;width: 100%;">
            <div class="tr">
              <div class="table-label">
                角色
              </div>
              <div style="width: 100%;">
                <details style="width: 100%;">
                  <div class="character" v-for="(character, index) in currentItem.characters" :key="index">
                      <el-card style="width: 100%;position: relative;">
                        <div class="character-attr">
                          <el-image class="avatar" :src="imageUrl(character.cover)" fit="cover" />
                          <div class="panel">
                            <h3>{{character.name}} <span style="font-size: 0.6em;color: gray; margin-left: 0px;">CV: {{character.cv.name}}</span></h3>
                            <div>
                              <span v-for="(alias, index) in character.alias" style="margin-right: 3px;">{{ alias }}</span>
                            </div>
                            <p>{{character.gender}}</p>
                            <p>{{character.relation}}</p>
                            <el-tag
                              v-for="(tag, index) in character.tags"
                              :key="index"
                              :disable-transitions="false"
                              style="margin-right: 5px;margin-bottom: 5px;"
                            >
                              {{ tag.name }}
                            </el-tag>
                          </div>
                          <el-image class="images" v-if="character.images && character.images.length>0" :preview-src-list="turnImageUrl(character.images)" :src="imageUrl(character.images[0])" fit="cover" />
                        </div>
                        <div>                          
                          <p v-html="character.summary" style="margin-top: 10px;"></p>
                        </div>
                        <el-button type="success" size="small" :icon="Back" style="position: absolute;top: 0;left: 0;" @click="toggleCharacter(character)"></el-button>
                      </el-card>
                  </div>
                </details>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td style="display: flex;width: 100%;">
            <el-form-item label="相关人员" style="width: 100%;">
              <details style="width: 100%;">
                <el-card style="width: 100%;margin-top: 5px;position: relative;padding-bottom: 7px;" v-for="(staff, index) in form.staff" :key="index">
                  <el-input v-model="form.staff[index].name" size="small" placeholder="name"></el-input>
                  <el-select v-model="form.staff[index].gender" placeholder="gender" size="small" style="width: 50%;" clearable>
                    <el-option
                      label="男"
                      value="男"
                    />
                    <el-option
                      label="女"
                      value="女"
                    />
                  </el-select>
                  <el-select v-model="form.staff[index].relation" placeholder="relation" size="small"  style="width: 50%;" multiple clearable>
                    <el-option
                      label="原画"
                      value="原画"
                    />
                    <el-option
                      label="剧本"
                      value="剧本"
                    />
                    <el-option
                      label="声优"
                      value="声优"
                    />
                    <el-option
                      label="音乐"
                      value="音乐"
                    />
                  </el-select>
                  <el-input v-model="form.staff[index].summary" type="textarea" placeholder="summary" :autosize="{minRows: 2, maxRows: 10}"></el-input>
                  <el-button type="danger" size="small" :icon="Minus" style="position: absolute;top: 0;right: 0;" @click="rmStaff(index)"></el-button>
                  <el-button type="primary" style="position: absolute;bottom: 0;right: 0;" :icon="Check" size="small" @click="submitStaff(index)" />
                </el-card>
              </details>
              <el-button type="primary" class="detail-plus" :icon="Plus" size="small" @click="addStaff" circle />
              <PersonSearch size="small" class="detail-search" @select="selectStaff" />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranStaff" circle />
            </div>
          </td>
          <td style="display: flex;width: 100%;">
            <div class="tr">
              <div class="table-label">
              相关人员
              </div>
              <div style="flex-grow: 1;">
                <details style="width: 100%;">
                  <div class="staff">
                    <el-card style="width: 100%;margin-top: 5px;position: relative;" v-for="(staff, index) in currentItem.staff" :key="index">
                      <h4>{{staff.name}} <span style="font-size: 0.8em;color: gray;">{{ staff.gender }}</span></h4>
                      <p>
                        <span style="font-size: 0.8em;color: gray;" v-for="r in staff.relation">{{ r }} </span>
                      </p>
                      <el-button type="success" size="small" :icon="Back" style="position: absolute;top: 0;left: 0;" @click="toggleStaff(staff)"></el-button>
                    </el-card>
                  </div>
                </details>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td style="display: flex;width: 100%;">
            <el-form-item label="相关链接" style="width: 100%;">
              <details style="width: 100%;">
                <el-card style="position: relative; width: 100%;margin-top: 5px;" v-for="(link, index) in form.links" :key="index">
                  <div style="display: flex;margin-top: 5px;">
                    <el-input v-model="form.links[index].name" size="small" style="width: 40%;" placeholder="name"></el-input>
                    <el-input v-model="form.links[index].url" size="small" style="width: 60%;" placeholder="url"></el-input>
                  </div>
                  <el-button type="danger" size="small" :icon="Minus" style="position: absolute;top: 0;right: 0;" @click="rmLink(index)"></el-button>
                </el-card>
              </details>
              <el-button type="primary" class="detail-plus" :icon="Plus" size="small" @click="addLink" circle />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranLinks" circle />
            </div>
          </td>
          <td style="display: flex;width:100%">
            <div class="tr">
              <div class="table-label">
                相关链接
              </div>
              <div>
                <details style="width: 100%;">
                  <div v-for="(link, index) in currentItem.links" :key="link" style="position: relative;width: 100%;">
                    <el-link :href="link.url" target=_blank style="margin-right: 3px;">
                      {{ link.name }}<el-icon><Link /></el-icon>
                    </el-link>
                    <el-button type="success" size="small" :icon="Back" @click="toggleLink(link)"></el-button>
                  </div>
                </details>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="价格">
              <el-input
                v-model="form.price"
                placeholder="Please input"
              />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranPrice" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                价格
              </div>
              <div style="font-weight: 500;">
                {{ currentItem.price }}
              </div>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <el-form-item label="其它信息">
              <el-input
                v-model="form.other_info"
                :rows="10"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </td>
          <td>
            <div>
              <el-button type="success" :icon="Back" @click="tranOtherInfo" circle />
            </div>
          </td>
          <td>
            <div class="tr">
              <div class="table-label">
                其它信息
              </div>
                <el-input
                  v-model="currentItem.other_info"
                  :rows="10"
                  type="textarea"
                  placeholder="Please input"
                  readonly
                ></el-input>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>
            <div class="tr">
              <div class="table-label">
                  所有图片
              </div>
              <div>
                <el-image
                  v-for="(image, index) in currentItem.all_images"
                  :key="index"
                  style="height: 60px;width: 60px;"
                  :src="imageUrl(image)"
                  fit="contain"
                  @click="copy(image)"
                >
                </el-image>
              </div>
            </div>
          </td>
          <td></td>
        </tr>
      </table>
    </el-form>
  </el-dialog>

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
</template>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
.el-form-item {
  margin-bottom: 10px;
}
.detail-plus {
  position: absolute;
  left: 60px;
  top: 4px;
}
.detail-search {
  position: absolute;
  left: 100px;
  top: -2px;
  width: calc(100% - 100px);
}
.scrape-info {
  font-size: 14px;
  color: #606266;
  box-sizing: border-box;
}
.tr {
  display: flex;
  width: 100%;
  /* flex-wrap: wrap; */
  min-height: 32px;
  margin-bottom: 10px;
}
.table-label {
  width: 70px;
  padding-right: 10px;
  text-align: start;
  vertical-align: top;
  text-align: right;
  flex: 0 0 70px;
}
.inline {
  width: calc(100% - 170px);
}
.summary {
  display: inline-block;
  overflow-x: hidden;
  overflow-y: auto;
  width: calc(100% - 170px);
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  border: #d8dadd 1px solid;
  border-radius: 5px;
}
.info tr td:nth-child(1) {
  width: 45%;
}
.info tr td:nth-child(2) {
  width: 10%;
}
.info tr td:nth-child(3) {
  width: 45%;
}
.info tr td:nth-child(2) > div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px
}
.character {
  margin-top: 5px;
}
.character .avatar {
  width: 100px; 
  height: 100px;
  flex: 0 0 100px;
  border-radius: 3px;
  border: #606266 1px solid;
  margin: 3px;
  margin-right: 7px;
}
.character-attr {
  display: flex;
  flex-wrap: nowrap;
}
.character-attr h3::before {
  content: '\25CF';
}
.character-attr .images {
  width: 60px; 
  height: 60px;
  flex: 0 0 60px;
  align-self: self-end
}
.character-attr .panel {
  flex-grow: 1;
}
</style>