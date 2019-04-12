// pages/login/login.js
var Tools=require("../../ToolsApi/toolsApi.js");
var isAccount=false,isPassword=false;
function isLogin(){
  if(isAccount&&isPassword){
    return true;
  }else{
    return false;
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    submitbtnBackgroungColor:"#ddd",
    submitbtnColor:"#fff",
    submitbtnLoading:false,
    account:"",
    password:"",
    imgPath:Tools.tools.imgPathUrl,
    isActive: false
  },

  accountInput:function(e){
    if(e.detail.value.length!=0){
      isAccount=true;
    }else{
      isAccount=false;
    }
    if (isLogin()) {
      this.setData({
        disabled: false, 
        submitbtnBackgroungColor: "#ffdc44",
        account: e.detail.value
      });
    }else{
      this.setData({
        disabled: true,
        submitbtnBackgroungColor: "#ddd",
        account: e.detail.value
      });
    }
  },

  passwordInput:function(e){
    if (e.detail.value.length != 0) {
      isPassword = true;
    } else {
      isPassword = false;
    }
    if (isLogin()) {
      this.setData({
        disabled: false,
        submitbtnBackgroungColor: "#ffdc44",
        password: e.detail.value
      });
    } else {
      this.setData({
        disabled: true,
        submitbtnBackgroungColor: "#ddd",
        password: e.detail.value
      });
    }
  },

  loginBtn:function(){
    if ((/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.account))){
      this.setData({
        disabled:true,
        submitbtnLoading:true,
        submitbtnBackgroungColor: "#ddd"
      });
      setTimeout(()=>{
        wx.request({
          url: Tools.urls.mob_commonUser_commonUserLogin,
          method: "POST",
          header:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            fAccount: this.data.account,
            fPassword: this.data.password
          },
          success: res => {
            if (res.data.code == 200) {
              Tools.tools.toast(res.data.msg, "success", true, 1000, ()=>{
                setTimeout(()=>{
                  wx.setStorage({
                    key: 'commonUser',
                    data: res.data.data,
                    success: res => {
                      if(this.data.isActive){
                        wx.navigateBack({
                          success: ()=> {
                            // if (!this.data.textInfo.recipeUnload) {
                              var page = getCurrentPages();
                              page = page[page.length - 2];
                              if (page == undefined || page == null) return;
                              if(this.data.textInfo){
                                page.onLoad(this.data.textInfo);
                              } else {
                                page.onLoad();
                              }
                            // }
                          }
                        })
                      }else{
                        wx.switchTab({
                          url: '/pages/person/person',
                          success: res => {
                            var page = getCurrentPages();
                            page = page[page.length - 2];
                            if (page == undefined || page == null) return;
                            page.onLoad();
                          }
                        })
                      }
                    }
                  })
                },1000);
              });
            } else {
              Tools.tools.toast(res.data.msg, "none", true, 2000,null);
              this.setData({
                disabled: false,
                submitbtnLoading: false,
                submitbtnBackgroungColor: "#ffdc44"
              });
            }
          },
          fail: err => {
            Tools.tools.toast("服务器出现故障", "none", true, 2000,null);
            this.setData({
              disabled: false,
              submitbtnLoading: false,
              submitbtnBackgroungColor: "#ffdc44"
            });
          }
        });
      },500);
    }else{
      Tools.tools.toast("请输入正确的手机号码", "none", true, 2000,null);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.active){
      if(options.type=="info"){
        // var textInfo={
        //   rid: options.rid,
        //   authorid: options.authorid,
        //   type: options.type
        // }
        // var textInfo = options;
        // this.setData({
        //   textInfo: textInfo
        // });
      }
      var textInfo = options;
        this.setData({
          textInfo: textInfo
        });
      this.setData({
        isActive: true
      });
    }else{
      this.setData({
        isActive: false
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