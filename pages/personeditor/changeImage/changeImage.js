import weCropper from '../../we-cropper/dist/weCropper.js'
var Tools = require("../../../ToolsApi/toolsApi.js");
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
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    optionObj: {},
    isChangeHead: false
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
        //  获取到裁剪后的图片
        var page = getCurrentPages();
        page = page[page.length - 2];
        if (page == undefined || page == null) return;
        var optionObj = this.data.optionObj;
        if (this.data.isChangeHead) {
          wx.uploadFile({
            url: Tools.urls.mob_commonUser_commonUsersaveHead,
            filePath: avatar,
            name: 'file',
            formData: {
              fId: optionObj.uid,
              img: 2,
              preImg: optionObj.preImg
            },
            header: {
              'content-type': 'multipart/form-data'
            },
            success: res => {
              wx.getStorage({
                key: "commonUser",
                success: result => {
                  var obj = result.data;
                  obj.fcover = JSON.parse(res.data).data;
                  wx.setStorage({
                    key: "commonUser",
                    data: obj,
                    success: () => {
                      page.onLoad(optionObj);
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          optionObj.avatar = avatar;
          page.onLoad(optionObj);
          wx.navigateBack({
            delta: 1
          });
        }
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    // do something
    this.setData({
      optionObj: option
    });
    if (option.isChangeHead) {
      this.setData({
        isChangeHead: option.isChangeHead
      });
    }
    const {
      cropperOpt
    } = this.data
    const {
      src
    } = option
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