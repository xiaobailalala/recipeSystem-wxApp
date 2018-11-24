// pages/home/index.js
var Tools = require("../../ToolsApi/toolsApi.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [
      {
        url: Tools.tools.imgPathUrl + "/banner.png",
        text: "这是第一张banner"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner1.png",
        text: "草莓奶油纸杯蛋糕"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner2.png",
        text: "巧克力被子蛋糕"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner3.png",
        text: "提拉米苏（简易版）"
      },
      {
        url: Tools.tools.imgPathUrl + "/banner4.png",
        text: "小奶油雪纷纷"
      }
    ],
    shortcutMenu: [
      {
        url: "",
        iconClass: "icon-remenhuida",
        color: "#ee343a",
        content: "热门推荐"
      }, {
        url: "/pages/menu/menu",
        iconClass: "icon-leibie2",
        color: "#4fcffc",
        content: "食谱分类"
      }, {
        url: "",
        iconClass: "icon-shucai",
        color: "#9d59e8",
        content: "时令食材"
      }, {
        url: "",
        iconClass: "icon-shangpu",
        color: "#9b5b38",
        content: "周边商铺"
      }, {
        url: "",
        iconClass: "icon-huodong",
        color: "#f7a17f",
        content: "热门活动"
      }, {
        url: "",
        iconClass: "icon-yumaobi",
        color: "#2c2b2b",
        content: "精选笔记"
      }, {
        url: "",
        iconClass: "icon-zhizuoshipu",
        color: "#7cb3e8",
        content: "精选食谱"
      }, {
        url: "",
        iconClass: "icon-guanyuwomen",
        color: "#ffdc44",
        content: "关于我们"
      },
    ],
    maskAnimation: {},
    writeRecipeShow: {},
    writeNoteShow: {},
    maskShow: false,
    dateTimeNow: {},
    mainScrollTop: 0,
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    refreshTipAnimation: {},
    recipeRandom: [],
    articleList: []
  },

  refreshRecipeList: function () {
    wx.request({
      url: Tools.urls.mob_common_randomRecipe,
      method: "GET",
      success: res => {
        this.setData({
          recipeRandom: res.data.data
        });
      }
    });
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    });
    animation.opacity(0.9).scale(1).step();
    this.setData({
      mainScrollTop: 534,
      refreshTipAnimation: animation
    });
    setTimeout(() => {
      var next = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      });
      next.opacity(0).scale(0).step();
      this.setData({
        refreshTipAnimation: next.export()
      });
    }, 1500);
  },

  refreshGroupList: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    });
    animation.opacity(0.9).scale(1).step();
    this.setData({
      mainScrollTop: 2860,
      refreshTipAnimation: animation
    });
    setTimeout(() => {
      var next = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      });
      next.opacity(0).scale(0).step();
      this.setData({
        refreshTipAnimation: next.export()
      });
    }, 1500);
  },

  addTab: function () {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-out'
    });
    var recipe = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out"
    });
    var note = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out"
    });
    animation.opacity(1).step();
    recipe.scale(1).opacity(1).step();
    note.scale(1).opacity(1).step();
    this.setData({
      maskShow: true,
      dateTimeNow: this.getDateTime()
    });
    this.setData({
      maskAnimation: animation.export(),
      writeRecipeShow: recipe.export(),
      writeNoteShow: note.export()
    });
  },

  maskTab: function () {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-out'
    });
    var recipe = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out"
    });
    var note = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out"
    });
    animation.opacity(0).step();
    recipe.scale(0).opacity(0).step();
    note.scale(0).opacity(0).step();
    this.setData({
      maskAnimation: animation.export(),
      writeRecipeShow: recipe.export(),
      writeNoteShow: note.export()
    });
    setTimeout(()=>{
      this.setData({
        maskShow: false
      });
    }, 200);
  },

  getDateTime: function () {
    var date = new Date();
    var week = date.getDay();
    var obj = {
      day: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
      month: (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
      year: date.getFullYear()
    };
    switch (week) {
      case 1:
        obj.week = "星期一"
        break;
      case 2:
        obj.week = "星期二"
        break;
      case 3:
        obj.week = "星期三"
        break;
      case 4:
        obj.week = "星期四"
        break;
      case 5:
        obj.week = "星期五"
        break;
      case 6:
        obj.week = "星期六"
        break;
      default:
        obj.week = "星期日"
    }
    return obj;
  },

  writeNoteTap: function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      success: function(res){
        var arr = res.tempFilePaths;
        wx.navigateTo({
          url: "/pages/infoadd/articleInfoAdd/articleInfoAdd?imgPath=" + JSON.stringify(arr)
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: Tools.urls.mob_common_index,
      method: "GET",
      success: res=> {
        var articles = res.data.data.articleList;
        articles.forEach(element => {
          var coverArr = JSON.parse(element.fcover)
          element.firstCover = coverArr[0];
        });
        this.setData({
          recipeRandom: res.data.data.randomRecipe,
          articleList: articles
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

  },

  checkname: function () {
    this.setData({
      data: "yes"
    })
  }

})