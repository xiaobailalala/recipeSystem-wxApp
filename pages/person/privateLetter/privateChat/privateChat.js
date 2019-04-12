var Tools = require("../../../../ToolsApi/toolsApi.js");
var Stomp = require('../../../../utils/stomp.js').Stomp;
var stompClient = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    isInputText: true,
    recordStart: false,
    cancleRecord: false,
    uid: 0,
    userInfo: {},
    oid: 0,
    otherInfo: {},
    chatContext: "",
    scrollWithAnimation: false,
    scrollTop: 0,
    messageList: []
  },

  changeInput: function () {
    this.setData({
      isInputText: !this.data.isInputText
    });
  },

  startRecording: function () {
    const recorderManager = wx.getRecorderManager();
    recorderManager.start({
      format: 'mp3',
    });
    recorderManager.onStart(() => {
      this.setData({
        recordStart: true
      });
    });
  },

  stopRecording: function () {
    var that = this;
    this.setData({
      recordStart: false
    });
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();
    recorderManager.onStop((res) => {
      if (!this.data.cancleRecord) {
        if (res.duration < 1000) {
          wx.showToast({
            title: '说话时间太短!',
            icon: 'none'
          });
          that.setData({
            startRecording: false
          })
          return;
        } else {
          this.submitMessage(res, 2);
        }
      }
      that.setData({
        cancleRecord: false
      })
    })
  },

  moveToCancle: function (event) {
    let cancleY = this.data.pageHeight;
    let currentY = event.touches[0].pageY;
    if (currentY < (cancleY - 65)) {
      this.setData({
        cancleRecord: true
      });
    } else {
      this.setData({
        cancleRecord: false
      });
    } 
  },

  bindInput: function(e) {
    this.setData({
      chatContext: e.detail.value
    });
  },

  bindConfirm: function() {
    if (this.data.chatContext) {
      this.submitMessage(this.data.chatContext, 1);
    } else {
      wx.showToast({
        title: '发送的内容不能为空',
        icon: 'none'
      });
    }
  },

  /**
   * tyle:1 文本信息
   * type:2 语音信息
   * type:3 图片信息
   */
  submitMessage: function(submitContent, type) {
    if (type == 1) {
      wx.request({
        url: Tools.urls.mob_commonChat_chatSaveMessage,
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          fContent: submitContent,
          fRelease: this.getDateTime(),
          fUid: this.data.uid,
          fOid: this.data.oid,
          fState: 0,
          fType: 1
        },
        success: res => {
          console.log("----> " + this.data.uid + " " + this.data.oid);
          this.getMessageData(this.data.uid, this.data.oid);
          this.setData({
            chatContext: ""
          });
        }
      });
    } else {
      wx.uploadFile({
        url: Tools.urls.mob_commonChat_chatSaveMessage,
        filePath: type == 2 ? submitContent.tempFilePath : submitContent,
        name: "file",
        formData: {
          fRelease: this.getDateTime(),
          fUid: this.data.uid,
          fOid: this.data.oid,
          fState: 0,
          fType: type,
          fLong: type == 2 ? Math.floor(Number(submitContent.duration)/1000) : 0
        },
        success: res => {
          this.getMessageData(this.data.uid, this.data.oid);
        }
      });
    }
  },

  selectImg: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.submitMessage(res.tempFilePaths[0], 3);
      }
    });
  },

  getMessageData: function(uid, oid) {
    wx.request({
      url: Tools.urls.mob_commonChat_showMessage,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        uid: uid,
        oid: oid
      },
      success: res => {
        this.setData({
          scrollTop: res.data.data.length * 1500,
          messageList: res.data.data
        });
        this.setData({
          scrollWithAnimation: true
        });
        console.log(res.data.data);
      }
    });
  },

  getDateTime: function () {
    var dateTime = new Date();
    var year = dateTime.getFullYear();
    var month = (dateTime.getMonth() + 1) < 10 ? "0" + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
    var day = dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();
    var hours = dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();
    var minutes = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = 2;
    wx.request({
      url: Tools.urls.mob_commonUser_peopleInfoBrief,
      method: "GET",
      data: {
        uid: uid
      },
      success: res => {
        this.setData({
          otherInfo: res.data.data
        });
      }
    });
    this.setData({
      oid: uid
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
    wx.getStorage({
      key: "commonUser",
      success: result => {
        console.log(result.data.fid);
        this.setData({
          uid: result.data.fid,
          userInfo: result.data
        });
        this.getMessageData(result.data.fid, this.data.oid);
        var _this = this;
        var socketOpen = false;
        function sendSocketMessage(msg) {
          if (socketOpen) {
            wx.sendSocketMessage({
              data: msg
            })
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
        });
        wx.onSocketMessage(function (res) {
        });
        stompClient = Stomp.over(ws);
        stompClient.connect({}, function (sessionId) {
          stompClient.subscribe('/chat/userMsg/' + result.data.fid, function (body, headers) {
            _this.getMessageData(result.data.fid, _this.data.oid);
          });
        });
      }
    });
    wx.getSystemInfo({
      success: res => {
        this.setData({
          pageHeight: res.windowHeight
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