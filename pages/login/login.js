// pages/login/login.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    paasword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getAccount:function(e){
    this.setData({
      account: e.detail.value
    })
  },
  getPwd: function (e) {
    this.setData({
      paasword: e.detail.value
    })
  },

  login:function(e){
    var account = this.data.account;
    var password = this.data.paasword;
    var host = App.globalData.host;
    if (account.length == 0 || password.length == 0) {
      wx.showModal({
        title: '登录失败',
        content: '账号或密码不能为空',
        showCancel:false,
        confirmColor:'#4cd964'
      })
    } else {
      // 成功跳转的页面
      wx.request({
        url: host +'/api/TokenAuth/Authenticate',
        method: "POST",
        data: {
          "userNameOrEmailAddress": account,
          "password": password,
          "rememberClient":true
        },  
        header: {
          'content-type':'application/json' // 默认值
        },
        success(res) {
          if (res.statusCode==200){
            var accessToken = res.data.result.accessToken;
        //存储token值
            wx.setStorageSync('accessToken', accessToken);
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 3000,
              mask:true,
              success: function () {
                wx.switchTab({
                  url: '/pages/test/test',
                })
              }
            }) 
          }else{
            wx.showModal({
              title: '登录失败',
              content: '账号或密码错误',
              showCancel: false,
              confirmColor: '#4cd964'
            })
          } 
        },
        fali(){
          console.log('接口调用失败');
        }
      })
    }
  }
})