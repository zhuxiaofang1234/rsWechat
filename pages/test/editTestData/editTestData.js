// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testType: ["N10轻型", "N63.5重型", "N120超重型"],
    testTypeCode:'',
    testTypeIndex:'',
    rdjlx: ["一般黏性土", "黏性素填土", "粉土、粉细砂土"],
    rdjlxCode: '',
    rdjlxIndex: '',
    dGrade: '',
    pileNo: '',
    orderNo: '',
    jcqsbg: '', //检测起始标高
    dValue:'',  //地基承载力特征值
    showTopTips: false,
    erroInfo: "错误提示",
    baseInfoId: "",
    machineId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取实验基本信息 
   var  ZTBaseData = wx.getStorageSync('ZTBaseData');
    //根据值找出测试类型的位置
    var testTypeCode = [10, 63, 120];
    var testTypeIndex = testTypeCode.indexOf(ZTBaseData.testType);

    this.setData({
      pileNo: ZTBaseData.pileNo,
      orderNo: ZTBaseData.orderNo,
      machineId: ZTBaseData.machineId,
      jcqsbg: ZTBaseData.jcqsbg,
      baseInfoId: ZTBaseData.baseInfoId,
      dValue: ZTBaseData.dValue,
      dGrade: ZTBaseData.dGrade,
      testTypeCode: ZTBaseData.testType,
      testTypeIndex: testTypeIndex,
      rdjlxCode: ZTBaseData.rdjlx,
      rdjlxIndex: ZTBaseData.rdjlx,
      serialNo: ZTBaseData.serialNo,
      testTime: ZTBaseData.testTime 
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
  //测试类型
  bindTestTypeChange: function (e) {
    var testTypeCode = [10, 63, 120];
    this.setData({
      testTypeIndex: e.detail.value,
      testTypeCode: testTypeCode[e.detail.value]
    })
  },
  //天然地基岩土性状
  bindRdjlxTypeChange: function (e) {
    this.setData({
      rdjlxIndex: e.detail.value,
      rdjlxCode: e.detail.value
    });
  },
  //提交表单
  reg: function (e) {
    var data = e.detail.value;
    var gpsIsValid = this.data.gpsIsValid;
    var erroInfo;
    if (!data.orderNo) {
      erroInfo = "请填写现场记录号";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.machineId) {
      erroInfo = "请填写设备编号";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.dGrade) {
      erroInfo = "请填写每级测试深度值";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.dGrade)) {
      erroInfo = "每级测试深度值只能为数值";
      this.errorTips(erroInfo);
      return;
    } else {
      this.setData({
        dGrade: data.dGrade
      });
    }

    if (!data.dValue) {
      erroInfo = "请填写设计承载力特征值";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.dValue)) {
      erroInfo = "设计承载力特征值只能为数值";
      this.errorTips(erroInfo);
      return;
    }

    if (!data.jcqsbg) {
      erroInfo = "请填写检测起始标高";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.jcqsbg)) {
      erroInfo = "检测起始标高只能为数值";
      this.errorTips(erroInfo);
      return;
    }

    data.baseInfoId = this.data.baseInfoId;
    data.serialNo = this.data.serialNo;
    data.dGrade = parseFloat(this.data.dGrade);
    data.rdjlx = this.data.rdjlxCode;
    data.testType = this.data.testTypeCode;
    data.dValue = data.dValue; //地基承载力特征值
    data.jcqsbg = data.jcqsbg; //检测起始标高
    data.dGroup =[2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    data.testTime = this.data.testTime;
    this.submit(data);
  },
  //提交数据
  submit: function (data) {
    var that = this;
    WXAPI.UpDateZTDataBaseData(data).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 3000,
        mask: true,
        success: function () {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          var  preDetail =  prevPage.details;
          // console.log(preDetail);
          
          // preDetail.pileNo = data.pileNo;
          // preDetail.orderNo = data.orderNo;
          // preDetail.machineId = data.machineId;
          // preDetail.testType = data.testType;
          // preDetail.machineId = data.machineId;
          // preDetail.rdjlx = data.rdjlx;
         
          // preDetail.dValue = data.dValue; //地基承载力特征值
          // preDetail.jcqsbg = data.jcqsbg; //检测起始标高

          // prevPage.setData({
          //   detail: preDetail
          // });
          prevPage.getTestDatadetails(data.baseInfoId);
           App.back();  
        }
      })
    }, err => {
      wx.showModal({
        title: '操作失败',
        content: '当前状态已锁定',
        showCancel: false,
        confirmColor: '#4cd964'
      })
    });
  },

  cancel: function () {
    App.back();
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
  }
})