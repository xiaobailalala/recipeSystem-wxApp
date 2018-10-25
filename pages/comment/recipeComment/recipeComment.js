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
    isAllData: false,
    userInfo: {}
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
      this.getData(true);
    }, 1000);
  },

  loadMore: function () {
    if (!this.data.isAllData) {
      var currPage = this.data.currentPage;
      this.setData({
        currentPage: currPage + 1
      });
      this.getData(false);
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

  getData: function (isTop) {
    wx.request({
      url: Tools.urls.mob_foodComment_getInfoByRidAndPage,
      method: "GET",
      data: {
        page: this.data.currentPage,
        rid: this.data.rid,
        uid: this.data.userInfo.fid
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
        if (res.data.data.isAll == 1) {
          this.setData({
            isAllData: true
          });
        } else {
          this.setData({
            isAllData: false
          });
        }
        this.setData({
          commentLength: res.data.data.dataLen
        });
        if (isTop) {
          this.setData({
            commentList: res.data.data.dataList
          });
        } else {
          var currentList = this.data.commentList;
          currentList = currentList.concat(res.data.data.dataList);
          this.setData({
            commentList: currentList
          });
        }
        this.refreshAnimation(false);
      }
    });
  },

  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: current.split(",")
    });
  },

  greatTab: function (e) {
    var isGreat = e.currentTarget.dataset.great;
    var dataObj = {};
    if (isGreat == 1) {
      dataObj = {
        cid: e.currentTarget.dataset.cid,
        uid: this.data.userInfo.fid,
        open: 0
      }
    } else {
      dataObj = {
        cid: e.currentTarget.dataset.cid,
        uid: this.data.userInfo.fid,
        open: 1
      }
    }
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: Tools.urls.mob_foodComment_greatOperation,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: dataObj,
      success: res => {
        var currentList = this.data.commentList;
        if (isGreat == 1) {
          currentList[index].userGreat = 0;
          currentList[index].fgood-=1;
        } else {
          currentList[index].userGreat = 1;
          currentList[index].fgood+=1;
        }
        this.setData({
          commentList: currentList
        });
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
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        this.setData({
          userInfo: res.data
        });
        wx.request({
          url: Tools.urls.mob_foodComment_getInfoByRid,
          method: "GET",
          data: {
            rid: this.data.rid,
            uid: this.data.userInfo.fid
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
            if (res.data.data.isAll == 1) {
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
      fail: err => {
        wx.showModal({
          title: '温馨提示',
          content: '登录已过期，请重新登录',
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