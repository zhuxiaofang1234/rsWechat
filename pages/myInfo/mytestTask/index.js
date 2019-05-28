// pages/myInfo/mytestTask/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [
      {
        "id": "0",
        "text": "低应变"
      },
      {
        "id": "1",
        "text": "圆锥动力触探"
      }, {
        "id": "2",
        "text": "高应变"
      }
    ],
    inputShowed: false,
    inputVal: ""
  },
  /*搜索页面 */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  //检测任务详情页
  toTestTaskDetails:function(){
    wx.navigateTo({
      //去根目录下找pages
      url: '/pages/myInfo/mytestTask/testTaskDetails'
    })
  }


  
})