// pages/info/commonDataInfo/commonDataInfo.js
var Tools = require("../../../ToolsApi/toolsApi.js");
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
    XSBtnStyle: "",
    FireBtnStyle: "",
    SmogBtnStyle: "",
    isSocketConnect: false
  },

  previewImage: function(e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: current.split(",")
    });
  },

  popup: function() {
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
  onLoad: function(options) {
    // var opt = options.rid;
    var opt = 5;
    wx.request({
      url: Tools.tools.reqPathUrl + '/mob/recipe/updateRecipeCount',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: opt,
      },
      success: res => {
        wx.request({
          url: Tools.tools.reqPathUrl + '/mob/recipe/getRecipeById',
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
          }
        });
      }
    })
  },

  voicePlay: function(arr) {
    console.log(arr);
    var content = arr[0].fcontent;
    var id = arr[0].fid;
    if (arr[0].fvoice == 0) {
      wx.request({
        url: Tools.tools.reqPathUrl + '/mob/process/produceVoice',
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

  testVoice: function() {
    // this.audioCtx.play();
    // console.log(this.data.recipeData.processes[0].fvoice);
    // this.setData({
    //   audioEle: true,
    //   voiceData: this.data.recipeData.processes[0].fvoice
    // });
    // this.audioCtx = wx.createAudioContext('aiAudio');
    // this.audioCtx.play();
    var socketOpen = false

    function sendSocketMessage(msg) {
      console.log('send msg:')
      console.log(msg);
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

    wx.connectSocket({
      url: Tools.tools.socketUrl
    })
    wx.onSocketOpen(function (res) {
      socketOpen = true
      ws.onopen()
    })

    wx.onSocketMessage(function (res) {
      ws.onmessage(res)
    })

    var Stomp = require('../../../utils/stomp.js').Stomp;
    Stomp.setInterval = function () { }
    Stomp.clearInterval = function () { }
    var stompClient = Stomp.over(ws);

    stompClient.connect({}, function (sessionId) {
      stompClient.subscribe('/topic/game_chat', function (body, headers) {
        console.log(headers);
        console.log('From MQ:', body);
      });
      // let openid = 'oO1Yu5Tlih1Lxqi7yh1qc7fZJE9M';
      // stompClient.subscribe('/user/' + openid + '/message', function (body, headers) {
      //   wx.vibrateLong()
      //   console.log('From MQ to user:', body);
      // });
      stompClient.send("/app/helloServer", {}, JSON.stringify({ 'content': '我是客户端' }));
    })
  },

  cook: function(e) {
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
    }
  },

  fire: function() {
    if (this.data.isFire) {
      this.setData({
        isFire: false,
        FireBtnStyle: ""
      });
    } else {
      this.setData({
        isFire: true,
        FireBtnStyle: "toolsOn"
      });
    }
  },

  smog: function() {
    if (this.data.isSmog) {
      this.setData({
        isSmog: false,
        SmogBtnStyle: ""
      });
    } else {
      this.setData({
        isSmog: true,
        SmogBtnStyle: "toolsOn"
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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