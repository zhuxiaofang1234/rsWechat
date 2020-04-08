// pages/myInfo/userInfo/index.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userAccount:'',
    userName:'',
    accessToken:'',
    isSign:"去查看"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var accessToken = wx.getStorageSync('rsAccessToken');
    if (accessToken){
      var userAccount = wx.getStorageSync('userAccount');
      var userName = wx.getStorageSync('userName');
      var userStamp = wx.getStorageSync('userStamp');
      var isSign;
      if (userStamp){
        isSign = "去查看";
      }else{
        isSign = "去设置";
      }
      this.setData({
        userAccount: userAccount,
        userName: userName,
        accessToken: accessToken,
        isSign: isSign
      });
    }  
  },

  loginOut: function() {
    var isTesting = wx.getStorageSync('isTesting');
    var content="";
    if (isTesting) {
      content = '有正在进行的试验,确定退出登录？'
    }else{
      content = '退出后不会删除任何数据'
    }
    wx.showModal({
      title: '退出当前账号',
      content: content,
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