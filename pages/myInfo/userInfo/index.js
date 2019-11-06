// pages/myInfo/userInfo/index.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userAccount:'',
    userName:'',
    accessToken:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var accessToken = App.globalData.accessToken;
    if (accessToken){
      var userAccount = wx.getStorageSync('userAccount');
      var userName = wx.getStorageSync('userName');
      this.setData({
        userAccount: userAccount,
        userName: userName,
        accessToken: accessToken
      });
    }  
  },

  loginOut: function() {
    wx.showModal({
      title: '退出当前账号',
      content: '退出后不会删除任何数据',
      confirmColor:'#4cd964',
      success(res) {
        if (res.confirm) {
          //关闭所有页面，打开应用内的某个页面
          wx.reLaunch({
            url: '/pages/login/login'
          })
          App.removeLoginInfo();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })   
  },
  toLogin:function(){
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }
})