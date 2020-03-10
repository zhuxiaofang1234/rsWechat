// pages/test/addTestData/testList.js
const WXAPI = require('../../../utils/main.js')
/*选择测点号的桩列表 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileList: [],
    hasVaildPile: false,
    loadingPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var TestModeCode = wx.getStorageSync('testModeCode');
    var SerialNo = wx.getStorageSync('serialNo');
    this.setData({
      TestModeCode: TestModeCode,
      SerialNo:SerialNo,
      loadingPage: false
    });
    if (TestModeCode == 'ZG' || TestModeCode == 'ZJ' || TestModeCode == 'ZY') {
     setTimeout(()=>{
       that.getPileList()
     },500)
    
    }  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var TestModeCode = this.data.TestModeCode;
    if (TestModeCode == 'TQ' || TestModeCode == 'TZ') {
      var pileList = wx.getStorageSync('pileList');
      setTimeout(()=>{
        this.filterPileList(pileList);
        this.setData({
          pileList: pileList,
          loadingPage: true
        });  
      },500);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  //选择测点号
  radioChange: function(e) {
    var pileList = this.data.pileList;
    for (var i = 0, len = pileList.length; i < len; ++i) {
      var id = pileList[i].id ? pileList[i].id : pileList[i].basicInfoId
      pileList[i].checked = id == e.detail.value;
    }
    this.setData({
      pileList: pileList
    });
    this.getPointInfo(e.detail.value);
  },
  //根据id获取选择测点的信息
  getPointInfo: function(id) {
    var pileList = this.data.pileList;
    for (var i = 0, len = pileList.length; i < len; ++i) {
      var pileId = pileList[i].id ? pileList[i].id : pileList[i].basicInfoId;
      if (pileId == id) {
        //返回上一页并刷新页面 
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];

        var obj={};
        var TestModeCode = this.data.TestModeCode
        switch (TestModeCode){
          case 'ZG':
          case 'ZJ':
          case 'ZY':
            obj = this.refreshZXPile(pileList[i])
            prevPage.setData({
              detailsData: obj
            });
          break;
          case 'TQ':
          case 'TZ':
            obj = this.refreshZTPile(pileList[i]);
            prevPage.setData(obj);
        }
       
        setTimeout(function() {
          wx.navigateBack({
            delta: 1 //想要返回的层级
          })
        }, 100)
      }
    }
  },
  //过滤桩列表
  filterPileList: function(pileList) {
    if (pileList.length != 0) {
      for (var item in pileList) {
        if (pileList[item].pileNo != "") {
          this.setData({
            hasVaildPile: true
          });
        }
      }
    }
  },
  toUpdateTestList: function() {
    wx.navigateTo({
      url: '/pages/test/testList/testList',
    })
  },
  //获取待检测的桩列表
  getPileList: function() {
    var that = this;
    var queryData = {
      'IsTesting': 1,
      'SerialNo': this.data.SerialNo
    };
    WXAPI.GetZXPileList(queryData).then(res => {
      var resData = res.result;
      that.setData({
        loadingPage: true
      });
      if (resData.length!=0){
        that.setData({
          hasVaildPile: true,
          pileList: resData,
        });
      }
    }, err => {
      that.setData({
        loadingPage: true
      });
    });
  },
  //更新触探数据
  refreshZTPile: function (pileList){
    var  obj = {
      id: pileList.id,
      pileNo: pileList.pileNo,
      pileBearing: pileList.pileBearing,
      height1: pileList.height1,
      height2: pileList.height2
    }
    return obj
  },
  //更新钻芯数据
  refreshZXPile: function (pileList){
    var obj = {
      id: pileList.basicInfoId,
      serialNo: this.data.SerialNo,
      pileNo: pileList.pileNo,
      pileBearing: pileList.pileBearing, //单桩承载力特征值
      tempStr4: pileList.tempStr4, //沉渣厚度
      pileDiameter: pileList.pileDiameter, //桩径(mm)
      pileType: pileList.pileType
    }
    return obj
  }
})