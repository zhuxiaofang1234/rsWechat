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
    pileData: null,
    holeData: null,
    endHoleInfo: null,
    holeId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var SerialNo = wx.getStorageSync('serialNo');
    this.setData({
      SerialNo: SerialNo
    });
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
    var holeData = this.data.holeData;
    if (holeData) {
      var holeId = holeData.id;
      this.setData({
        holeId: holeId
      });
      //加载孔的详情信息
      if (holeId) {
        this.getHoleDetailInfo(holeId);
      }
    }
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

  //选择孔号
  toChoseHole: function (e) {
    var pileData = this.data.pileData;
    if (pileData && pileData.id) {
      wx.navigateTo({
        url: '/pages/HoleList/index?pileId=' + pileData.id,
      })
    } else {
      wx.showModal({
        title: '操作提示',
        content: '请先选择桩号',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    }
  },

  //跳转到添加钻进记录
  toAddZXTestData: function () {
    if (this.data.pileData && this.data.pileData.id) {
      var pileId = this.data.pileData.id
      var holeId = this.data.holeId;

      if (holeId) {
        // var url = '/pages/AddZXRecordData/AddZXRecordData?pileId='+ pileId +'&holeId='+holeId;
        var url = '/pages/ZXRecordList/index?pileId=' + pileId;


        this.isNavigateTo(url)
      } else {
        wx.showModal({
          title: '操作提示',
          content: '请先选择孔号',
          showCancel: false,
          confirmColor: '#4cd964'
        })
      }
    } else {
      wx.showModal({
        title: '操作提示',
        content: '请先选择桩号',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    }
  },
  //跳转到终孔操作
  toEndHole: function () {
    var url = '/pages/EndHole/EndHole?id=';
    this.isNavigateTo(url);

  },
  //跳转现场编录表
  toZXSceneRecord: function () {
    var url = '/pages/ZXSceneRecordData/ZXSceneRecordData?id=';
    this.isNavigateTo(url);
  },
  //是否跳转
  isNavigateTo: function (_url) {
    var holeId = this.data.holeId;
    if (holeId) {
      wx.navigateTo({
        url: _url
      })
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
  getHoleDetailInfo: function (holeId) {
    var queryData = {
      Id: holeId
    };
    WXAPI.GetHoleDetailsInfo(queryData).then(res => {
      //缓存孔的基本信息
      wx.setStorageSync('ZXHoleDetails', res.result);
    })
  },
  cancel: function () {
    App.back();
  },
})