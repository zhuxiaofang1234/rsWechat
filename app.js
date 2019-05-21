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
  statusBarHeight: 0
})
