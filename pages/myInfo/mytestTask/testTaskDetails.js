// pages/myInfo/mytestTask/testTaskDetails.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wtId:null,
    confirmStatus:null,
    hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wtId = options.Id;
    var confirmStatus = options.confirm;
    if (confirmStatus==0){
      this.setData({
        hidden:false
      });
    }else{
      this.setData({
        hidden: true
      });
    } 
    this.setData({
      wtId: wtId
    }); 
  //加载委托单详情信息
    this.getEntrustDetails(wtId);
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //获取委托单详情信息
  getEntrustDetails: function (wtId) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = wx.getStorageSync('accessToken');
    var url = host + '/api/services/app/WorkSures/GetById?Id=' + wtId;

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
            wtDetails: resData
          });
         
        } else if (res.statusCode == 401) {
          wx.showModal({
            title: '登录过期',
            content: '请重新登录',
            showCancel: false,
            confirmColor: '#4cd964',
            success: function () {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          })
        } else {
          wx.hideLoading(); 
        }
      },
      fali() {
        wx.hideLoading();
      }
    })
  },
  toWtReject:function(){
    var wtId = this.data.wtId;
    wx.navigateTo({
      url: '/pages/myInfo/mytestTask/workReject?wtId=' + wtId
    })
  },
  toWtSure:function(){
    var wtId = this.data.wtId;
    wx.navigateTo({
      url: '/pages/myInfo/mytestTask/workSure?wtId=' + wtId
    })
  }
})