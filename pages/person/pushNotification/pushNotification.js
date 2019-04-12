var Tools = require("../../../ToolsApi/toolsApi.js");
var Stomp = require('../../../utils/stomp.js').Stomp;
var stompClient = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    scrollTop: 0,
    dataList: [],
    userInfo: {},
    actionSheetHidden: true,
    scrollWithAnimation: false
  },

  toolTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  bindClear: function () {
    wx.showModal({
      title: '温馨提示',
      content: '您确定要清空所有信息吗',
      success: res => {
        this.setData({
          actionSheetHidden: !this.data.actionSheetHidden
        });
        if (res.confirm) {
          wx.request({
            url: Tools.urls.mob_sysNotification_deleteMessage,
            method: "GET",
            data: {
              uid: this.data.userInfo.fid
            },
            success: result => {
              this.getMessageData(this.data.userInfo.fid);
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getMessageData: function (uid) {
    wx.request({
      url: Tools.urls.mob_sysNotification_showMessage,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        uid: uid
      },
      success: res => {
        this.setData({
          dataList: res.data.data,
          scrollTop: 1500 * res.data.data.length
        });
        this.setData({
          scrollWithAnimation: true
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
    var _this = this;
    wx.getStorage({
      key: "commonUser",
      success: result => {
        this.setData({
          userInfo: result.data
        });
        this.getMessageData(result.data.fid);
        var socketOpen = false;
        function sendSocketMessage(msg) {
          if (socketOpen) {
            wx.sendSocketMessage({
              data: msg
            });
          } else {
            socketMsgQueue.push(msg)
          }
        }
        var ws = {
          send: sendSocketMessage
        }
        Stomp.setInterval = function () { }
        Stomp.clearInterval = function () { }
        wx.connectSocket({
          url: Tools.tools.socketUrl
        });
        wx.onSocketOpen(function (res) {
          socketOpen = true
          ws.onopen()
        });
        wx.onSocketMessage(function (res) {
          ws.onmessage(res)
        });
        stompClient = Stomp.over(ws);
        stompClient.connect({}, function (sessionId) {
          stompClient.subscribe('/systemMessage/userMsg/' + result.data.fid, function (body, headers) {
            _this.getMessageData(result.data.fid);
          });
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket();
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