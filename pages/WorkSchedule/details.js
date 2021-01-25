// pages/myInfo/mytestTask/testTaskDetails.js
const App = getApp();
const WXAPI = require('../../utils/main.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wtId: null,
    confirmStatus: null,
    hidden: true,
    testLeader: {
      testLeaderId: "",
      testLeaderName: ""
    },
    testPerson1: {
      testPerson1Id: "",
      testPerson1Name: ""
    },
    testPerson2: {
      testPerson2Id: "",
      testPerson2Name: ""
    },
    equipList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wtId = options.wtId;
    this.setData({
      wtId: wtId,
      type: options.type
    })
    //加载委托单详情信息
    this.WorkScheduleDetails(wtId);
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
  WorkScheduleDetails: function (wtId) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    WXAPI.WorkScheduleDetails(this.data.type, wtId).then(res => {
      wx.hideLoading();
      var resData = res.result;
      var personList = resData.personList;
      this.setData({
        equipList: resData.equipList
      })
      for (var i = 0; i < personList.length; i++) {
        var personId = personList[i].personId;
        var personName = personList[i].personName;
        if (personList[i].personType == 0) {
          that.setData({
            'testLeader.testLeaderId': personId,
            'testLeader.testLeaderName': personName
          })
        } else if (personList[i].personType == 1) {
          that.setData({
            'testPerson1.testPerson1Id': personId,
            'testPerson1.testPerson1Name': personName
          })
        } else if (personList[i].personType == 2) {
          that.setData({
            'testPerson2.testPerson2Id': personId,
            'testPerson2.testPerson2Name': personName
          })
        }
      }
      that.setData({
        wtDetails: resData
      });
    }, err => {
      wx.hideLoading();
    })
  },

  //选择设备
  toDeviceList: function (e) {
    wx.navigateTo({
      url: '/pages/WorkSchedule/selectDevice?wtId=' + this.data.wtId + '&equipList=' + JSON.stringify(this.data.equipList) + '&type='+this.data.type,
    })
  },

  //提交表单
  toWorkSchedule: function (e) {
    wx.showLoading({
      title: '提交中...',
    })
    var that = this;
    var data = {};
    data.entrustId = this.data.wtId;
    data.workDate = util.getDate();
    data.finishDate = util.getDate(14);
    data.testLeaderId = this.data.testLeader.testLeaderId;
    data.testPerson1Id = this.data.testPerson1.testPerson1Id;
    data.testPerson2Id = this.data.testPerson2.testPerson2Id;
    data.deviceList = this.data.equipList;
    WXAPI.UpdateWorkSchedule(this.data.type, data).then(res => {
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
  },

  //删除检测设备
  toDeleteDevice: function (e) {
    var id = e.currentTarget.dataset.id;
    var equipList = this.data.equipList;
    for (var key in equipList) {
      if (equipList[key].equipId === id) {
        equipList.splice(key, 1)
      }
    }
    this.setData({
      equipList:equipList
    })

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