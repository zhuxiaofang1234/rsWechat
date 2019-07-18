App({
  onLaunch: function() {
    //获取系统信息
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.globalData.navHeight = res.statusBarHeight + 46;
        that.globalData.windowHeight = res.windowHeight
      }
    });
  },
  //全局变量
  globalData: {
    userInfo: null,
    host: 'http://test.rocksea.net.cn:9000/',
    statusBarHeight: 0,
    windowHeight:0,
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
  },
  isNumber: function (val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  //判断是否为整数
  isInt: function (value) {
    var ex = /^\d+$/;
    if (!ex.test(value)) {
      return false;
    } else {
      return true
    }
  }  
})