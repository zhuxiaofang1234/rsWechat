// pages/myInfo/mytestTask/workSure.js
const App = getApp();
const WXAPI = require('../../../utils/main.js')
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

  toList: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  reg: function (e) {
    var that = this;
    var message = e.detail.value.message; 
    console.log(message);
    if (message.length==0) {
      wx.showModal({
        title: '错误提示',
        content: '驳回原因不能为空',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    } else {
      // 成功跳转的页面
      var data = {
        "id": this.data.wtId,
        'result': 2,
        'message': message
      };
      WXAPI.TaskSure(data).then(res=>{
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
              prevPage.getEntrustDetails(prevPage.data.wtId);
              prevPage.setData({
                hidden: true,
              })
              wx.navigateBack({
                delta: 1 //想要返回的层级
              })
            }, 2000)
          }
        })
      },err=>{
        wx.showModal({
          title: '操作失败',
          content: '当前状态已锁定',
          showCancel: false,
          confirmColor: '#4cd964'
        })
      })
    }
  }
})