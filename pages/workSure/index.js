// pages/test/test.js
const App = getApp();
const WXAPI = require('../../utils/main.js');
var sliderWidth = 36; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testModeName: '全部',
    testModeCode: '',
    inputVal: "",
    accessToken: '',
    totalCount: 0,
    MaxResultCount: 10,
    page: 0,
    testList: [],
    loadingData: true,
    loadingText: '加载中.....',
    /***数据是否正在加载**/
    hidden: true,
    ConfirmStatus: "",
    loadingPage: true,
    tabs: ["全部", "待确认", "待进场", "待出场"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.setData({
      loadingPage: true
    });
    setTimeout(function () {
      that.setData({
        inputVal: '',
        page: 0,
        testList: []
      });
      that.getPage();
    }, 200)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 2000)
    if (this.data.accessToken) {
      this.setData({
        inputVal: '',
        page: 0,
        testList: []
      });
      this.getPage();
    }
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
      setTimeout(function () {
        that.getPage()
      }, 600)

    } else {
      this.setData({
        "hidden": false,
        'loadingText': '已加载完所有数据'
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底');
  },

  /*搜索 */
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

  //获取列表数据
  getPage: function () {
    var that = this;
    var hidden = this.data.hidden;
    var page = this.data.page;
    var Filter = this.data.inputVal;
    var ConfirmStatus = this.data.ConfirmStatus;
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
      'TestModeCode': TestModeCode,
      'ConfirmStatus': ConfirmStatus,
      'Filter': Filter
    };
    WXAPI.GetMyTestTask(queryData).then(res => {
      wx.hideLoading();
      var resData = res.result;
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
      setTimeout(() => {
        that.setData({
          'loadingPage': false
        }, 100);
      })

    }, err => {
      //请求出错也关闭加载状态页面
      that.setData({
        loadingPage: false
      });
    });
  },
  //检测任务详情页
  toTestTaskDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    var confirm = e.currentTarget.dataset.confirm;
    wx.navigateTo({
      url: '/pages/workSure/details?Id=' + id + '&confirm=' + confirm
    })
  },
  //切换状态
  tabClick: function (e) {
    var id = e.currentTarget.id;
    var that = this;
    switch (id) {
      case "0":
        ConfirmStatus = "";
        break;
      case "1":
        ConfirmStatus = 0;
        break;
      case "2":
        ConfirmStatus = 1;
        break;
      case "3":
        ConfirmStatus = 30;
        break;
      default:
        ConfirmStatus = "";
    };

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      ConfirmStatus: ConfirmStatus,
      inputVal: '',
      page: 0,
      testList: [],
      loadingPage: true
    });
    setTimeout(() => {
      this.getPage();
    }, 200)

  },
  //选择检测方法
  toSelectTestMode: function (e) {
    var testModeCode = this.data.testModeCode;
    if (testModeCode == "") {
      testModeCode = "All"
    }
    wx.navigateTo({
      url: "/pages/test/testMode?testModeCode=" + testModeCode
    })
  }
})