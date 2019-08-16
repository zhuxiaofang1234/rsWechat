// pages/test/test.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [{
        "code": "",
        "text": "全部"
      },
      {
        "code": "2",
        "text": "待检测"
      },
      {
        "code": "5",
        "text": "检测中"
      }, {
        "code": "6",
        "text": "已检测"
      }
    ],
    curTestStatus: '',
    inputShowed: false,
    inputVal: "",
    accessToken: '',
    totalCount: 0,
    MaxResultCount: 10,
    page: 0,
    testList: [],
    loadingData: false,
    loadingText: '加载中.....',
    /***数据是否正在加载**/
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化页面
    this.setData({
      "accessToken": wx.getStorageSync('accessToken'),
    })
    this.getPage();
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

    this.setData({
      inputVal: '',
      page: 0,
      testList: []
    });
    this.getPage();
  },

  //加载更多
  loadMore: function() {
    var total = this.data.totalCount;
    var loadingData = this.data.loadingData;
    //当前列表数据
    var testList = this.data.testList;

    if (loadingData) {
      return;
    }
    this.setData({
      loadingData: true
    });
    var that = this;

    if (testList.length < total) {
      wx.showLoading({
        title: '加载中',
      });
      setTimeout(function() {
        that.getPage()
      }, 1000)

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
  onReachBottom: function() {
    console.log('页面上拉触底');
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
  search:function(e){
    this.setData({
      inputVal: e.detail.value,
      page: 0,
      testList: []
    });
    this.getPage();
  },
  //跳转到查看详情
  toTestDetails: function(e) {
    var wtId = e.currentTarget.dataset.id;
    wx.navigateTo({
      //去根目录下找pages
      url: '/pages/test/testDetails?wtId=' + wtId,
    })
  },
  //获取select子组件传过来的值
  getData: function(e) {
    var testStatus = e.detail.code;
    this.setData({
      curTestStatus: testStatus,
      page: 0,
      testList: []
    });
    this.getPage();
  },
  //获取列表数据
  getPage: function() {
    var that = this;
    var curTestStatus = this.data.curTestStatus;
    var host = App.globalData.host;
    console.log(host);
    var hidden = this.data.hidden;
    var accessToken = this.data.accessToken;
    var page = this.data.page;
    var total = this.data.totalCount;
    var Filter = this.data.inputVal;

    var MaxResultCount = this.data.MaxResultCount;
    var SkipCount = (page) * MaxResultCount;
    var loadData = this.data.load;
    var hidden = this.data.hidden;

    var TestModeCode = wx.getStorageSync('testModeCode');
    console.log(TestModeCode);

    if (hidden) {
      this.setData({
        "hidden": false
      });
    }
    wx.request({
      url: host + '/api/services/app/WorkRecord/GetPaged?SkipCount=' + SkipCount + '&MaxResultCount=' + MaxResultCount + '&status=' + curTestStatus + '&Filter=' + Filter + '&TestModeCode=' + TestModeCode,
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var resData = res.data.result;
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
            'loadingData': false
          });
        } else if (res.statusCode == 401) {
          wx.showModal({
            title: '登录过期',
            content: '请重新登录',
            showCancel: false,
            confirmColor: '#4cd964',
            success: function() {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          })
        }
      },
      fali() {
        console.log('接口调用失败');
      }
    })
  }
})