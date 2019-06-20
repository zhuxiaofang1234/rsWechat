// pages/test/testData/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNo: '',
    pileList:[]
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
  //获取桩列表
  getPileList: function (serialNo) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = wx.getStorageSync('accessToken');

    var url = host + '/api/services/app/ZTData/GetPileList?SerialNo=' + serialNo;
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
  },
  //新增试验数据
  toAddTestData:function(){
    wx.navigateTo({
      url: '/pages/test/addTestData/addTestData'
    })
  },
  //查看数据详情
  toTestDataDetails:function(e){
    wx.navigateTo({
      url: '/pages/test/TestDataDetails/TestDataDetails'
    })
  }

})