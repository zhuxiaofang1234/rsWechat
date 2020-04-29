// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startDate: '2019-06-28',
    endDate: '2019-07-30',
    height: ["无", "有"],
    heightIndex: 0,
    isShowHeight: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  cancel: function () {
    App.back();
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

  //开钻时间
  bindStartDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //结束时间
  bindEndDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //设计桩顶标高
  bindHeightChange: function (e) {
    var heightIndex = e.detail.value;
    this.setData({
      heightIndex: heightIndex
    });
    if (heightIndex == 1) {
      this.setData({
        isShowHeight: false
      });
    } else {
      this.setData({
        isShowHeight: true
      });
    }
  },
  //返回上一级
  cancel: function () {
    App.back()
  }
})