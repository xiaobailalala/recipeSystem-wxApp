var Tools = require("../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    bannerList: [],
    dataList: []
  },

  writeNoteTap: function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      success: function(res){
        var arr = res.tempFilePaths;
        wx.navigateTo({
          url: "/pages/infoadd/articleInfoAdd/articleInfoAdd?imgPath=" + JSON.stringify(arr)
        });
      }
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
    wx.request({
      url: Tools.urls.mob_article_listIndex,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        res.data.data.bannerList.forEach(item => item.fcover = JSON.parse(item.fcover)[0]);
        res.data.data.dataList.forEach(item => item.fcover = JSON.parse(item.fcover)[0]);
        this.setData({
          bannerList: res.data.data.bannerList,
          dataList: res.data.data.dataList
        });
      }
    });
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