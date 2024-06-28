<script setup>
import { ref, watch } from "vue"
import { createPublisher, updatePublisher } from "@/api/publisher"
import { ElMessage } from 'element-plus'

const visible = ref(false)

const props = defineProps({
  publisherDialogFormVisible: {
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
  () => props.publisherDialogFormVisible,
  (newProps) => {
    visible.value = newProps
  }, { immediate: true }
)
const publisherForm = ref({})
watch(
  () => props.data,
  (newProps) => {
    publisherForm.value = newProps
  }, { immediate: true }
)
const rules = ref({
  name: [
    { required: true, message: '请填写发行商名', trigger: 'blur' },
  ],
})

const formRef = ref(null)

async function submit() {
  if (!formRef) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      if (props.op === "create") {
        createPublisher(publisherForm.value).then(res => {
          ElMessage.success("添加成功")
          emit('refresh')
          emit('setPublisherDialogFormVisible', false)
        })
      } else {
        updatePublisher(publisherForm.value).then(res => {
          ElMessage.success("更新成功")
          emit('refresh')
          emit('setPublisherDialogFormVisible', false)
        })
      }
    } else {
      ElMessage.error('请将参数填写完整')
    }
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="op=='create'? '新增发行商':'修改发行商'" @close="emit('setPublisherDialogFormVisible', false)">
    <el-form :model="publisherForm" ref="formRef" :rules="rules">
      <el-form-item label="发行商名" prop="name" label-width="80px">
        <el-input v-model="publisherForm.name" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('setPublisherDialogFormVisible', false)">取消</el-button>
        <el-button type="primary" @click="submit()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>