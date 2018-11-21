var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    contentStyle: "",
    isContentShow: false,
    image: [
      {
        url: Tools.tools.imgPathUrl + "/banner.png",
        text: "这是第一张banner"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner1.png",
        text: "草莓奶油纸杯蛋糕"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner2.png",
        text: "巧克力被子蛋糕"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner3.png",
        text: "提拉米苏（简易版）"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner4.png",
        text: "小奶油雪纷纷"
      }
    ],
    contentHeadRecipe: "content_head_on",
    contentHeadArticle: "",
    recipeIsShow: true,
    articleIsShow: false
  },

  scrollBind: function(e){
    var top = e.detail.scrollTop;
    if(top>=364){
      this.setData({
        contentStyle: "content_head_fixed",
        isContentShow: true
      });
    } else {
      this.setData({
        contentStyle: "",
        isContentShow: false
      });
    }
  },

  recipeList: function(){
    this.setData({
      contentHeadRecipe: "content_head_on",
      contentHeadArticle: "",
      recipeIsShow: true,
      articleIsShow: false
    });
  },

  articleList: function(){
    this.setData({
      contentHeadRecipe: "",
      contentHeadArticle: "content_head_on",
      recipeIsShow: false,
      articleIsShow: true
    });
  },

  userHeadChange: function(){
    console.log("userHead");
  },

  bgChange: function(){
    console.log("bgChange");
  },

  editorBind: function(){
    wx.navigateTo({
      url: "/pages/personeditor/personeditor"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type=="article"){
      this.setData({
        contentHeadRecipe: "",
        contentHeadArticle: "content_head_on",
        recipeIsShow: false,
        articleIsShow: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})