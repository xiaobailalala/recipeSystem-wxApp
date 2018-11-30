var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    peopleLen: 0,
    peopleList: [],
    articleList: [],
    classify: 1
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
    var classify = options.classify;
    wx.request({
      url: Tools.urls.mob_article_articleForClassify,
      method: "GET",
      data: {classify: classify},
      success: res => {
        console.log(res);
        res.data.data.articleList.forEach(item => item.fcover = JSON.parse(item.fcover)[0]);
        this.setData({
          peopleLen: res.data.data.peopleList.length,
          peopleList: res.data.data.peopleList,
          articleList: res.data.data.articleList,
          classify: classify
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