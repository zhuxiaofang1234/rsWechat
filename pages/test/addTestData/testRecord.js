// pages/test/addTestData/testRecord.js
const App = getApp();
var until = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    depth: '',
    dGrade:'',
    hammerValue: '',
    description: '',
    remark:'',
    showTopTips: false,
    erroInfo: "错误提示",
    isDisabled: false,
    depthList: [],
    baseInfoId: null,
    autoFocus:true,
    lastDepthData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    //获取缓存的试验基本数据
    var BaseTestData = wx.getStorageSync('BaseTestData');
    if (BaseTestData){
      this.setData({
        baseInfoId: BaseTestData.baseInfoId,
        dGrade: BaseTestData.dGrade,  
      });
    }
    
    //获取缓存的上一条试验记录数据 
    var lastDepthData = wx.getStorageSync('lastDepthData');
    if (lastDepthData){
      this.setData({
        depth: (parseFloat(lastDepthData.depth) + parseFloat(this.data.dGrade)).toFixed(2),
        description: lastDepthData.description,
        remark: lastDepthData.remark,
        index: (lastDepthData.index)+1
      });
    }else{
      this.setData({
        depth: BaseTestData.dGrade
      });
    }
    this.getDepthList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    console.log('onHide');

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  //获取深度
  getDepth: function(e) {
    if (!e.detail.value) {
      var erroInfo = "请填写当前深度";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        depth: e.detail.value
      })
    }
  },
  //获取锤击数
  getHammerValue: function(e) {
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
  //获取土层描述
  getDesc: function(e) {
    this.setData({
      description: e.detail.value
    })
  },
  //获取备注信息
  getRemark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //提交
  submitRecord: function(e) {
    var accessToken = App.globalData.accessToken;
    var host = App.globalData.host;
    var that = this;
    var erroInfo;
    var data = {};
    var index = this.data.index;
    data.baseInfoId = this.data.baseInfoId;
    data.index = index;
    var depth = this.data.depth;
    var hammerValue = this.data.hammerValue;
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
    } else if (!App.isInt(hammerValue)) {
      erroInfo = "实测锤击数只能是整数";
      this.errorTips(erroInfo);
      return
    }
    data.depth = depth;
    data.hammerValue = hammerValue;
    data.description = this.data.description;
    data.remark = this.data.remark;
    var dGrade = this.data.dGrade;
   
    // 成功跳转的页面
    wx.request({
      url: host + '/api/services/app/ZTData/CreateDetails',
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function() {
              //缓存提交的数据
              wx.setStorageSync('lastDepthData', data)
              that.setData({
                index: index + 1,
                depth: (parseFloat(depth) + parseFloat(dGrade)).toFixed(2),
                isDisabled: true,
                hammerValue: '',
              });
              setTimeout(function() {
                that.getDepthList();
              }, 100)
            }
          })
        } else {
          wx.showModal({
            title: '操作失败',
            content: '当前状态已锁定',
            showCancel: false,
            confirmColor: '#4cd964'
          })
        }
      },
      fali() {
        console.log('接口调用失败');
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
  },
  //获取指定数据详情
  getDepthList: function() {
    var that = this;
    var host = App.globalData.host;
    var accessToken = App.globalData.accessToken;
    var baseInfoId = this.data.baseInfoId;
    var url = host + '/api/services/app/ZTData/GetById?BaseInfoId=' + baseInfoId;
    wx.request({
      url: url,
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          var resData = res.data.result;
          that.setData({
            depthList: resData.detailsData
          });
        } else if (res.statusCode == 401) {
          var content = '登录过期，重新登录？';
          App.redirectToLogin(content);
        }
      }
    })
  },
  //结束试验
  endTest: function() {
    until.endTest()
  }
})