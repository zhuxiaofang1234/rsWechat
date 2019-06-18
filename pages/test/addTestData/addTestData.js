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
    testLoad: '',
    pileBearing: '',
    height1: '',
    height2: '',
    showTopTips: false,
    erroInfo: "错误提示",
    baseInfoId: "",
    gpsIsValid: false,
    gpstext: 'GPS无效',
    gpsLongitude: '',
    gpsLatitude: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGps();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.getbaseInfoId();

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
    console.log(testTypeCode[e.detail.value]);
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
      wx.setStorageSync('dGrade', data.dGrade);
    }

    var baseInfoId = this.data.baseInfoId;
    data.baseInfoId = baseInfoId;
    wx.setStorageSync('baseInfoId', baseInfoId);
    data.serialNo = wx.getStorageSync('serialNo');
    data.rdjlx = this.data.rdjlxCode;
    data.testType = this.data.testTypeCode;
    data.dValue = this.data.pileBearing;
    data.djsjbg = this.data.height1;
    var nowDate = new Date();
    data.testTime = App.format(nowDate);

    //GPS位置
    if (!gpsIsValid) {
      data.gpsIsValid = 0;
    } else {
      data.gpsIsValid = 1;
      data.gpsLongitude = this.data.gpsLongitude;
      data.gpsLatitude = this.data.gpsLatitude;
    }
    this.submit(data);
    //跳转到试验采样记录
    // wx.navigateTo({
    //   url: '/pages/test/addTestData/testRecord',
    // })
  },
  //提交数据
  submit: function(data) {
    var accessToken = wx.getStorageSync('accessToken');
    var host = App.globalData.host;
    var that = this;

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
              wx.navigateTo({
                url: '/pages/test/addTestData/testRecord',
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
    var accessToken = wx.getStorageSync('accessToken');
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
          wx.showModal({
            title: '登录过期',
            content: '请重新登录',
            showCancel: false,
            confirmColor: '#4cd964',
            success: function() {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          })
        }
      }
    })
  },
  //打开GPS
  switchChange: function(e) {
    var GPSIspen = e.detail.value;
    if (GPSIspen) {
      this.getGps();
    } else {
      this.setData({
        gpsIsValid: false,
        gpstext: 'GPS无效'
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
        console.log(latitude);
      },
      fail: function() {
        that.setData({
          gpsIsValid: false,
          gpstext: 'GPS无效',
        });
      }
    })
  },
  cancel: function() {
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