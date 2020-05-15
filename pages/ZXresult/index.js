// pages/ZXresult/index.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    zxGatherInfo: "",
    ZXHoleDetails: "",
    labelText: "",
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
    //钻芯汇总信息
    var zxGatherInfo = wx.getStorageSync('zxGather');

    //钻芯孔的基本信息
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    console.log(ZXHoleDetails);  

    this.setData({
      zxGatherInfo: zxGatherInfo,
      ZXHoleDetails: ZXHoleDetails,
      id: ZXHoleDetails.id
    });
    if (zxGatherInfo.pileType == 0) { //混凝土
      this.getPileXyDescribe(zxGatherInfo);
    } else { //搅拌桩
      this.getZJXyDescribe(zxGatherInfo);
    }
    this.getRockXyDescribe();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //表单
  reg: function (e) {
    var hzInfo = this.data.zxGatherInfo;
    console.log(hzInfo);
    var data = e.detail.value;
    var pileXyDescribe = data.pileXyDescribe;
    var erroInfo;
    if (!pileXyDescribe) {
      erroInfo = "请填写混凝土芯样汇总描述";
      this.errorTips(erroInfo);
      return;
    }
    hzInfo.pileXyDescribe = pileXyDescribe;
    hzInfo.rockXyDescribe = data.rockXyDescribe;
    console.log(hzInfo);
    this.submitZXgatherInfo(hzInfo);
  },
  //桩芯样描述
  getPileXyDescribe: function (zxGatherInfo) {
    //芯样缺陷描述+芯样情况
    var zxHoleCoreDefectList = this.data.ZXHoleDetails.zxHoleCoreDefectList;
    var PileXyDescribe = "";
    var str = zxGatherInfo.coreSample + ',' + '骨料分布' + zxGatherInfo.aggregateCover + ',' + '胶结' + zxGatherInfo.cementation + ',' +
      '侧表面' + zxGatherInfo.sideSurface+'。';
      console.log(str);

    if (zxHoleCoreDefectList.length != 0) {
      zxHoleCoreDefectList.forEach(function (item) {
        PileXyDescribe += '孔深在' + item.startPosition + '~' + item.endPosition + 'm段芯样侧面' + item.type + ';'
      });
      PileXyDescribe += '其余砼芯' + str;
    } else {
      PileXyDescribe += '所有砼芯' + str
    }
    console.log(PileXyDescribe);
    this.setData({
      pileXyDescribe: PileXyDescribe
    });
  },

  //搅拌桩芯样描述
  getZJXyDescribe: function (zxGatherInfo) {
    var PileXyDescribe = "";
    var zxHoleCoreDefectList = this.data.ZXHoleDetails.zxHoleCoreDefectList;
    console.log(zxHoleCoreDefectList);
    var str = zxGatherInfo.coreState + ',' + '断口' + zxGatherInfo.fracture + ',' + '水泥搅拌' + zxGatherInfo.cementSoilMixing + ',' +
      '胶结' + zxGatherInfo.cementation+','+zxGatherInfo.other;
    if (zxHoleCoreDefectList.length != 0) {
      zxHoleCoreDefectList.forEach(function (item) {
        PileXyDescribe += '孔深在' + item.startPosition + '~' + item.endPosition + 'm段芯样侧面' + item.type + ';'
      });
      PileXyDescribe += '其余芯样' + str;
    } else {
      PileXyDescribe += '芯样' + str
    }
    this.setData({
      pileXyDescribe: PileXyDescribe
    });
  },

  //岩层芯样描述
  getRockXyDescribe: function () {
    var rockXyDescribe = "";
    var zxHoleForceLayerList = this.data.ZXHoleDetails.zxHoleForceLayerList;
    if (zxHoleForceLayerList.length != 0) {
      rockXyDescribe += zxHoleForceLayerList[0].weatheringDegree + zxHoleForceLayerList[0].type + zxHoleForceLayerList[0].describition
    }
    this.setData({
      rockXyDescribe: rockXyDescribe
    });
  },

  //更新孔的汇总信息
  submitZXgatherInfo: function (hzInfo) {
    var data = {};
    data.id = this.data.id;
    data.hzInfo = hzInfo;
    wx.showLoading({
      title: '提交中...',
    })
    
    WXAPI.UpdateHole(data).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function (res) {
        }
      })
    })
  }
})