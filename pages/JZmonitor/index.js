// pages/test/test.js
const App = getApp();
const until = require('../../utils/util.js')
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testModeName: '全部',
    testModeCode: '',
    inputVal: "",
    totalCount: 0,
    MaxResultCount: 10,
    page: 0,
    testList: [],
    loadingData: true,
    loadingText: '加载中.....',
    /***数据是否正在加载**/
    hidden: true,
    loadingPage: true,
    pageFlag: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPage();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000)
      this.setData({
        inputVal: '',
        page: 0,
        testList: []
      });
      this.getPage();
  },

  //加载更多
  loadMore: function () {
    var total = this.data.totalCount;
    var loadingData = this.data.loadingData;
    //当前列表数据
    var testList = this.data.testList;

    if (!loadingData) {
      return;
    }
    this.setData({
      loadingData: false
    });
    var that = this;

    if (testList.length < total) {
      wx.showLoading({
        title: '加载中',
      });
      setTimeout(() => {
        that.getPage()
      }, 600)

    } else {
      this.setData({
        "hidden": false,
        'loadingText': '已加载完所有数据'
      });
    }
  },

  /***搜索***/
  search: function (e) {
    var that = this;
    this.setData({
      loadingPage: true,
      inputVal: e.detail,
      page: 0,
      testList: []
    });
    that.getPage();
  },

  //取消搜索
  cancelSearch: function (e) {
    if (!this.data.inputVal) {
      return
    }
    var that = this;
    this.setData({
      loadingPage: true,
      inputVal: "",
      page: 0,
      testList: []
    });
    that.getPage();
  },


  getPage: function () {
    var that = this;
    var page = this.data.page;
    var Filter = this.data.inputVal;
    var MaxResultCount = this.data.MaxResultCount;
    var SkipCount = (page) * MaxResultCount;
    var hidden = this.data.hidden;
    var TestModeCode = this.data.testModeCode;
    if (hidden) {
      this.setData({
        "hidden": false
      });
    }
    var queryData = {
      'SkipCount': SkipCount,
      'MaxResultCount': MaxResultCount,
      'TestModeCode': 'JZ',
      'Hour':0,
      'Filter': Filter
    };
    WXAPI.JZMonitorList(queryData).then(res => {
      var resData = res.result;
      //数据总条数小于每页要显示的总条数
      var curList = that.data.testList;
      if (resData.totalCount < MaxResultCount) {
        that.setData({
          "hidden": false,
          'loadingText': '已加载完所有数据',
        });
      }
      that.setData({
        "testList": curList.concat(resData.items),
        "totalCount": resData.totalCount,
        "page": page + 1,
        "hidden": true,
        'loadingData': true
      });
      wx.hideLoading();
      that.setData({
        loadingPage: false
      }, 500);
    }, err => {
      //请求出错也关闭加载状态页面
      that.setData({
        loadingPage: false
      });
    });
  },

  //选择检测方法
  toSelectTestMode: function (e) {
    var testModeCode = this.data.testModeCode;
    if (testModeCode == "") {
      testModeCode = "All"
    }
    wx.navigateTo({
      url: "/pages/test/testMode?testModeCode=" + testModeCode + "&pageFlag=" + this.data.pageFlag
    })
  },

   //静载数据详情
   toJZMonitorDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        //去根目录下找pages
        url: '/pages/WebView/index?baseInfoId=' + id + '&type=' + 'monitor'
      })
    }
  }
})