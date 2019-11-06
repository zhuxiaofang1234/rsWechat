// pages/test/addTestData/testRecord.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    depth: '',
    hammerValue: '',
    description: '',
    remark: '',
    showTopTips: false,
    erroInfo: "错误提示",
    isDisabled: true,
    baseInfoId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var baseInfoId = wx.getStorageSync('baseInfoId');
    var id = options.id;
    this.setData({
      baseInfoId: baseInfoId,
      id: id
    });
    this.getDepthDetails(id);
  },

  //获取锤击数
  getHammerValue: function(e) {
    if (!e.detail.value) {
      var erroInfo = "请填写实测锤击数";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        hammerValue: e.detail.value
      })
    }
  },
  //获取土层描述
  getDesc: function(e) {
    this.setData({
      description: e.detail.value
    })
  },
  //获取备注信息
  getRemark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //提交
  submitRecord: function(e) {
    var accessToken = App.globalData.accessToken;
    var host = App.globalData.host;
    var that = this;
    var erroInfo;
    var data = {};
    var depth = this.data.depth;
    var hammerValue = this.data.hammerValue;
    data.id = this.data.id;
    data.baseInfoId = this.data.baseInfoId;

    if (!hammerValue) {
      erroInfo = "请填写修改锤击数";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(hammerValue)) {
      erroInfo = "修改锤击数只能是整数";
      this.errorTips(erroInfo);
      return
    }
    data.depth = depth;
    data.correctValue = hammerValue;
    data.description = this.data.description;
    data.remark = this.data.remark;

    // 成功跳转的页面
    wx.request({
      url: host + '/api/services/app/ZTData/UpdateDetails',
      method: "PUT",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 3000,
            mask: true,
            success: function() {
              setTimeout(function() {
                //返回上一页并刷新页面 
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                prevPage.getDepthList();
                wx.navigateBack({
                  delta: 1
                })

              }, 2000)
            }
          })
        } else {
          wx.showModal({
            title: '操作失败',
            content: '当前状态已锁定',
            showCancel: false,
            confirmColor: '#4cd964'
          })
        }
      },
      fali() {
        console.log('接口调用失败');
      }
    })
  },
  //获取测点详情信息
  getDepthDetails: function(id) {
    var that = this;
    var host = App.globalData.host;
    var accessToken = App.globalData.accessToken;
    var BaseInfoId = this.data.baseInfoId;
    var url = host + '/api/services/app/ZTData/GetDetailById?BaseInfoId=' + BaseInfoId + '&Id=' + id;
    wx.request({
      url: url,
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          var resData = res.data.result;
          that.setData({
            depth: resData.depth,
            hammerValue: resData.hammerValue,
            description: resData.description,
            remark: resData.remark,
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
      }
    })
  },
  
  //错误提示
  errorTips: function(erroInfo) {
    var that = this;
    this.setData({
      showTopTips: true,
      erroInfo: erroInfo
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  cancel:function(){
    App.back()
  }
})