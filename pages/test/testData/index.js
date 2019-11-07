// pages/test/testData/index.js
const App = getApp();
var until = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNo: '',
    pileList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      serialNo: options.serialNo
    });
    this.getPileList(options.serialNo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000)
    var serialNo = this.data.serialNo;
    this.getPileList(serialNo);
  },
  //获取桩列表
  getPileList: function(serialNo) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = App.globalData.accessToken;

    var url = host + '/api/services/app/ZTData/GetPileList?SerialNo=' + serialNo +'&OrderBy=4';
    wx.showLoading({
      title: '加载中',
    });
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
          wx.hideLoading();
          var resData = res.data.result;
          that.setData({
            pileList: resData
          });

        } else if (res.statusCode == 401) {
          var content = '登录过期，重新登录？';
          App.redirectToLogin(content);
        }
      }
    })
  },
  //新增试验数据
  toAddTestData: function() {
    var isTesting = wx.getStorageSync('isTesting');
    if (isTesting) { //当前有试验在进行
      until.isTesting();  
    }else{
      wx.navigateTo({
        url: '/pages/test/addTestData/addTestData'
      })
    }
  },
  //查看数据详情
  toTestDataDetails: function(e) {
    var baseInfoId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/test/TestDataDetails/TestDataDetails?baseInfoId=' + baseInfoId
    })
  }

})