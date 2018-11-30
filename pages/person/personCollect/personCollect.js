var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    headAnimation: {},
    occupiedAnimation: {},
    contentHeadRecipe: "content_head_on",
    contentHeadArticle: "",
    recipeIsShow: true,
    articleIsShow: false,
    recipeList: [],
    articleList: [],
    recipeListAll: [],
    articleListAll: []
  },

  bindFocus: function () {
    var headAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    var occupiedAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    headAnimation.translateY("-50%").step();
    occupiedAnimation.height("80rpx").step();
    this.setData({
      headAnimation: headAnimation.export(),
      occupiedAnimation: occupiedAnimation.export()
    });
  },

  bindBlur: function () {
    var headAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    var occupiedAnimation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-out"
    });
    headAnimation.translateY(0).step();
    occupiedAnimation.height("160rpx").step();
    this.setData({
      headAnimation: headAnimation.export(),
      occupiedAnimation: occupiedAnimation.export()
    });
  },

  recipeList: function () {
    this.setData({
      contentHeadRecipe: "content_head_on",
      contentHeadArticle: "",
      recipeIsShow: true,
      articleIsShow: false
    });
  },

  articleList: function () {
    this.setData({
      contentHeadRecipe: "",
      contentHeadArticle: "content_head_on",
      recipeIsShow: false,
      articleIsShow: true
    });
  },

  bindInput: function (e) {
    var value = e.detail.value;
    var newArr = [];
    if (this.data.recipeIsShow) {
      if (value) {
        var recipeArr = this.data.recipeList;
        recipeArr.forEach(item => {
          if (item.recipe.fname.indexOf(value) != -1) {
            newArr.push(item);
          }
        });
      } else {
        newArr = this.data.recipeListAll;
      }
      this.setData({
        recipeList: newArr
      });
    } else {
      if (value) {
        var articleArr = this.data.articleList;
        articleArr.forEach(item => {
          if (item.article.fname.indexOf(value) != -1) {
            newArr.push(item);
          }
        });
      } else {
        newArr = this.data.articleListAll;
      }
      this.setData({
        articleList: newArr
      });
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid;
    wx.request({
      url: Tools.urls.mob_commonUser_collectionInfo,
      data: {
        uid: uid
      },
      method: 'GET',
      success: res => {
        res.data.data.article.forEach(item => {
          item.article.fcover = JSON.parse(item.article.fcover)[0];
        });
        this.setData({
          recipeList: res.data.data.recipe,
          recipeListAll: res.data.data.recipe,
          articleList: res.data.data.article,
          articleListAll: res.data.data.article
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