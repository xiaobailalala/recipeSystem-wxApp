// pages/info/commonDataInfo/commonDataInfo.js
var Tools = require("../../../ToolsApi/toolsApi.js");
var Stomp = require('../../../utils/stomp.js').Stomp;
var stompClient = {};
var fireSensorData = 0;
var smogSensorData = 0;
var fireTimer = null;
var smogTimer = null;
var tempTop, tempBottom;
var fireVoice, smogVoice, readyVoice;
var innerAudioContext;
var isVoicePlay = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPathUrl: Tools.tools.resPathUrl,
    recipeData: null,
    processLength: 0,
    voiceData: "",
    audioEle: false,
    isPopping: true,
    animationcollect: {}, //item位移,透明度
    animationTranspond: {}, //item位移,透明度
    animationInput: {}, //item位移,透明度
    isXS: false,
    isFire: false,
    isSmog: false,
    XSStyle: "safeOn",
    FireStyle: "safeOn",
    SmogStyle: "safeOn",
    mainBtnStyle: "mainBtnOn",
    XSBtnStyle: "",
    FireBtnStyle: "",
    SmogBtnStyle: "",
    userInfo: null,
    isSocketConnect: false
  },

  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: current.split(",")
    });
  },

  popup: function () {
    if (this.data.isPopping) {
      popp.call(this);
      this.setData({
        isPopping: false
      });
    } else {
      takeback.call(this);
      this.setData({
        isPopping: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var opt = options.rid;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onEnded(function () {
      isVoicePlay = false;
    });
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        this.setData({
          userInfo: res.data
        });
      },
      fail: err => {
        this.setData({
          userInfo: null
        });
      }
    });
    var opt = 5;
    wx.request({
      url: Tools.urls.mob_recipe_updateRecipeCount,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: opt,
      },
      success: res => {
        wx.request({
          url: Tools.urls.mob_recipe_getRecipeById,
          method: "GET",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            id: opt,
          },
          success: res => {
            this.setData({
              recipeData: res.data.data,
              processLength: res.data.data.processes.length
            });
            // this.voicePlay(res.data.data.processes);
            var temStr = this.data.recipeData.ffire;
            if (temStr != 0) {
              tempBottom = temStr.split("-")[0];
              tempTop = temStr.split("-")[1];
              if (!this.data.isSocketConnect) {
                this.initSocket(true);
              }
            } else {
              if (!this.data.isSocketConnect) {
                this.initSocket(false);
              }
            }
          }
        });
      }
    })
    wx.request({
      url: Tools.urls.mob_aiMark_getVoiceForWXReady,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        readyMark: "RECIPE_START",
        fireMark: "FIRE_SENSOR_ALARM",
        smogMark: "SMOG_SENSOR_ALARM"
      },
      success: res => {
        readyVoice = res.data.data[0];
        fireVoice = res.data.data[1];
        smogVoice = res.data.data[2]
        // this.setData({
        //   audioEle: true,
        //   voiceData: res.data.data
        // });
        // this.audioCtx = wx.createAudioContext('aiAudio');
        // this.audioCtx.play();
      }
    })
  },

  initSocket: function (isFire) {
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
      url: Tools.tools.socketUrl,
      success: () => {
        this.setData({
          isSocketConnect: true
        });
      }
    });
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
    if (isFire) {
      stompClient.connect({}, function (sessionId) {
        stompClient.subscribe('/sensorData/fire', function (body, headers) {
          fireSensorData = JSON.parse(body.body).tmp;
        });
        stompClient.subscribe('/sensorData/smog', function (body, headers) {
          smogSensorData = JSON.parse(body.body).pm;
        });
        // stompClient.send("/app/helloServer", {}, JSON.stringify({ 'content': '我是客户端' }));
      });
    } else {
      stompClient.connect({}, function (sessionId) {
        stompClient.subscribe('/sensorData/smog', function (body, headers) {
          fireSensorData = JSON.parse(body.body).tmp;
        });
      });
    }
  },

  voicePlay: function (arr) {
    console.log(arr);
    var content = arr[0].fcontent;
    var id = arr[0].fid;
    if (arr[0].fvoice == 0) {
      wx.request({
        url: Tools.urls.mob_process_produceVoice,
        method: "GET",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          fContent: content,
          fId: id
        },
        success: res => {
          this.setData({
            voiceData: res.data.data
          });
        }
      });
    } else {
      this.setData({
        voiceData: arr[0].fvoice
      });
    }
    console.log(this.data.voiceData);

    // this.audioCtx.play()
  },

  testVoice: function () {
    // this.audioCtx.play();
    // console.log(this.data.recipeData.processes[0].fvoice);
    // this.setData({
    //   audioEle: true,
    //   voiceData: this.data.recipeData.processes[0].fvoice
    // });
    // this.audioCtx = wx.createAudioContext('aiAudio');
    // this.audioCtx.play();
    wx.navigateTo({
      url: '/pages/login/login?active=true',
    });
  },

  cook: function (e) {
    if (this.data.isXS) {
      this.setData({
        isXS: false,
        XSBtnStyle: ""
      });
    } else {
      this.setData({
        isXS: true,
        XSBtnStyle: "toolsOn"
      });
      if (!isVoicePlay) {
        isVoicePlay = true;
        innerAudioContext.src = this.data.resPathUrl + readyVoice;
        innerAudioContext.play();
      }
    }
  },

  fire: function () {
    if (this.data.userInfo == null) {
      wx.showModal({
        title: '温馨提示',
        content: '小膳提醒您，请先登录哦',
        confirmText: "去登陆",
        confirmColor: "#ffb31a",
        cancelColor: "#666666",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?active=true',
            });
          }
        }
      });
    } else {
      if (this.data.isFire) {
        this.setData({
          isFire: false,
          FireBtnStyle: "",
          mainBtnStyle: "mainBtnOn"
        });
        stompClient.send("/sensorMonitor/fireListenStop", {}, this.data.userInfo.fid);
        this.fireMonitor(false);
      } else {
        this.fireMonitor(true);
        this.setData({
          isFire: true,
          FireBtnStyle: "toolsOn"
        });
        stompClient.send("/sensorMonitor/fireListenStart", {}, JSON.stringify({ "uid": this.data.userInfo.fid, "top": tempTop }));
      }
    }
  },

  smog: function () {
    if (this.data.userInfo == null) {
      wx.showModal({
        title: '温馨提示',
        content: '小膳提醒您，请先登录哦',
        confirmText: "去登陆",
        confirmColor: "#ffb31a",
        cancelColor: "#666666",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?active=true',
            });
          }
        }
      });
    } else {
      if (this.data.isSmog) {
        this.setData({
          isSmog: false,
          SmogBtnStyle: "",
          mainBtnStyle: "mainBtnOn"
        });
        stompClient.send("/sensorMonitor/smogListenStop", {}, this.data.userInfo.fid);
        this.smogMonitor(false);
      } else {
        this.smogMonitor(true);
        this.setData({
          isSmog: true,
          SmogBtnStyle: "toolsOn"
        });
        stompClient.send("/sensorMonitor/smogListenStart", {}, JSON.stringify({ "uid": this.data.userInfo.fid, "top": 90 }));
      }
    }
  },

  fireMonitor: function (isOpen) {
    if (isOpen) {
      fireTimer = setInterval(() => {
        if (fireSensorData > tempTop) {
          this.setData({
            FireStyle: "safeWarn",
            mainBtnStyle: "mainBtnWarn"
          });
          if (!isVoicePlay) {
            isVoicePlay = true;
            innerAudioContext.src = this.data.resPathUrl + fireVoice;
            innerAudioContext.play();
          }
        } else {
          this.setData({
            FireStyle: "safeOn",
            mainBtnStyle: "mainBtnOn"
          });
        }
      }, 1500);
    } else {
      clearInterval(fireTimer);
    }
  },

  smogMonitor: function (isOpen) {
    if (isOpen) {
      smogTimer = setInterval(() => {
        if (smogSensorData > 90) {
          this.setData({
            SmogStyle: "safeWarn",
            mainBtnStyle: "mainBtnWarn"
          });
          if (!isVoicePlay) {
            isVoicePlay = true;
            innerAudioContext.src = this.data.resPathUrl + smogVoice;
            innerAudioContext.play();
          }
        } else {
          this.setData({
            SmogStyle: "safeOn",
            mainBtnStyle: "mainBtnOn"
          });
        }
      }, 1500);
    } else {
      clearInterval(smogTimer);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.userInfo != null) {
      stompClient.send("/sensorMonitor/allListenStop", {}, this.data.userInfo.fid);
    }
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

function popp() {
  var animationcollect = wx.createAnimation({
    duration: 300,
    delay: 0,
    timingFunction: 'ease-out'
  })
  var animationTranspond = wx.createAnimation({
    duration: 300,
    delay: 200,
    timingFunction: 'ease-out'
  })
  var animationInput = wx.createAnimation({
    duration: 300,
    delay: 400,
    timingFunction: 'ease-out'
  })
  animationcollect.translate(40, -55).opacity(1).step();
  animationTranspond.translate(-22, -60).opacity(1).step();
  animationInput.translate(-65, -10).opacity(1).step();
  this.setData({
    animationcollect: animationcollect.export(),
    animationTranspond: animationTranspond.export(),
    animationInput: animationInput.export(),
  })
}

function takeback() {
  var animationcollect = wx.createAnimation({
    duration: 300,
    timingFunction: 'ease-out'
  })
  var animationTranspond = wx.createAnimation({
    duration: 300,
    delay: 200,
    timingFunction: 'ease-out'
  })
  var animationInput = wx.createAnimation({
    duration: 300,
    delay: 400,
    timingFunction: 'ease-out'
  })
  animationcollect.translate(0, 0).opacity(0).step();
  animationTranspond.translate(0, 0).opacity(0).step();
  animationInput.translate(0, 0).opacity(0).step();
  this.setData({
    animationcollect: animationcollect.export(),
    animationTranspond: animationTranspond.export(),
    animationInput: animationInput.export(),
  })
}