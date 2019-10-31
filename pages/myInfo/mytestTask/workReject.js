// pages/myInfo/mytestTask/workSure.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wtId: "",
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wtId: options.wtId
    });
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
  },

  //详情信息
  messageConfirm: function (e) {
    console.log(e.detail.value);
    this.setData({
      message: e.detail.value
    });
  },
  toList: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  toReject: function (e) {
    var message = this.data.message;
    var id = this.data.wtId;
    var that = this;
    var accessToken = App.globalData.accessToken;

    var host = App.globalData.host;
    if (message.length==0) {
      wx.showModal({
        title: '错误提示',
        content: '驳回原因不能为空',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    } else {
      // 成功跳转的页面
      wx.request({
        url: host + '/api/services/app/WorkSures/WorkSure',
        method: "POST",
        data: {
          "id": id,
          'result': 2,
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
              success: function () {
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