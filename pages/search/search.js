// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: ""
  },
  showInput:function(){
   this.setData({
     inputShowed: true, 
   });
  },
  hideInput:function(){
    this.setData({
      inputShowed: false,
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
})