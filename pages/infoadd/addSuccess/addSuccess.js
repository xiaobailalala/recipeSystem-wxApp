var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    target: ""
  },

  home: function () {
    wx.switchTab({
      url: "/pages/home/index"
    });
    var arr = [];
  },

  write: function () {
    switch(this.data.target) {
      case "recipe": 
        wx.navigateTo({
          url: "/pages/infoadd/recipeInfoAdd/recipeInfoAdd"
        });
        break;
      case "article":
        wx.navigateTo({
          url: "/pages/infoadd/articleInfoAdd/articleInfoAdd"
        });
        break;
      case "works":
        wx.navigateTo({
          url: "/pages/info/commonDataInfo/works/works"
        });
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      target: options.target
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