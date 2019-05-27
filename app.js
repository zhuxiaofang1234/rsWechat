App({
  onLaunch: function () {
    //获取系统信息
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.globalData.navHeight = res.statusBarHeight + 46;
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    host: 'http://localhost:8080',
    statusBarHeight: 0
  }
})
