// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ZXHoleDetails: '',
    zxHoleDrillingRecordList: [], //钻进记录列表
    startX: 0,
    startY: 0,
    loadingPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
   
    this.setData({
      zxHoleDrillingRecordList: ZXHoleDetails.zxHoleDrillingRecordList,
      ZXHoleDetails: ZXHoleDetails,
      pileId: options.pileId,
      holeId:ZXHoleDetails.id
   });
  },

  //添加钻芯回次记录
  toAddZXRecord:function(e){
    wx.navigateTo({
      url: '/pages/AddZXRecord/AddZXRecord?pileId='+this.data.pileId+'&holeId='+this.data.holeId,
    })
  },
  //钻芯详情信息
  toZXRecordDetails:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/ZXRecordDetails/index?id='+ id,
    })
  }
})