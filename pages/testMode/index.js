// pages/testMode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testModeCode: '',
    hidden: true,
    pageType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pageType = options.page;
    this.setData({
      pageType: pageType
    });

    //显示隐藏下一步按钮
    if (pageType == 'first') {
      this.setData({
        hidden: false
      });
    } else if (pageType == 'sencond') {
      //记住上一次选择的检测方法
      var testModeCode = wx.getStorageSync('testModeCode');
      this.setData({
        hidden: true
      });
      if (testModeCode) {
        this.setData({
          testModeCode: testModeCode
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  toWorkRecord: function() {
    var testModeCode = this.data.testModeCode;
    if (!testModeCode) {
      wx.showModal({
        title: '提示',
        content: '请选择检测方法',
        showCancel: false,
        confirmColor: '#4cd964',
      });
      return
    } else {
      wx.setStorageSync('testModeCode', testModeCode);
    }

    wx.switchTab({
      url: '/pages/test/test'
    });
  },

  //选择检测方法
  selectTestMode: function(e) {
    var pageType = this.data.pageType;
    var testModeCode = e.target.dataset.code;
    if (pageType =='first'){
       this.setData({
         testModeCode: testModeCode
    });
    } else if (pageType =='sencond'){
      wx.setStorageSync('testModeCode', testModeCode);
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/test/test'
        });
      },1000)
     
    } 
  }
})