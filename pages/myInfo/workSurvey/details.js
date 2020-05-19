// pages/test/TestDataDetails/TestDataDetails.js
const App = getApp();
const until = require('../../../utils/util.js');
const WXAPI = require('../../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["委托基本信息", "踏勘记录"],
    activeIndex: 0,
    SurveyRecord: null,
    recordList: [],
    wtId: null,
    imageList: [],
    base64codeList: []
  },

  onLoad: function (options) {
    this.setData({
      wtId: options.Id
    });
    this.getSurveyRecordDetails(this.data.wtId);
  },

  tabClick: function (e) {
    var curIndex = e.currentTarget.id;
    this.setData({
      activeIndex: curIndex
    });
  },
  onPullDownRefresh: function () {
    this.getSurveyRecordDetails(this.data.wtId);
  },

  //获取指定数据详情
  getSurveyRecordDetails: function (id) {
    var that = this;
    var queryData = {
      'Id': id
    }
    wx.showLoading({
      title: '加载中',
    });

    WXAPI.SurveyRecordDetails(queryData).then(res => {
      var resData = res.result;
      that.setData({
        SurveyRecord: resData,
        recordList: resData.recordList
      });
      wx.hideLoading();
    })
  },
  toTestList: function () {
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  toAddRecord: function () {
    var id = this.data.wtId;
    wx.navigateTo({
      url: '/pages/myInfo/workSurvey/add?Id=' + id
    })
  },

  //获取图片base64
  getPicBase64(hash) {
    return WXAPI.GetPic(hash).then(res => {
      return res.result
    })
  },
  //点击查看图片
  toPreviewImg: function (e) {
    var that = this;
    var hashList = e.currentTarget.dataset.list;
    if (hashList.length != 0) {
      var urls=[];
      for (var i = 0; i < hashList.length; i++) {
        var host =  wx.getStorageSync('rshostName');
        var url = host+'/api/Resurce/FileResult/'+hashList[i];
        urls.push(url)
      }
      wx.previewImage({
        current: urls[0],
        urls:urls,
        success:function(data){
          console.log(data)
        },
        fail:function(err){
          console.log(err)
        }
      })
    }
  }
})