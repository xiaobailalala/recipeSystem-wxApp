var toolsObj = {
  // reqPathUrl: "http://192.168.1.110:8080",
  // reqPathUrl: "http://192.168.1.110:8080",
  reqPathUrl: "http://172.20.10.2:8080",
  // imgPathUrl:"http://192.168.1.119:8080/recipeUpload/resource/img",
  // imgPathUrl: "http://172.21.91.21:8080/recipeUpload/resource/img",
  // imgPathUrl: "http://192.168.1.110:8090/recipeUpload/resource/img",
  imgPathUrl: "http://172.20.10.2:8090/recipeUpload/resource/img",
  // resPathUrl: "http://192.168.1.108/",
  // resPathUrl: "http://172.20.10.2/",
  // resPathUrl: "http://172.21.91.21/",
  resPathUrl: "http://172.20.10.10/",
  // socketUrl: "ws://192.168.1.110:8080/endpoint-websocket-wxClient",
  socketUrl: "ws://172.20.10.2:8080/endpoint-websocket-wxClient",
  toast: function(content, icon, mask, duration, fn) {
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
  mob_attention_attentionInfo: toolsObj.reqPathUrl + "/mob/attention/attentionInfo"
}
module.exports = {
  tools: toolsObj,
  urls: urlsObj
}