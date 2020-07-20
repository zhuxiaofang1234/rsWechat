const App = getApp();
const WXAPI = require('../../utils/main.js');
var flag = true;
new Page({
  /**
   * 页面的初始数据
   */
  data: {
    pileNo: "",
    showTopTips: false,
    erroInfo: "错误提示",
    pileDetails: null,
    pileItems: [],
    date: "2019-09-01",
    powerLevel: ['C15', 'C20', 'C25', 'C30', 'C35', 'C40', 'C45', 'C50', 'C55', 'C60', 'C65', 'C70', 'C75', 'C80'],
    selectPowerLevel: 'C15',
    LevelIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    //渲染空页面
    var pileItems = this.fromType();
    this.setData({
      pileItems:pileItems
    });
    this.getPileDetails(id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //提交表单
  reg: function(e) {
    var postData = this.data.pileDetails;
    var data = e.detail.value;
    var TestModeCode = wx.getStorageSync('testModeCode');
    switch (TestModeCode) {
        case 'KY':
        case 'KB':
        case 'SP':
        case 'ZP':
          this.validJZFrom(data, postData);
        break;
      case 'TQ':
      case 'TZ':
        this.validZTFrom(data, postData);
        break;
      case 'ZG':
      case 'ZJ':
      case 'ZY':
        this.validZXFrom(data, postData)
        break;
    }
  },
  //错误提示
  errorTips: function(erroInfo) {
    var that = this;
    this.setData({
      showTopTips: true,
      erroInfo: erroInfo
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //提交数据
  submit: function(data) {
    var that = this;
    var index = parseInt(data.index);
    if (flag) {
      flag = false
      WXAPI.UpdatePile(data).then(res => {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 3000,
          mask: true,
          success: function() {
            flag = true    
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; 
            var pileList = prevPage.data.pileList;
             pileList[index - 1] = data;    
              prevPage.setData({
                pileList: pileList
              });
      
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 600)
          
          }
        })
      },err=>{
        flag = true;
        var errmsg = err.data.message;
        wx.showModal({
          title: '温馨提示',
          content: errmsg,
          showCancel: false,
          confirmColor: '#4cd964'
        })  
      })
    }
  },
  cancel: function() {
    wx.navigateBack({
      delta: 1 //想要返回的层级
    })
  },

  //获取单根桩的详情信息
  getPileDetails: function(id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var queryData = {
      'Id': id
    }
    WXAPI.GetPileDetails(queryData).then(res => {
      wx.hideLoading();
      var resData = res.result;
      that.setData({
        pileDetails: resData
      });
      that.setValue(resData)
    }, err => {
      wx.hideLoading();
    })
  },
  //根据检测方法渲染页面
  fromType: function() {
    var TestModeCode = wx.getStorageSync('testModeCode');
    var pileItems = [];
    switch (TestModeCode) {
        case 'KY':
        case 'KB':
        case 'SP':
        case 'ZP':
           pileItems = [{
              'code': 'pileNo',
              'name': '桩号',
              'value': ''
            },
            {
              'code': 'pileDiameter',
              'name': '桩径(mm)',
              'value': ''
            },
            {
              'code': 'pileLength',
              'name': '桩长(m)',
              'value': ''
            },
            {
              'code': 'pileAxis',
              'name': '桩位轴线',
              'value': ''
            },
            {
              'code': 'pileDate',
              'name': '成桩日期',
              'value': ''
            },
            {
              'code': 'powerLevel',
              'name': '设计强度',
              'value': ''
            },
            {
              'code': 'pileBearing',
              'name': '单桩承载力特征值(kN)',
              'value': ''
            },
          
            {
              'code': 'testLoad',
              'name': '最大试验荷载(kN)',
              'value': ''
            },
            {
              'code': 'forceLayer',
              'name': '设计桩端持力层',
              'value': ''
            },
          ]
            break;
      case 'TQ':
      case 'TZ':
        pileItems = [{
            'code': 'pileAxis',
            'name': '轴线位置',
            'value': ''
          },
          {
            'code': 'pileBearing',
            'name': '设计地基承载力特征值(kPa)',
            'value': ''
          },
          {
            'code': 'height1',
            'name': '检测起始试验标高(m)',
            'value': ''
          },
          {
            'code': 'height2',
            'name': '设计基底标高(m)',
            'value': ''
          }
        ]
        break;
      case 'ZX':
      case 'ZG':
      case 'ZJ':
      case 'ZY':
        pileItems = [{
            'code': 'pileNo',
            'name': '桩号',
            'value': ''
          },
          {
            'code': 'tubeNumber',
            'name': '孔数',
            'value': ''
          },
          {
            'code': 'pileDiameter',
            'name': '桩径(mm)',
            'value': ''
          },
          {
            'code': 'pileType',
            'name': '桩型',
            'value': ''
          },
          {
            'code': 'pileLength',
            'name': '桩长(m)',
            'value': ''
          },
          {
            'code': 'pileAxis',
            'name': '轴线位置',
            'value': ''
          },
          {
            'code': 'pileDate',
            'name': '成桩日期',
            'value': ''
          },
          {
            'code': 'powerLevel',
            'name': '设计强度',
            'value': ''
          },
          {
            'code': 'tempStr4',
            'name': '允许沉渣厚度(cm)',
            'value': ''
          },
          {
            'code': 'pileBearing',
            'name': '单桩承载力特征值(kN)',
            'value': ''
          },
          {
            'code': 'forceLayer',
            'name': '设计桩端持力层',
            'value': ''
          },
        ]
    }
    return pileItems
  },
  //给页面赋值
  setValue: function(resData) {
    var pileItems = this.fromType();
    for (var i = 0; i < pileItems.length; i++) {
      var code = pileItems[i].code 
      if (resData.hasOwnProperty(code)) {
          //砼强度等级
          if(code==="powerLevel"){
            var powerLevel = resData[code];
            var index = this.data.powerLevel.indexOf(powerLevel);
            var slectedIndex = index == -1 ? 0 : index;
            this.setData({
              LevelIndex: slectedIndex
            });
        }
        pileItems[i].value = resData[code]
      }
    }
    this.setData({
      pileItems: pileItems
    });
  },
  //成桩日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //选择砼强度等级
  bindPowerLevelChange: function(e) {
    var LevelIndex =  e.detail.value;
    this.setData({
      LevelIndex: e.detail.value,
      selectPowerLevel: this.data.powerLevel[LevelIndex]
    });
  },

  //圆锥动力触探表单验证
  validZTFrom: function(data, postData) {
    var erroInfo;
    if (!data.pileAxis) {
      erroInfo = "请填写轴线位置";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileNo = data.pileAxis;
      postData.pileAxis = data.pileAxis;
    }
    if (!data.height2) {
      erroInfo = "请填写设计基底标高";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.height2 = data.height2;
    }
    if (!data.height1) {
      erroInfo = "请填写检测起始试验标高";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.height1 = data.height1;
    }
    if (!data.pileBearing) {
      erroInfo = "请填写地基承载力特征值";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileBearing = data.pileBearing;
    }
    this.submit(postData)
  },
  //钻芯表单验证
  validZXFrom: function(data, postData) {
    var erroInfo;
    if (!data.pileNo) {
      erroInfo = "请填写桩号";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileNo = data.pileNo;
    }
    if (!data.tubeNumber) {
      erroInfo = "请填写孔数";
      this.errorTips(erroInfo);
      return;
    } else {
      if(data.tubeNumber==0){
        erroInfo = "孔数值必须大于0";
        this.errorTips(erroInfo);
        return;
      }
      postData.tubeNumber = data.tubeNumber;
    }
    if (!data.pileDiameter) {
      erroInfo = "请填写桩径";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileDiameter = data.pileDiameter;
    }
    if (!data.pileType) {
      erroInfo = "请填写桩型";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileType = data.pileType;
    }
    if (!data.pileLength) {
      erroInfo = "请填写桩长";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileLength = data.pileLength;
    }
    if (!data.pileAxis) {
      erroInfo = "请填写桩轴位线";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileAxis = data.pileAxis;
    }
    if (!data.tempStr4) {
      erroInfo = "请填写允许沉渣厚度";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.tempStr4 = data.tempStr4;
    }
    if (!data.pileBearing) {
      erroInfo = "请填写单桩承载力特征值";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileBearing = data.pileBearing;
    }
    if (!data.forceLayer) {
      erroInfo = "请填写设计桩端持力层";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.forceLayer = data.forceLayer;
    }
    postData.powerLevel = this.data.selectPowerLevel;
    postData.pileDate = this.data.date;
    this.submit(postData);
  },

  //静载表单验证
  validJZFrom: function(data, postData) {
    var erroInfo;
    if (!data.pileNo) {
      erroInfo = "请填写桩号";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileNo = data.pileNo;
    }
    if (!data.pileDiameter) {
      erroInfo = "请填写桩径";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileDiameter = data.pileDiameter;
    }
    if (!data.pileLength) {
      erroInfo = "请填写桩长";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileLength = data.pileLength;
    }
    if (!data.pileAxis) {
      erroInfo = "请填写桩轴位线";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileAxis = data.pileAxis;
    }
    if (!data.pileBearing) {
      erroInfo = "请填写单桩承载力特征值";
      this.errorTips(erroInfo);
      return;
    } else {
      postData.pileBearing = data.pileBearing;
    }
    postData.powerLevel = this.data.selectPowerLevel;
    postData.pileDate = this.data.date;
    this.submit(postData);
  }
})