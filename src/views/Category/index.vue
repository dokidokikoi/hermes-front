<script setup>
import { ref } from "vue"
import { Plus, Edit, Delete  } from '@element-plus/icons-vue'
import Upsert from "./Upsert.vue"
import { listCategory, deleteCategory } from "@/api/category"
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([
])
const op = ref("")
const categoryParam = ref({})
const dialogFormVisible = ref(false)
function getCategoryList() {
  listCategory().then(res => {
    tableData.value = res.data.list
  })
}
function setDialogFormVisible(bool) {
  dialogFormVisible.value = bool
}

function editCategory(data) {
  op.value = "update"
  categoryParam.value = data
  setDialogFormVisible(true)
}

function createCategory() {
  op.value = "create"
  categoryParam.value = {}
  setDialogFormVisible(true)
}

function delCategory(id) {
  ElMessageBox.confirm(
    '是否删除分类？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteCategory([id]).then(res => {
        ElMessage.success('删除成功')
        getCategoryList()
      })
    })
    .catch(() => {
    })
}

getCategoryList()
</script>

<template>
  <el-button type="primary" @click="createCategory" :icon="Plus" />
  <el-table :data="tableData" stripe style="width: 100%;margin-top: 20px;">
    <el-table-column prop="id" label="ID" width="60"/>
    <el-table-column prop="name" label="分类名" />
    <el-table-column prop="summary" label="分类介绍" />
    <el-table-column prop="action" label="操作" fixed="right" width="110">
      <template #default="{row}" style="padding: 10px, 0;">
        <el-button
          type="primary"
          size="small"
          @click="editCategory(row)"
        >
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button
          type="danger"
          size="small"
          style="margin-left: 6px;"
          @click="delCategory(row.id)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <Upsert 
  :op="op"
  :data="categoryParam"
  :category-dialog-form-visible="dialogFormVisible" 
  @setCategoryDialogFormVisible="setDialogFormVisible"
  @refresh="getCategoryList" />
</template>

<style scoped>
</style>