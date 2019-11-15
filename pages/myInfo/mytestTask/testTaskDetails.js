// pages/myInfo/mytestTask/testTaskDetails.js
const App = getApp();
const WXAPI = require('../../../utils/main.js')
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
    wx.showLoading({
      title: '加载中',
    });
    var queryData={
      'Id': wtId
    };
    WXAPI.GetTaskDetails(queryData).then(res=>{
      wx.hideLoading();
      var resData = res.result;
      that.setData({
        wtDetails: resData
      });
    },err=>{
      wx.hideLoading(); 
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