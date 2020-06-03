// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../../utils/main.js');
var flag=true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testType: ["N10轻型", "N63.5重型", "N120超重型"],
    testTypeCode: 10,
    testTypeIndex: 0,
    rdjlx: ["一般黏性土", "黏性素填土", "粉土、粉细砂土"],
    rdjlxCode: 0,
    rdjlxIndex: 0,
    dGrade: 0.3,
    id:null,
    pileNo: '请选择测点号',
    orderNo: '',
    pileBearing: '', //地基承载力特征值
    height1: '', //检测起始标高
    height2: '', //
    showTopTips: false,
    erroInfo: "错误提示",
    baseInfoId: "",
    gpsIsValid: false,
    gpstext: 'GPS无效',
    gpsLongitude: '',
    gpsLatitude: '',
    machineId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   this.getGps();
    var testModeCode = wx.getStorageSync('testModeCode');
    if (testModeCode == 'TQ'){
      this.setData({
        testTypeCode: 10,
        testTypeIndex: 0,
      });
    } else if (testModeCode=='TZ'){
      this.setData({
        testTypeCode: 63,
        testTypeIndex: 1,
        dGrade: 0.1,
      });
    }
    //默认填写上次设备编号
    var machineId = wx.getStorageSync('machineId');
    if (machineId) {
      this.setData({
        machineId: machineId
      });    
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getbaseInfoId();
  },
  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function (e) {
    this.dialog.hideDialog();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  //测试类型
  bindTestTypeChange: function(e) {
    var testTypeCode = [10, 63, 120];
    this.setData({
      testTypeIndex: e.detail.value,
      testTypeCode: testTypeCode[e.detail.value]
    })
  },
  //天然地基岩土性状
  bindRdjlxTypeChange: function(e) {
    this.setData({
      rdjlxIndex: e.detail.value,
      rdjlxCode: e.detail.value
    });
  },
  //提交表单
  reg: function(e) {
    var data = e.detail.value;
    var gpsIsValid = this.data.gpsIsValid;
    var erroInfo;
    if (this.data.pileNo == '请选择测点号') {
      erroInfo = "请选择测点号";
      this.errorTips(erroInfo);
      return;
    } else {
      data.pileNo = this.data.pileNo;
    }
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
    } else if (!App.isNumber(data.dGrade)){
      erroInfo = "每级测试深度值只能为数值";
      this.errorTips(erroInfo);
      return;
    }else{
      this.setData({
        dGrade: data.dGrade
      });
    }
    if (!data.height1) {
      erroInfo = "请填写检测起始标高";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.height1)) {
      erroInfo = "检测起始标高只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.height2) {
      erroInfo = "请填写设计地基标高";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.height2)) {
      erroInfo = "设计地基标高只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.pileBearing) {
      erroInfo = "请填写设计承载力特征值";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.pileBearing)) {
      erroInfo = "设计承载力特征值只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    var baseInfoId = this.data.baseInfoId;
    data.baseInfoId = baseInfoId;
    data.testModeCode = wx.getStorageSync('testModeCode');
    data.serialNo = wx.getStorageSync('serialNo');
    data.foundationType = wx.getStorageSync('foundationType');
    data.rdjlx = this.data.rdjlxCode;
    data.testType = this.data.testTypeCode;
    data.dValue = data.pileBearing;
    data.jcqsbg = data.height1; //检测起始标高
    data.sjdjbg = data.height2; //地基设计标高
    var nowDate = new Date();
    data.testTime = App.format(nowDate);
    data.pileId = this.data.id;
    
    //存储设备编号
    wx.setStorageSync('machineId', data.machineId);

    //GPS位置
    if (!gpsIsValid) {
      data.gpsIsValid = 0;
    } else {
      data.gpsIsValid = 1;
      data.gpsLongitude = this.data.gpsLongitude;
      data.gpsLatitude = this.data.gpsLatitude;
    }
    if(flag){
      flag = false;
      this.submit(data);
    }   
  },
  //提交数据
  submit: function(data) {
    var that = this;
    WXAPI.AddZtBaseData(data).then(res=>{
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 3000,
        mask: true,
        success: function () {
          flag = true;
          //跳转到试验采样记录
          wx.setStorageSync('isTesting', 1);
          //清除上一条的试验记录数据
          wx.removeStorageSync('lastDepthData');
          //缓存基本数据
          wx.setStorageSync('BaseTestData', data);
          wx.redirectTo({
            url: '/pages/test/addTestData/testRecord'
          })
        }
      })
    },err=>{
      flag = true
    });
  },
  //检测数据唯一标识
  getbaseInfoId: function() {
    var that = this;
    WXAPI.UUIDGenerator().then(res=>{
      that.setData({
        baseInfoId: res[0],
      });
    })
  },
  //打开GPS
  switchChange: function(e) {
    var GPSIspen = e.detail.value;
    var that = this;
    if (GPSIspen) {
      //获得dialog组件
      this.dialog = this.selectComponent("#dialog");
      this.showDialog();
    } else {
      this.setData({
        gpsIsValid: false,
        gpstext: 'GPS无效',
      });
    }
  },
  //获取GPS的位置
  getGps: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          gpsLongitude: longitude,
          gpsLatitude: latitude,
          gpsIsValid: true,
          gpstext: 'GPS有效',
        });
      },
      fail: function() {
        that.setData({
          gpsIsValid: false,
          gpstext: 'GPS无效',
        });
      }
    })
  },

  cancel:function() {
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
  },
  //再次获取地理位置权限
  getSetting: function (event){  
    var that = this;
    if (!event.detail['scope.userLocation']) {
      wx.showModal({
        title: '温馨提示',
        content: '你关闭了获取用户·当前地理位置的权限',
        showCancel: false,
        success(res){
          that.setData({
            gpsIsValid: false,
            gpstext: 'GPS无效',
          });
        }
      })
    }else{
      wx.showToast({
        icon: 'success',
        title: `授权成功`,
        success(res) {
          that.getGps();
        }
      })
    }
  },
  //去编辑现场记录
  toEditTestPoint:function(){
    var id = this.data.id;
    var lastPage = 'AddTestData'
    if(id){ //测点id
      wx.navigateTo({
        url: '/pages/test/testList/EditTestPoint?id=' + id + '&lastPage=' + lastPage
      })
    }  
  }
})