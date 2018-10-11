var toolsObj = {
  reqPathUrl: "http://192.168.1.110:8080",
  imgPathUrl:"http://192.168.1.119:8080/recipeUpload/resource/img",
  // imgPathUrl: "http://172.21.91.21:8080/recipeUpload/resource/img",
  resPathUrl: "http://192.168.1.108/",
  // resPathUrl: "http://172.21.91.21/",
  socketUrl: "ws://192.168.1.110:8080/endpoint-websocket",
  toast: function(content, icon, mask, duration, fn) {
    wx.showToast({
      title: content,
      icon: icon,
      mask: mask,
      duration: duration,
      success: fn
    })
  }
}
module.exports = {
  tools: toolsObj
}