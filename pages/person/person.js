// pages/person/person.js
var Tools=require("../../ToolsApi/toolsApi.js");
var Stomp = require('../../utils/stomp.js').Stomp;
var stompClient = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    viewflag:0,
    imgPath:Tools.tools.imgPathUrl,
    resPathUrl:Tools.tools.resPathUrl,
    articlesLen: 0,
    recipesLen: 0,
    tipCount: 0
  },

  getMessageData: function(uid) {
    wx.request({
      url: Tools.urls.mob_sysNotification_showMessageCount,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        uid: uid
      },
      success: res => {
        this.setData({
          tipCount: res.data.data
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: "commonUser",
      success: result => {
        result.data.faccount = result.data.faccount.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
        this.setData({
          userInfo:result.data,
          viewflag: 2
        });
      },
      fail:err=>{
        this.setData({
          viewflag:1
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
      key: 'commonUser',
      success: result => {
        result.data.faccount = result.data.faccount.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
        wx.request({
          url: Tools.urls.mob_commonUser_peopleInfoDetail,
          method: "GET",
          data: {uid: result.data.fid},
          success: res => {
            this.setData({
              articlesLen: res.data.data.info.articles.length,
              recipesLen: res.data.data.info.recipes.length
            });
          }
        });
        this.setData({
          userInfo: result.data,
          viewflag: 2
        });
        this.getMessageData(result.data.fid);
        Tools.websocket.then(stompClient => {
          stompClient.subscribe('/systemMessage/userMsg/' + result.data.fid, function (body, headers) {
            _this.getMessageData(result.data.fid);
          });
        });
      },
      fail: err => {
        this.setData({
          viewflag: 1
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // if(this.data.userInfo) {
    //   wx.closeSocket();
    // }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // if(this.data.userInfo) {
    //   wx.closeSocket();
    // }
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