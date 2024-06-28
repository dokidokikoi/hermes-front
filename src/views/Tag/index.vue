<script setup>
import { ref } from "vue"
import { Plus, Edit, Delete  } from '@element-plus/icons-vue'
import Upsert from "./Upsert.vue"
import { listTag, deleteTag } from "@/api/tag"
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([
])
const op = ref("")
const tagParam = ref({})
const dialogFormVisible = ref(false)
function getTagList() {
  listTag().then(res => {
    tableData.value = res.data.list
  })
}
function setDialogFormVisible(bool) {
  dialogFormVisible.value = bool
}

function editTag(data) {
  op.value = "update"
  tagParam.value = data
  setDialogFormVisible(true)
}

function createTag() {
  op.value = "create"
  tagParam.value = {}
  setDialogFormVisible(true)
}

function delTag(id) {
  ElMessageBox.confirm(
    '是否删除标签？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteTag([id]).then(res => {
        ElMessage.success('删除成功')
        getTagList()
      })
    })
    .catch(() => {
    })
}

getTagList()
</script>

<template>
  <el-button type="primary" @click="createTag" :icon="Plus" />
  <el-table :data="tableData" stripe style="width: 100%;margin-top: 20px;">
    <el-table-column prop="id" label="ID" width="60"/>
    <el-table-column prop="name" label="标签名" />
    <el-table-column prop="action" label="操作" fixed="right" width="110">
      <template #default="{row}" style="padding: 10px, 0;">
        <el-button
          type="primary"
          size="small"
          @click="editTag(row)"
        >
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button
          type="danger"
          size="small"
          style="margin-left: 6px;"
          @click="delTag(row.id)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <Upsert 
  :op="op"
  :data="tagParam"
  :tag-dialog-form-visible="dialogFormVisible" 
  @setTagDialogFormVisible="setDialogFormVisible"
  @refresh="getTagList" />
</template>

<style scoped>
</style>