var Tools = require("../../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    selectImgPath: [],
    selectImgLength: 0,
    uid: 0,
    rid: 0,
    contentMask: {
      length: 1000,
      isShow: false
    },
    articleContent: ""
  },

  contentFocus: function () {
    var newObj = this.data.contentMask;
    newObj.isShow = true;
    this.setData({
      contentMask: newObj
    });
  },

  contentBlur: function () {
    var newObj = this.data.contentMask;
    newObj.isShow = false;
    this.setData({
      contentMask: newObj
    });
  },

  contentInput: function (e) {
    var newObj = this.data.contentMask;
    newObj.length = 1000 - e.detail.value.length;
    this.setData({
      contentMask: newObj,
      articleContent: e.detail.value
    });
  },

  getDateTime: function () {
    var dateTime = new Date();
    var year = dateTime.getFullYear();
    var month = (dateTime.getMonth() + 1) < 10 ? "0" + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
    var day = dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();
    var hours = dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();
    var minutes = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
  },

  selectImg: function () {
    if (this.data.selectImgLength >= 9) {
      wx.showToast({
        title: "选择的图片不能超过9张",
        icon: "none"
      });
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: res => {
          var arr = res.tempFilePaths[0];
          var obj = this.data.selectImgPath;
          obj.push(arr);
          this.setData({
            selectImgPath: obj,
            selectImgLength: obj.length
          });
        }
      });
    }
  },

  deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var obj = this.data.selectImgPath;
    obj.splice(index, 1);
    this.setData({
      selectImgPath: obj,
      selectImgLength: obj.length
    });
  },

  submitTap: function () {
    if (this.data.selectImgLength) {
      wx.showLoading({
        title: "作品上传中",
        mask: true,
        success: res => {
          var newArr = [];
          this.uploadImg(0, this.data.selectImgPath, newArr, {
            fContent: this.data.articleContent,
            fType: "待审核",
            fUid: this.data.uid,
            fRid: this.data.rid,
            fRelease: this.getDateTime()
          });
        }
      });
    } else {
      wx.showToast({
        title: "请至少添加一张封面",
        icon: "none"
      });
    }
  },

  uploadImg: function(i, imgData, newArr, infoObj){
    var len = imgData.length;
    wx.uploadFile({
      url: Tools.urls.mob_article_uploadCover,
      filePath: imgData[i],
      name: "cover",
      success: res => {
        i++;
        newArr.push(JSON.parse(res.data).data);
        if (i == len){
          infoObj.fCover = JSON.stringify(newArr);
          this.uploadInfo(infoObj);
        } else {
          this.uploadImg(i, imgData, newArr, infoObj);
        }
      }
    });
  },

  uploadInfo: function(infoObj){
    wx.request({
      url: Tools.urls.mob_product_saveInfo,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: infoObj,
      success: res => {
        wx.reLaunch({
          url: "/pages/infoadd/addSuccess/addSuccess?target=works"
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.imgPath) {
      var arr = JSON.parse(options.imgPath);
      this.setData({
        selectImgPath: arr,
        selectImgLength: arr.length
      });
    }
    this.setData({
      uid: options.uid,
      rid: options.rid
      // uid: 5
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