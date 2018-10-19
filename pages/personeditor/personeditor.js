// pages/personeditor/personeditor.js
var Tools = require("../../ToolsApi/toolsApi.js");
var isImg = false;
var professionArray = new Array();
var professionId = new Array();
function Ope(that, disabled, bg, load) {
  that.setData({
    disabled: disabled,
    submitbtnBackgroungColor: bg,
    submitbtnLoading: load
  });
}
function saveInfo(that, file, img) {
  wx.request({
    url: Tools.urls.mob_commonUser_commonUserSaveInfo,
    method: "POST",
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      fId: that.data.userInfo.fid,
      fUsername: that.data.userInfo.fusername,
      fProvince: that.data.userInfo.fprovince,
      fCity: that.data.userInfo.fcity,
      fArea: that.data.userInfo.farea,
      fCover: file,
      fSex: that.data.userInfo.fsex,
      fSign: that.data.userInfo.fsign,
      fPid: that.data.userInfo.fpid,
      img: img
    },
    success: res => {
      wx.setStorage({
        key: 'commonUser',
        data: that.data.userInfo,
        success: res => {
          Ope(that, false, "#ffdc44", false);
          Tools.tools.toast("保存成功", "success", true, 2000, function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 2000);
          });
        }
      })
    },
    fail: err => {
      var b = this;
      Ope(b, false, "#ffdc44", false);
      Tools.tools.toast("保存失败", "none", true, 2000, null);
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    submitbtnBackgroungColor: "#ddd",
    submitbtnColor: "#fff", 
    submitbtnLoading: false,
    imgPath: null,
    userInfo: null,
    sexArray: ["男", "女"],
    sexIndex: 0,
    addressArray: [],
    professionArray: [],
    professionIndex: -1,
    countLimitColor: "#999",
    countLimit: 0
  },

  chooseImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        const src = res.tempFilePaths[0]
        wx.redirectTo({
          url: './changeImage/changeImage?src=' + src
        });
        // this.setData({
        //   imgPath: res.tempFilePaths[0]
        // });
      },
    })
  },

  usernameInput: function (e) {
    var that = this;
    if (e.detail.value.length == 0) {
      Ope(that, true, "#ddd", false);
    } else {
      Ope(that, false, "#ffdc44", false);
    }
    this.data.userInfo.fusername = e.detail.value;
  },

  sexChange: function (e) {
    var that = this;
    Ope(that, false, "#ffdc44", false);
    this.data.userInfo.fsex = e.detail.value == 0 ? "男" : "女";
    this.setData({
      sexIndex: e.detail.value
    });
  },

  professionChange: function (e) {
    var that = this;
    Ope(that, false, "#ffdc44", false);
    this.data.userInfo.fpid = professionId[e.detail.value];
    this.setData({
      professionIndex: e.detail.value
    });
  },

  addressChange: function (e) {
    var that = this;
    Ope(that, false, "#ffdc44", false);
    this.data.userInfo.fprovince = e.detail.value[0];
    this.data.userInfo.fcity = e.detail.value[1];
    this.data.userInfo.farea = e.detail.value[2];
    this.setData({
      addressArray: e.detail.value
    });
  },

  signInput: function (e) {
    var that = this;
    if (this.data.userInfo.fusername == "" || this.data.userInfo.fusername == null) {
      Ope(that, true, "#ddd", false);
    } else {
      Ope(that, false, "#ffdc44", false);
    }
    if (e.detail.value.length <= 40) {
      this.setData({
        countLimitColor: "#999",
        countLimit: e.detail.value.length
      });
    } else {
      this.setData({
        countLimitColor: "#ff2a23",
        countLimit: e.detail.value.length
      });
    }
    this.data.userInfo.fsign = e.detail.value;
  },



  saveBtn: function () {
    var a=this;
    Ope(a, true, "#ddd", true);
    if (isImg) {
      var file = this.data.imgPath;
      var userInfo = this.data.userInfo;
      var img = 0;
      var preImg = "";
      if (userInfo.fcover == null || userInfo.fcover == "") {
        img = 0;
        preImg = userInfo.fcover;
      } else {
        img = 1;
        preImg = userInfo.fcover;
      }
      wx.uploadFile({
        url: Tools.urls.mob_commonUser_commonUsersaveHead,
        filePath: file,
        name: 'file',
        formData: {
          fId: userInfo.fid,
          img: img,
          preImg: preImg
        },
        header: {
          'content-type': 'multipart/form-data'
        },
        success: res => {
          var obj = JSON.parse(res.data);
          if (obj.code == 200) {
            var file = obj.data;
            this.data.userInfo.fcover = file;
            var that = this;
            saveInfo(that, file);
          } else {
            var b=this;
            Ope(b, false, "#ffdc44", false);
            Tools.tools.toast(obj.msg, "none", true, 2000, null);
          }
        }
      })
    } else {
      var that = this;
      saveInfo(that, that.data.userInfo.fcover);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'commonUser',
      success: res => {
        res.data.faccount = res.data.faccount.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
        var img = res.data.fcover == null || "" ? Tools.tools.imgPathUrl + "/defaulthead.png" : Tools.tools.resPathUrl + res.data.fcover;
        this.setData({
          userInfo: res.data,
          sexIndex: ["男", "女"].indexOf(res.data.fsex),
          addressArray: [res.data.fprovince, res.data.fcity, res.data.farea],
          countLimit: res.data.fsign.length,
          imgPath: img
        });
        let {
          avatar
        } = options
        if (avatar) {
          this.setData({
            imgPath: avatar
          });
          isImg = true;
          var that = this;
          Ope(that, false, "#ffdc44", false);
        }
      },
      fail: err => {

      }
    });
    wx.request({
      url: Tools.urls.mob_profession_getAllInfo,
      method: "GET",
      success: res => {
        res.data.data.forEach(function (item, index) {
          professionArray.push(item.fname);
          professionId.push(item.fid);
        });
        this.setData({
          professionArray: professionArray,
          professionIndex: professionId.indexOf(this.data.userInfo.fpid)
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