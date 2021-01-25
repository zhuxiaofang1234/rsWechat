// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
const until = require('../../utils/util.js')
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
    hcXyCount: "",
    xyLength: 0,
    endLength: "", //到底时余尺
    startLength: "", //提钻时余尺
    xyResidual: 0, //残留芯样
    Imghash: "",
    uploadtext: '上传成功',
    uploadFlag: true,
    startDate: '2020/01/01 12:37',
    endDate: '2020/12/31 12:38',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    //获取缓存钻芯孔的数据
    var ZXrecordData = wx.getStorageSync('ZXrecordData');
    this.setData({
      id: ZXrecordData.id,
      zxHoleId: ZXrecordData.zxHoleId,
      hcNo: ZXrecordData.hcNo,
      endLength: (ZXrecordData.endLength) / 1000,
      startLength: (ZXrecordData.startLength) / 1000,
      hcStartDepth: ZXrecordData.hcStartDepth,
      hcEndDepth: ZXrecordData.hcEndDepth,
      hcDepth: ZXrecordData.hcDepth,
      hcXyCount: ZXrecordData.hcXyCount,
      xyResidual: (ZXrecordData.xyResidual) / 1000,
      remark: ZXrecordData.remark,
      xyLength: (ZXrecordData.xyLength) / 1000,
      hcStartTime: (ZXrecordData.hcStartTime).substring(0, 16),
      hcEndTime: (ZXrecordData.hcEndTime).substring(0, 16)
    });

    //芯样汇总图片
    var Imghash = ZXrecordData.zxXyImageHash;
    var chooseImage;
    //根据hash值获取图片base64 
    if (Imghash) {
      chooseImage = false
      WXAPI.GetPic(Imghash).then(res => {
        that.setData({
          base64Code: res.result
        });
      })
      that.setData({
        Imghash: Imghash,
        chooseImage: chooseImage
      });
    } else {
      that.setData({
        chooseImage: true
      });
    }
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

  //选择开钻时间
  bindStartTimeChange: function (e) {
    this.setData({
      hcStartTime: e.detail.dateString
    })
  },
  //选择结束时间
  bindEndTimeChange: function (e) {
    this.setData({
      hcEndTime: e.detail.dateString
    })
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

    data['id'] = this.data.id
    data['zxHoleId'] = this.data.zxHoleId
    data['startLength'] = startLength
    data['endLength'] = endLength
    data['xyLength'] = xyLength
    data['xyResidual'] = xyResidual
    data['hcDepth'] = hcDepth
    data['hcStartDepth'] = hcStartDepth
    data['hcEndDepth'] = hcEndDepth
    data['hcStartTime'] = this.data.hcStartTime + ':00'
    data['hcEndTime'] = this.data.hcEndTime + ':00'
    data['zxXyImageHash'] = this.data.Imghash;
    this.submit(data);
  },

  //提交表单
  submit: function (data) {
    var that = this;
    WXAPI.UpdateZxHoleDrillingRecord(data).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {

         //更新孔的基本信息
         var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
         var zxHoleDrillingRecordList = ZXHoleDetails.zxHoleDrillingRecordList;
         //根据id找出修改元素的位置
         var currentIndex;
         for (var i = 0; i < zxHoleDrillingRecordList.length; i++) {
           if (zxHoleDrillingRecordList[i].id == data.id) {
             currentIndex = i
           }
         }
         zxHoleDrillingRecordList.splice(currentIndex, 1, data);
         //返回上一页并刷新页面 
         var pages = getCurrentPages();
         var prevPage = pages[pages.length - 2];
         prevPage.setData({
          recordData: data
         });
         wx.navigateBack({
           delta: 1 //想要返回的层级
         })
        wx.setStorageSync('ZXrecordData', data);
         //更新缓存孔的信息
         wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)
        }
      })
    });
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

  //删除之前的图片
  delBeforeImg: function () {
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
            chooseImage: true
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
   //显示图片
   previewGatherPic: function () {
    var base64 = 'data:image/jpg;base64,' + this.data.base64Code;
    until.base64src(base64, res => {
      // 返回图片地址，直接赋值到image标签即可
      wx.previewImage({
        current: res,
        urls: [res]
      })
    });
  },
  //提交回次记录
  cancel: function () {
    App.back();
  }
})