// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    SideSurface:['光滑','较光滑','气孔','蜂窝麻面'],
    sideSurfaceIndex:0,
    zxCompleteItems: [
      { name: 'USA', value: '连续完整' },
      { name: 'CHN', value: '基本完整', checked: 'true' }
    ],
    AggregateCoverItems:[
      { name: 'USA', value: '均匀' },
      { name: 'CHN', value: '基本均匀', checked: 'true' }
    ],
    cementationItems:[
      { name: 'USA', value: '好' },
      { name: 'CHN', value: '较好', checked: 'true' }
    ],
    bottomStateItems: [
      { name: 'USA', value: '清晰' },
      { name: 'CHN', value: '不清晰', checked: 'true' }
    ],
    sedimentStateItems: [
      { name: 'USA', value: '无' },
      { name: 'CHN', value: '有', checked: 'true' }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  cancel: function () {
    App.back();
  },
  //错误提示
  errorTips: function (erroInfo) {
    var that = this;
    this.setData({
      showTopTips: true,
      erroInfo: erroInfo
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //开钻时间
  bindStartDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //结束时间
  bindEndDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //设计桩顶标高
  bindHeightChange: function (e) {
    var heightIndex = e.detail.value;
    this.setData({
      heightIndex: heightIndex
    });
    if (heightIndex == 1) {
      this.setData({
        isShowHeight: false
      });
    } else {
      this.setData({
        isShowHeight: true
      });
    }
  },
  //返回上一级
  cancel: function () {
    App.back()
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  }
})