<script setup>
import { ref } from "vue"
import { Plus, Edit, Delete  } from '@element-plus/icons-vue'
import Upsert from "./Upsert.vue"
import { listDeveloper, deleteDeveloper } from "@/api/developer"
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([
])
const op = ref("")
const developerParam = ref({})
const dialogFormVisible = ref(false)
function getDeveloperList() {
  listDeveloper().then(res => {
    tableData.value = res.data.list
  })
}
function setDialogFormVisible(bool) {
  dialogFormVisible.value = bool
}

function editDeveloper(data) {
  op.value = "update"
  developerParam.value = data
  setDialogFormVisible(true)
}

function createDeveloper() {
  op.value = "create"
  developerParam.value = {}
  setDialogFormVisible(true)
}

function delDeveloper(id) {
  ElMessageBox.confirm(
    '是否删除开发商？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteDeveloper([id]).then(res => {
        ElMessage.success('删除成功')
        getDeveloperList()
      })
    })
    .catch(() => {
    })
}

getDeveloperList()
</script>

<template>
  <el-button type="primary" @click="createDeveloper" :icon="Plus" />
  <el-table :data="tableData" stripe style="width: 100%;margin-top: 20px;">
    <el-table-column prop="id" label="ID" width="60"/>
    <el-table-column prop="name" label="标签名" />
    <el-table-column prop="action" label="操作" fixed="right" width="110">
      <template #default="{row}" style="padding: 10px, 0;">
        <el-button
          type="primary"
          size="small"
          @click="editDeveloper(row)"
        >
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button
          type="danger"
          size="small"
          style="margin-left: 6px;"
          @click="delDeveloper(row.id)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <Upsert 
  :op="op"
  :data="developerParam"
  :developer-dialog-form-visible="dialogFormVisible" 
  @setDeveloperDialogFormVisible="setDialogFormVisible"
  @refresh="getDeveloperList" />
</template>

<style scoped>
</style>