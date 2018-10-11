// pages/menu/menu.js
var Tools = require("../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    menuActive: 0,
    secondMenu: null,
    resPathUrl: Tools.tools.resPathUrl
  },

  selectItem: function(e){
    var index = e.target.dataset.index;
    this.setData({
      menuActive: index,
      secondMenu: this.data.list[index].classifyTwos
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: Tools.tools.reqPathUrl+'/mob/cla/getAllInfo',
      method: "get",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:res=>{
        this.setData({
          list: res.data.data,
          secondMenu: res.data.data[0].classifyTwos
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