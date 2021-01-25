// pages/EditZXSample/index.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ZXForceLayer: null,
    weatheringDegreeType:[
      '强风化',
      '中风化',
      '弱微风化',
      '强~中风化',
      '强~弱微风化',
      '中~弱微风化'
    ],
    rockType:[
      '灰色可塑状粉质粘土',
      '灰色、浅灰色可塑状粉质粘土',
      '灰色、灰黑色软塑状淤泥质粘土',
      '黄色微风化细、中砂岩',
      '红褐色弱微风化泥灰岩',
      '红褐色可塑状粉质粘土',
      '黄褐色可塑状粉质粘土',
      '黑色粉砂粘土',
      '灰色淤泥',
      '红褐色弱微风化泥质粉砂岩'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ZXForceLayer  = JSON.parse(options.ZXForceLayer);
    this.setData({
      ZXForceLayer: ZXForceLayer,
      weatheringDegree:ZXForceLayer.weatheringDegree,
      type:ZXForceLayer.type
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

   //风化程度
   bindweatherChange:function(e){
    var index = e.detail.value;
    this.setData({
      weatheringDegree:this.data.weatheringDegreeType[index]
    })
  },

 //岩土类别
  bindrockTypeChange:function(e){
    var index = e.detail.value;
    this.setData({
      type:this.data.rockType[index]
    })
  },

  //提交修改的取样深度
  reg: function (e) {
    var data = e.detail.value;
    var ZXForceLayer = this.data.ZXForceLayer;
    var that = this;
    var erroInfo;
    var index = data.index;
    var startPosition = data.startPosition;
    var endPosition = data.endPosition;

    if (!index) {
      erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(index)) {
      erroInfo = "取样编号请输入整数";
      this.errorTips(erroInfo);
      return
    }
    if (!startPosition) {
      erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(startPosition)) {
      erroInfo = "深度起始位置只能是数值";
      this.errorTips(erroInfo);
      return
    }
    if (!endPosition) {
      erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(endPosition)) {
      erroInfo = "深度终止位置只能是数值";
      this.errorTips(erroInfo);
      return
    }
    if (!data.weatheringDegree) {
      erroInfo = "请填写风化程度";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.type) {
      erroInfo = "请填写岩土类别";
      this.errorTips(erroInfo);
      return;
    }
    data.id = ZXForceLayer.id;
    data.index = index;
    data.zxHoleId = ZXForceLayer.zxHoleId;
    data.startPosition = startPosition;
    data.endPosition = endPosition;
    this.UpdateZxHoleForceLayer(data);
  },
  //更新钻芯取样深度
  UpdateZxHoleForceLayer: function (data) {
    wx.showLoading({
      title: '保存中....',
    })
    WXAPI.UpdateZxHoleForceLayer(data).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {
          //更新孔的基本信息
          var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
          var zxHoleForceLayerList = ZXHoleDetails.zxHoleForceLayerList;
          //根据id找出修改元素的位置
          var currentIndex;
          for (var i = 0; i < zxHoleForceLayerList.length; i++) {
            if (zxHoleForceLayerList[i].id == data.id) {
              currentIndex = i
            }
          }
          zxHoleForceLayerList.splice(currentIndex, 1, data);
          //返回上一页并刷新页面 
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            ZxHoleForceLayerList: zxHoleForceLayerList
          });
          wx.navigateBack({
            delta: 1 //想要返回的层级
          })
          //更新缓存孔的信息
          wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)
        }
      });

    }, err => {
      wx.hideLoading();
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
  }
})