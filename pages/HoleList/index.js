// pages/HoleList/index.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HoleList: [],
    loadingPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pileId = options.pileId;
    if (pileId) {
      //根据桩id获取孔的列表
      WXAPI.GetHoleList(pileId).then(res => {
        this.setData({
          HoleList: res.result,
          loadingPage: true
        });
      })
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


  //选择测点号
  radioChange: function (e) {
    var HoleList = this.data.HoleList,
       holeId = e.detail.value,
       choseHoleData =[];
    for (var i = 0, len = HoleList.length; i < len; ++i) { 
      if (HoleList[i].id == holeId) {
        choseHoleData = HoleList[i];
      }
      HoleList[i].checked = HoleList[i].id == holeId;
    }
    this.setData({
      HoleList: HoleList
    });

    //返回选择孔的信息
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      holeData: choseHoleData
    });  

    setTimeout(function() {
      wx.navigateBack({
        delta: 1 //想要返回的层级
      })
    }, 100)
  }
})