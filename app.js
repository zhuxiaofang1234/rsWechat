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
  },
  back:function(){
    wx.navigateBack({
      delta: 1 //想要返回的层级
    })
  },
  //获取当前系统时间
  format:function(Date){
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
    M = M < 10 ? '0' + M : M;// 不够两位补充0
    var D = Date.getDate();
    D = D < 10 ? '0' + D : D;
    var H = Date.getHours();
    H = H < 10 ? '0' + H : H;
    var Mi = Date.getMinutes();
    Mi = Mi < 10 ? '0' + Mi : Mi;
    var S = Date.getSeconds();
    S = S < 10 ? '0' + S : S;
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
  }
})