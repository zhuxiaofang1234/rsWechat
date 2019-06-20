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
    var plieList = wx.getStorageSync('pileList')
    this.setData({
      pileList: plieList 
    });
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