<script setup>
import { ref } from "vue"
import { Plus, Edit, Delete  } from '@element-plus/icons-vue'
import Upsert from "./Upsert.vue"
import { searchPerson, deletePerson } from "@/api/person"
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref({
  "page":1, 
  "page_size":20,
  "order_by": "created_at desc"
})
const searchParam = ref({
  keyword: "",
  tags: [],
  full_text: false
})

const total = ref(0)
const tableData = ref([
])
const op = ref("")
const personParam = ref({})
const dialogFormVisible = ref(false)
function getPersonList() {
  searchPerson(searchParam.value, page.value).then(res => {
    tableData.value = res.data.list
    total.value = res.total
  })
}
function setDialogFormVisible(bool) {
  dialogFormVisible.value = bool
}

function editPerson(data) {
  op.value = "update"
  personParam.value = data
  setDialogFormVisible(true)
}

function createPerson() {
  op.value = "create"
  personParam.value = {}
  setDialogFormVisible(true)
}

function delPerson(id) {
  ElMessageBox.confirm(
    '是否删除人员？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deletePerson([id]).then(res => {
      ElMessage.success('删除成功')
      getPersonList()
    })
  }).catch(() => {
  })
}

getPersonList()
</script>

<template>
  <el-button type="primary" @click="createTag" :icon="Plus" />
  <el-table :data="tableData" stripe style="width: 100%;margin-top: 20px;">
    <el-table-column prop="id" label="ID" width="60"/>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="alias" label="别名">
      <template #default="{row}">
        {{ row.alias ? row.alias.join("; "):"" }}
      </template>
    </el-table-column>
    <el-table-column prop="gender" label="性别" />
    <el-table-column prop="summary" label="简介" width="310" />
    <el-table-column prop="action" label="操作" fixed="right" width="110">
      <template #default="{row}" style="padding: 10px, 0;">
        <el-button
          type="primary"
          size="small"
          @click="editPerson(row)"
        >
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button
          type="danger"
          size="small"
          style="margin-left: 6px;"
          @click="delPerson(row.id)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <Upsert 
  :data="personParam"
  :person-dialog-form-visible="dialogFormVisible" 
  @setPersonDialogFormVisible="setDialogFormVisible"
  @refresh="getPersonList" />
</template>

<style scoped>
</style>