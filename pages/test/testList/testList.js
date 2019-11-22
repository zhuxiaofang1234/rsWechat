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
  
  //编辑测点信息
  toEditTestPoint:function(e){
    var id = e.currentTarget.dataset.id;
    var lastPage = 'TestList'
    wx.navigateTo({
      url: '/pages/test/testList/EditTestPoint?id=' + id + '&lastPage=' + lastPage
    })
  }
})