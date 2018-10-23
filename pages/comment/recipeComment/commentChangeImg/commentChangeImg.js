// pages/comment/recipeComment/commentChangeImg/commentChangeImg.js
import weCropper from '../../../we-cropper/dist/weCropper.js'

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 280) / 2,
        y: (height - 280) / 2,
        width: 280,
        height: 280
      }
    },
    temporary: null,
    content: "",
    rid: 0,
    authorid: 0,
    uid: 0
  },


  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        var pages = getCurrentPages();
        var prePage = pages[pages.length-2];
        var imgArr = prePage.data.imgArr;
        imgArr.push(avatar);
        prePage.setData({
          imgArr: imgArr
        });
        wx.navigateBack({
          delta: 1
        });
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let src = res.tempFilePaths[0];
        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    const {
      cropperOpt
    } = this.data
    const {
      src,
      imgArr,
      content,
      rid,
      authorid,
      uid
    } = option
    this.setData({
      temporary: imgArr,
      content: content,
      rid: rid,
      authorid: authorid,
      uid: uid
    });
    if (src) {
      Object.assign(cropperOpt, {
        src
      })

      new weCropper(cropperOpt)
        .on('ready', function (ctx) { })
        .on('beforeImageLoad', (ctx) => {
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 3000
          })
        })
        .on('imageLoad', (ctx) => {
          wx.hideToast()
        })
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