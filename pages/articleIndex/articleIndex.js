var Tools = require("../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
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
        console.log(res.data.data.bannerList);
        console.log(res.data.data.dataList);
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