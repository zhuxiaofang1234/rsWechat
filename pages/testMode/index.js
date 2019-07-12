// pages/testMode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testModeCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var testModeCode = wx.getStorageSync('testModeCode');
    if (testModeCode){
      this.setData({
        testModeCode: testModeCode
      });
    }

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

  toWorkRecord:function(){
    var testModeCode = this.data.testModeCode;
    if(!testModeCode){
      wx.showModal({
        title: '登录过期',
        content: '请重新登录',
        showCancel: false,
        confirmColor: '#4cd964',
      });
      return
    }else{
      wx.setStorageSync('testModeCode', testModeCode);
    }
   
    wx.switchTab({
      url:'/pages/test/test'
    }); 
  },

  //选择检测方法
  selectTestMode:function(e){
   this.setData({
     testModeCode:e.target.dataset.code
   });
  }
})