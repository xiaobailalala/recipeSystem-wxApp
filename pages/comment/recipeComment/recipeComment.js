// pages/comment/recipeComment/recipeComment.js
var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPathUrl: Tools.tools.resPathUrl,
    scrollTop: 0,
    isOut: false,
    animationPlus: {},
    animationComment: {},
    animationTop: {}
  },

  plusMenu: function () {
    if (this.data.isOut) {
      this.menuBack();
      this.setData({
        isOut: false
      });
    } else {
      this.menuOut();
      this.setData({
        isOut: true
      });
    }
  },

  topMenu: function(){
    this.setData({
      scrollTop: 0
    });
    this.menuBack();
  },

  menuOut: function () {
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationComment = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTop = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationComment.translate(0, -60).opacity(1).step();
    animationTop.translate(-60, 0).opacity(1).step();
    this.setData({
      animationPlus: animationPlus.export(),
      animationComment: animationComment.export(),
      animationTop: animationTop.export()
    })
  },

  menuBack: function () {
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationComment = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTop = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationComment.translate(0, 0).opacity(0).step();
    animationTop.translate(0, 0).opacity(0).step();
    this.setData({
      animationPlus: animationPlus.export(),
      animationComment: animationComment.export(),
      animationTop: animationTop.export()
    })
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