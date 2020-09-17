// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testDate: '', //检测日期
    fullDate: '',
    overPileHeightItems: [{ //桩顶设计标高
        overPileHeightText: '无',
        value: 0,
        checked: 'true'
      },
      {
        overPileHeightText: '有',
        value: 1
      }
    ],
    zxHoleBaseInfo: null,
    isShowHeight: false,
    gpsIsValid: 0,
    gpstext: 'GPS无效',
    gpsLongitude: '',
    gpsLatitude: '',
    holeImageString:'',
    holeXPosition:'',
    holeYPosition:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //默认加载GPS
    this.getGps();
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    this.setData({
      height: windowHeight - 340
    });

    //获取钻芯汇总信息
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    console.log(ZXHoleDetails)
    var id = ZXHoleDetails.id;
    var pileDiameter = ZXHoleDetails.pileDiameter;
    var zxHoleBaseInfo = {};
    zxHoleBaseInfo.overhead = ZXHoleDetails.overhead; //钻机架空
    zxHoleBaseInfo.overPileHeight = ZXHoleDetails.ZXHoleDetails; //设计桩顶标高
    zxHoleBaseInfo.holeDiameter = ZXHoleDetails.holeDiameter; //孔径
    zxHoleBaseInfo.holeLength = ZXHoleDetails.holeLength; //钻孔深度
    zxHoleBaseInfo.machineId = ZXHoleDetails.machineId; //钻机编号
    zxHoleBaseInfo.shangGangZheng = ZXHoleDetails.shangGangZheng; //上岗证号码

    //获取测试时间
    const nowDate = new Date();
    const testTime = App.format(nowDate);
    //检测日期默认当前时间
    this.setData({
      id:id,
      pileDiameter:pileDiameter,
      zxHoleBaseInfo: zxHoleBaseInfo,
      testDate: testTime.substring(0, 10)
    })
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
  },

  //检测时间
  bindTestTimeChange: function (e) {
    this.setData({
      testDate: e.detail.value
    })
  },

  //设计桩顶标高
  bindHeightChange: function (e) {
    var heightIndex = e.detail.value;
    this.setData({
      heightIndex: heightIndex
    });
    if (heightIndex == 0) {
      this.setData({
        isShowHeight: false
      });
    } else {
      this.setData({
        isShowHeight: true
      });
    }
  },

  //提交表单
  reg: function (e) {
    var data = e.detail.value;
    var submitData = {};
    submitData.shangGangZheng = data.shangGangZheng;
    submitData.machineId = data.machineId;
    submitData.overhead = data.overhead; //钻机架空      
    submitData.holeDiameter = data.holeDiameter; //孔径
    var overPileHeight = data.overPileHeight;
    submitData.gpsIsValid = this.data.gpsIsValid;
    if (this.data.gpsIsValid) {
      submitData.gpsLongitude = this.data.gpsLongitude;
      submitData.gpsLatitude = this.data.gpsLatitude;
    } else {
      submitData.gpsLongitude = ""
      submitData.gpsLatitude = ""
    }

    //检测时间
    const nowDate = new Date();
    const testTime = App.format(nowDate);
    submitData.testTime = this.data.testDate + testTime.substring(10);
    var erroInfo;
    if (overPileHeight == 0) {
      submitData.overPileHeight = "无"
    } else {
      if (!data.otherOverPileHeight) {
        erroInfo = "请填写桩顶标高以上";
        this.errorTips(erroInfo);
        return;
      } else {
        submitData.overPileHeight = data.otherOverPileHeight + "m";
      }
    }
    var holeXPosition = this.data.holeXPosition;
    var holeYPosition = this.data.holeYPosition;
   
    if(holeXPosition && holeYPosition){
      submitData.holeXPosition =  holeXPosition;
      submitData.holeYPosition =  holeYPosition;
      submitData.holeImageString = this.data.holeImageString;
    }else{
      erroInfo = "请选择检测孔位置";
      this.errorTips(erroInfo);
      return;
    }

    wx.showLoading({
      title: '提交中...',
    }) 
    var zxData = {id:this.data.id};
    zxData.baseInfo = submitData;
    WXAPI.UpdateHole(zxData).then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true
      })
    })
  },

  //返回上一级
  cancel: function () {
    App.back()
  },
 
  //打开GPS
  switchChange: function (e) {
    var GPSIspen = e.detail.value;
    var that = this;
    if (GPSIspen) {
      //获得dialog组件
      this.dialog = this.selectComponent("#dialog");
      this.showDialog();
    } else {
      this.setData({
        gpsIsValid: 0,
        gpstext: 'GPS无效',
      });
    }
  },
  showDialog: function () {
    this.dialog.showDialog();
  },
  confirmEvent: function (e) {
    this.dialog.hideDialog();
  },
  //获取GPS的位置
  getGps: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          gpsLongitude: longitude,
          gpsLatitude: latitude,
          gpsIsValid: 1,
          gpstext: 'GPS有效',
        });
      },
      fail: function () {
        that.setData({
          gpsIsValid: 0,
          gpstext: 'GPS无效',
        });
      }
    })
  },
  //再次获取地理位置权限
  getSetting: function (event) {
    var that = this;
    if (!event.detail['scope.userLocation']) {
      wx.showModal({
        title: '温馨提示',
        content: '你关闭了获取用户·当前地理位置的权限',
        showCancel: false,
        success(res) {
          that.setData({
            gpsIsValid: 0,
            gpstext: 'GPS无效',
          });
        }
      })
    } else {
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