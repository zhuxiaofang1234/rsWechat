// pages/EditZXDefact/index.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zxDefactData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      zxDefactData: JSON.parse(options.zxDefactData)
    });
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

  //提交修改的取样深度
  submitEditzxDefactData: function (e) {
    var data = e.detail.value;
    var zxDefactData = this.data.zxDefactData;
    var that = this;
    var erroInfo;
    var index = data.index;
    var startPosition = data.startPosition;
    var endPosition = data.endPosition;
    var type = data.type;
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
    if (!type) {
      erroInfo = "请填写芯样缺陷描述"
      this.errorTips(erroInfo);
      return;
    }
    data.id = zxDefactData.id;
    data.index = index;
    data.zxHoleId = zxDefactData.zxHoleId;
    data.startPosition = startPosition;
    data.endPosition = endPosition;
    data.type = type;
    this.UpdateZXDefact(data);
  },
  //更新钻芯取样深度
  UpdateZXDefact: function (data) {
    wx.showLoading({
      title: '保存中....',
    })
    WXAPI.UpdateZxHoleCoreDefect(data).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {
          //更新孔的基本信息
          var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
          var zxHoleCoreDefectList = ZXHoleDetails.zxHoleCoreDefectList;
          //根据id找出修改元素的位置
          var currentIndex;
          for (var i = 0; i < zxHoleCoreDefectList.length; i++) {
            if (zxHoleCoreDefectList[i].id == data.id) {
              currentIndex = i
            }
          }
          zxHoleCoreDefectList.splice(currentIndex, 1, data);
          //返回上一页并刷新页面 
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            zxHoleCoreDefectList: zxHoleCoreDefectList
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