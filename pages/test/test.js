// pages/test/test.js

const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [
      {
        "id": "0",
        "text": "待检测"
      },
      {
      "id": "1",
      "text": "已检测"
    }, {
      "id": "2",
      "text": "检测完成"
    }
    ],
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function(){
      wx.stopPullDownRefresh();
    },1000)
  },

  scollFunc:function(){
    console.log('滚动到底部了！');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底');
  },


  /**
   * 用户点击右上角分享
   */
  bindPickerChange(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  getDate: function (e) {
    console.log(e.detail)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //查看详情
  toTestDetails: function () {
    console.log('查看详情');
    var title = '查看详情页面';
    wx.navigateTo({
      //去根目录下找pages
      url: '/pages/test/testDetails?title=' + title,
    })
  }
})