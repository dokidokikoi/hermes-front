export const imageUrl = (url) => {
  if (!url) {
    return
  }
  if (url.length > 4 && url.substring(0, 4) !== "http") {
    let arr = url.split("/")
    return `${import.meta.env.VITE_BASE_URL}/file/${arr[arr.length-1]}`
  }
  return url
}