var Tools = require("../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    contentStyle: "",
    isContentShow: false,
    contentHeadRecipe: "content_head_on",
    contentHeadArticle: "",
    recipeIsShow: true,
    articleIsShow: false,
    user: {},
    atteLen: 0,
    fansLen: 0,
    userInfo: null,
    type: "",
    uid: 0
  },

  scrollBind: function(e){
    var top = e.detail.scrollTop;
    if(top>=364){
      this.setData({
        contentStyle: "content_head_fixed",
        isContentShow: true
      });
    } else {
      this.setData({
        contentStyle: "",
        isContentShow: false
      });
    }
  },

  recipeList: function(){
    this.setData({
      contentHeadRecipe: "content_head_on",
      contentHeadArticle: "",
      recipeIsShow: true,
      articleIsShow: false
    });
  },

  articleList: function(){
    this.setData({
      contentHeadRecipe: "",
      contentHeadArticle: "content_head_on",
      recipeIsShow: false,
      articleIsShow: true
    });
  },

  userHeadChange: function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        const src = res.tempFilePaths[0]
        console.log(this.data.uid);
        wx.navigateTo({
          url: '/pages/personeditor/changeImage/changeImage?src=' + src + 
          '&type=' + this.data.type +
          '&uid=' + this.data.uid + 
          '&isChangeHead=true' +
          '&preImg=' + this.data.user.fcover
        });
      },
    });
  },

  bgChange: function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        const src = res.tempFilePaths[0];
        wx.uploadFile({
          url: Tools.urls.mob_commonUser_updateCommonUserBg,
          filePath: src,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            fId: this.data.userInfo.fid,
            fBg: this.data.userInfo.fbg,
          },
          success: res => {
            var userObj1 = this.data.userInfo;
            var userObj2 = this.data.user;
            userObj1.fbg = JSON.parse(res.data).data;
            userObj2.fbg = JSON.parse(res.data).data;
            this.setData({
              user: userObj2
            });
            wx.setStorage({
              key: "commonUser",
              data: userObj1
            });
          }
        });
      },
    });
  },

  editorBind: function(){
    wx.navigateTo({
      url: "/pages/personeditor/personeditor"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid;
    if (options.type=="article"){
      this.setData({
        contentHeadRecipe: "",
        contentHeadArticle: "content_head_on",
        recipeIsShow: false,
        articleIsShow: true,
        type: options.type
      });
    }
    wx.getStorage({
      key: "commonUser",
      success: res => {
        this.setData({
          userInfo: res.data
        });
      }
    });
    wx.request({
      url: Tools.urls.mob_commonUser_peopleInfoDetail,
      method: "GET",
      data: {uid: uid},
      success: res => {
        res.data.data.info.articles.forEach(item => item.fcover = JSON.parse(item.fcover)[0]);
        this.setData({
          user: res.data.data.info,
          atteLen: res.data.data.attentionInfo.length,
          fansLen: res.data.data.fansInfo.length,
          uid: uid
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