const App = getApp();

function endTest(){
  var accessToken = App.globalData.accessToken;
  var host = App.globalData.host;
  var baseInfoId = wx.getStorageSync('baseInfoId');
  wx.showModal({
    title: '结束试验',
    content: '确定要结束当前试验吗？',
    confirmColor: '#4cd964',
    success(res) {
      if (res.confirm) {
        wx.request({
          url: host + '/api/services/app/ZTData/Finish?BaseInfoId=' + baseInfoId,
          method: "POST",
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': "Bearer " + accessToken
          },
          success(res) {
            if (res.statusCode == 200) {
              var serialNo = wx.getStorageSync('serialNo');
              wx.showToast({
                title: '当前试验已结束',
                icon: 'success',
                duration: 3000,
                mask: true,
                success: function () {
                  //跳转到检测数据列表页
                  wx.setStorageSync('isTesting', 0);
                  //清除上一条的数据
                  wx.removeStorageSync('lastDepthData');
                  wx.redirectTo({
                    url: '/pages/test/testData/index?serialNo=' + serialNo
                  })
                }
              })
              
            } else {
              wx.showModal({
                title: '操作失败',
                content: '当前状态已锁定',
                showCancel: false,
                confirmColor: '#4cd964'
              })
            }
          },
          fali() {
            console.log('接口调用失败');
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

//是否正在试验中
function isTesting (){
  if (isTesting) { //当前有试验在进行
    wx.showModal({
      title: '温馨提示',
      content: '有中断的试验，是否继续?',
      cancelText: '结束试验',
      cancelColor: '#ddd',
      confirmText: '继续试验',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/test/addTestData/testRecord',
          });
        } else if (res.cancel) {
         endTest();
        }
      }
    })
  }
}

module.exports = {
  endTest,
  isTesting
}
