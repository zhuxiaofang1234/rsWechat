// pages/index/index.js
const App = getApp();
var until = require('../../utils/util.js')
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [{
        name: '轻型动力触探',
        value: 'TQ',
        checked: true
      },
      {
        name: '重型动力触探',
        value: 'TZ'
      },
      {
        name: '灌注桩钻芯',
        value: 'q'
      },
      {
        name: '搅拌桩钻芯',
        value: 'e'
      },
      {
        name: '岩基钻芯',
        value: 'r'
      }
    ],
    loginName: '未登录',
    headImg: '/images/noLogin@2x.png',
    accessToken: null,
    curTestMode: 'TQ'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    var accessToken = wx.getStorageSync('rsAccessToken');
    //更新main.js内的Token和host
    WXAPI.getToken();
    WXAPI.getHost();
    wx.setStorageSync('testModeCode', this.data.curTestMode);
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
    //选中当前检测方法
    var TestModeCode = wx.getStorageSync('testModeCode');
    this.checkedTestMode(TestModeCode);
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

  //选择试验方法
  radioChange: function(e) {
    var curTestMode = e.detail.value;
    this.checkedTestMode(curTestMode);
    //更换检测方法
    wx.setStorageSync('testModeCode', curTestMode);
  },

  //获取用户信息
  getUserData: function() {
    var that = this;
    WXAPI.GetUserData().then(res=>{
      var resData = res.result.user;
      var userName = resData.name;
      var userAccount = resData.userName

      wx.setStorageSync('userAccount', userAccount);
      wx.setStorageSync('userName', userName);
      
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
          url: '/pages/test/TestDataDetails/TestDataDetails?baseInfoId=' + baseInfoId + '&pileId=' + pileId,
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
  goLogin: function() {
    var accessToken = this.data.accessToken;
    if (!accessToken) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  checkedTestMode: function (curTestMode){
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == curTestMode;
    }
    this.setData({
      radioItems: radioItems,
      curTestMode: curTestMode
    });
  }
})