// pages/list/commonDataList/commonDataList.js
var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    imgPath: Tools.tools.imgPathUrl,
    resPathUrl: Tools.tools.resPathUrl,
    recipesTab1: null,
    recipesTab2: null,
    recipesTab3: null
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      });
    }
  },

  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: Tools.urls.mob_recipe_getDataByClaId,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        threeid: options.threeid,
        twoid: options.twoid
      },
      success: res => {
        var result1 = res.data.data.counts.length == 0 ? null : res.data.data.counts;
        var result2 = res.data.data.news.length == 0 ? null : res.data.data.news;
        var result3 = res.data.data.goods.length == 0 ? null : res.data.data.goods;
        this.setData({
          recipesTab1: result1,
          recipesTab2: result2,
          recipesTab3: result3
        });
      }
    })
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