// pages/test/test.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testModeName:'全部',
    testModeCode:'',
    inputShowed: false,
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
    loadingPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化页面
    var accessToken = wx.getStorageSync('rsAccessToken');
    if (accessToken) {
      this.setData({
        "accessToken": accessToken
      });
      this.getPage();
    } else {
      App.redirectToLogin();
    }  
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
      }, 100)

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


  /***搜索***/
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
  search: function (e) {
    var that = this;
    this.setData({
      loadingPage: false,
      inputVal: e.detail.value,
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
    var total = this.data.totalCount;
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
      'TestModeCode': TestModeCode,
      'Filter': Filter
    };

    WXAPI.SurveyRecord(queryData).then(res => {
      wx.hideLoading();
  
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
      setTimeout(()=>{
        that.setData({
          'loadingPage': true
        },100);
      })
      
    }, err => {
      //请求出错也关闭加载状态页面
      that.setData({
        loadingPage: true
      });
    });
  },
  //检测任务详情页
  toTestTaskDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      //去根目录下找pages
      url: '/pages/workSurvey/details?Id=' + id
    })
  },
   //选择检测方法
   toSelectTestMode:function(e){
    wx.navigateTo({
      url:  "/pages/test/testMode",
    })
  }
})