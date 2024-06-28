<script setup>
import { ref, watch } from "vue"
import { upsertPerson } from "@/api/person"
import { ElMessage } from 'element-plus'
import { Check, Plus, Minus } from '@element-plus/icons-vue'

const visible = ref(false)

const props = defineProps({
  personDialogFormVisible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits()

watch(
  () => props.personDialogFormVisible,
  (newProps) => {
    visible.value = newProps
  }, { immediate: true }
)
const personForm = ref({})
watch(
  () => props.data,
  (newProps) => {
    personForm.value = newProps
  }, { immediate: true }
)
const rules = ref({
  // name: [
  //   { required: true, message: '请填写人员名', trigger: 'blur' },
  // ],
})

const formRef = ref(null)

async function submit() {
  upsertPerson(personForm.value).then(res => {
          ElMessage.success("编辑成功")
          emit('refresh')
          emit('setPersonDialogFormVisible', false)
        })
  if (!formRef) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
        upsertPerson(personForm.value).then(res => {
          ElMessage.success("编辑成功")
          emit('refresh')
          emit('setPersonDialogFormVisible', false)
        })
      } else {
      ElMessage.error('请将参数填写完整')
    }
  })
}

function addAlias() {
  if (personForm.value.alias) {
    personForm.value.alias.push("")
  } else {
    personForm.value.alias = [""]
  }
}
function removeAlias(index) {
  if (personForm.value.alias) {
    personForm.value.alias = [...personForm.value.alias.slice(0, index), ...personForm.value.alias.slice(index+1)]
  }
}
</script>

<template>
  <el-dialog v-model="visible" :title="'编辑标签'" @close="emit('setPersonDialogFormVisible', false)">
    <el-form :model="tagForm" ref="formRef" :rules="rules">
      <el-form-item label="姓名" prop="name" label-width="80px">
        <el-input v-model="personForm.name" clearable />
      </el-form-item>
      <el-form-item label="别名" prop="alias" label-width="80px">
        <template v-for="(a, index) in personForm.alias" :key="index">
          <el-input v-model="personForm.alias[index]" clearable style="width: 70%;" />
          <el-button type="danger" :icon="Minus" @click="removeAlias(index)" style="margin-left: 5px;"></el-button>
        </template>
        <el-button type="primary" :icon="Plus" @click="addAlias" style="margin-left: 5px;"></el-button>
      </el-form-item>
      <el-form-item label="性别" prop="gender" label-width="80px">
        <el-select v-model="personForm.gender" placeholder="gender" clearable>
          <el-option
            label="男"
            value="男"
          />
          <el-option
            label="女"
            value="女"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="summary" label-width="80px">
        <el-input v-model="personForm.summary" type="textarea" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('setPersonDialogFormVisible', false)">取消</el-button>
        <el-button type="primary" @click="submit()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>