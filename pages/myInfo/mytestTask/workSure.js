// pages/myInfo/mytestTask/workSure.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wtId: "",
    startDate: "2016-09-01",
    endDate: "2019-06-06",
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      wtId: options.wtId
    });    
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
  },

  //进场时间
  bindstartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  //完成时间
  bindendDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  //详情信息
  messageConfirm: function(e) {
    this.setData({
      message: e.detail.value
    });
  },
  toList: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  toSure: function(e) {
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    var message = this.data.message;
    var id = this.data.wtId;
    var that = this;
    var accessToken = App.globalData.accessToken;
  
    var host = App.globalData.host;
    if (startDate.length == 0 || endDate.length == 0) {
      wx.showModal({
        title: '错误提示',
        content: '日期不能为空',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    } else {
      // 成功跳转的页面
      wx.request({
        url: host + '/api/services/app/WorkSures/WorkSure',
        method: "POST",
        data: {
          "workDate": startDate,
          "finishDate": endDate,
          "id": id,
          'result': 1,
          'message': message
        },
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
                //返回上一页并刷新页面 
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                setTimeout(() => {
                  prevPage.getTaskDetails(prevPage.data.wtId);
                  prevPage.setData({
                    hidden: true,
                  })
                  wx.navigateBack({
                    delta: 1 //想要返回的层级
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
    }
  }
})