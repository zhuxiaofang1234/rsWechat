// pages/test/addTestData/testList.js
const WXAPI = require('../../utils/main.js');
const Until = require('../../utils/util.js');
/*选择测点号的桩列表 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileList: [],
    loadingPage: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var wtId = options.wtId,
      equipList = JSON.parse(options.equipList);
    console.log(equipList)
    this.setData({
      wtId: options.wtId,
      equipList: equipList,
      type:options.type,
    });
    //加载设备列表
    this.GetDeviceList(wtId);
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

  //选择测点号
  radioChange: function (e) {
    var DeviceId = e.detail.value;
    this.getCheckDeviceList(DeviceId)
  },

  getCheckDeviceList: function (DeviceId) {
    var DeviceList = this.data.DeviceList;
    var that = this;
    for (var i = 0, len = DeviceList.length; i < len; ++i) {
      var id = DeviceList[i].id;
      if (id == DeviceId) {
        DeviceList[i].checked = !DeviceList[i].checked
      }
    }
    this.setData({
      DeviceList: DeviceList
    });
  },

  //获取设备列表
  GetDeviceList: function (wtId) {
    var that = this;
    WXAPI.GetDeviceList(this.data.type,wtId).then(res => {
      var DeviceList = res.result;
      var DeviceId = that.data.DeviceId;
      that.setData({
        loadingPage: false,
        DeviceList: DeviceList
      });
      that.defalutSelectedDeviceList();
    })
  },

  //设置默认选中
  defalutSelectedDeviceList: function () {
    var DeviceList = this.data.DeviceList;
    var equipList = this.data.equipList;
    var that = this;
    for (var i = 0, len = DeviceList.length; i < len; ++i) {
      var id = DeviceList[i].id;
      for (var j = 0; j < equipList.length; j++) {
        if (id == equipList[j].equipId) {
          DeviceList[i].checked = true
        }
      }
    }
    this.setData({
      DeviceList: DeviceList
    });
  },

  //选择设备
  toSelectDevice: function () {
    let pages = getCurrentPages(); //页面对象
    let prevpage = pages[pages.length - 2]; //上一个页面对象
    console.log(this.data.DeviceList);
    let selectedDeviceList = this.data.DeviceList.filter(function (item) {
      return item.checked == true
    })
    if (selectedDeviceList.length == 0) {
      wx.showToast({
        title: '请选择设备',
      })
      return
    }
    console.log(this.data.equipList);
    console.log(selectedDeviceList);
    var selectedEquipList = [];
    for (var i = 0; i < selectedDeviceList.length; i++) {
      var item = {};
      item.equipId = selectedDeviceList[i].id;
      item.equipName = selectedDeviceList[i].sbName;
      item.equipNo = selectedDeviceList[i].sbCode;
      item.equipArchiveNo = selectedDeviceList[i].sbGuige;
      selectedEquipList.push(item)
    }
    prevpage.setData({
      equipList: selectedEquipList
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  toCancel:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})