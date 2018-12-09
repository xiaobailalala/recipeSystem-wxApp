var Tools = require("../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    isBgHide: false,
    searchContent: "",
    searchDataIsShow: false,
    dataList: [],
    dataListShow: {},
    searchList: []
  },

  bindInput: function(e) {
    this.setData({
      searchContent: e.detail.value
    });
    if (e.detail.value != "") {
      wx.request({
        url: Tools.urls.mob_material_getDataByVagueName,
        method: "GET",
        data: {name: e.detail.value},
        success: res => {
          this.setData({
            searchList: res.data.data
          });
        }
      });
    } else {
      this.setData({
        searchList: []
      });
    }
  },

  randomBtn: function () {
    this.getRandomData();
  },

  bindFocus: function () {
    this.setData({
      isBgHide: true,
      searchDataIsShow: true
    });
  },

  bindBlur: function () {
    if (!this.data.searchContent) {
      this.setData({
        isBgHide: false,
        searchDataIsShow: false
      });
    }
  },

  getRandomData: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease-out"
    });
    animation.opacity(0).step();
    this.setData({
      dataListShow: animation.export()
    });
    setTimeout(() => {
      wx.request({
        url: Tools.urls.mob_material_randomList,
        method: "GET",
        success: res => {
          this.setData({
            dataList: res.data.data
          });
          animation.opacity(1).step();
          this.setData({
            dataListShow: animation.export()
          });
        }
      });
    }, 300);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomData();
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