var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    fireMonitorRadio: [
      {
        value: "30-40",
        content: "低火（30-40）"
      }, {
        value: "60-70",
        content: "中火（60-70）"
      }, {
        value: "80-90",
        content: "高火（80-90）"
      }
    ],
    classify: [],
    tip: [],
    fireMonitorAnimation: {},
    isFireMonitor: false,
    reciptTipLength: 0,
    recipeCover: "",
    recipeTitle: "",
    recipeIntroduction: "",
    recipeFire: "",
    recipeClassify: [],
    recipeMaterial: [],
    recipeProcess: [{
      content: "",
      time: "",
      cover: ""
    }],
    recipeTip: [],
    uid: 0
  },

  selectCover: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        this.setData({
          recipeCover: res.tempFilePaths[0]
        });
      },
    })
  },

  recipeTitle: function (e) {
    this.setData({
      recipeTitle: e.detail.value
    });
  },

  monitorChange: function (e) {
    this.setData({
      recipeFire: e.detail.value
    });
  },

  fireMonitorSwitch: function (e) {
    var isOpen = false;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out"
    });
    if (e.detail.value) {
      animation.height("220rpx").step();
      isOpen = true;
    } else {
      animation.height(0).step();
    }
    this.setData({
      isFireMonitor: isOpen,
      fireMonitorAnimation: animation.export()
    });
  },

  addNewClassify: function () {
    var obj = this.data.recipeClassify;
    var firstArr = this.data.classify.map(item => {
      return item.fname;
    });
    firstArr.unshift("请选择");
    obj.push({
      index: [0, 0, 0],
      list: [firstArr, [], []],
      isConfirm: false,
      currentIndex: {
        first: 0,
        second: 0,
        third: 0
      },
      first: {
        name: "",
        id: 0
      },
      second: {
        name: "",
        id: 0
      },
      third: {
        name: "",
        id: 0
      }
    });
    this.setData({
      recipeClassify: obj
    });
  },

  bindClassifyChange: function (e) {
    if (e.detail.value[0] == 0 || e.detail.value[1] == 0) {
      this.customToast("请至少添加一项二级分类");
      this.classifySelectCancel(e);
    } else {
      var index = e.currentTarget.dataset.index;
      var newArray = this.data.recipeClassify;
      var thirdIndex = 0;
      if (e.detail.value[2] == 0) {
        thirdIndex = 0;
      } else {
        thirdIndex = this.data.classify[e.detail.value[0] - 1].classifyTwos[e.detail.value[1] - 1].classifies[e.detail.value[2] - 1].fid;
      }
      var isRepetition = false;
      this.data.recipeClassify.forEach(element => {
        if (element.first.id == this.data.classify[e.detail.value[0] - 1].fid &&
          element.second.id == this.data.classify[e.detail.value[0] - 1].classifyTwos[e.detail.value[1] - 1].fid &&
          element.third.id == thirdIndex) {
          isRepetition = true;
          return false;
        }
      });
      if (!isRepetition) {
        newArray[index].isConfirm = true;
        newArray[index].index = [e.detail.value[0] - 1, e.detail.value[1] - 1, e.detail.value[2] - 1];
        newArray[index].currentIndex = { first: e.detail.value[0], second: e.detail.value[1], third: e.detail.value[2] };
        newArray[index].list = [this.data.recipeClassify[index].list[0], this.data.recipeClassify[index].list[1], this.data.recipeClassify[index].list[2]];
        newArray[index].first = {
          name: this.data.recipeClassify[index].list[0][e.detail.value[0]],
          id: this.data.classify[e.detail.value[0] - 1].fid
        };
        newArray[index].second = {
          name: this.data.recipeClassify[index].list[1][e.detail.value[1]],
          id: this.data.classify[e.detail.value[0] - 1].classifyTwos[e.detail.value[1] - 1].fid
        };
        newArray[index].third = {
          name: this.data.recipeClassify[index].list[2][e.detail.value[2]],
          id: thirdIndex
        };
        this.setData({
          recipeClassify: newArray
        });
      } else {
        this.customToast("该分类已存在，请勿重复添加");
      }
    }
  },

  classifySelectCancel: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeClassify;
    newArray[index].list = [this.data.recipeClassify[index].list[0], [], []];
    newArray[index].index = [0, 0, 0];
    newArray[index].currentIndex = { first: 0, second: 0, third: 0 };
    this.setData({
      recipeClassify: newArray
    });
  },

  classSelectChange: function (e) {
    var index = e.currentTarget.dataset.index;
    switch (e.detail.column) {
      case 0:
        if (e.detail.value == 0) {
          var newArray = this.data.recipeClassify;
          newArray[index].list = [this.data.recipeClassify[index].list[0], [], []];
          newArray[index].index = [0, 0, 0];
          newArray[index].currentIndex = { first: 0, second: 0, third: 0 };
          this.setData({
            recipeClassify: newArray
          });
        } else {
          var newSecondArray = this.data.classify[e.detail.value - 1]
            .classifyTwos.map(item => {
              return item.fname;
            });
          newSecondArray.unshift("请选择");
          var newArray = this.data.recipeClassify;
          newArray[index].list = [this.data.recipeClassify[index].list[0], newSecondArray, []];
          newArray[index].index = [e.detail.value, 0, 0];
          newArray[index].currentIndex.first = e.detail.value - 1;
          this.setData({
            recipeClassify: newArray
          });
        }
        break;
      case 1:
        if (e.detail.value == 0) {
          var newArray = this.data.recipeClassify;
          newArray[index].list = [this.data.recipeClassify[index].list[0], this.data.recipeClassify[index].list[1], []];
          newArray[index].index = [this.data.recipeClassify[index].index[0], 0, 0];
          newArray[index].currentIndex = { first: this.data.recipeClassify[index].currentIndex.first, second: 0, third: 0 };
          this.setData({
            recipeClassify: newArray
          });
        } else {
          var newThirdArray = this.data.classify[this.data.recipeClassify[index].currentIndex.first]
            .classifyTwos[e.detail.value - 1]
            .classifies.map(item => {
              return item.fname;
            });
          newThirdArray.unshift("不选择");
          var newArray = this.data.recipeClassify;
          newArray[index].list = [this.data.recipeClassify[index].list[0], this.data.recipeClassify[index].list[1], newThirdArray];
          newArray[index].index = [this.data.recipeClassify[index].index[0], e.detail.value, 0];
          newArray[index].currentIndex.second = e.detail.value - 1;
          this.setData({
            recipeClassify: newArray
          });
        }
        break;
      default:
        this.setData({
          currentThird: e.detail.value
        });
        break;
    }
  },

  deleteClassify: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeClassify;
    newArray.splice(index, 1);
    this.setData({
      recipeClassify: newArray
    });
  },

  addNewMaterial: function () {
    var obj = this.data.recipeMaterial;
    obj.push({
      name: "",
      number: ""
    });
    this.setData({
      recipeMaterial: obj
    });
  },

  materialNameInput: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeMaterial;
    newArray[index].name = e.detail.value;
    this.setData({
      recipeMaterial: newArray
    });
  },

  materialNumberInput: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeMaterial;
    newArray[index].number = e.detail.value;
    this.setData({
      recipeMaterial: newArray
    });
  },

  deleteMaterial: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeMaterial;
    newArray.splice(index, 1);
    this.setData({
      recipeMaterial: newArray
    });
  },

  addNewProcess: function () {
    var obj = this.data.recipeProcess;
    obj.push({
      content: "",
      time: "",
      cover: ""
    });
    this.setData({
      recipeProcess: obj
    });
  },

  selectProcessCover: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeProcess;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        newArray[index].cover = res.tempFilePaths[0];
        this.setData({
          recipeProcess: newArray
        });
      },
    });
  },

  processIntroductionInput: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeProcess;
    newArray[index].content = e.detail.value;
    this.setData({
      recipeProcess: newArray
    });
  },

  processTimeInput: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeProcess;
    newArray[index].time = e.detail.value;
    this.setData({
      recipeProcess: newArray
    });
  },

  deleteProcess: function(e){
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeProcess;
    newArray.splice(index, 1);
    this.setData({
      recipeProcess: newArray
    });
  },

  getTipRandom: function () {
    wx.request({
      url: Tools.urls.mob_tips_getInfoRandom,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        this.setData({
          tip: res.data.data
        });
      }
    });
  },

  addTips: function (e) {
    if (this.data.recipeTip.length == 2) {
      this.customToast("小贴士最多只能选择两项");
    } else {
      var obj = this.data.recipeTip;
      obj.push({
        content: e.currentTarget.dataset.content,
        id: e.currentTarget.dataset.id
      });
      this.setData({
        recipeTip: obj,
        reciptTipLength: obj.length
      });
    }
  },

  deleteTip: function (e) {
    var index = e.currentTarget.dataset.index;
    var newArray = this.data.recipeTip;
    newArray.splice(index, 1);
    this.setData({
      recipeTip: newArray,
      reciptTipLength: newArray.length
    });
  },

  refreshTip: function () {
    this.getTipRandom();
  },

  subRecipeBtn: function () {
    if (this.data.recipeCover) {
      if (this.data.recipeTitle) {
        if (this.data.recipeIntroduction) {
          var twoArr = [], threeArr = [];
          var classifyFlag = true;
          this.data.recipeClassify.forEach(element => {
            if (element.first.id != 0 && element.second.id != 0) {
              if (element.third.id != 0) {
                twoArr.push(0);
                threeArr.push(element.third.id);
              } else {
                twoArr.push(element.second.id);
                threeArr.push(0);
              }
            } else {
              classifyFlag = false;
              return false;
            }
          });
          if (classifyFlag && this.data.recipeClassify.length != 0) {
            if (this.data.reciptTipLengthreciptTipLength != 0) {
              var tipIdArr = [];
              this.data.recipeTip.forEach(element => {
                tipIdArr.push(element.id);
              });
              var materialNumArr = [], materialNameArr = [];
              var materialFlag = true;
              this.data.recipeMaterial.forEach(element => {
                if (element.name != "" && element.number != "") {
                  materialNumArr.push(element.number);
                  materialNameArr.push(element.name);
                } else {
                  materialFlag = false;
                  return false;
                }
              });
              if (materialFlag && this.data.recipeMaterial.length != 0) {
                var processContent = [], processTime = [], processCover = [];
                var procesFlag = true;
                this.data.recipeProcess.forEach(element => {
                  if (element.content != "" && element.time != "" && element.cover != "") {
                    processContent.push(element.content);
                    processTime.push(element.time);
                    processCover.push(element.cover);
                  } else {
                    procesFlag = false;
                    return false;
                  }
                });
                if (procesFlag && this.data.recipeProcess.length != 0) {
                  var fire = 0;
                  if (this.data.isFireMonitor) {
                    fire = this.data.recipeFire;
                  }
                  wx.showLoading({
                    title: "食谱上传中",
                    mask: true,
                    success: res=> {
                      var newArr = [];
                      this.uploadImg(0, processCover, newArr, {
                        cover: this.data.recipeCover,
                        title: this.data.recipeTitle,
                        introduction: this.data.recipeIntroduction,
                        fire: fire,
                        twoArr: twoArr,
                        threeArr: threeArr,
                        tipIdArr: tipIdArr,
                        materialNumArr: materialNumArr,
                        materialNameArr: materialNameArr,
                        processContent: processContent,
                        processTime: processTime
                      });
                    }
                  });
                }else{
                  this.customToast("请完善步骤信息");
                }
              } else {
                this.customToast("请完善食材信息");
              }
            } else {
              this.customToast("请完善小贴士信息");
            }
          } else {
            this.customToast("请完善您的分类信息");
          }
        } else {
          this.customToast("请描述食谱简介");
        }
      } else {
        this.customToast("请填写食谱名");
      }
    } else {
      this.customToast("请上传食谱封面");
    }
  },

  uploadInfo: function(infoObj){
    wx.uploadFile({
      url: Tools.urls.mob_recipe_uploadRecipeInfo,
      filePath: infoObj.cover,
      name: "cover",
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        fUid: this.data.uid,
        fName: infoObj.title,
        fIntroduction: infoObj.introduction,
        fFire: infoObj.fire,
        fRelease: this.getDateTime(),
        fType: "待审核",
        jsonArr: JSON.stringify({
          twoArr: infoObj.twoArr,
          threeArr: infoObj.threeArr,
          tipIdArr: infoObj.tipIdArr,
          materialNumArr: infoObj.materialNumArr,
          materialNameArr: infoObj.materialNameArr,
          processCover: infoObj.processCover,
          processContent: infoObj.processContent,
          processTime: infoObj.processTime
        }),
      },
      success: res => {
        wx.reLaunch({
          url: "/pages/infoadd/addSuccess/addSuccess?target=recipe"
        });
      }
    });
  },

  uploadImg: function(i, imgData, newArr, infoObj){
    var len = imgData.length;
    wx.uploadFile({
      url: Tools.urls.mob_recipe_uploadProcessCover,
      filePath: imgData[i],
      name: "process",
      success: res => {
        i++;
        newArr.push(JSON.parse(res.data).data);
        if (i == len){
          infoObj.processCover = newArr;
          this.uploadInfo(infoObj);
        } else {
          this.uploadImg(i, imgData, newArr, infoObj);
        }
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
    var seconds = dateTime.getSeconds() < 10 ? "0" + dateTime.getSeconds() : dateTime.getSeconds()
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  },

  customToast: function (content) {
    wx.showToast({
      title: content,
      icon: "none"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        this.setData({
          uid: res.data.fid
        });
        wx.request({
          url: Tools.urls.mob_cla_getAllInfo,
          method: "GET",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            this.setData({
              classify: res.data.data
            });
          }
        });
        this.getTipRandom();
      },
      fail: err => {
        wx.showModal({
          title: '温馨提示',
          content: '请先登录后再发布食谱哦',
          cancelText: "返回",
          confirmText: "去登录",
          confirmColor: "#ffb31a",
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login?active=true'
              });
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
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