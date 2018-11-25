var Tools = require("../../../ToolsApi/toolsApi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    image: [
      {
        url: Tools.tools.imgPathUrl + "/banner.png",
        text: "这是第一张banner"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner1.png",
        text: "草莓奶油纸杯蛋糕"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner2.png",
        text: "巧克力被子蛋糕"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner3.png",
        text: "提拉米苏（简易版）"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner4.png",
        text: "小奶油雪纷纷"
      }
    ],
    fixedBottom: 0,
    imageIndex: 1,
    articleInfo: {},
    coverLength: 0,
    isGreat: false,
    isCollect: false,
    userInfo: null,
    commentLen: 0,
    isAttention: false
  },

  swiperChange: function (e) {
    this.setData({
      imageIndex: e.detail.current + 1
    });
  },

  greatTab: function () {
    if (this.data.userInfo) {
      wx.request({
        url: Tools.urls.mob_article_greatOperation,
        method: "GET",
        data: {
          open: this.data.isGreat ? 0 : 1,
          fAid: this.data.articleInfo.fid,
          fUid: this.data.userInfo.fid,
          fType: 2
        },
        success: res => {
          var newObj = this.data.articleInfo;
          if (this.data.isGreat) {
            newObj.fgood = newObj.fgood - 1;
            this.setData({
              isGreat: false,
              articleInfo: newObj
            });
          } else {
            newObj.fgood = newObj.fgood + 1;
            this.setData({
              isGreat: true,
              articleInfo: newObj
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录哦',
        confirmText: "去登陆",
        confirmColor: "#ffb31a",
        cancelColor: "#666666",
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?active=true&aid=' + this.data.articleInfo.fid,
            });
          }
        }
      });
    }
  },

  collectTab: function(){
    if (this.data.userInfo) {
      wx.request({
        url: Tools.urls.mob_article_collectArticle,
        method: "GET",
        data: {
          open: this.data.isCollect ? 0 : 1,
          fRid: this.data.articleInfo.fid,
          fUid: this.data.userInfo.fid,
          fType: 2
        },
        success: res => {
          var newObj = this.data.articleInfo;
          if (this.data.isCollect) {
            newObj.fcollect = newObj.fcollect - 1;
            this.setData({
              isCollect: false,
              articleInfo: newObj
            });
          } else {
            newObj.fcollect = newObj.fcollect + 1;
            this.setData({
              isCollect: true,
              articleInfo: newObj
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录哦',
        confirmText: "去登陆",
        confirmColor: "#ffb31a",
        cancelColor: "#666666",
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?active=true&aid=' + this.data.articleInfo.fid,
            });
          }
        }
      });
    }
  },

  moreTab: function(){
    wx.navigateTo({
      url: "/pages/comment/recipeComment/recipeComment?rid=" + this.data.articleInfo.fid + 
      "&authorid=" + this.data.articleInfo.commonUser.fid + 
      "&type=article"
    });
  },

  focusBind: function (e) {

  },

  initData: function(aid, uid){
    wx.request({
      url: Tools.urls.mob_article_index,
      method: "GET",
      data: { 
        aid: aid,
        uid: uid
      },
      success: res => {
        var article = res.data.data.article;
        article.fcover = JSON.parse(article.fcover);
        this.setData({
          commentLen: res.data.data.article.articleComments.length,
          articleInfo: res.data.data.article,
          coverLength: article.fcover.length,
          isGreat: res.data.data.isGreat ? true : false,
          isCollect: res.data.data.isCollect ? true : false
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    // var aid = 1;
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        this.setData({
          userInfo: res.data
        });
        this.initData(aid, res.data.fid);
      },
      fail: err=> {
        this.initData(aid, -1);
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