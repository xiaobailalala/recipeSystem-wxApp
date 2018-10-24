// pages/comment/recipeComment/recipeComment.js
var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPathUrl: Tools.tools.resPathUrl,
    scrollTop: 0,
    isOut: false,
    animationPlus: {},
    animationComment: {},
    animationTop: {},
    uid: 0,
    authorid: 0,
    rid: 0,
    actionSheetHidden: true,
    replyid: -1,
    replyname: "",
    commentList: [],
    commentLength: 0,
    hiddenHeader: true,
    refreshTime: "",
    refreshAnimation: {},
    currentPage: 1,
    isAllData: false
  },

  plusMenu: function () {
    if (this.data.isOut) {
      this.menuBack();
      this.setData({
        isOut: false
      });
    } else {
      this.menuOut();
      this.setData({
        isOut: true
      });
    }
  },

  topMenu: function () {
    this.setData({
      scrollTop: 0,
      isOut: false
    });
    this.menuBack();
  },

  menuOut: function () {
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationComment = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTop = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationComment.translate(0, -60).opacity(1).step();
    animationTop.translate(-60, 0).opacity(1).step();
    this.setData({
      animationPlus: animationPlus.export(),
      animationComment: animationComment.export(),
      animationTop: animationTop.export()
    })
  },

  menuBack: function () {
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationComment = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTop = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationComment.translate(0, 0).opacity(0).step();
    animationTop.translate(0, 0).opacity(0).step();
    this.setData({
      animationPlus: animationPlus.export(),
      animationComment: animationComment.export(),
      animationTop: animationTop.export()
    })
  },

  toComment: function () {
    var rid = this.data.rid;
    var authorid = this.data.authorid;
    var uid = this.data.uid;
    this.menuBack();
    wx.navigateTo({
      url: "/pages/comment/recipeComment/commentInput/commentInput?rid=" + rid + "&authorid=" + authorid + "&uid=" + uid + "&replyid=-1"
    });
  },

  actionSheetTab: function (e) {
    this.setData({
      replyid: e.currentTarget.dataset.replyid,
      replyname: e.currentTarget.dataset.replyname,
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  bindReply: function () {
    var rid = this.data.rid;
    var authorid = this.data.authorid;
    var uid = this.data.uid;
    var replyid = this.data.replyid;
    var replyname = this.data.replyname;
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    wx.navigateTo({
      url: "/pages/comment/recipeComment/commentInput/commentInput?rid=" + rid + "&authorid=" + authorid + "&uid=" + uid + "&replyid=" + replyid + "&replyname=" + replyname
    });
  },

  refresh: function () {
    var date = new Date();
    this.setData({
      refreshTime: date.toLocaleTimeString(),
      currentPage: 1
    });
    this.refreshAnimation(true);
    setTimeout(() => {
      this.getData();
    }, 1000);
  },

  loadMore: function () {
    if(!this.data.isAllData){
      var currPage = this.data.currentPage;
      this.setData({
        currentPage: currPage + 1
      });
      this.getData();
    }
  },

  refreshAnimation: function (isShow) {
    var refreshAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    });
    if (isShow) {
      refreshAnimation.height("42rpx").opacity(1).step();
    } else {
      refreshAnimation.height(0).opacity(0).step();
    }
    this.setData({
      refreshAnimation: refreshAnimation.export()
    });
  },

  getData: function () {
    wx.request({
      url: Tools.urls.mob_foodComment_getInfoByRidAndPage,
      method: "GET",
      data: {
        page: this.data.currentPage,
        rid: this.data.rid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        res.data.data.dataList.forEach(function (item, index) {
          if (item.fcover != 0) {
            var jsonData = JSON.parse(item.fcover);
            item.fcover = jsonData;
          }
        });
        if(res.data.data.isAll==1){
          this.setData({
            isAllData: true
          });
        } else {
          this.setData({
            isAllData: false
          });
        }
        this.setData({
          commentList: res.data.data.dataList,
          commentLength: res.data.data.dataLen
        });
        this.refreshAnimation(false);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      rid,
      authorid,
      uid
    } = options
    var date = new Date();
    this.setData({
      rid: rid,
      authorid: authorid,
      uid: uid,
      refreshTime: date.toLocaleTimeString()
    });
    wx.request({
      url: Tools.urls.mob_foodComment_getInfoByRid,
      method: "GET",
      data: { rid: this.data.rid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        res.data.data.dataList.forEach(function (item, index) {
          if (item.fcover != 0) {
            var jsonData = JSON.parse(item.fcover);
            item.fcover = jsonData;
          }
        });
        if(res.data.data.isAll==1){
          this.setData({
            isAllData: true
          });
        } else {
          this.setData({
            isAllData: false
          });
        }
        this.setData({
          commentList: res.data.data.dataList,
          commentLength: res.data.data.dataLen
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