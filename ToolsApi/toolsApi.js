var toolsObj = {
  reqPathUrl: "http://192.168.1.110:8080",
  imgPathUrl:"http://192.168.1.119:8080/recipeUpload/resource/img",
  // imgPathUrl: "http://172.21.91.21:8080/recipeUpload/resource/img",
  resPathUrl: "http://192.168.1.108/",
  // resPathUrl: "http://172.21.91.21/",
  socketUrl: "ws://192.168.1.110:8080/endpoint-websocket-wxClient",
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
  mob_foodComment_greatOperation: toolsObj.reqPathUrl + "/mob/foodComment/greatOperation"
}
module.exports = {
  tools: toolsObj,
  urls: urlsObj
}