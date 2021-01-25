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
const TestModeGroup = [{
    code: 'ZT',
    name: '动力触探',
    children: [{
        code: 'TQ',
        name: '轻型动力触探',
      },
      {
        code: 'TZ',
        name: '重型动力触探',
      }
    ]
  },
  {
    code: 'ZX',
    name: '钻芯',
    children: [{
        code: 'ZG',
        name: '灌注桩钻芯',
      },
      {
        code: 'ZJ',
        name: '搅拌桩钻芯',
      },
      {
        code: 'ZY',
        name: '岩基钻芯',
      },
      {
        code: 'ZF',
        name: '复合地基钻芯',
      },
      {
        code: 'JX',
        name: '界面钻芯',
      },
    ]
  },
  {
    code: 'DC',
    name: '动测',
    children: [{
        code: 'DY',
        name: '低应变',
      },
      {
        code: 'GY',
        name: '高应变',
      },
      {
        code: 'SC',
        name: '声波透射',
      },
    ]
  },
  {
    code: 'JZ',
    name: '静载',
    children: [{
        code: 'KY',
        name: '抗压静载',
      },
      {
        code: 'KB',
        name: '抗拔静载',
      },
      {
        code: 'SP',
        name: '水平多循环静载',
      }
    ]
  },
  {
    code: 'PB',
    name: '平板',
    children: [{
        code: 'PT',
        name: '天然地基平板',
      },
      {
        code: 'PF',
        name: '复合地基平板',
      },
      {
        code: 'PC',
        name: '处理土地基平板',
      },
      {
        code: 'YJ',
        name: '岩基载荷试验',
      },
      {
        code: 'BG',
        name: '标准贯入试验',
      }
    ]
  },
  {
    code: 'MG',
    name: '锚杆',
    children: [{
        code: 'JM',
        name: '基础锚杆试验',
      },
      {
        code: 'ZM',
        name: '支护锚杆试验',
      },
      {
        code: 'SM',
        name: '支护锚索试验',
      },
      {
        code: 'ZH',
        name: '支护锚索/锚索试验',
      },
      {
        code: 'TB',
        name: '土钉抗拔试验',
      }
    ]
  },
];

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
              //清除上一条记录的数据
              wx.removeStorageSync('lastDepthData');
              //清除基本数据
              wx.removeStorageSync('BaseTestData');

              wx.redirectTo({
                url: '/pages/dataCenter/testList?serialNo=' + serialNo
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
          url: '/pages/ZT/addZTData/testRecord',
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
  console.log(TestModeCode)
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
    case 'KY':
    case 'KB':
    case 'SP':
    case 'ZP':
      ModeType = 'JZ';
      break;
    default:
      ModeType = TestModeCode
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

// //根据深度和实测锤击数获取修正系数（广东规范）
  /*
  val1:深度
  val2:实测锤击数
  */
function  getCorrectValueEle(val1, val2) {
  var num, newval2 = val2;
    //深度小于4修正锤击数等于1.00
    if (val1 <= 4) {
      num = 1
    }
    //剔除一些极限值
    else {
      if (val1 > 20) {
        val1 = 20
      } else {
        val1 = val1 - val1 % 2
      }

      if (val2 >= 50) {
        val2 = 50
      } else if (40 < val2 < 50) {
        val2 = 40
      } else if (val2 < 5) {
        val2 = 5
      } else {
        val2 = val2 - val2 % 5
      }
      num = getNumber(val1, val2)
  }
  return (num * newval2).toFixed(2)
}

//对比值生成修正锤击数
function getNumber(val1, val2) {
  var NBList = getList()
  var value = 0
  NBList.forEach(function (item) {
    if (item[0] == val1 && item[1] == val2) {
      value = item[2]
    }
  })
  return value
};

 //构建规范中的二维数组
 function getList() {
  //修正系数数组（广东规范）
  var CorrectValueEleList = [
    [0.96, 0.95, 0.93, 0.92, 0.90, 0.89, 0.87, 0.86, 0.84],
    [0.93, 0.90, 0.88, 0.85, 0.83, 0.81, 0.79, 0.78, 0.75],
    [0.90, 0.86, 0.83, 0.80, 0.77, 0.75, 0.73, 0.71, 0.67],
    [0.88, 0.83, 0.79, 0.75, 0.72, 0.69, 0.67, 0.64, 0.61],
    [0.85, 0.79, 0.75, 0.70, 0.67, 0.64, 0.61, 0.59, 0.55],
    [0.82, 0.76, 0.71, 0.66, 0.62, 0.58, 0.56, 0.53, 0.50],
    [0.79, 0.73, 0.67, 0.62, 0.57, 0.54, 0.51, 0.48, 0.45],
    [0.77, 0.70, 0.63, 0.57, 0.53, 0.49, 0.46, 0.43, 0.40],
    [0.75, 0.67, 0.59, 0.53, 0.48, 0.44, 0.41, 0.39, 0.36]
  ]
  // 深度数组  
  var LList = Array.from({ length: 9 }, (k, v) => ((v + 2) * 2))
  //实测锤击数数组
  var NList = [5, 10, 15, 20, 25, 30, 35, 40, 50]
  var NBList = []
  //合并生成一个二维数组，//如：[[4,5,0.96],[4,10,0.95]...]
  for (let i = 0; i < CorrectValueEleList.length; i++) {
    for (let j = 0; j < CorrectValueEleList[i].length; j++) {
      NBList.push([LList[i], NList[j], CorrectValueEleList[i][j]])
    }
  }
  return NBList
};


//base64加密
function Base64() {
  // private property  
  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // public method for encoding  
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // public method for decoding  
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding  
  _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  // private method for UTF-8 decoding  
  _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

//预计完成时间
function getDate(day) {
  if (!day) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + '-' + month + '-' + strDate;
    return currentDate;
  } else {
    //Date()返回当日的日期和时间。
    var days = new Date();
    //getTime()返回 1970 年 1 月 1 日至今的毫秒数。
    var gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day;
    //setTime()以毫秒设置 Date 对象。
    days.setTime(gettimes);
    var year = days.getFullYear();
    var month = days.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var today = days.getDate();
    if (today < 10) {
      today = "0" + today;
    }
    return year + "-" + month + "-" + today;
  }
}

module.exports = {
  endTest,
  isTesting,
  getModeType,
  sortBy,
  base64src,
  Base64,
  TestMode,
  TestModeGroup,
  getDate,
  getCorrectValueEle
}