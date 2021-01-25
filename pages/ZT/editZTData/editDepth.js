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
    pileId: "",
    index: "",
    depth: '',
    hammerValue: '',
    correctValue: '',
    description: '',
    remark: '',
    showTopTips: false,
    erroInfo: "错误提示",
    isDisabled: true,
    baseInfoId: null,
    currentDepth: null,
    depthList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pileId = wx.getStorageSync('pileId');
    var depthList = wx.getStorageSync('depthList');
    var id = options.Id;
    var currentDepth = depthList.filter(function (item) {
      return item.id == id
    });
    this.setData({
      id: id,
      pileId: pileId,
      baseInfoId: options.baseInfoId,
      index: currentDepth[0].index,
      depth: currentDepth[0].depth,
      hammerValue: currentDepth[0].hammerValue,
      correctValue: currentDepth[0].correctValue,
      description: currentDepth[0].description,
      remark: currentDepth[0].remark,
    });
  },

  //实测锤击数
  getHammerValue: function (e) {
    if (!e.detail.value) {
      var erroInfo = "请填写实测锤击数";
      this.errorTips(erroInfo);
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
    this.setData({
      correctValue: e.detail.value
    })

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
      erroInfo = "实测锤击数只能是数值类型";
      this.errorTips(erroInfo);
      return
    }
    if (correctValue && !App.isNumber(correctValue)) {
      erroInfo = "修正锤击数只能是数值类型";
      this.errorTips(erroInfo);
      return
    };
    data.depth = depth;
    data.pileId = this.data.pileId;
    data.index = this.data.index;
    data.correctValue = parseInt(correctValue);
    data.hammerValue = parseInt(hammerValue);
    data.description = this.data.description;
    data.remark = this.data.remark;
    if (flag) {
      flag = false;
      WXAPI.ReviseDetails(data).then(res => {
        flag = true;
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 3000,
          mask: true,
          success: function () {
            setTimeout(function () {
              //返回上一页并刷新页面 
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              var depthList = wx.getStorageSync('depthList');
              for (var i = 0; i < depthList.length; i++) {
                if (data.id == depthList[i].id) {
                  depthList[i].correctValue = data.correctValue;
                  depthList[i].hammerValue = data.hammerValue;
                  depthList[i].description = data.description;
                  depthList[i].remark = data.remark;
                }
              }
              //缓存实验深度
              wx.setStorageSync('depthList', depthList);
              prevPage.setData({
                depthList: depthList
              });
              //刷新深度列表
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          }
        })
      }, err => {
        flag = true;
      })
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
  cancel: function () {
    App.back()
  }
})