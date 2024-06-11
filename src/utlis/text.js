import { ElMessage } from 'element-plus'

export const textLimit = (num, text) => {
    let textNum = 100
    if (num) {
        textNum = num
    }

    if (text.length > textNum) {
        text = text.Slice(0, textNum)+"..."
    }
    return text
} 

export const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    ElMessage({
        message: '已复制到剪切板',
        type: 'success',
    })
}