// pages/infoadd/recipeInfoAdd/recipeIntroduction/recipeIntroduction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduction: ""
  },

  introduction: function(e){
    this.setData({
      introduction: e.detail.value
    });
  },

  subBtnTab: function(){
    if(this.data.introduction){
      var prePage = getCurrentPages();
      var pageContent = prePage[prePage.length-2];
      pageContent.setData({
        recipeIntroduction: this.data.introduction
      });
      wx.navigateBack({
        delta: 1
      });
    }else{
      wx.showToast({
        title: "内容不能为空哦！",
        icon: "none"
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.content){
      this.setData({
        introduction: options.content
      });
    }
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