//app.js
App({
  onLaunch: function () {
    var that = this;
    //获取手机系统信息
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err){
        console.log(err);
      }
    })
    
  },
  globalData: {
    userInfo: null,
    navHeight: 0
  }
})