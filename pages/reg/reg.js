// pages/reg/reg.js
var Tools=require("../../ToolsApi/toolsApi.js");
var isAccount=false,isPassword=false,isCode=false;
var codeText=0;
function isReg(){
  if(isAccount&&isPassword&&isCode){
    return true;
  }else{
    return false;
  }
}
function resetTime(time,self) {
  var timer = null;
  var t = time;
  var m = 0;
  var s = 0;
  m = Math.floor(t / 60 % 60);
  m < 10 && (m = '0' + m);
  s = Math.floor(t % 60);
  function countDown() {
    s--;
    s < 10 && (s = '0' + s);
    if (s.length >= 3) {
      s = 59;
      m = "0" + (Number(m) - 1);
    }
    if (m.length >= 3) {
      m = '00';
      s = '00';
      clearInterval(timer);
      self.setData({
        codeBtnText: "获取验证码",
        codeColor:"#13ae12",
        codeDisabled:false
      });
    } else {
      self.setData({
        codeColor: "#999",
        codeBtnText: s + "s后再获取",
        codeDisabled:true
      });
    }
  }
  timer = setInterval(countDown, 1000);
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeBtnText:"获取验证码",
    codeColor:"#999",
    codeDisabled:true,
    imgPath:Tools.tools.imgPathUrl,
    account:"",
    password:"",
    code:"",
    disabled: true,
    submitbtnBackgroungColor: "#ddd",
    submitbtnColor: "#fff",
    submitbtnLoading: false
  },
  accountInput:function(e){
    if (e.detail.value.length != 0 && (/^[1][3,4,5,7,8][0-9]{9}$/.test(e.detail.value))){
      isAccount=true;
      this.setData({
        codeDisabled:false,
        codeColor:"#13ae12"
      });
    }else{
      isAccount=false;
      this.setData({
        codeDisabled: true,
        codeColor: "#999"
      });
    }
    if(isReg()){
      this.setData({
        disabled:false,
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
    if(e.detail.value.length!=0){
      isPassword=true;
    }else{
      isPassword=false;
    }
    if(isReg()){
      this.setData({
        disabled: false,
        submitbtnBackgroungColor: "#ffdc44",
        password: e.detail.value
      });
    }else{
      this.setData({
        disabled: true,
        submitbtnBackgroungColor: "#ddd",
        password: e.detail.value
      });
    }
  },
  codeInput:function(e){
    if(e.detail.value.length!=0){
      isCode=true;
    }else{
      isCode=false;
    }
    if(isReg()){
      this.setData({
        disabled: false,
        submitbtnBackgroungColor: "#ffdc44",
        code: e.detail.value
      });
    }else{
      this.setData({
        disabled: true,
        submitbtnBackgroungColor: "#ddd",
        code: e.detail.value
      });
    }
  },
  codeBtn:function(){
    this.setData({
      codeColor: "#999",
      codeBtnText: "60s后再获取",
      codeDisabled: true
    });
    resetTime(60,this); 
    wx.request({
      url: Tools.tools.reqPathUrl +'/mob/common/getCode',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method:"POST",
      data:{
        num:this.data.account
      },
      success:res=>{
        codeText=res.data.code;
      },
      fail:err=>{
        Tools.tools.toast("系统出现未知错误","none",true,2000,null);
      }
    });
  },
  regBtn:function(){
    if(this.data.code==codeText){
      this.setData({
        disabled: true,
        submitbtnLoading: true,
        submitbtnBackgroungColor: "#ddd"
      });
      setTimeout(()=>{
        wx.request({
          url: Tools.tools.reqPathUrl + '/mob/commonUser/commonUserReg',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: "POST",
          data: {
            fAccount: this.data.account,
            fPassword: this.data.password
          },
          success: res => {
            if(res.data.code==200){
              Tools.tools.toast(res.data.msg, "success", true, 1000, function(){
                setTimeout(()=>{
                  wx.navigateBack({
                    delta:1
                  });
                },1000);
              });
            } else {
              Tools.tools.toast(res.data.msg, "none", true, 2000, null);
              this.setData({
                disabled: false,
                submitbtnLoading: false,
                submitbtnBackgroungColor: "#ffdc44"
              });
            }
          },
          fail: err => {
            Tools.tools.toast("服务器出现故障", "none", true, 2000, null);
            this.setData({
              disabled: false,
              submitbtnLoading: false,
              submitbtnBackgroungColor: "#ffdc44"
            });
          }
        });
      },500);
    }else{
      Tools.tools.toast("您输入的验证码有误", "none", true, 2000,null);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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