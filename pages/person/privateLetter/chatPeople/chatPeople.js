var Tools = require("../../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    dataList: []
  },

  enterChat: function(e) {
    wx.navigateTo({
      url: "/pages/person/privateLetter/privateChat/privateChat?uid" + e.currentTarget.dataset.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: "commonUser",
      success: res => {
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: Tools.urls.mob_commonUser_peopleInfoDetail,
          method: "GET",
          data: {
            uid: res.data.fid
          },
          success: result => {
            wx.hideLoading();
            if (options.type=='atte') {
              var dataList = result.data.data.attentionInfo.map(item => {
                return item.commonUserPassivity;
              });
              this.setData({
                dataList: dataList
              });
            } else {
              var dataList = result.data.data.fansInfo.map(item => {
                return item.commonUserInitiative;
              });
              this.setData({
                dataList: dataList
              });
            }
          }
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