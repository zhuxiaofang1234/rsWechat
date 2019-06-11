App({
  onLaunch: function() {
    //获取系统信息
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.globalData.navHeight = res.statusBarHeight + 46;
      }
    });
  },
  //全局变量
  globalData: {
    userInfo: null,
    host: 'http://test.rocksea.net.cn:9001/',
    statusBarHeight: 0,
    testData: 123
  }
})