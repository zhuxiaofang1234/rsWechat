const util = require('../../utils/util.js');
const TestMode = util.TestMode;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    testModeList: [],
    hasVaildPile: true,
    loadingPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jobScope = wx.getStorageSync('jobScope');
     
    //根据工作范围筛选出检测方法
    var testModeList = [{
      "testModeName": '全部',
      "testModeCode": 'All'
    },];
    for(var key in  TestMode){
     if(jobScope.indexOf(key)!=-1){
       var item ={};
       item.testModeName = TestMode[key];
       item.testModeCode =key;
       testModeList.push(item);
     } 
    }
    this.setData({
      loadingPage: true, //显示加载页面
      testModeList:testModeList
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

  //测点列表
  testModeList: function () {

  },

  //选择测点号
  radioChange: function (e) {
    var testCode = e.detail.value;
    console.log(testCode);
    var testModeList = this.data.testModeList;
    var selectedTestModeName,selectTestCode;
    for (var i = 0, len = testModeList.length; i < len; ++i) {
      var testModeCode = testModeList[i].testModeCode;
      testModeList[i].checked = testModeCode == testCode;
      if (testModeCode == testCode) {
        selectedTestModeName = testModeList[i].testModeName;
        selectTestCode = testModeCode;
      }
    }
    this.setData({
      testModeList: testModeList
    });

    if (selectTestCode == "All") {
      selectTestCode = "";
    }

    //返回列表页，并刷新列表页
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      testModeName: selectedTestModeName,
      testModeCode: selectTestCode,
      loadingPage: false,
      testList: [],
      inputVal: '',
      page: 0,
    });
    prevPage.getPage();
    wx.navigateBack(1);
  }
})