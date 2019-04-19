var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    uid: null,
    userInfo: {},
    height: 0,
    linkmanList: []
  },

  bindLongPress: function() {
    wx.showModal({
      title: '温馨提示',
      content: '确认要删除当前会话吗？',
      confirmText: '删除',
      confirmColor: '#d9534f',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },

  enterChat: function() {
    wx.navigateTo({
      url: "/pages/person/privateLetter/privateChat/privateChat"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height: height
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
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.getStorage({
      key: "commonUser",
      success: result => {
        this.setData({
          uid: result.data.fid,
          userInfo: result.data
        });
        wx.request({
          url: Tools.urls.mob_linkman_linkmanList,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            fUid: this.data.uid
          },
          success: res => {
            this.setData({
              linkmanList: res.data.data
            });
            console.log(this.data.linkmanList);
            wx.hideLoading()
          }
        });
        Tools.websocket.then(stompClient => {
          stompClient.subscribe('/chat/userMsg/' + result.data.fid, function (body, headers) {
            
          });
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