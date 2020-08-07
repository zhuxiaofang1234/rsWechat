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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    var accessToken = wx.getStorageSync('rsAccessToken');
    //更新main.js内的Token和host
    WXAPI.getToken();
    WXAPI.getHost();
  
    /*根据token判断用户是否登录*/
    if (accessToken) {
      this.setData({
        "accessToken": accessToken,
      })
      this.getUserData();
       //是否有正在进行的试验
      var isTesting = wx.getStorageSync('isTesting');
        if (isTesting) {
          until.isTesting();
        }
    }
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
    // //选中当前检测方法
    // var TestModeCode = wx.getStorageSync('testModeCode');
    // this.checkedTestMode(TestModeCode);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //获取用户信息
  getUserData: function() {
    var that = this;
    WXAPI.GetUserData().then(res=>{
      var resData = res.result.user;
      var userName = resData.name;
      var userAccount = resData.userName;
      var userStamp = resData.userStamp;
      var jobScope = res.result.jobScope;
     
      wx.setStorageSync('userAccount', userAccount);
      wx.setStorageSync('userName', userName);
      wx.setStorageSync('userStamp', userStamp);
      wx.setStorageSync('jobScope', jobScope);
      
      that.setData({
        loginName: userName,
        headImg: '/images/profile-pic.jpg',
      });    
    });
  },
  //跳转到检测任务页面
  toMytestTask: function() {
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/myInfo/mytestTask/index'
      })
    } else {
      App.redirectToLogin();
    }
  },

  //静载监控
  goJZmonitor:function(){
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/JZmonitor/index'
      })
    } else {
      App.redirectToLogin();
    }
  },

  //工作安排
  goWrokSchedule:function(){
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/WorkSchedule/index'
      })
    } else {
      App.redirectToLogin();
    }
  },
  //工作确认
  goWrokSure:function(){
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/workSure/index'
      })
    } else {
      App.redirectToLogin();
    }
  },

  //现场踏勘
  goWorkSurvey:function(){
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/workSurvey/index'
      })
    } else {
      App.redirectToLogin();
    }
  },

  //现场记录
  goWorkRecord:function(){
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/workRecord/index?flag=wrokRecod'
      })
    } else {
      App.redirectToLogin();
    }   
  },

  //现场试验
  goRecordTest:function(){
    var accessToken = this.data.accessToken;
    if (accessToken) {
      wx.navigateTo({
        url: '/pages/workRecord/index?flag=RecordTest'
      })
    } else {
      App.redirectToLogin();
    }
  },

  //跳转到进行中试验
  toTestRecord: function() { 
    var accessToken = this.data.accessToken;
    if (accessToken) {
      var isTesting = wx.getStorageSync('isTesting');
      if (isTesting){
        var BaseTestData = wx.getStorageSync('BaseTestData');
        var baseInfoId = BaseTestData.baseInfoId;
        var pileId = BaseTestData.pileId
        wx.navigateTo({
          url: '/pages/ZT/ZTDataDetails/index?baseInfoId=' + baseInfoId + '&pileId=' + pileId,
        });
      }else{
        wx.showModal({
          title: '提示',
          content: '暂无进行中的试验',
          showCancel:false,
          confirmColor:'#4cd964',
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

  //数据中心
  goDataCenter:function(){
      var accessToken = this.data.accessToken;
      if (accessToken) {
        wx.navigateTo({
          url: '/pages/dataCenter/index'
        })
      } else {
        App.redirectToLogin();
      }    
  },

  //报告管理
  goReportCenter:function(){

  },
  goLogin: function() {
    var accessToken = this.data.accessToken;
    if (!accessToken) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  }
})