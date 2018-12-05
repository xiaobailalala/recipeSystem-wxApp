// pages/person/person.js
var Tools=require("../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    viewflag:0,
    imgPath:Tools.tools.imgPathUrl,
    resPathUrl:Tools.tools.resPathUrl,
    articlesLen: 0,
    recipesLen: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.removeStorage({
    //   key: 'commonUser',
    //   success: function(res) {},
    // })
    wx.getStorage({
      key: 'commonUser',
      success: res=> {
        res.data.faccount = res.data.faccount.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
        this.setData({
          userInfo:res.data,
          viewflag: 2
        });
      },
      fail:err=>{
        this.setData({
          viewflag:1
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
    // this.onLoad();
    
    // wx.removeStorage({
    //   key: 'commonUser',
    //   success: function(res) {},
    // })
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        res.data.faccount = res.data.faccount.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
        wx.request({
          url: Tools.urls.mob_commonUser_peopleInfoDetail,
          method: "GET",
          data: {uid: res.data.fid},
          success: res => {
            this.setData({
              articlesLen: res.data.data.info.articles.length,
              recipesLen: res.data.data.info.recipes.length
            });
          }
        });
        this.setData({
          userInfo: res.data,
          viewflag: 2
        });
      },
      fail: err => {
        this.setData({
          viewflag: 1
        });
      }
    })
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