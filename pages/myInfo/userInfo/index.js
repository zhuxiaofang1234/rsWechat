// pages/myInfo/userInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  }
})