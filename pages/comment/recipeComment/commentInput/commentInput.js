var Tools = require("../../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPathUrl: Tools.tools.resPathUrl,
    countLimit: 0,
    imgArr: [],
    content: "",
    rid: 0,
    authorid: 0,
    uid: 0,
    replyid: -1,
    replyname: "在此留下您的评论~"
  },

  signInput: function (e) {
    if (e.detail.value.length <= 40) {
      this.setData({
        countLimit: e.detail.value.length,
        content: e.detail.value
      });
    } else {
      this.setData({
        countLimit: e.detail.value.length
      });
    }
  },

  changeImg: function () {
    var imgArr = this.data.imgArr;
    if (imgArr.length == 3) {
      wx.showToast({
        title: "添加的附图不能超过3张",
        icon: "none"
      });
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: res => {
          const src = res.tempFilePaths[0]
          var newArr = JSON.stringify(this.data.imgArr);
          var content = this.data.content;
          var rid = this.data.rid;
          var authorid = this.data.authorid;
          var uid = this.data.uid;
          wx.navigateTo({
            url: '../commentChangeImg/commentChangeImg?src=' + src + '&imgArr=' + newArr + "&content=" + content + '&rid=' + rid + '&authorid=' + authorid + '&uid=' + uid
          });
          // this.setData({
          //   imgPath: res.tempFilePaths[0]
          // });
        },
      })
    }
  },

  deleteImg: function (e) {
    var arr = this.data.imgArr;
    var index = arr.indexOf(e.currentTarget.dataset.path);
    arr.splice(index, 1);
    this.setData({
      imgArr: arr
    });
  },

  subTab: function () {
    if (this.data.content.length == 0) {
      wx.showToast({
        title: "写点评论吧，文本内容不能为空！",
        icon: "none"
      });
    } else {
      if (this.data.imgArr.length == 0) {
        this.sendData({
          fRid: this.data.rid,
          fUid: this.data.uid,
          fContent: this.data.content,
          fRelease: this.getDateTime(),
          fCover: 0,
          fReplyid: this.data.replyid
        });
      } else {
        var newArr = [];
        this.uploadImg(0, this.data.imgArr, newArr);
      }
    }
  },

  uploadImg: function (i, imgData, newArr) {
    var len = imgData.length;
    wx.uploadFile({
      url: Tools.urls.mob_foodComment_imgupload,
      filePath: imgData[i],
      name: "commentImg",
      success: res => {
        i++;
        newArr.push(JSON.parse(res.data).data);
        if (i == len) {
          this.sendData({
            fRid: this.data.rid,
            fUid: this.data.uid,
            fContent: this.data.content,
            fRelease: this.getDateTime(),
            fCover: JSON.stringify(newArr),
            fReplyid: this.data.replyid
          });
        } else {
          this.uploadImg(i, imgData, newArr);
        }
      }
    });
  },

  sendData: function (dataArr) {
    wx.request({
      url: Tools.urls.mob_foodComment_saveInfo,
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: dataArr,
      success: res => {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.onLoad({
          rid: this.data.rid,
          authorid: this.data.authorid,
          uid: this.data.uid
        });
        wx.navigateBack({
          delta: 1
        });
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
    return (year + "").substring(2, 4) + "-" + month + "-" + day + " " + hours + ":" + minutes;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      content,
      rid,
      authorid,
      uid,
      replyid,
      replyname
    } = options
    this.setData({
      rid: rid,
      authorid: authorid,
      uid: uid
    });
    if (replyid && replyid != -1) {
      this.setData({
        replyid: replyid,
        replyname: "回复@" + replyname + "：",
        isReplyname: true
      });
    }
    if (content) {
      this.setData({
        content: content
      });
    }
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