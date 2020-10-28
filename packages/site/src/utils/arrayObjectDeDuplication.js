// 数组对象去重
export default function arrayObjectDeDuplication(arr, key) {
  var newobj = {},
    newArr = []
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    if (!newobj[item[key]]) {
      newobj[item[key]] = newArr.push(item)
    }
  }
  return newArr
}
