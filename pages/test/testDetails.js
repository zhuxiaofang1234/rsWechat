// pages/test/testDetails.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wtDetails: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化页面
    var wtId = options.wtId;
    var that = this;
    that.getEntrustDetails(wtId);
    wx.setStorageSync('wtId', wtId);
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  //页面跳转
  toPersonInfo: function() {
    wx.navigateTo({
      url: '/pages/test/personInfo/personInfo'
    });
  },

  toTestStandard: function() {
    var testStandard = this.data.testStandard;
    wx.navigateTo({
      url: '/pages/test/testStandard/testStandard?testStandard=' + testStandard
    });
  },

  toReportRes: function() {
    wx.navigateTo({
      url: '/pages/test/reportRes/reportRes'
    });
  },
  //检测列表
  toTestList: function() {
    var pileList = JSON.stringify(this.data.pileList);
    wx.navigateTo({
      url: '/pages/test/testList/testList?pileList=' + pileList
    });
  },
  //获取委托单详情信息
  getEntrustDetails: function(wtId) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = wx.getStorageSync('accessToken');
    var url = host + '/api/services/app/WorkRecord/GetEntrustInfoById?Id=' + wtId;
    
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
            wtDetails: resData,
            testStandard: resData.testStandard,
            pileList: resData.pileList
          });
        } else if (res.statusCode == 401) {
          wx.showModal({
            title: '登录过期',
            content: '请重新登录',
            showCancel: false,
            confirmColor: '#4cd964',
            success: function() {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          })
        }
      }
    })
  }
})