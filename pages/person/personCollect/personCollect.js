var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    headAnimation: {},
    occupiedAnimation: {},
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

  bindFocus: function(){
    var headAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    var occupiedAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    headAnimation.translateY("-50%").step();
    occupiedAnimation.height("80rpx").step();
    this.setData({
      headAnimation: headAnimation.export(),
      occupiedAnimation: occupiedAnimation.export()
    });
  },

  bindBlur: function(){
    var headAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    var occupiedAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    headAnimation.translateY(0).step();
    occupiedAnimation.height("160rpx").step();
    this.setData({
      headAnimation: headAnimation.export(),
      occupiedAnimation: occupiedAnimation.export()
    });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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