// pages/myInfo/mytestTask/testTaskDetails.js
const App = getApp();
const WXAPI = require('../../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wtId: null,
    confirmStatus: null,
    hidden: true,
    isShowDialog: false,
    Date: "",
    timeLabel: '',
    operationFlag: 'toDetect'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wtId = options.Id;
    var confirmStatus = options.confirm;
    if (confirmStatus == 0 || confirmStatus == 1 || confirmStatus == 30) {
      this.setData({
        hidden: false,
      });
    } else {
      this.setData({
        hidden: true
      });
    }
    this.setData({
      wtId: wtId,
      confirmStatus: confirmStatus
    });
    //加载委托单详情信息
    this.getEntrustDetails(wtId);
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

  //获取委托单详情信息
  getEntrustDetails: function (wtId) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var queryData = {
      'Id': wtId
    };
    WXAPI.GetTaskDetails(queryData).then(res => {
      wx.hideLoading();
      var resData = res.result;
      that.setData({
        wtDetails: resData
      });
    }, err => {
      wx.hideLoading();
    })
  },

  toWtReject: function () {
    var wtId = this.data.wtId;
    wx.navigateTo({
      url: '/pages/myInfo/mytestTask/workReject?wtId=' + wtId
    })
  },

  toWtSure: function () {
    var wtId = this.data.wtId;
    wx.navigateTo({
      url: '/pages/myInfo/mytestTask/workSure?wtId=' + wtId
    })
  },

  //进场
  toDoDetect: function () {
    this.getCurrentTime();
    this.showModal();
    this.setData({
      timeLabel: '进场时间',
      operationFlag: 'toDetect'
    });
  },

  //出场
  toFinishDetect: function () {
    this.getCurrentTime();
    this.showModal();
    this.setData({
      timeLabel: '出场时间',
      operationFlag: 'FinishDetect'
    });
  },

  getCurrentTime() {
    //获取系统当前时间
    const nowDate = new Date();
    const testTime = App.format(nowDate);
    //检测日期默认当前时间
    this.setData({
      Date: testTime.substring(0, 10)
    })
  },

  //检测时间
  bindDateChange: function (e) {
    this.setData({
      Date: e.detail.value
    })
  },

  // 显示遮罩层 
  showModal: function () {
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear',
      delay: 0,
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(600).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      isShowDialog: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
  },

  // 隐藏遮罩层 
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        isShowDialog: false
      })
    }, 200)
  },

  //提交表单
  reg: function (e) {
    wx.showLoading({
      title: '提交中...',
    })
    var operationFlag = this.data.operationFlag;
    var data = {};
    data.id = this.data.wtId;
    var date = this.data.Date;
    var that = this;

    if (operationFlag == 'toDetect') { //待进场
      data.startDate = date
      WXAPI.DoDetect(data).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function (res) {
            setTimeout(() => {
              App.back();
            }, 600)
          }
        })
      }, err => {
        wx.hideLoading()

      });
    } else if (operationFlag == 'FinishDetect') {
      data.endDate = date
      WXAPI.FinishDetect(data).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function (res) {
            setTimeout(() => {
              App.back();
            }, 600)
          }
        })
      }, err => {
        wx.hideLoading()
      })
    }
  },
  goBack: function () {
    //返回列表页
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      inputVal: '',
      page: 0,
      testList: []
    });
    prevPage.getPage();
    App.back();
  }
})