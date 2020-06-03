const App = getApp();
const WXAPI = require('./main.js')
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

const TestMode = {
        "DC": "动测",
        "DY": "低应变",
        "GY": "高应变",
        "SC": "声波透射",
        "ZX": "钻芯",
        "ZG": "灌注桩钻芯",
        "ZJ": "搅拌桩钻芯",
        "ZY": "岩基钻芯",
        "JZ": "静载",
        "KY": "抗压静载",
        "KB": "抗拔静载",
        "SP": "水平多循环静载",
        "ZP": "自平衡静载",
        "PB": "平板试验",
        "PT": "天然地基平板",
        "PF": "复合地基平板",
        "PC": "处理土地基平板",
        "YJ": "岩基载荷试验",
        "BG": "标准贯入试验",
        "ZT": "触探",
        "TQ": "轻型动力触探",
        "TZ": "重型动力触探",
        "MG": "锚杆",
        "JM": "基础锚杆试验",
        "ZM": "支护锚杆试验",
        "SM": "支护锚索试验",
        "TB": "土钉抗拔试验"
};

function endTest() {
  var BaseTestData = wx.getStorageSync('BaseTestData');
  var baseInfoId = BaseTestData.baseInfoId;
  var serialNo = BaseTestData.serialNo;
  wx.showModal({
    title: '结束试验',
    content: '确定要结束当前试验吗？',
    confirmColor: '#4cd964',
    success(res) {
      if (res.confirm) {
        var queryData = {
          "BaseInfoId": baseInfoId
        }
        WXAPI.FinishZTtest(queryData).then(res => {
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
        }, err => {
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
function isTesting() {
  var BaseTestData = wx.getStorageSync('BaseTestData');
  var TestModeCode = BaseTestData.testModeCode;
  var content = "";
  switch (TestModeCode) {
    case 'TQ':
      content += '有中断的轻型动力触探试验，是否继续？'
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

//综合测试类型
function getModeType() {
  var TestModeCode = wx.getStorageSync('testModeCode');
  var ModeType;
  switch (TestModeCode) {
    case 'TQ':
    case 'TZ':
      ModeType = 'ZT';
      break;
    case 'ZG':
    case 'ZJ':
    case 'ZY':
      ModeType = 'ZX';
      break;
  }
  return ModeType;
}


//倒序排列
function sortBy(attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  }
}


function base64src(base64data, cb) {
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  if (!format) {
    return (new Error('ERROR_BASE64SRC_PARSE'));
  }
  const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
  const buffer = wx.base64ToArrayBuffer(bodyData);
  const fsm = wx.getFileSystemManager();
  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success() {
      cb(filePath);
    },
    fail() {
      return (new Error('ERROR_BASE64SRC_WRITE'));
    },
  });
};

module.exports = {
  endTest,
  isTesting,
  getModeType,
  sortBy,
  base64src,
  TestMode
}