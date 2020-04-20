// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    showTopTips: false,
    erroInfo: "错误提示",
    checkboxItems: [{
        name: '轻度蜂窝麻面',
        value: '0',
        checked: true
      },
      {
        name: '中度蜂窝麻面',
        value: '1'
      },
      {
        name: '重度蜂窝麻面',
        value: '2'
      },
      {
        name: '沟槽',
        value: '3'
      },
      {
        name: '骨料分布不均匀',
        value: '4'
      },
      {
        name: '芯样破碎',
        value: '5'
      },
      {
        name: '芯样松散',
        value: '6'
      },
      {
        name: '夹泥',
        value: '7'
      },
      {
        name: '夹粉状物',
        value: '8'
      },
      {
        name: '断口',
        value: '9'
      },
      {
        name: '其他',
        value: '10'
      },
    ],

    autoFocus: true,
    lastDepthData: null
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

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  }
})