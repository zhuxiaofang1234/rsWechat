// pages/index/index.js
const App = getApp();
var until = require('../../utils/util.js')
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginName: '未登录',
    headImg: '/images/noLogin@2x.png',
    accessToken: null,
    loadingPage: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var accessToken = wx.getStorageSync('rsAccessToken');
    var refreshToken = wx.getStorageSync('refreshToken');

    /*根据token判断用户是否登录*/
    if (accessToken || refreshToken) {
      this.setData({
        "accessToken": accessToken,
      })
      this.getUserData();
      //是否有正在进行的试验
      var isTesting = wx.getStorageSync('isTesting');
      if (isTesting) {
        until.isTesting();
      }
    } else {
      this.setData({
        loadingPage: false
      })
    }
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //获取用户信息
  getUserData: function () {
    var that = this;
    WXAPI.GetUserData().then(res => {
      var resData = res.result.user;
      var userName = resData.name;
      var userAccount = resData.userName;
      var userStamp = resData.userStamp;
      var jobScope = res.result.jobScope;

      wx.setStorageSync('userAccount', userAccount);
      wx.setStorageSync('userName', userName);
      wx.setStorageSync('userStamp', userStamp);
      wx.setStorageSync('jobScope', jobScope);

      that.showMenu(res.result.menu);

      that.setData({
        loginName: userName,
        headImg: '/images/profile-pic.jpg',
      });
    });
  },


  homeNav: function (e) {
    const {
      type
    } = e.currentTarget.dataset;

    let url;
    console.log(type)
    switch (type) {
      case 'WorkSchedule':
        url = '/pages/WorkSchedule/index?type=WorkSchedule'
        break;
      case 'PersonSchedule':
        url = '/pages/WorkSchedule/index?type=PersonSchedule'
        break;
      case 'WorkSures':
        url = '/pages/workSure/index'
        break;
      case 'WorkRecord': //现场记录
        url = '/pages/workRecord/index?flag=wrokRecod'
        break;
      case 'WorkTest': //现场试验
        url = '/pages/workRecord/index?flag=RecordTest'
        break;
      case 'SurveyRecord': //现场踏勘
        url = '/pages/workSurvey/index'
        break;
      case 'TestData': //数据中心
        url = '/pages/dataCenter/index'
        break;
      case 'Monitor': //数据监控
        url = '/pages/JZmonitor/index'
        break;
      case 'ReportManage': //报告管理
        url = '/pages/TestReportsNav/index'
        break;
    }
    var accessToken = wx.getStorageSync('rsAccessToken');
    var refreshToken = wx.getStorageSync('refreshToken');

    if (accessToken || refreshToken) {
      wx.navigateTo({
        url: url,
      })
    } else {
      App.redirectToLogin()
    }
  },

  //跳转到进行中试验
  toTestRecord: function () {
    var accessToken = wx.getStorageSync('rsAccessToken');
    var refreshToken = wx.getStorageSync('refreshToken');
    if (accessToken || refreshToken) {
      var isTesting = wx.getStorageSync('isTesting');
      if (isTesting) {
        var BaseTestData = wx.getStorageSync('BaseTestData');
        var baseInfoId = BaseTestData.baseInfoId;
        var pileId = BaseTestData.pileId
        wx.navigateTo({
          url: '/pages/ZT/ZTDataDetails/index?baseInfoId=' + baseInfoId + '&pileId=' + pileId,
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '暂无进行中的试验',
          showCancel: false,
          confirmColor: '#4cd964',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    } else {
      App.redirectToLogin();
    }
  },

  //按权限展示菜单
  showMenu: function (menu) {
    var menuStr = JSON.stringify(menu);
    var moduleArr = ['WorkSchedule', 'SurveyRecord', 'PersonSchedule', 'WorkSures', 'WorkRecord', 'TestData', 'ReportCheck', 'ReportVerify', 'ReportApproval', 'ReportSign', 'ReportUpload', 'ReportInValid', 'Monitor'];
    var hasAuthMenu = [],
      Reports = [];
    for (var i = 0; i < moduleArr.length; i++) {
      var module = moduleArr[i];
      if (menuStr.indexOf(module) !== -1) {
        var item = {};
        switch (module) {
          case 'WorkSchedule':
            item.code = 'WorkSchedule';
            item.name = '工作安排';
            break;
          case 'SurveyRecord':
            item.code = 'SurveyRecord';
            item.name = '现场踏勘';
            break;
          case 'PersonSchedule':
            item.code = 'PersonSchedule';
            item.name = '人员安排';
            break;
          case 'WorkSures':
            item.code = 'WorkSures';
            item.name = '工作确认';
            break;
          case 'WorkRecord':
            item.code = 'WorkRecord';
            item.name = '现场记录';
            hasAuthMenu.push({
              code: 'WorkTest',
              name: '现场试验'
            })
            break;
          case 'TestData':
            item.code = 'TestData';
            item.name = '检测数据';
            break;
            // case 'ReportSubmit':
            //   Reports.push('ReportSubmit');
            //   break;
          case 'ReportCheck':
            Reports.push('ReportCheck');
            break;
          case 'ReportVerify':
            Reports.push('ReportVerify');
            break;
          case 'ReportApproval':
            Reports.push('ReportApproval');
            break;
          case 'ReportSign':
            Reports.push('ReportSign');
            break;
          case 'ReportUpload':
            Reports.push('ReportUpload');
            break;
          case 'ReportInValid':
            Reports.push('ReportInValid');
            break;
          case 'Monitor':
            item.code = 'Monitor';
            item.name = '静载监控';
            break;
        }

        if (JSON.stringify(item) != "{}") {
          hasAuthMenu.push(item);
        }
      }
    }
    wx.setStorageSync('ReportsAuth', Reports);

    if (Reports.length !== 0) {
      hasAuthMenu.push({
        code: 'ReportManage',
        name: '报告管理'
      })
    }
    this.setData({
      hasAuthMenu,
      loadingPage: false
    })
  }
})