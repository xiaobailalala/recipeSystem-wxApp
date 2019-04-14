// pages/info/commonDataInfo/commonDataInfo.js
var Tools = require("../../../ToolsApi/toolsApi.js");
var Stomp = require('../../../utils/stomp.js').Stomp;
var innerAudioContext;
var endType = 0, voiceNext;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stompClient: {},
    fireSensorData: 0,
    smogSensorData: 0,
    infraredSensorData: 0,
    distanceSensorData: 0,
    fireTimer: null,
    smogTimer: null,
    tempTop: 0, 
    tempBottom: 0,
    fireVoice: null, 
    smogVoice: null, 
    readyVoice: null, 
    distanceVoice: null, 
    cookTipMark: null,
    isFirstVoice: true, 
    processVoice: null, 
    requestVoice: null, 
    voiceNextTimeout: null, 
    voiceNextInterval: null, 
    cookIndex: 0,

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
    isSocketConnect: false,
    isCollect: "#999999",
    isAttention: false
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
    var opt = options.rid;
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        this.setData({
          userInfo: res.data
        });
        this.getInitData(opt, res.data.fid, 1);
      },
      fail: err => {
        this.setData({
          userInfo: null
        });
        this.getInitData(opt, 0, 1);
      }
    });
  },

  getInitData: function (rid, uid, type) {
    const _this = this;
    wx.request({
      url: Tools.urls.mob_recipe_updateRecipeCount,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: rid,
      },
      success: res => {
        wx.request({
          url: Tools.urls.mob_recipe_getRecipeById,
          method: "GET",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            fRid: rid,
            fUid: uid,
            fType: type
          },
          success: res => {
            this.setData({
              isAttention: res.data.data.isAttention ? true : false,
              recipeData: res.data.data.item,
              processLength: res.data.data.item.processes.length
            });
            console.log(this.data.recipeData);
            const isCollect = res.data.data.isCollect ? "#ffdc44" : "#999999";
            this.setData({
              isCollect: isCollect,
              cookOperation: this.cookProcess()
            });
            var temStr = this.data.recipeData.ffire;
            if (temStr != 0) {
              _this.setData({
                tempBottom: temStr.split("-")[0],
                tempTop: temStr.split("-")[1]
              });
              this.initSocket(true);
              // this.setData({
              //   isSocketConnect: true
              // });
            } else {
              this.initSocket(false);
              // this.setData({
              //   isSocketConnect: true
              // });
            }
          }
        });
      }
    });
    wx.request({
      url: Tools.urls.mob_aiMark_getVoiceForWXReady,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        readyMark: "RECIPE_START",
        fireMark: "FIRE_SENSOR_ALARM",
        smogMark: "SMOG_SENSOR_ALARM",
        distanceMark: "FIRE_DISTANCE",
        cookTipMark: "COOK_TIP"
      },
      success: res => {
        _this.setData({
          fireVoice: res.data.data[1],
          smogVoice: res.data.data[2],
          readyVoice: res.data.data[0],
          distanceVoice: res.data.data[3],
          cookTipMark: res.data.data[4]
        });
        
        
        
        
        
      }
    });
  },

  initSocket: function (isFire) {
    const _this = this;
    if (isFire) {
      Tools.websocket.then(stompClient => {
        stompClient.subscribe('/sensorData/fire', function (body, headers) {
          _this.setData({
            fireSensorData: JSON.parse(body.body).tmp
          });
        });
        stompClient.subscribe('/sensorData/smog', function (body, headers) {
          _this.setData({
            smogSensorData: JSON.parse(body.body).pm
          });
        });
        stompClient.subscribe("/sensorData/infrared", function (body, headers) {
          _this.setData({
            infraredSensorData: JSON.parse(body.body).body
          });
        });
        stompClient.subscribe("/sensorData/distance", function (body, headers) {
          _this.setData({
            distanceSensorData: JSON.parse(body.body).distance
          });
        });
      });
    } else {
      Tools.websocket.then(stompClient => {
        stompClient.subscribe('/sensorData/smog', function (body, headers) {
          _this.setData({
            fireSensorData: JSON.parse(body.body).tmp
          });
        });
      });
    }
  },

  voicePlay: function (arr) {
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
      url: '/pages/login/login?active=true&recipeUnload=true&rid=' + this.data.recipeData.fid
    });
  },

  cook: function (e) {
    if (this.data.isXS) {
      this.setData({
        isXS: false,
        XSBtnStyle: ""
      });
      this.data.cookOperation.stop();
    } else {
      this.setData({
        isXS: true,
        XSBtnStyle: "toolsOn"
      });
      this.data.cookOperation.start();
    }
  },

  cookProcess() {
    let _this = this, process = this.data.recipeData.processes, readyTimeout;
    return {
      start() {
        this.stopVoice();
        if (_this.data.isFirstVoice) {
          endType = -1;
          innerAudioContext.src = _this.data.resPathUrl + _this.data.readyVoice;
          innerAudioContext.play();
          readyTimeout = setTimeout(() => {
            this.cookInterval(_this.data.cookIndex);
          }, 10000);
        } else {
          this.cookInterval(_this.data.cookIndex);
        }
      },
      stop() {
        endType = 0;
        innerAudioContext.stop();
        clearTimeout(readyTimeout);
        clearInterval(_this.data.voiceNextInterval);
        clearTimeout(_this.data.voiceNextTimeout);
      },
      cookInterval(index) {
        this.stopVoice();
        this.request(process[index].fid).then(res => {
          _this.setData({
            processVoice: res.data.data.fvoice,
            requestVoice: res.data.data.freqVoice
          });
          endType = 1;
          innerAudioContext.src = _this.data.resPathUrl + _this.data.cookTipMark;
          innerAudioContext.play();
          voiceNext = Number(res.data.data.frequest) * 1000;
        });
      },
      stopVoice() {
        if (endType == 5) {
          innerAudioContext.stop();
        }
      },
      request(id) {
        const req = new Promise(function(resolve, reject){
          wx.request({
            url: Tools.urls.mob_process_produceVoice,
            method: "GET",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {fId: id},
            success: res => {
              resolve(res);
            }
          });
        });
        return req;
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
              url: '/pages/login/login?active=true&recipeUnload=true&rid=' + this.data.recipeData.fid
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
        Tools.websocket.then(stompClient => {
          stompClient.send("/sensorMonitor/fireListenStop", {}, this.data.userInfo.fid);
          stompClient.send("/sensorMonitor/infraredListenStop", {}, this.data.userInfo.fid);
          stompClient.send("/sensorMonitor/distanceListenStop", {}, this.data.userInfo.fid);
        });
        this.fireMonitor(false);
      } else {
        this.fireMonitor(true);
        this.setData({
          isFire: true,
          FireBtnStyle: "toolsOn"
        });
        Tools.websocket.then(stompClient => {
          stompClient.send("/sensorMonitor/fireListenStart", {}, JSON.stringify({ "uid": this.data.userInfo.fid, "top": _this.data.tempTop }));
          stompClient.send("/sensorMonitor/infraredListenStart", {}, JSON.stringify({ "uid": this.data.userInfo.fid, "top": 50 }));
          stompClient.send("/sensorMonitor/distanceListenStart", {}, JSON.stringify({ "uid": this.data.userInfo.fid, "top": 50 }));
        });
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
              url: '/pages/login/login?active=true&recipeUnload=true&rid=' + this.data.recipeData.fid
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
        Tools.websocket.then(stompClient => {
          stompClient.send("/sensorMonitor/smogListenStop", {}, this.data.userInfo.fid);
        });
        this.smogMonitor(false);
      } else {
        this.smogMonitor(true);
        this.setData({
          isSmog: true,
          SmogBtnStyle: "toolsOn"
        });
        Tools.websocket.then(stompClient => {
          stompClient.send("/sensorMonitor/smogListenStart", {}, JSON.stringify({ "uid": this.data.userInfo.fid, "top": 90 }));
        });
      }
    }
  },

  fireMonitor: function (isOpen) {
    const _this = this;
    if (isOpen) {
      const tempFireTimer = setInterval(() => {
        if (_this.data.fireSensorData > _this.data.tempTop || (_this.data.infraredSensorData == 1 && _this.data.distanceSensorData < 0.5)) {
          this.setData({
            FireStyle: "safeWarn",
            mainBtnStyle: "mainBtnWarn"
          });
          if (_this.data.fireSensorData > _this.data.tempTop) {
            if (endType == 0) {
              endType = 5;
              innerAudioContext.src = this.data.resPathUrl + _this.data.fireVoice;
              innerAudioContext.play();
              Tools.websocket.then(stompClient => {
                stompClient.send("/sensorMonitor/warning", {}, this.data.userInfo.fid);
              });
            }
          }
          if (_this.data.infraredSensorData == 1 && _this.data.distanceSensorData < 0.5) {
            if (endType == 0) {
              endType = 5;
              innerAudioContext.src = this.data.resPathUrl + _this.data.distanceVoice;
              innerAudioContext.play();
              Tools.websocket.then(stompClient => {
                stompClient.send("/sensorMonitor/warning", {}, this.data.userInfo.fid);
              });
            }
          }
        } else {
          this.setData({
            FireStyle: "safeOn",
            mainBtnStyle: "mainBtnOn"
          });
        }
      }, 1500);
      _this.setData({
        fireTimer: tempFireTimer
      });
    } else {
      clearInterval(_this.data.fireTimer);
    }
  },

  smogMonitor: function (isOpen) {
    const _this = this;
    if (isOpen) {
      const tempSmogTimer = setInterval(() => {
        if (_this.data.smogSensorData > 90) {
          this.setData({
            SmogStyle: "safeWarn",
            mainBtnStyle: "mainBtnWarn"
          });
          if (endType == 0) {
            endType = 5;
            innerAudioContext.src = this.data.resPathUrl + _this.data.smogVoice;
            innerAudioContext.play();
            Tools.websocket.then(stompClient => {
              stompClient.send("/sensorMonitor/warning", {}, this.data.userInfo.fid);
            });
          }
        } else {
          this.setData({
            SmogStyle: "safeOn",
            mainBtnStyle: "mainBtnOn"
          });
        }
      }, 1500);
      _this.setData({
        smogTimer: tempSmogTimer
      });
    } else {
      clearInterval(_this.data.smogTimer);
    }
  },

  collectTab: function () {
    if (this.data.userInfo) {
      if (this.data.isCollect == "#999999") {
        wx.request({
          url: Tools.urls.mob_recipe_collectRecipe,
          method: "GET",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            fUid: this.data.userInfo.fid,
            fRid: this.data.recipeData.fid,
            fType: 1
          },
          success: res => {
            var oldObj = this.data.recipeData;
            oldObj.fgood++;
            this.setData({
              isCollect: "#ffdc44",
              recipeData: oldObj
            });
            wx.showToast({
              title: "收藏成功",
              icon: "success"
            });
          }
        });
      } else {
        wx.request({
          url: Tools.urls.mob_recipe_collectRecipe,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            fUid: this.data.userInfo.fid,
            fRid: this.data.recipeData.fid,
            fType: 1,
            _method: "DELETE"
          },
          success: res => {
            var oldObj = this.data.recipeData;
            oldObj.fgood--;
            this.setData({
              isCollect: "#999999",
              recipeData: oldObj
            });
          }
        });
      }
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '小膳提醒您，请先登录哦',
        confirmText: "去登陆",
        confirmColor: "#ffb31a",
        cancelColor: "#666666",
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?active=true&recipeUnload=true&rid=' + this.data.recipeData.fid
            });
          }
        }
      });
    }
  },

  attentionTab: function (e) {
    wx.getStorage({
      key: "commonUser",
      success: res => {
        wx.request({
          url: this.data.isAttention ? Tools.urls.mob_attention_deleteAttention : Tools.urls.mob_attention_addAttention,
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            fUid: res.data.fid,
            fOid: e.currentTarget.dataset.oid,
            fType: 1
          },
          success: res => {
            if (!this.data.isAttention) {
              wx.showToast({
                title: "成功添加关注",
                icon: "success",
                mask: true
              });
            }
            this.setData({
              isAttention: this.data.isAttention ? false : true
            });
          }
        });
      },
      fail: err => {
        wx.showModal({
          title: '温馨提示',
          content: '小膳提醒您，请先登录哦',
          confirmText: "去登陆",
          confirmColor: "#ffb31a",
          cancelColor: "#666666",
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login?active=true&recipeUnload=true&rid=' + this.data.recipeData.fid
              });
            }
          }
        });
      }
    });
  },

  uploadWorks() {
    wx.getStorage({
      key: "commonUser",
      success: result => {
        wx.chooseImage({
          count: 9,
          sizeType: ['compressed'],
          success: function(res){
            var arr = res.tempFilePaths;
            wx.navigateTo({
              url: "/pages/info/commonDataInfo/works/works?imgPath=" + JSON.stringify(arr) +
              "&uid=" + result.data.fid
            });
          }
        });
      },
      fail: err =>{
        wx.showModal({
          title: '温馨提示',
          content: '请先登录',
          cancelText: "返回",
          confirmText: "去登录",
          confirmColor: "#ffb31a",
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login?active=true&fid=' + this.data.recipeData.fid
              });
            }
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // if (this.data.isSocketConnect) {
    //   this.onLoad({
    //     rid: this.data.recipeData.fid
    //   });
    // }
    // type=1: tipFinish  type=2: processFinish  type=3: requestFinish  type=5: warningFinish
    let _this = this;
    endType = 0;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onEnded(function () {
      switch(endType) {
        case 1:
          endType = 2;
          innerAudioContext.src = _this.data.resPathUrl + _this.data.processVoice;
          innerAudioContext.play();
          break;
        case 2:
          endType = 3;
          innerAudioContext.src = _this.data.resPathUrl + _this.data.requestVoice;
          innerAudioContext.play();
          break;
        case 3:
          endType = 0;
          const tempVoiceNextTimeout = setTimeout(() => {
            const tempVoiceNextInterval = setInterval(() => {
              voiceNext-=100;
            },100);
            _this.setData({
              voiceNextInterval: tempVoiceNextInterval
            });
            clearInterval(_this.data.voiceNextInterval);
            let tempCookIndex = _this.data.cookIndex;
            tempCookIndex++;
            _this.setData({
              cookIndex: tempCookIndex
            });
            _this.data.cookOperation.cookInterval(_this.data.cookIndex)
          },voiceNext);
          _this.setData({
            voiceNextTimeout: tempVoiceNextTimeout
          });
          break;
        case 5:
          endType = 0;
          break;
        case -1:
          const isFirst = _this.data.isFirstVoice;
          _this.setData({
            isFirstVoice: !isFirst
          });
          break;
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.userInfo != null) {
      Tools.websocket.then(stompClient => {
        stompClient.send("/sensorMonitor/allListenStop", {}, this.data.userInfo.fid);
        stompClient.send("/sensorMonitor/infraredListenStop", {}, this.data.userInfo.fid);
        stompClient.send("/sensorMonitor/distanceListenStop", {}, this.data.userInfo.fid);
      });
    }
    // wx.closeSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.userInfo != null) {
      Tools.websocket.then(stompClient => {
        stompClient.send("/sensorMonitor/allListenStop", {}, this.data.userInfo.fid);
        stompClient.send("/sensorMonitor/infraredListenStop", {}, this.data.userInfo.fid);
        stompClient.send("/sensorMonitor/distanceListenStop", {}, this.data.userInfo.fid);
      });
    }
    // wx.closeSocket();
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