// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileNo: '请选择孔号',
    showTopTips: false,
    erroInfo: "错误提示",
    baseInfoId: "",
    detailsData:null,
    endHoleInfo:null,
    holeId:null
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
    this.getbaseInfoId();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var detailsData = this.data.detailsData,
        holeId = this.data.holeId;
    if (detailsData){
         //加载该孔的详情信息
      if (detailsData.id != holeId){
        this.setData({
          holeId: detailsData.id
        });
        this.getHoleDetailInfo(detailsData.id);
      }
    }
    console.log(this.data.detailsData);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
 
  //检测数据唯一标识
  getbaseInfoId: function () {
    var that = this;
    WXAPI.UUIDGenerator().then(res => {
      that.setData({
        baseInfoId: res[0],
      });
    })
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
  
  //跳转到添加钻进记录
  toAddZXTestData:function(){
     var url = '/pages/AddZXRecordData/AddZXRecordData?id='
    this.isNavigateTo(url)
  },
  //跳转到终孔操作
  toEndHole:function(){
    var url = '/pages/EndHole/EndHole?id=';
    this.isNavigateTo(url);

  },
 //跳转现场编录表
  toZXSceneRecord:function(){
    var url = '/pages/ZXSceneRecordData/ZXSceneRecordData?id=';
    this.isNavigateTo(url);
  },
  //是否跳转
  isNavigateTo:function(_url){
    var detailsData = this.data.detailsData;
    if (detailsData) {
      var id = detailsData.id;
      if (id) {
        if (detailsData) {
          wx.navigateTo({
            url: _url + id
          })
        }
      }
    } else {
      wx.showModal({
        title: '操作提示',
        content: '请先选择孔号',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    } 
  },
  //获取孔的详情信息
  getHoleDetailInfo:function(holeId){
    var queryData = {
      Id: holeId
    };
    WXAPI.GetHoleDetailsInfo(queryData).then(res=>{ 
      //缓存孔的基本信息
      wx.setStorageSync('ZXHoleDetails', res.result);
    }) 
  },
  cancel: function () {
    App.back();
  },
})