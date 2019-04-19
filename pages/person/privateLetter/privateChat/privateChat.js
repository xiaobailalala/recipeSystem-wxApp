var Tools = require("../../../../ToolsApi/toolsApi.js");
var innerAudioContext;
Page({
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    isInputText: true,
    recordStart: false,
    cancleRecord: false,
    isPlaying: false,
    uid: 0,
    userInfo: {},
    oid: 0,
    otherInfo: {},
    chatContext: "",
    scrollWithAnimation: false,
    messageList: [],
    height: 0,
    scrollIntoView: "",
    currentVoiceSrc: ""
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
        recordStart: true,
        isPlaying: true
      });
    });
  },

  stopRecording: function () {
    var that = this;
    this.setData({
      recordStart: false,
      isPlaying: false
    });
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();
    recorderManager.onStop((res) => {
      // if (!this.data.cancleRecord) {
        if (res.duration < 1000) {
          wx.showToast({
            title: '说话时间太短!',
            icon: 'none'
          });
          return;
        } else {
          this.submitMessage(res, 1);
        }
        that.setData({
          // startRecording: false
          isPlaying: false
        })
      // }
      // that.setData({
      //   cancleRecord: false
      // })
    })
  },

  moveToCancle: function (event) {
    // let cancleY = this.data.pageHeight;
    // let currentY = event.touches[0].pageY;
    // if (currentY < (cancleY - 75)) {
    //   this.setData({
    //     cancleRecord: true
    //   });
    // } else {
    //   this.setData({
    //     cancleRecord: false
    //   });
    // } 
  },

  bindInput: function(e) {
    this.setData({
      chatContext: e.detail.value
    });
  },

  bindConfirm: function() {
    if (this.data.chatContext) {
      this.submitMessage(this.data.chatContext, 0);
    } else {
      wx.showToast({
        title: '发送的内容不能为空',
        icon: 'none'
      });
    }
  },

  /**
   * tyle:0 文本信息
   * type:1 语音信息
   * type:2 图片信息
   */
  submitMessage: function(submitContent, type) {
    wx.showLoading({
      title: '发送中',
      mask: true
    });
    if (type == 0) {
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
          fType: type
        },
        success: res => {
          this.refreshMessageData(res.data.data);
          this.setData({
            chatContext: ""
          });
          wx.hideLoading()
        }
      });
    } else {
      wx.uploadFile({
        url: Tools.urls.mob_commonChat_chatSaveMessage,
        filePath: type == 1 ? submitContent.tempFilePath : submitContent,
        name: "file",
        formData: {
          fRelease: this.getDateTime(),
          fUid: this.data.uid,
          fOid: this.data.oid,
          fState: 0,
          fType: type,
          fLong: type == 1 ? Math.floor(Number(submitContent.duration)/1000) : 0
        },
        success: res => {
          this.refreshMessageData(JSON.parse(res.data).data);
          wx.hideLoading()
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
        this.submitMessage(res.tempFilePaths[0], 2);
      }
    });
  },

  refreshMessageData: function (obj) {
    const _this = this;
    let newMessageList = _this.data.messageList;
    newMessageList.push(obj);
    _this.setData({
      scrollIntoView: "scrollPosition-" + obj.fid,
      messageList: newMessageList
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
        const list = res.data.data;
        this.setData({
          scrollIntoView: list.length !== 0 ? "scrollPosition-" + list[list.length - 1].fid : "",
          messageList: res.data.data
        });
        this.setData({
          scrollWithAnimation: true
        });
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

  playVoice: function (e) {
    const current = e.currentTarget.dataset.src;
    if (this.data.currentVoiceSrc == current) {
      this.setData({
        currentVoiceSrc: ""
      });
      innerAudioContext.stop();
    } else {
      this.setData({
        currentVoiceSrc: current
      });
      innerAudioContext.src = this.data.resPath + current;
      innerAudioContext.play();
    }
  },

  previewImage: function (e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [this.data.resPath + current]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height: height
    });
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
    const _this = this;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onEnded(function () {
      _this.setData({
        currentVoiceSrc: ""
      });
    });
    wx.getStorage({
      key: "commonUser",
      success: result => {
        this.setData({
          uid: result.data.fid,
          userInfo: result.data
        });
        this.getMessageData(result.data.fid, this.data.oid);
        const _this = this;
        Tools.websocket.then(stompClient => {
          stompClient.subscribe('/chat/userMsg/' + result.data.fid, function (body, headers) {
            _this.refreshMessageData(JSON.parse(body.body));
            stompClient.send("/chatSwitch/user/changeChatState", {}, JSON.stringify({ "fUid": _this.data.uid, "fOid": _this.data.oid }));
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