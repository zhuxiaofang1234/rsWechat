// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js');
var flag = true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hcNo: "",
    files: [],
    isShowUploader: false,
    currentTime: "",
    lastHcEndDepth: 0,
    hcXyCount: 1,
    xyLength: 0,
    endLength: "", //到底时余尺
    startLength: "", //提钻时余尺
    xyResidual: 0, //残留芯样
    Imghash: "",
    uploadtext: '上传成功',
    uploadFlag: true,
    placeholder: "",
    startDate: '2020/01/01 12:37',
    endDate: '2020/12/31 12:38',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = App.format(new Date());
    var zxDate = date.substring(0, 16);
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    var zxHoleDrillingRecordList = ZXHoleDetails.zxHoleDrillingRecordList;
    var recordLen = zxHoleDrillingRecordList.length;

    //获取最后一个深度的取样编号
    var hcNo, lastHcEndDepth;
    if (recordLen == 0) {
      hcNo = 0;
      lastHcEndDepth = 0;
    } else {
      hcNo = parseInt(zxHoleDrillingRecordList[recordLen - 1].hcNo);
      lastHcEndDepth = parseFloat(zxHoleDrillingRecordList[recordLen - 1].hcEndDepth);
    }
    this.setData({
      placeholder: zxDate,
      holeId: options.holeId,
      pileId: options.pileId,
      hcNo: hcNo + 1,
      lastHcEndDepth: lastHcEndDepth
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //到底时余尺
  getEndLength: function (e) {
    var EndLength = parseFloat(e.detail.value);
    var StartLength = parseFloat(this.data.startLength);
    this.setData({
      endLength: EndLength
    });
    if (EndLength && StartLength) {
      var XyLength = parseFloat(EndLength - StartLength).toFixed(2);
      this.setData({
        xyLength: XyLength,
      });
    }
  },

  //提钻时余尺
  getStartLength: function (e) {
    var StartLength = parseFloat(e.detail.value); //到底时余尺
    var EndLength = parseFloat(this.data.endLength); //提钻时余尺
    this.setData({
      startLength: StartLength
    });
    if (StartLength && EndLength) {
      var XyLength = parseFloat(EndLength - StartLength).toFixed(2); //芯样长度
      this.setData({
        xyLength: XyLength,
      });
    }
  },

  //错误提示
  errorTips: function (erroInfo) {
    var that = this;
    this.setData({
      showTopTips: true,
      erroInfo: erroInfo
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //提交表单
  reg: function (e) {
    var data = e.detail.value;
    /**表单验证 */
    data.zxHoleId = this.data.holeId;
    data.pileId = this.data.pileId;
    var erroInfo;
    if (!data.hcNo) {
      erroInfo = "请填写回次编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.hcNo)) {
      erroInfo = "回次编号只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.hcXyCount) {
      erroInfo = "请填写芯样数量";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(data.hcXyCount)) {
      erroInfo = "芯样数量只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.endLength) {
      erroInfo = "请填写到底时余尺";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.endLength)) {
      erroInfo = "到底时余尺只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.startLength) {
      erroInfo = "请填写提钻时余尺";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.startLength)) {
      erroInfo = "提钻时余尺只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.xyLength) {
      erroInfo = "请填写芯样长度";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.xyLength)) {
      erroInfo = "芯样长度只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.xyResidual) {
      erroInfo = "请填写残留芯样";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.xyResidual)) {
      erroInfo = "残留芯样只能为数值";
      this.errorTips(erroInfo);
      return;
    }

    var startLength, endLength, xyLength, xyResidual, hcDepth;
    startLength = parseFloat(data.startLength) * 1000; //提钻时余尺
    endLength = parseFloat(data.endLength) * 1000; //到底时余尺
    xyLength = parseFloat(data.xyLength) * 1000; //芯样长度
    xyResidual = parseFloat(data.xyResidual) * 1000; //残留芯样
    hcDepth = endLength - startLength; //钻进深度= 到底时余尺-提钻时余尺；

    var hcStartDepth = parseFloat(this.data.lastHcEndDepth); //回次开始标尺 = 上一次截止标尺
    var hcEndDepth = hcStartDepth + hcDepth; //回次截止标尺 = 回次开始标尺 + 钻进深度

    data['startLength'] = startLength
    data['endLength'] = endLength
    data['xyLength'] = xyLength
    data['xyResidual'] = xyResidual
    data['hcDepth'] = hcDepth
    data['hcStartDepth'] = hcStartDepth
    data['hcEndDepth'] = hcEndDepth
    if (this.data.hcStartTime && this.data.hcEndTime) {
      data['hcStartTime'] = this.data.hcStartTime + ':00'
      data['hcEndTime'] = this.data.hcEndTime + ':00'
    } else {
      data['hcStartTime'] = this.data.placeholder + ':00'
      data['hcEndTime'] = this.data.placeholder + ':00'
    }

    data['zxXyImageHash'] = this.data.Imghash;

    if(flag){
      flag = false;
      this.submit(data);
    }   
  },

  //提交表单
  submit: function (data) {
    var that = this;
    WXAPI.CreateZxHoleDrillingRecord(data).then(res => {
      var recordId = res.result.id;
      data.id = recordId;
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {
          flag = true;
          that.setData({
            lastHcEndDepth: data.hcEndDepth,
            hcNo: parseInt(data.hcNo) + 1,
            files: [],
            isShowUploader: false,
            hcXyCount: "",
            Imghash: "",
            xyLength: "",
            endLength: "",
            startLength: "",
            xyResidual: "",
          });

          //更新孔的基本信息
          var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
          var zxHoleDrillingRecordList = ZXHoleDetails.zxHoleDrillingRecordList;
          zxHoleDrillingRecordList.push(data);

          //返回上一页并刷新页面 
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            zxHoleDrillingRecordList: zxHoleDrillingRecordList
          });
          //更新孔的详情信息缓存
          wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)

        }
      })
    },err=>{
      flag = true 
    });
  },
  //选择开钻时间
  bindStartTimeChange: function (e) {
    this.setData({
      hcStartTime: e.detail.dateString,
      endStartDate: e.detail.dateString
    })
  },
  //选择结束时间
  bindEndTimeChange: function (e) {
    this.setData({
      hcEndTime: e.detail.dateString
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          isShowUploader: true
        });
        that.uploadFile();
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //删除上传图片
  delUploaderImg: function (e) {
    var that = this;
    wx.showModal({
      title: '操作提醒',
      content: '确定要删除当前图片吗？',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          that.setData({
            files: [],
            Imghash: "",
            isShowUploader: false
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //上传图片
  uploadFile: function () {
    var that = this;
    var files = this.data.files;
    wx.uploadFile({
      url: wx.getStorageSync('rshostName') + '/api/Resurce/Upload', //上传图片服务器API接口的路径 
      filePath: files[0], //要上传文件资源的路径 String类型
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': "Bearer " + wx.getStorageSync('rsAccessToken')
      },
      success: function (res) { //当调用uploadFile成功之后，再次调用后台修改的操作
        if (res.statusCode = 200) {
          var responseData = JSON.parse(res.data);
          if (responseData.result) {
            var Imghash = responseData.result[0].hash;
            that.setData({
              Imghash: Imghash,
              uploadtext: '上传成功',
              uploadFlag: true
            });
          } else {
            that.setData({
              uploadtext: '上传失败',
              uploadFlag: false
            });
          }
        }
      }
    });
  },
  //提交回次记录
  cancel: function () {
    App.back();
  }
})