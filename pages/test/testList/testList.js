// pages/test/testList/testList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toWtDetails: function () {
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  //录入检测数据
  toAddTestData:function(){
    wx.navigateTo({
      url: '/pages/test/addTestData/addTestData'
    })
  },
  //查看数据详情
  toTestDataDetails:function(){
    wx.navigateTo({
      url: '/pages/test/TestDataDetails/TestDataDetails'
    })

  } 
})