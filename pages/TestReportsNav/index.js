// pages/TestReports/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取报告权限
    var ReportAuth = wx.getStorageSync('ReportsAuth');
    this.setData({
      ReportCheck:this.isArray('ReportCheck',ReportAuth),
      ReportVerify:this.isArray('ReportVerify',ReportAuth),
      ReportApproval:this.isArray('ReportApproval',ReportAuth),
      ReportSign:this.isArray('ReportSign',ReportAuth),
      ReportUpload:this.isArray('ReportUpload',ReportAuth),
      ReportInValid:this.isArray('ReportInValid',ReportAuth),
    })
    this.setData({
      ReportAuth:ReportAuth
    })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //审核，批准，发布，报告，作废
  toTestReportOperate: function (e) {
    var pageType = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/TestReports/index?flag=' + pageType,
    })
  },

  //判断数组是否存在某个值
 isArray:function(target,arr){
  if(arr.indexOf(target) !== -1){
      return true
  }else{
    return false
  }
 }
})