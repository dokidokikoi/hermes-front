<script setup>
import { ref, watch } from "vue"
import { createDeveloper, updateDeveloper } from "@/api/developer"
import { ElMessage } from 'element-plus'

const visible = ref(false)

const props = defineProps({
  developerDialogFormVisible: {
    type: Boolean,
    default: false
  },
  op: {
    type: String,
    default: "create"
  },
  data: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits()

watch(
  () => props.developerDialogFormVisible,
  (newProps) => {
    visible.value = newProps
  }, { immediate: true }
)
const developerForm = ref({})
watch(
  () => props.data,
  (newProps) => {
    developerForm.value = newProps
  }, { immediate: true }
)
const rules = ref({
  name: [
    { required: true, message: '请填写标签名', trigger: 'blur' },
  ],
})

const formRef = ref(null)

async function submit() {
  if (!formRef) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      if (props.op === "create") {
        createDeveloper(developerForm.value).then(res => {
          ElMessage.success("添加成功")
          emit('refresh')
          emit('setDeveloperDialogFormVisible', false)
        })
      } else {
        updateDeveloper(developerForm.value).then(res => {
          ElMessage.success("更新成功")
          emit('refresh')
          emit('setDeveloperDialogFormVisible', false)
        })
      }
    } else {
      ElMessage.error('请将参数填写完整')
    }
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="op=='create'? '新增开发商':'修改开发商'" @close="emit('setDeveloperDialogFormVisible', false)">
    <el-form :model="developerForm" ref="formRef" :rules="rules">
      <el-form-item label="开发商名" prop="name" label-width="80px">
        <el-input v-model="developerForm.name" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('setDeveloperDialogFormVisible', false)">取消</el-button>
        <el-button type="primary" @click="submit()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>