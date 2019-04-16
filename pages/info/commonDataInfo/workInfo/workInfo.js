var Tools = require("../../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
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

  attentionTab: function(e){
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
                url: '/pages/login/login?active=true&recipeUnload=true&rid=' + this.data.recipeData.fid,
              });
            }
          }
        });
      }
    });
  },

  initData: function(aid, uid){
    wx.request({
      url: Tools.urls.mob_product_index,
      method: "GET",
      data: {
        aid: aid,
        uid: uid
      },
      success: res => {
        console.log(res.data.data);
        var works = res.data.data.works;
        works.fcover = JSON.parse(works.fcover);
        this.setData({
          articleInfo: res.data.data.works,
          coverLength: works.fcover.length,
          isAttention: res.data.data.isAttention ? true : false
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var wid = options.wid;
    var wid = 1;
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        this.setData({
          userInfo: res.data
        });
        this.initData(wid, res.data.fid);
      },
      fail: err=> {
        this.initData(wid, -1);
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