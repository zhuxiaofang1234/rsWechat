// pages/test/addTestData/testRecord.js
const App = getApp();
const WXAPI = require('../../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    pileId:"",
    index:"",
    depth: '',
    hammerValue: '',
    correctValue:'',
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
    console.log(options)
   
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
  },
  //修正锤击数
  getcorrectValue:function(e){
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
    } else if (!App.isInt(hammerValue)) {
      erroInfo = "实测锤击数只能是整数";
      this.errorTips(erroInfo);
      return
    }
    if (!App.isInt(correctValue)){
      erroInfo = "修改锤击数只能是整数";
      this.errorTips(erroInfo);
      return
    };
    data.depth = depth;
    data.correctValue = hammerValue;
    data.description = this.data.description;
    data.remark = this.data.remark;

    WXAPI.UpdateDepthDetails(data).then(res => {
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
            prevPage.getDepthList();
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
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