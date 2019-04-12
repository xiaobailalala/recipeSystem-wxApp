var Tools = require("../../ToolsApi/toolsApi.js");
var attePeople = [], fansPeople = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    isAtteShow: false,
    isFansShow: false,
    personScrollAnimation: {},
    bottomScrollAnimation: {},
    people: [],
    atteLen: 0,
    fansLen: 0,
    isAttePeople: false,
    attentionDataList: []
  },

  atteTap: function () {
    if (this.data.isAtteShow) {
      this.setData({
        personScrollAnimation: this.animationOff(false).export(),
        bottomScrollAnimation: this.animationOff(true).export(),
        isAtteShow: false
      });
    } else {
      if (!this.data.isFansShow) {
        this.setData({
          isAttePeople: true,
          people: attePeople,
          personScrollAnimation: this.animationOn(false).export(),
          bottomScrollAnimation: this.animationOn(true).export(),
          isAtteShow: true
        });
      } else {
        this.setData({
          personScrollAnimation: this.animationOff(false).export(),
          bottomScrollAnimation: this.animationOff(true).export(),
          isFansShow: false
        });
        setTimeout(() => {
          this.setData({
            isAttePeople: true,
            people: attePeople,
            personScrollAnimation: this.animationOn(false).export(),
            bottomScrollAnimation: this.animationOn(true).export(),
            isAtteShow: true,
            isFansShow: false
          });
        }, 300);
      }
    }
  },

  fansTap: function () {
    if (this.data.isFansShow) {
      this.setData({
        personScrollAnimation: this.animationOff(false).export(),
        bottomScrollAnimation: this.animationOff(true).export(),
        isFansShow: false
      });
    } else {
      if (!this.data.isAtteShow) {
        this.setData({
          isAttePeople: false,
          people: fansPeople,
          personScrollAnimation: this.animationOn(false).export(),
          bottomScrollAnimation: this.animationOn(true).export(),
          isFansShow: true,
          isAtteShow: false
        });
      } else {
        this.setData({
          personScrollAnimation: this.animationOff(false).export(),
          bottomScrollAnimation: this.animationOff(true).export(),
          isAtteShow: false
        });
        setTimeout(() => {
          this.setData({
            isAttePeople: false,
            people: fansPeople,
            personScrollAnimation: this.animationOn(false).export(),
            bottomScrollAnimation: this.animationOn(true).export(),
            isFansShow: true,
            isAtteShow: false
          });
        }, 300);
      }
    }
  },

  animationOn: function (isBottom) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease-out"
    });
    animation.opacity(1).height(isBottom ? "230rpx" : "160rpx").step();
    return animation;
  },

  animationOff: function (isBottom) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease-out"
    });
    animation.opacity(0).height(isBottom ? "80rpx" : "0").step();
    return animation;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      success: res => {
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: Tools.urls.mob_attention_attentionInfo,
          method: "GET",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            uid: res.data.fid
          },
          success: result => {
            var dataArr = [];
            result.data.data.articles.forEach(item => {
              item.isRecipe = false;
              item.fcover = JSON.parse(item.fcover)[0];
              dataArr.push(item);
            });
            result.data.data.recipes.forEach(item => {
              item.isRecipe = true;
              dataArr.push(item);
            });
            dataArr.sort((a, b) => {
              return new Date(b.frelease.replace(/-/g, "/")) - new Date(a.frelease.replace(/-/g, "/"))
            });
            attePeople = result.data.data.attentionInfo;
            fansPeople = result.data.data.fansInfo;
            this.setData({
              attentionDataList: dataArr,
              atteLen: attePeople.length,
              fansLen: fansPeople.length
            });
            wx.hideLoading();
          }
        });
      },
      fail: err => {
        wx.showModal({
          title: '温馨提示',
          content: '请先登录哦',
          confirmText: "去登陆",
          confirmColor: "#ffb31a",
          cancelColor: "#666666",
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login?active=true'
              });
            } else {
              wx.reLaunch({
                url: "/pages/home/index"
              });
            }
          }
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