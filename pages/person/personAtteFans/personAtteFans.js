var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    headAnimation: {},
    occupiedAnimation: {},
    contentHeadRecipe: "content_head_on",
    contentHeadArticle: "",
    recipeIsShow: true,
    articleIsShow: false,
    atteArrAll: [],
    fansArrAll: [],

    atteArr: [],
    fansArr: []
  },

  bindFocus: function () {
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

  bindBlur: function () {
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

  recipeList: function () {
    this.setData({
      contentHeadRecipe: "content_head_on",
      contentHeadArticle: "",
      recipeIsShow: true,
      articleIsShow: false
    });
  },

  articleList: function () {
    this.setData({
      contentHeadRecipe: "",
      contentHeadArticle: "content_head_on",
      recipeIsShow: false,
      articleIsShow: true
    });
  },

  bindInput: function (e) {
    var value = e.detail.value;
    var newArr = [];
    if (this.data.recipeIsShow) {
      if (value) {
        var atteArr = this.data.atteArrAll;
        atteArr.forEach(item => {
          if (item.commonUserPassivity.fusername.indexOf(value) != -1) {
            newArr.push(item);
          }
        });
      } else {
        newArr = this.data.atteArrAll;
      }
      this.setData({
        atteArr: newArr
      });
    } else {
      if (value) {
        var fansArr = this.data.fansArrAll;
        fansArr.forEach(item => {
          if (item.commonUserInitiative.fusername.indexOf(value) != -1) {
            newArr.push(item);
          }
        });
      } else {
        newArr = this.data.fansArrAll;
      }
      this.setData({
        fansArr: newArr
      });
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid;
    wx.request({
      url: Tools.urls.mob_commonUser_peopleInfoDetail,
      method: "GET",
      data: {uid: uid},
      success: res => {
        this.setData({
          atteArr: res.data.data.attentionInfo,
          fansArr: res.data.data.fansInfo,
          atteArrAll: res.data.data.attentionInfo,
          fansArrAll: res.data.data.fansInfo
        });
      }
    });
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