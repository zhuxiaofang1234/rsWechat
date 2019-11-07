// pages/test/addTestData/addTestData.js
const App = getApp();
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
    pileNo: '请选择测点号',
    orderNo: '',
    pileBearing: '',
    height1: '',
    height2: '',
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

    var baseInfoId = this.data.baseInfoId;
    data.baseInfoId = baseInfoId;
    data.serialNo = wx.getStorageSync('serialNo');
    data.foundationType = wx.getStorageSync('foundationType');
    data.rdjlx = this.data.rdjlxCode;
    data.testType = this.data.testTypeCode;
    data.dValue = this.data.pileBearing;
    data.djsjbg = this.data.height1;
    var nowDate = new Date();
    data.testTime = App.format(nowDate);
    
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
    this.submit(data);
  },
  //提交数据
  submit: function(data) {
    var accessToken = App.globalData.accessToken;
    var host = App.globalData.host;
    var that = this;
    var dGrade = this.data.dGrade;

  

    // 成功跳转的页面
    wx.request({
      url: host + '/api/services/app/ZTData/Create',
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 3000,
            mask: true,
            success: function() {
              //跳转到试验采样记录
              wx.setStorageSync('isTesting', 1);
              //清除上一条的试验记录数据
              wx.removeStorageSync('lastDepthData');
              //缓存基本数据
              wx.setStorageSync('BaseTestData', data);

              wx.navigateTo({
                url: '/pages/test/addTestData/testRecord'
              })
            }
          })
        } else {
          wx.showModal({
            title: '操作失败',
            content: '当前状态已锁定',
            showCancel: false,
            confirmColor: '#4cd964'
          })
        }
      },
      fali() {
        console.log('接口调用失败');
      }
    })
  },
  //检测数据唯一标识
  getbaseInfoId: function() {
    var that = this;
    var host = App.globalData.host;
    var accessToken = App.globalData.accessToken;
    var url = host + '/api/Tools/UUIDGenerator';
    wx.request({
      url: url,
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + accessToken
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            baseInfoId: res.data[0],
          });
        } else if (res.statusCode == 401) {
          var content = '登录过期，重新登录？';
          App.redirectToLogin(content);
        }
      }
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
  }
})