// pages/test/testList/testList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pileList:[]
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({
      pileList:JSON.parse(options.pileList)  
    });
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
      url: '/pages/test/testList/addTestPoint'
    })
  },

  //新增测点信息
  toAddTestPoint:function(){
    wx.navigateTo({
      url: '/pages/test/testList/addTestPoint'
    })
  },
  //查看数据详情
  toTestDataDetails:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/test/TestDataDetails/TestDataDetails?Id=' + id
    })
  } 
})