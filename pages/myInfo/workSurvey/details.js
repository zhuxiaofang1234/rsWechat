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
    base64CodeList:[]
  },

  onLoad: function (options) {
    this.setData({
      wtId: options.Id
    });
    this.getSurveyRecordDetails(this.data.wtId);
  },

  tabClick: function (e) {
    var that = this;
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
      var recordList = resData.recordList;
      console.log(recordList);
  
      for (var i = 0; i < recordList.length; i++) {
        var item = recordList[i];
        var imageLength = item.imageList.length;
        if (imageLength != 0) {
          for (var j = 0; j < imageLength; j++) {
            var hash = item.imageList[j];
            that.data.base64CodeList = [];
          
            that.getPicBase64(hash).then(res=>{
              console.log(res)
            })
          }
        }
      }
    
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
  //显示图片
  previewPic: function () {
    var base64 = 'data:image/jpg;base64,' + this.data.base64Code;
    until.base64src(base64, res => {
      console.log(res) // 返回图片地址，直接赋值到image标签即可
      wx.previewImage({
        current: res,
        urls: [res]
      })
    });
  },
  //获取图片base64
  getPicBase64(hash) {
    // var that = this;
    return new Promise(function(resolve,reject){
      WXAPI.GetPic(hash).then(res => {
        resolve(res.result)
        // var base64Code = res.result
        // that.data.base64CodeList.push(base64Code);
      })
    });
    
  }
})