var Tools = require("../../../../ToolsApi/toolsApi.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: Tools.tools.imgPathUrl,
    resPath: Tools.tools.resPathUrl,
    uid: 0,
    type: 0,
    dataList: [],
    selectArr: []
  },

  prePage: function() {
    var prePage = getCurrentPages();
    prePage = prePage[prePage.length - 2];
    return prePage;
  },

  referPeople: function(e) {
    var index = e.currentTarget.dataset.index;
    var isSelect = e.currentTarget.dataset.select;
    var preArr = this.prePage().data.referPeopleArr;
    if (isSelect) {
      var objArr = this.data.dataList;
      objArr[index].isSelect = false;
      var deleteItem = preArr.filter(filterItem => {
        return filterItem.id == e.currentTarget.dataset.id;
      });
      preArr.splice(preArr.indexOf(deleteItem[0]), 1);
      this.setData({
        selectArr: preArr,
        dataList: objArr
      });
    } else {
      if (preArr.length >= 2) {
        wx.showToast({
          title: "最多只能选择两项",
          icon: "none"
        });
      } else {
        var objArr = this.data.dataList;
        objArr[index].isSelect = true;
        preArr.push({
          id: e.currentTarget.dataset.id,
          name: e.currentTarget.dataset.name
        });
        this.setData({
          selectArr: preArr,
          dataList: objArr
        });
      }
    }
  },

  referArticle: function(e) {
    var index = e.currentTarget.dataset.index;
    var isSelect = e.currentTarget.dataset.select;
    var preArr = this.prePage().data.referArticleArr;
    if (isSelect) {
      var objArr = this.data.dataList;
      objArr[index].isSelect = false;
      var deleteItem = preArr.filter(filterItem => {
        return filterItem.id == e.currentTarget.dataset.id;
      });
      preArr.splice(preArr.indexOf(deleteItem[0]), 1);
      this.setData({
        selectArr: preArr,
        dataList: objArr
      });
    } else {
      if (preArr.length >= 2) {
        wx.showToast({
          title: "最多只能选择两项",
          icon: "none"
        });
      } else {
        var objArr = this.data.dataList;
        objArr[index].isSelect = true;
        preArr.push({
          id: e.currentTarget.dataset.id,
          name: e.currentTarget.dataset.name
        });
        this.setData({
          selectArr: preArr,
          dataList: objArr
        });
      }
    }
  },

  referRecipe: function(e) {
    var index = e.currentTarget.dataset.index;
    var isSelect = e.currentTarget.dataset.select;
    var preArr = this.prePage().data.referRecipeArr;
    if (isSelect) {
      var objArr = this.data.dataList;
      objArr[index].isSelect = false;
      var deleteItem = preArr.filter(filterItem => {
        return filterItem.id == e.currentTarget.dataset.id;
      });
      preArr.splice(preArr.indexOf(deleteItem[0]), 1);
      this.setData({
        selectArr: preArr,
        dataList: objArr
      });
    } else {
      if (preArr.length >= 2) {
        wx.showToast({
          title: "最多只能选择两项",
          icon: "none"
        });
      } else {
        var objArr = this.data.dataList;
        objArr[index].isSelect = true;
        preArr.push({
          id: e.currentTarget.dataset.id,
          name: e.currentTarget.dataset.name
        });
        this.setData({
          selectArr: preArr,
          dataList: objArr
        });
      }
    }
  },

  submitTap: function(){
    if (this.data.type == 1) {
      this.prePage().setData({
        referPeopleArr: this.data.selectArr
      });
    } else if (this.data.type == 2) {
      this.prePage().setData({
        referArticleArr: this.data.selectArr
      });
    } else {
      this.prePage().setData({
        referRecipeArr: this.data.selectArr
      });
    }
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: options.uid,
      type: options.type
    });
    if (options.type == 1) {
      wx.request({
        url: Tools.urls.mob_commonUser_peopleInfoDetail,
        method: "GET",
        data: {uid: options.uid},
        success: res => {
          var dataList = res.data.data.attentionInfo.map(item => {
            return item.commonUserPassivity;
          });
          res.data.data.fansInfo.map(item => {
            return item.commonUserInitiative;
          }).forEach(item => {
            item.isFans = true;
            dataList.push(item);
          });
          var obj = {};
          dataList = dataList.reduce((current, next) => {
            obj[next.fid] ? '' : obj[next.fid] = true && current.push(next);
            return current;
          }, []);
          this.prePage().data.referPeopleArr.forEach(item => {
            var selectItem = dataList.filter(filterItem => {
              return filterItem.fid==item.id;
            });
            dataList[dataList.indexOf(selectItem[0])].isSelect = true;
          });
          this.setData({
            dataList: dataList
          });
        }
      });
    } else {
      wx.request({
        url: Tools.urls.mob_commonUser_collectionInfo,
        method: "GET",
        data: {uid: options.uid},
        success: res => {
          if (options.type == 2) {
            res.data.data.article.forEach(item => item.article.fcover = JSON.parse(item.article.fcover)[0]);
            this.prePage().data.referArticleArr.forEach(item => {
              var selectItem = dataList.filter(filterItem => {
                return filterItem.article.fid==item.id;
              });
              dataList[dataList.indexOf(selectItem[0])].isSelect = true;
            });
          } else {
            this.prePage().data.referRecipeArr.forEach(item => {
              var selectItem = dataList.filter(filterItem => {
                return filterItem.recipe.fid==item.id;
              });
              dataList[dataList.indexOf(selectItem[0])].isSelect = true;
            });
          }
          this.setData({
            dataList: options.type == 2 ? res.data.data.article : res.data.data.recipe
          });
        }
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