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
    totalCount: null,
    MaxResultCount: 10,
    page: 1,
    testList: [],
    loadingData: false,/***数据是否正在加载**/
    hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    //初始化页面
    this.setData({
      "accessToken": wx.getStorageSync('accessToken')
    })
    var that = this;
    var curTestStatus = this.data.curTestStatus;
    var host = App.globalData.host;
    var hidden = this.data.hidden;
    var accessToken = this.data.accessToken;
    wx.request({
      url: host + '/api/services/app/WorkRecord/GetPaged',
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
          that.setData({
            "testList": resData.items,
            "totalCount": resData.totalCount,
            "hidden":false
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 1000)
  },

  //加载更多
  loadMore: function() {
    var that = this;
    var total = this.data.totalCount;
    var page = this.data.page;
    var host = App.globalData.host;
    var accessToken = this.data.accessToken;
    var MaxResultCount = this.data.MaxResultCount;
    var SkipCount = (this.data.page) * MaxResultCount;
    var loadData = this.data.load;
    var hidden = this.data.hidden;
    if (!hidden){
      this.setData({
        hidden: true  
      });
    }
    if (loadData){
      return;
    }

   
    if (that.data.testList.length < total) {
      that.setData({
        page: page + 1
      })
      wx.request({
        url: host + '/api/services/app/WorkRecord/GetPaged?SkipCount=' + SkipCount + '&MaxResultCount=' + MaxResultCount,
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
            var oldData = that.data.testList;
            that.setData({
              "testList": oldData.concat(resData.items),
              "load": true
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
    } else {
      //全部加载完毕
      that.setData({
        "load": false
      })
    }
    //if(testList)


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //跳转到查看详情
  toTestDetails: function() {
    var title = '查看详情页面';
    wx.navigateTo({
      //去根目录下找pages
      url: '/pages/test/testDetails?title=' + title,
    })
  },
  //获取select子组件传过来的值
  getData: function(e) {
    var testStatus = e.detail.code;
    this.setData({
      curTestStatus: testStatus
    });
  }
})