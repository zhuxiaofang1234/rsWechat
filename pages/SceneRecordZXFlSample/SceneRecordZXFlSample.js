// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sampleNo: 1,
    ZXHoleDetails: '',
    sampleList: [],
    zxHoleId: null,
    startPosition: 0,
    endPosition: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var type = options.type;
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    var sampleList = [];
    ZXHoleDetails.zxHoleSampleDepthList.forEach(function(v, i) {
      if (v.type == type) {
        sampleList.push(v)
      }
    });
    console.log(sampleList);
    this.setData({
      sampleList: sampleList,
      zxHoleId: ZXHoleDetails.id,
      ZXHoleDetails: ZXHoleDetails,
      sampleNo: sampleList.length + 1
    });
  },

  //获取取样编号
  getSampleNo: function(e) {
    var sampleNo = e.detail.value;
    if (!sampleNo) {
      var erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(sampleNo)) {
      var erroInfo = "取样编号请输入整数";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        sampleNo: sampleNo
      })
    }
  },
  //获取深度起始位置
  getStartPosition: function(e) {
    var startPosition = e.detail.value;
    if (!startPosition) {
      var erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(startPosition)) {
      var erroInfo = "深度起始位置请输入数值";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        startPosition: startPosition
      })
    }
  },

  //获取深度终止位置
  getEndPosition: function(e) {
    var endPosition = e.detail.value;
    if (!endPosition) {
      var erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(endPosition)) {
      var erroInfo = "深度终止位置请输入数值";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        endPosition: endPosition
      })
    }
  },
  //提交
  submitRecord: function(e) {
    var that = this;
    var erroInfo;
    var data = {};
    var zxHoleId = this.data.zxHoleId;
    var sampleNo = this.data.sampleNo;
    var startPosition = this.data.startPosition;
    var endPosition = this.data.endPosition;

    if (!sampleNo) {
      erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(sampleNo)) {
      erroInfo = "取样编号请输入整数";
      this.errorTips(erroInfo);
      return
    }
    if (!startPosition) {
      erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(startPosition)) {
      erroInfo = "深度起始位置只能是整数";
      this.errorTips(erroInfo);
      return
    }
    if (!endPosition) {
      erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(endPosition)) {
      erroInfo = "深度终止位置只能是整数";
      this.errorTips(erroInfo);
      return
    }
    data.id = null;
    data.sampleNo = sampleNo;
    data.zxHoleId = zxHoleId;
    data.startPosition = startPosition;
    data.endPosition = endPosition;
    data.type = 2

    WXAPI.UpdateZxHoleSampleDepth(data).then(res => {
      data.id = res.result.id
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function(res) {
          //更新钻芯的数据
          var sampleList = that.data.sampleList;
          var ZXHoleDetails = that.data.ZXHoleDetails;
          sampleList.push(data);
          ZXHoleDetails.zxHoleSampleDepthList.push(data);
          that.setData({
            sampleList: sampleList,
            sampleNo: parseInt(sampleNo) + 1,
            startPosition: '',
            endPosition: ''
          });
          //更新孔的详情信息缓存
          wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)
        }
      })
    })
  },
  zxHoleSampleEdit: function(e) {
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      itemColor: '#333',
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //错误提示
  errorTips: function(erroInfo) {
    var that = this;
    this.setData({
      showTopTips: true,
      erroInfo: erroInfo
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  }
})