// pages/test/addTestData/testRecord.js
const App = getApp();
const WXAPI = require('../../../utils/main.js');
const until = require('../../../utils/util.js');
var flag = true;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    depth: '',
    hammerValue: '',
    correctValue: '',
    description: '',
    remark: '',
    showTopTips: false,
    erroInfo: "错误提示",
    isDisabled: true,
    baseInfoId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var BaseTestData = wx.getStorageSync('BaseTestData');
    var baseInfoId = BaseTestData.baseInfoId;
    var id = options.id;
    this.setData({
      baseInfoId: baseInfoId,
      id: id
    });
    this.getDepthDetails(id);
  },

  //获取实测锤击数
  getHammerValue: function (e) {
    if (!e.detail.value) {
      var erroInfo = "请填写实测锤击数";
      this.errorTips(erroInfo);
      this.setData({
        hammerValue: ""
      })
      return;
    } else {
      this.setData({
        hammerValue: e.detail.value
      })
    }
    //获取修正锤击数
    var correctValue = until.getCorrectValueEle(this.data.depth, e.detail.value);
    this.setData({
      correctValue: correctValue
    })
  },
  //修正锤击数
  getcorrectValue: function (e) {
    if (!e.detail.value) {
      var erroInfo = "请填写修正锤击数";
      this.errorTips(erroInfo);
      this.setData({
        correctValue: ""
      })
      return;
    } else {
      this.setData({
        correctValue: e.detail.value
      })
    }
  },
  //获取土层描述
  getDesc: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  //获取备注信息
  getRemark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //提交
  submitRecord: function (e) {
    var that = this;
    var erroInfo;
    var data = {};
    var depth = this.data.depth;
    var hammerValue = this.data.hammerValue;
    var correctValue = this.data.correctValue;
    data.id = this.data.id;
    data.baseInfoId = this.data.baseInfoId;
    if (!hammerValue) {
      erroInfo = "请填写实测锤击数";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(hammerValue)) {
      erroInfo = "实测锤击数只能是整数";
      this.errorTips(erroInfo);
      return
    }

    if (!correctValue) {
      erroInfo = "请填写修正锤击数";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(correctValue)) {
      erroInfo = "修正锤击数只能是整数";
      this.errorTips(erroInfo);
      return
    }

    data.depth = depth;
    data.hammerValue = hammerValue;
    data.correctValue = correctValue;
    data.description = this.data.description;
    data.remark = this.data.remark;

    if (flag) {
      flag = false;
      WXAPI.UpdateDepthDetails(data).then(res => {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 3000,
          mask: true,
          success: function () {
            flag = true;
            setTimeout(function () {
              //返回上一页并刷新页面 
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.getDepthList();
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        })
      }, err => {
        flag = true;
      })
    }
  },
  //获取测点详情信息
  getDepthDetails: function (id) {
    var that = this;
    var queryData = {
      'BaseInfoId': this.data.baseInfoId,
      'Id': id
    }
    WXAPI.GetDepthDetails(queryData).then(res => {
      var resData = res.result;
      that.setData({
        depth: resData.depth,
        hammerValue: resData.hammerValue,
        correctValue: resData.correctValue,
        description: resData.description,
        remark: resData.remark,
      });
    })
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
  cancel: function () {
    App.back()
  }
})