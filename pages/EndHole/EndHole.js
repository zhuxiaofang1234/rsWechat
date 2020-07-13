// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    EndHoleReson: ["钻到钢筋", "偏出桩外", "涌砂", '砼胶结质量差','达到预定深度','其他'],
    reasonIndex:4,
    isShowEndHole:true,
    endHoleRemark:"达到预定深度",
    endTime:"",
    innerEndTime:"",
    holeId:null,
    otherEndHoleReason:"",
    currentTime:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
  
    var date = new Date();
    var endTime = App.format(date);
    this.setData({
      endTime: endTime.substring(0,10),
      currentTime: endTime.substring(endTime.length - 9),
      innerEndTime: endTime,
      holeId:ZXHoleDetails.id,
      tongLength:ZXHoleDetails.tongLength,
      holeLength:ZXHoleDetails.holeLength
    });

    //展示终孔操作信息
    var endHoleRemark = ZXHoleDetails.endHoleRemark;
    var isEndHole;
    if(endHoleRemark){
      isEndHole = true;
    }else{
      isEndHole = false;
    }
    this.setData({
      isEndHole:isEndHole,
      ZXHoleDetails:ZXHoleDetails
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
  
  //终孔时间
  bindEndTimeChange: function (e) {
    var date = e.detail.value;
    this.setData({
      endTime: date,
      innerEndTime: date + currentTime
    })
  },
  //终孔原因
  bindEndHoleResonChange:function(e){
    var reasonIndex = e.detail.value;
    this.setData({
      reasonIndex: reasonIndex,
      endHoleRemark: this.data.EndHoleReson[reasonIndex]
    });
    if(reasonIndex==5){
      this.setData({
        isShowEndHole:false
      });
    }else{
      this.setData({
        isShowEndHole: true
      });
    }
  },
  //提交表单
  reg: function (e) {
    var data = e.detail.value;
    var erroInfo;
    if (!data.tongLength) {
      erroInfo = "请填写实际桩长";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.tongLength)){
      erroInfo = "实际桩长只能为数值";
      this.errorTips(erroInfo);
      return;
    } 
    if (!data.holeLength) {
      erroInfo = "请填实际孔深";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.holeLength)) {
      erroInfo = "实际孔深只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    //终孔原因
    var reasonIndex = this.data.reasonIndex;
    if (reasonIndex==5){
      if (!data.otherEndHoleReason) {
        erroInfo = "请填写终孔原因";
        this.errorTips(erroInfo);
        return;
      }else{
        data.endHoleRemark = data.otherEndHoleReason
      }
    }else{
      data.endHoleRemark = this.data.endHoleRemark
    }
    data.id = this.data.holeId
    data.endTime = this.data.innerEndTime 
    this.submit(data);
  },
 
  //提交终孔操作
  submit:function(data){
    var that = this;
    WXAPI.EndHole(data).then(res=>{
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {
          that.cancel();
        }
      })
    })   
  },
  //返回上一级
  cancel: function () {
    App.back()
  }
})