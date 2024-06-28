<script setup>
import { h, ref } from 'vue';
import { Check, Plus, Minus } from '@element-plus/icons-vue'
import { updatePolicy, listPolicy } from "@/api/policy"
import { ElMessage } from 'element-plus'

const loading = ref(false)
const policies = ref({})
function getPolicyList() {
  loading.value = false

  listPolicy().then(res => {
    policies.value = res.data
    for (let k in policies.value) {
      policies.value[k] = JSON.parse(policies.value[k])
    }

    console.log(policies.value)

    for (let name in policies.value.scraper) {
      let header = []
      for (let k in policies.value.scraper[name].header) {
        header.push({
          key: k,
          value: policies.value.scraper[name].header[k]
        })
      }
      policies.value.scraper[name].header = header
    }
    
    console.log(policies.value)
    loading.value = true
  })
}

const scrapers = ref([
  "bangumi",
  "2dfan",
  "getchu",
  "ggbases",
  "dlsite"
])

function addHeader() {
  scraperForm.value.header.push({})
}
function removeHeader(index) {
  if (policies.value['scraper'][scraperName].header[index].header) {
    policies.value['scraper'][scraperName].header[index].header = [...policies.value['scraper'][scraperName].header.slice(0, index), ...policies.value['scraper'][scraperName].header.slice(index+1)]
  }
}

const scraperName = ref("bangumi")
function scraperChange(idx) {
  scraperForm.value = scrapers.value[idx]
}

function scraperSubmit() {
  let param = JSON.parse(JSON.stringify(policies.value))
  for (let name in param.scraper) {
    let header = {}
    for (let h of param.scraper[name].header) {
      header[h.key] = h.value
    }
    param.scraper[name].header = header
  }
  updatePolicy({key: "scraper", policy: JSON.stringify(param.scraper)}).then(res => {
    ElMessage.success("修改成功")
    getPolicyList()
  })
}
function systemSubmit() {
  updatePolicy({key: "system", policy: JSON.stringify(policies.value.system)}).then(res => {
    ElMessage.success("修改成功")
    getPolicyList()
  })
}

getPolicyList()
</script>

<template>
<div v-if="loading">
  <div style="content">
    <el-card class="card">
      <template #header>
        <div class="card-header" style="display: flex;align-items: center;justify-content: space-between;">
          <span>代理设置</span>
          <el-button type="primary" :icon="Check" @click="systemSubmit"></el-button>
        </div>
      </template>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="scheme">
          <el-input v-model="policies.system.proxy.scheme" />
        </el-form-item>
        <el-form-item label="host">
          <el-input v-model="policies.system.proxy.host" />
        </el-form-item>
        <el-form-item label="port">
          <el-input v-model="policies.system.proxy.port" />
        </el-form-item>
        <el-form-item label="username">
          <el-input v-model="policies.system.proxy.username" />
        </el-form-item>
        <el-form-item label="password">
          <el-input v-model="policies.system.proxy.password" type="password" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header" style="display: flex;align-items: center;justify-content: space-between;">
          <div>
            <span>刮削设置</span>
            <el-select v-model="scraperName" placeholder="刮削器名称" @change="scraperChange" style="width: 140px;margin-left: 20px;">
              <el-option
                v-for="item in scrapers"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <el-button type="primary" :icon="Check" @click="scraperSubmit"></el-button>
        </div>
      </template>
      <p>Header</p>
      <template v-for="(h, index) in policies.scraper[scraperName].header" :key="index">
        <el-input v-model="policies['scraper'][scraperName].header[index].key" style="width: 35%;" /> : <el-input v-model="policies['scraper'][scraperName].header[index].value" style="width: 40%;" />
        <el-button type="danger" :icon="Minus" @click="removeHeader(index)" style="margin-left: 5px;"></el-button>
      </template>
      <el-button type="primary" :icon="Plus" @click="addHeader" style="margin-left: 5px;"></el-button>
    </el-card>
  </div>
</div>
</template>

<style scoped>
.card {
  width: 45%;
  float: left;
  margin:10px;
  box-sizing: border-box;
}
</style>