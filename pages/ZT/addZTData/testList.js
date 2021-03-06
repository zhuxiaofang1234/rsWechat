// pages/test/addTestData/testList.js
const WXAPI = require('../../../utils/main.js');
const Until = require('../../../utils/util.js');
/*选择测点号的桩列表 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileList: [],
    pileListStore: [],
    hasVaildPile: true,
    loadingPage: true,
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var TestModeCode = wx.getStorageSync('testModeCode');
    var SerialNo = wx.getStorageSync('serialNo');
    this.setData({
      TestModeCode: TestModeCode,
      SerialNo: SerialNo
    });
    //加载桩列表
    that.getPileList();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /***搜索***/
  showInput: function () {
    this.setData({
      inputShowed: true
    });
    this.setData({
      pileList: this.data.pileListStore
    });
  },
  //取消搜索
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      pileList: this.data.pileListStore
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      pileList: this.data.pileListStore
    });

  },

  search: function (e) {
    var index = parseInt(e.detail.value);
    var plieList = this.data.pileList;
    var newPlieList = [];
    var newPlieList = plieList.filter(function (item) {
      return item.index == index
    });
    this.setData({
      inputVal: e.detail.value,
      pileList: newPlieList
    });
  },

  //选择测点号
  radioChange: function (e) {
    var pileList = this.data.pileList;
    for (var i = 0, len = pileList.length; i < len; ++i) {
      var id = pileList[i].id;
      pileList[i].checked = id == e.detail.value;
    }
    this.setData({
      pileList: pileList
    });
    this.getPointInfo(e.detail.value);
  },
  //根据id获取选择测点的信息
  getPointInfo: function (id) {
    var pileList = this.data.pileList;
    for (var i = 0, len = pileList.length; i < len; ++i) {
      var pileId = pileList[i].id;
      if (pileId == id) {
        //返回上一页并刷新页面 
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];

        var obj = {};
        var TestModeCode = this.data.TestModeCode
        switch (TestModeCode) {
          case 'ZG':
          case 'ZJ':
          case 'ZY':
            prevPage.setData({
              pileData: pileList[i]
            });
            break;
          case 'TQ':
          case 'TZ':
            obj = this.refreshZTPile(pileList[i]);
            prevPage.setData(obj);
        }

        setTimeout(function () {
          wx.navigateBack({
            delta: 1 //想要返回的层级
          })
        }, 100)
      }
    }
  },

  toUpdateTestList: function () {
    wx.navigateTo({
      url: '/pages/test/testList/testList',
    })
  },
  //获取桩列表
  getPileList: function () {
    var that = this;
    var modeType = Until.getModeType();
    this.setData({
      modeType: modeType
    });
    var wtId = wx.getStorageSync('wtId');
    WXAPI.GetPileListByEntrustId(wtId, modeType).then(res => {
      var resData = res.result;
      console.log(resData);
      if (resData.length != 0) {
        var newPileList;
        //过滤测点号不存在的列表
        if (modeType == 'ZX') {
          newPileList = resData.filter(function (item) {
            return item.pileNo != "" && item.pileNo != "-";
          });
        } else {
          newPileList = resData.filter(function (item) {
            return item.pileAxis != "" && item.pileAxis != "-";
          });
        }
        if (newPileList.length != 0) {
          console.log(newPileList)
          that.setData({
            loadingPage: false, //隐藏加载页面  
            hasVaildPile: true, //显示有效桩列表
            pileList: newPileList.sort(this.compare('isStartTest')),
            pileListStore: newPileList.sort(this.compare('isStartTest'))
          });
        } else {
          that.setData({
            loadingPage: false,
            hasVaildPile: false //显示去完善桩列表
          });
        }
      }
    }, err => {
      that.setData({
        loadingPage: false
      });
    });
  },
  //更新触探数据
  refreshZTPile: function (pileList) {
    var obj = {
      id: pileList.id,
      pileNo: pileList.pileNo,
      pileBearing: pileList.pileBearing,
      height1: pileList.height1, //检测起始标高
      height2: pileList.height2 //地基起始标高
    }
    return obj
  },
  //更新钻芯数据
  refreshZXPile: function (pileList) {
    var obj = {
      id: pileList.id,
      serialNo: this.data.SerialNo,
      pileNo: pileList.pileNo,
      pileBearing: pileList.pileBearing, //单桩承载力特征值
      tempStr4: pileList.tempStr4, //沉渣厚度
      pileLength: pileList.pileLength, //桩长
      pileDiameter: pileList.pileDiameter, //桩径(mm)
      pileType: pileList.pileType //桩型
    }
    return obj
  },
  //数组排序
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2
    }
  }
})