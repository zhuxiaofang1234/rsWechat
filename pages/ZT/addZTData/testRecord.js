// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../../utils/util.js');
const WXAPI = require('../../../utils/main.js');
var flag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    depth: '',
    dGrade: '',
    hammerValue: '',
    description: '',
    remark: '',
    showTopTips: false,
    erroInfo: "错误提示",
    isDisabled: false,
    depthList: [],
    baseInfoId: null,
    autoFocus: true,
    lastDepthData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取缓存的试验基本数据
    var BaseTestData = wx.getStorageSync('BaseTestData');
    if (BaseTestData) {
      this.setData({
        baseInfoId: BaseTestData.baseInfoId,
        dGrade: BaseTestData.dGrade,
      });
    }

    //获取缓存的上一条试验记录数据 
    var lastDepthData = wx.getStorageSync('lastDepthData');
    if (lastDepthData) {
      this.setData({
        depth: (parseFloat(lastDepthData.depth) + parseFloat(this.data.dGrade)).toFixed(2),
        description: lastDepthData.description,
        remark: lastDepthData.remark,
        index: (lastDepthData.index) + 1
      });
    } else {
      this.setData({
        depth: BaseTestData.dGrade
      });
    }
    this.getDepthList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  //获取深度
  getDepth: function (e) {
    if (!e.detail.value) {
      var erroInfo = "请填写当前深度";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        depth: e.detail.value
      })
    }
     //获取修正锤击数
     var correctValue = until.getCorrectValueEle(e.detail.value,this.data.hammerValue);
     this.setData({
       correctValue:correctValue
     })
  },
  //获取锤击数
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
    var correctValue = until.getCorrectValueEle(this.data.depth,e.detail.value);
    this.setData({
      correctValue:correctValue
    })
  },
  //获取修正锤击数
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
    var index = this.data.index;
    data.baseInfoId = this.data.baseInfoId;
    data.index = index;
    var depth = this.data.depth;
    var hammerValue = this.data.hammerValue;
    var correctValue = this.data.correctValue;
    if (!depth) {
      erroInfo = "请填写当前深度";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(depth)) {
      erroInfo = "当前深度请填数值类型";
      this.errorTips(erroInfo);
      return
    }
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
    }
    data.depth = depth;
    data.hammerValue = hammerValue;
    data.correctValue = correctValue;
    data.description = this.data.description;
    data.remark = this.data.remark;
    var dGrade = this.data.dGrade;
    console.log(data)
    if (flag) {
      flag = false //关闭提交表单数据开关，
      WXAPI.AddZtRecord(data).then(res => {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function () {
            // 清空表单数据之后关闭节流阀开关
            flag = true
            //缓存提交的数据
            wx.setStorageSync('lastDepthData', data)
            that.setData({
              index: index + 1,
              depth: (parseFloat(depth) + parseFloat(dGrade)).toFixed(2),
              isDisabled: true,
              hammerValue: '',
              correctValue: '',
            });
            setTimeout(function () {
              that.getDepthList();
            }, 10)
          }
        })
      }, err => {
        flag = true
        wx.showModal({
          title: '操作失败',
          content: '当前状态已锁定',
          showCancel: false,
          confirmColor: '#4cd964'
        })
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
  //获取指定数据详情
  getDepthList: function () {
    var that = this;
    var baseInfoId = this.data.baseInfoId;
    var queryData = {
      'BaseInfoId': baseInfoId
    };
    WXAPI.GetDepthList(queryData).then(res => {
      var resData = res.result;
      var depthList = resData.detailsData;
      console.log(depthList)

      //按照index倒序
      that.setData({
        depthList: depthList.sort(until.sortBy('index', false)),
      });
    }, err => {

    });
  },
  //结束试验
  endTest: function () {
    until.endTest()
  }
})