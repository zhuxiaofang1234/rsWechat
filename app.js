App({
  onLaunch: function () {
    //获取系统信息
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.globalData.navHeight = res.statusBarHeight + 46;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.windowWidth = res.windowWidth;
      }
    });
  },
  //全局变量
  globalData: {
    userInfo: null,
    statusBarHeight: 0,
    windowHeight: 0,
    windowWidth: 0,
  },
  back: function () {
    wx.navigateBack({
      delta: 1 //想要返回的层级
    })
  },
  //重定向到登录页
  redirectToLogin: function (content) {
    var content = content || '登录后可使用更多功能，前往登录?';
    wx.showModal({
      title: '温馨提示',
      content: content,
      cancelText: '暂不登录',
      cancelColor: '#ddd',
      confirmText: '立即登录',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/login/login'
          })
          wx.removeStorageSync('accessToken');
          wx.removeStorageSync('refreshToken');
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  removeLoginInfo: function () {
    wx.removeStorageSync('rsAccessToken');
    wx.removeStorageSync('refreshToken');
    wx.removeStorageSync('userAccount');
    wx.removeStorageSync('userName');
    this.globalData.accessToken = null;
  },
  //获取当前系统时间
  format: function (Date) {
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
    M = M < 10 ? '0' + M : M; // 不够两位补充0
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