const App = getApp();
const WXAPI = require('./main.js')

function endTest(){
  var BaseTestData = wx.getStorageSync('BaseTestData');
  var baseInfoId = BaseTestData.baseInfoId;
  var serialNo = BaseTestData.serialNo;
  wx.showModal({
    title: '结束试验',
    content: '确定要结束当前试验吗？',
    confirmColor: '#4cd964',
    success(res) {
      if (res.confirm) {
        var queryData =  {
          "BaseInfoId": baseInfoId
        }
        WXAPI.FinishZTtest(queryData).then(res=>{
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
              //清除基本数据
              wx.removeStorageSync('BaseTestData');
              wx.redirectTo({
                url: '/pages/test/testData/index?serialNo=' + serialNo
              })
            }
          })
        },err=>{
          wx.showModal({
            title: '操作失败',
            content: '当前状态已锁定',
            showCancel: false,
            confirmColor: '#4cd964'
          })
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

//是否正在试验中
function isTesting (){
  var TestModeCode = wx.getStorageSync('testModeCode');
  var content = "";
  switch (TestModeCode){
    case 'TQ':
      content+= '有中断的轻型动力触探试验，是否继续？'
      break;
      case 'TZ':
      content += '有中断的重型动力触探试验，是否继续？'
    break;
  }
    wx.showModal({
      title: '温馨提示',
      content: content,
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

module.exports = {
  endTest,
  isTesting
}
