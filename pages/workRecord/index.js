// pages/test/test.js
const App = getApp();
const until = require('../../utils/util.js')
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
    loadingPage:false,
    pageFlag:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {  

    if (options.flag == 'RecordTest') {
      title = "现场试验"
    } else{
      title = "现场检测"
    }
    wx.setNavigationBarTitle({
      title: title
    })

    var accessToken = wx.getStorageSync('rsAccessToken');
    if (accessToken){
      if(options.flag ==="RecordTest"){ //现场试验
        this.setData({
          "pageFlag":options.flag,
          "testModeName":'轻型动力触探',
          "testModeCode":'TQ'
        })
      }
      this.setData({
        "accessToken": accessToken,
      })
      this.getPage();

    }else{
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
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(function() {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1000)
    
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
  loadMore: function() {
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
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  /*搜索 */
  search:function(e){
    var that = this;
    this.setData({
      loadingPage: false,
      inputVal: e.detail.value,
      page: 0,
      testList: []
    });
    that.getPage();
  },
  //跳转到查看详情
  toTestDetails: function(e) {
    var wtId = e.currentTarget.dataset.id;
    var testModeCode =  e.currentTarget.dataset.testmodecode;
    //缓存检测方法
    wx.setStorageSync('testModeCode', testModeCode);
    var url;
    if(this.data.pageFlag!='RecordTest'){
      url = '/pages/workRecord/details?wtId=' + wtId;
    }else{
      url = '/pages/workTest/details?wtId=' + wtId;
    }
    wx.navigateTo({
      //去根目录下找pages
      url: url,
    })
  },
  getPage: function(){
    var that = this;
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
    WXAPI.WorkRecordList(queryData).then(res => {
       
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
        loadingPage: true
      },500);

        
    },err=>{
      //请求出错也关闭加载状态页面
      that.setData({
        loadingPage: true
      });
    });
  }, 

  toSelectTestMode:function(e){
    wx.navigateTo({
      url:  "/pages/test/testMode?pageFlag="+this.data.pageFlag,
    })
  }
})