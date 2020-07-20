const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    testModeList: [],
    hasVaildPile: true,
    loadingPage: true,
    pageFlag: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const TestModeGroup = util.TestModeGroup;
    var jobScope = wx.getStorageSync('jobScope');
    //根据工作范围筛选出检测方法
    var filterTestModeGroup = [];
    var map = [];
    for (var i = 0; i < TestModeGroup.length; i++) {
      var TestModeGroupItem = TestModeGroup[i];
      if (TestModeGroupItem.children.length !== 0) {
        for (var j = 0; j < TestModeGroupItem.children.length; j++) {
          var key = TestModeGroupItem.children[j].code;
          if (jobScope.indexOf(key) !== -1) {
            var item = {};
            var n = TestModeGroupItem.code;
            item.code = TestModeGroupItem.code;
            item.name = TestModeGroupItem.name;
            item.children = [];

            if (!map[n]) { //如果不存在
              map[n] = TestModeGroupItem.code;
              item.children.push(TestModeGroupItem.children[j]);
              filterTestModeGroup.push(item)
            } else {
              for (var k = 0; k < filterTestModeGroup.length; k++) {
                var aj = filterTestModeGroup[k];
                if (aj.code == n) {
                  filterTestModeGroup[k].children.push(TestModeGroupItem.children[j])
                }
              }
            }
          }
        }
      }
    }
    this.setData({
      loadingPage: true, //显示加载页面
      TestModeGroup: filterTestModeGroup
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
    var that = this;
    var testCode = e.detail.value;
    var TestModeGroup = this.data.TestModeGroup;
    var selectedTestModeName, selectTestCode;
    for (var i = 0, len = TestModeGroup.length; i < len; i++) {
      for (var j = 0, length = TestModeGroup[i].children.length; j < length; j++) {
        var childrenItem = TestModeGroup[i].children[j];
        var code = childrenItem.code;
        childrenItem.checked = code == testCode
        if (code == testCode) {
          selectedTestModeName = childrenItem.name;
          selectTestCode = code;
        }
      }
    }
    that.setData({
      TestModeGroup: TestModeGroup
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