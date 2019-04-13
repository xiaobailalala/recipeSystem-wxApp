var toolsObj = {
  reqPathUrl: "http://192.168.2.226:8080",
  imgPathUrl: "http://47.107.179.70:8090/recipeUpload/resource/img",
  resPathUrl: "http://47.107.179.70/",
  socketUrl: "ws://192.168.2.226:8080/endpoint-websocket-wxClient",
  toast: function (content, icon, mask, duration, fn) {
    wx.showToast({
      title: content,
      icon: icon,
      mask: mask,
      duration: duration,
      success: fn
    });
  }
}
var urlsObj = {
  mob_recipe_updateRecipeCount: toolsObj.reqPathUrl + "/mob/recipe/updateRecipeCount",
  mob_recipe_getRecipeById: toolsObj.reqPathUrl + "/mob/recipe/getRecipeById",
  mob_aiMark_getVoiceForWXReady: toolsObj.reqPathUrl + "/mob/aiMark/getVoiceForWXReady",
  mob_process_produceVoice: toolsObj.reqPathUrl + "/mob/process/produceVoice",
  mob_recipe_getDataByClaId: toolsObj.reqPathUrl + "/mob/recipe/getDataByClaId",
  mob_commonUser_commonUserLogin: toolsObj.reqPathUrl + "/mob/commonUser/commonUserLogin",
  mob_cla_getAllInfo: toolsObj.reqPathUrl + "/mob/cla/getAllInfo",
  mob_commonUser_commonUserSaveInfo: toolsObj.reqPathUrl + "/mob/commonUser/commonUserSaveInfo",
  mob_commonUser_commonUsersaveHead: toolsObj.reqPathUrl + "/mob/commonUser/commonUsersaveHead",
  mob_profession_getAllInfo: toolsObj.reqPathUrl + "/mob/profession/getAllInfo",
  mob_common_getCode: toolsObj.reqPathUrl + "/mob/common/getCode",
  mob_commonUser_commonUserReg: toolsObj.reqPathUrl + "/mob/commonUser/commonUserReg",
  mob_foodComment_imgupload: toolsObj.reqPathUrl + "/mob/foodComment/imgupload",
  mob_foodComment_saveInfo: toolsObj.reqPathUrl + "/mob/foodComment/saveInfo",
  mob_foodComment_getInfoByRid: toolsObj.reqPathUrl + "/mob/foodComment/getInfoByRid",
  mob_foodComment_getInfoByRidAndPage: toolsObj.reqPathUrl + "/mob/foodComment/getInfoByRidAndPage",
  mob_foodComment_greatOperation: toolsObj.reqPathUrl + "/mob/foodComment/greatOperation",
  mob_tips_getInfoRandom: toolsObj.reqPathUrl + "/mob/tips/getInfoRandom",
  mob_recipe_uploadProcessCover: toolsObj.reqPathUrl + "/mob/recipe/uploadProcessCover",
  mob_recipe_uploadRecipeInfo: toolsObj.reqPathUrl + "/mob/recipe/uploadRecipeInfo",
  mob_article_uploadCover: toolsObj.reqPathUrl + "/mob/article/uploadCover",
  mob_article_saveInfo: toolsObj.reqPathUrl + "/mob/article/saveInfo",
  mob_recipe_collectRecipe: toolsObj.reqPathUrl + "/mob/recipe/collectRecipe",
  mob_common_index: toolsObj.reqPathUrl + "/mob/common/index",
  mob_common_randomRecipe: toolsObj.reqPathUrl + "/mob/common/randomRecipe",
  mob_article_index: toolsObj.reqPathUrl + "/mob/article/index",
  mob_article_greatOperation: toolsObj.reqPathUrl + "/mob/article/greatOperation",
  mob_article_collectArticle: toolsObj.reqPathUrl + "/mob/article/collectArticle",
  mob_articleComment_getInfoByRid: toolsObj.reqPathUrl + "/mob/articleComment/getInfoByRid",
  mob_articleComment_greatOperation: toolsObj.reqPathUrl + "/mob/articleComment/greatOperation",
  mob_articleComment_getInfoByRidAndPage: toolsObj.reqPathUrl + "/mob/articleComment/getInfoByRidAndPage",
  mob_articleComment_saveInfo: toolsObj.reqPathUrl + "/mob/articleComment/saveInfo",
  mob_articleComment_imgupload: toolsObj.reqPathUrl + "/mob/articleComment/imgupload",
  mob_commonUser_collectionInfo: toolsObj.reqPathUrl + "/mob/commonUser/collectionInfo",
  mob_attention_addAttention: toolsObj.reqPathUrl + "/mob/attention/addAttention",
  mob_attention_deleteAttention: toolsObj.reqPathUrl + "/mob/attention/deleteAttention",
  mob_attention_attentionInfo: toolsObj.reqPathUrl + "/mob/attention/attentionInfo",
  mob_article_listIndex: toolsObj.reqPathUrl + "/mob/article/listIndex",
  mob_article_articleForClassify: toolsObj.reqPathUrl + "/mob/article/articleForClassify",
  mob_commonUser_peopleInfoDetail: toolsObj.reqPathUrl + "/mob/commonUser/peopleInfoDetail",
  mob_commonUser_peopleInfoBrief: toolsObj.reqPathUrl + "/mob/commonUser/peopleInfoBrief",
  mob_commonUser_updateCommonUserBg: toolsObj.reqPathUrl + "/mob/commonUser/updateCommonUserBg",
  mob_recipe_handpickList: toolsObj.reqPathUrl + "/mob/recipe/handpickList",
  mob_article_handpickList: toolsObj.reqPathUrl + "/mob/article/handpickList",
  mob_material_randomList: toolsObj.reqPathUrl + "/mob/material/randomList",
  mob_material_getDataByVagueName: toolsObj.reqPathUrl + "/mob/material/getDataByVagueName",
  mob_sysNotification_showMessage: toolsObj.reqPathUrl + "/mob/sysNotification/showMessage",
  mob_sysNotification_showMessageCount: toolsObj.reqPathUrl + "/mob/sysNotification/showMessageCount",
  mob_sysNotification_deleteMessage: toolsObj.reqPathUrl + "/mob/sysNotification/deleteMessage",
  mob_marqueClassify_productClassifyList: toolsObj.reqPathUrl + "/mob/marqueClassify/productClassifyList",
  mob_recipe_getDataByMid: toolsObj.reqPathUrl + "/mob/recipe/getDataByMid",
  mob_commonChat_chatSaveMessage: toolsObj.reqPathUrl + "/mob/commonChat/chatSaveMessage",
  mob_commonChat_showMessage: toolsObj.reqPathUrl + "/mob/commonChat/showMessage"
}

const websocket = new Promise(function(resolve, reject){
  let socketOpen = false
  let socketMsgQueue = []
  // 发送数据
  function sendSocketMessage(msg) {
    if (socketOpen) {
      wx.sendSocketMessage({ // 通过 WebSocket连接发送数据
        data: msg
      })
    } else {
      socketMsgQueue.push(msg)
    }
  }
  let ws = {
    send: sendSocketMessage
  }
  wx.connectSocket({
    url: toolsObj.socketUrl
  })
  wx.onSocketOpen((res) => {
    socketOpen = true
    ws.onopen()
  })
  wx.onSocketMessage(res => {
    ws.onmessage(res)
  })
  let Stomp = require('../utils/stomp.js').Stomp
  Stomp.setInterval = (interval, f) => {
    return setInterval(interval, f)
  }
  Stomp.clearInterval = (id) => {
    return clearInterval(id)
  }
  var stompClient = Stomp.over(ws)
  stompClient.connect({}, sessionId => {
    resolve(stompClient)
  })
})


module.exports = {
  tools: toolsObj,
  urls: urlsObj,
  websocket: websocket
}