// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
const until = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sedimentStateFlag: false, //有无沉渣标识
    SideSurface: ['光滑', '较光滑', '气孔', '蜂窝麻面'],
    SideSurfaceText: '光滑',
    sideSurfaceIndex: 0,
    ZXComplete: '连续完整',
    ZGgatherInfo: "", //混凝土汇总试验信息
    ZJgatherInfo: "", //搅拌桩汇总信息
    zxCompleteItems: [{ //芯样完整性
        zxCompleteText: '连续完整',
        checked: 'true'
      },
      {
        zxCompleteText: '基本完整',
        value: 1
      }
    ],
    AggregateCover: '均匀',
    AggregateCoverItems: [{ //骨料分布
        AggregateCoverText: '均匀',
        value: 0,
        checked: 'true'
      },
      {
        AggregateCoverText: '基本均匀',
        value: 1,
      }
    ],
    coreStateFlag: false,
    coreState: '长柱状',
    otherCoreState: "",
    coreStateItems: [{
        coreStateText: '长柱状',
        value: 0,
        checked: 'true'
      },
      {
        coreStateText: '柱状',
        value: 1
      },
      {
        coreStateText: '其他',
        value: 2
      },
    ],
    fracture: '吻合',
    fractureItems: [{ //搅拌桩断口
        fractureText: '吻合',
        value: 0,
        checked: 'true'
      }, {
        fractureText: '基本吻合',
        value: 1
      },
      {
        fractureText: '不吻合',
        value: 2
      }
    ],
    cementSoilMixing: "均匀",
    cementSoilMixingFlag: false,
    cementSoilMixingItems: [ //水泥搅拌
      {
        cementSoilMixingText: '均匀',
        value: 0,
        checked: 'true'
      },
      {
        cementSoilMixingText: '较均匀',
        value: 1
      },
      {
        cementSoilMixingText: '不均匀',
        value: 2
      },
    ],
    cementation: '好',
    cementationItems: [{ //胶结
        name: 'cementation',
        cementationText: '好',
        value: 0,
        checked: 'true'
      },
      {
        name: 'cementation',
        cementationText: '较好',
        value: 0
      }
    ],
    ZJcementationFlag: false,
    ZJcementation: '好',
    otherZJcementation: '',
    ZJcementationItems: [{ //胶结
        cementationText: '好',
        value: 0,
        checked: 'true'
      },
      {
        cementationText: '较好',
        value: 1
      },
      {
        cementationText: '较差',
        value: 2
      }
    ],
    bottomState: '清晰',
    bottomStateItems: [{ //砼底情况
        bottomStateText: '清晰',
        value: 0,
        checked: 'true'
      },
      {
        bottomStateText: '不清晰',
        value: 1

      }
    ],
    sedimentStateItems: [ //沉渣情况
      {
        name: 'sedimentState',
        value: 0,
        sedimentStatetext: '无',
        checked: 'true'
      },
      {
        name: 'sedimentState',
        value: 1,
        sedimentStatetext: '有'
      }
    ],
    files: [],
    isShowUploader: false,
    xyAttachment: "",
    uploadtext: '上传中...',
    uploadFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TestModeCode = wx.getStorageSync('testModeCode');
    //获取钻芯汇总信息
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    console.log(ZXHoleDetails)

    var pileType, ZXType;
    if (TestModeCode == 'ZG') {
      pileType = 0
      ZXType = '混凝土芯样情况'
      this.showZGgatherInfo(ZXHoleDetails);
    } else {
      pileType = 1
      ZXType = '搅拌桩芯样情况'
      this.showZJgatherInfo(ZXHoleDetails)
    }
    this.setData({
      pileType: pileType,
      ZXType: ZXType
    });

    this.showZXGatherInfo(ZXHoleDetails);
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
  onPullDownRefresh: function () {},

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

  //开钻时间
  bindStartDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //结束时间
  bindEndDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //返回上一级
  cancel: function () {
    App.back()
  },

  //搅拌桩芯样呈
  coreStateChange: function (e) {
    var value = e.detail.value;
    var coreStateFlag;
    var checkedCoreState = this.data.coreStateItems.filter(function (item) {
      return item.value == e.detail.value;
    });

    if (value == 2) {
      coreStateFlag = true
    } else {
      coreStateFlag = false
    }
    this.setData({
      coreStateFlag: coreStateFlag,
      coreState: checkedCoreState[0].coreStateText
    });
  },

  //水泥搅拌
  cementSoilMixingChange: function (e) {
    var value = e.detail.value;
    var cementSoilMixingFlag;
    var checkedcementSoilMixing = this.data.cementSoilMixingItems.filter(function (item) {
      return item.value == e.detail.value;
    });

    if (value == 2) {
      cementSoilMixingFlag = true
    } else {
      cementSoilMixingFlag = false
    }
    this.setData({
      cementSoilMixingFlag: cementSoilMixingFlag,
      cementSoilMixing: checkedcementSoilMixing[0].cementSoilMixingText
    });
  },

  //搅拌桩胶结
  ZJcementationChange: function (e) {
    var value = e.detail.value,
      ZJcementationFlag;
    var checkedZJcementation = this.data.ZJcementationItems.filter(function (item) {
      return item.value == e.detail.value;
    });
    if (value == 2) {
      ZJcementationFlag = true
    } else {
      ZJcementationFlag = false
    }
    this.setData({
      ZJcementationFlag: ZJcementationFlag,
      ZJcementation: checkedZJcementation[0].cementationText
    });
  },

  //断口
  fractureChange: function (e) {
    var checkedFractureItems = this.data.fractureItems.filter(function (item) {
      return item.value == e.detail.value;
    });
    this.setData({
      fracture: checkedFractureItems[0].fractureText
    });
  },


  //芯样完整性
  zxCompleteChange: function (e) {
    var checkedZXComplete = this.data.zxCompleteItems.filter(function (item) {
      return item.value == e.detail.value
    })
    this.setData({
      ZXComplete: checkedZXComplete[0].zxCompleteText
    });
  },

  //骨料分布
  aggregateCoverChange: function (e) {
    var checkedaggregateCover = this.data.AggregateCoverItems.filter(function (item) {
      return item.value == e.detail.value
    })

    this.setData({
      AggregateCover: checkedaggregateCover[0].AggregateCoverText
    });
  },
  //胶结
  cementationChange: function (e) {
    var checkedCementation = this.data.cementationItems.filter(function (item) {
      return item.value == e.detail.value
    })
    this.setData({
      cementation: checkedCementation[0].cementationText
    });
  },

  //侧表面
  bindSideSurfaceChange: function (e) {
    var index = e.detail.value;
    this.setData({
      SideSurfaceText: this.data.SideSurface[index],
      sideSurfaceIndex: index
    });
  },

  //砼底情况
  bottomStateChange: function (e) {
    var checkedBottomState = this.data.bottomStateItems.filter(function (item) {
      return item.value == e.detail.value
    })
    this.setData({
      bottomState: checkedBottomState[0].bottomStateText
    });
  },

  //沉渣情况
  sedimentStateChange: function (e) {
    var sedimentStateFlag;
    if (e.detail.value == 0) {
      sedimentStateFlag = false
    } else {
      sedimentStateFlag = true
    }
    this.setData({
      sedimentStateFlag: sedimentStateFlag
    });
  },

  //选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          isShowUploader: true
        });
        that.uploadFile();
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //删除上传图片
  delUploaderImg: function (e) {
    var that = this;
    wx.showModal({
      title: '操作提醒',
      content: '确定要删除当前图片吗？',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          that.setData({
            files: [],
            xyAttachment: "",
            isShowUploader: false,
            uploadtext: '上传中...',
            uploadFlag: true
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //上传图片
  uploadFile: function () {
    var that = this;
    var files = this.data.files;
    wx.showLoading({
      title: '上传中...',
    })
    wx.uploadFile({
      url: wx.getStorageSync('rshostName') + '/api/Resurce/Upload', //上传图片服务器API接口的路径 
      filePath: files[0], //要上传文件资源的路径 String类型
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': "Bearer " + wx.getStorageSync('rsAccessToken')
      },

      success: function (res) { //当调用uploadFile成功之后，再次调用后台修改的操作
        if (res.statusCode = 200) {
          var responseData = JSON.parse(res.data);
          if (responseData.result) {
            var Imghash = responseData.result[0].hash;
            console.log(Imghash)
            if (Imghash) {
              wx.hideLoading();
              that.setData({
                xyAttachment: Imghash,
                uploadtext: '上传成功',
                uploadFlag: true
              });
            }
          } else {
            wx.hideLoading();
            that.setData({
              uploadtext: '上传失败',
              uploadFlag: false
            });
          }
        }
      }
    });
  },
  reg: function (e) {
    var data = e.detail.value;
    var submitData = {};
    var that = this;
    //灌注桩
    submitData.pileType = this.data.pileType;
    if (this.data.pileType == 0) {
      submitData.coreSample = this.data.ZXComplete; //芯样完整性
      submitData.aggregateCover = this.data.AggregateCover; //骨料分布
      submitData.cementation = this.data.cementation; //胶结
      submitData.sideSurface = this.data.SideSurfaceText; //侧表面
    } else {
      //搅拌桩
      if (data.coreState == 2) { //芯样状态
        submitData.coreState = data.otherCoreState + "m破碎块或松散";
      } else {
        submitData.coreState = this.data.coreState;
      }
      submitData.fracture = this.data.fracture; //断口

      if (data.cementSoilMixing == 2) {
        submitData.cementSoilMixing = data.otherCementSoilMixing + "m不均匀";
      } else {
        submitData.cementSoilMixing = this.data.cementSoilMixing; //水泥土搅拌
      }

      if (data.ZJcementation == 2) {
        submitData.cementation = data.otherZJcementation + "m较差";
      } else {
        submitData.cementation = this.data.ZJcementation; //水泥土搅拌
      }
      submitData.other = data.other;
    }
    submitData.bottomState = this.data.bottomState; //砼底情况
    submitData.sedimentState = data.sedimentState; //沉渣厚度

    console.log(submitData);

    if (this.data.sedimentStateFlag) { //沉渣厚度
      var erroInfo;
      if (!data.sedimentState) {
        erroInfo = "请填写沉渣厚度";
        this.errorTips(erroInfo);
        return;
      } else if (!App.isNumber(data.sedimentState)) {
        erroInfo = "沉渣厚度只能为数值";
        this.errorTips(erroInfo);
        return;
      }
      submitData.sedimentState = data.sedimentState
      submitData.sedimentDescribe = data.sedimentDescribe
    } else {
      submitData.sedimentDescribe = '无'
      submitData.sedimentState = 0
    }
    //缓存部分汇总信息
    wx.showLoading({
      title: '汇总中...',
    })
    setTimeout(function () {
      submitData.xyAttachment = that.data.xyAttachment; //芯样附件
      wx.setStorageSync('zxGather', submitData);
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/ZXresult/index',
      })
    }, 600)
  },

  //回显混凝土试验汇总情况
  showZGgatherInfo: function (ZXHoleDetails) {
    //芯样完整性
    var coreSample = ZXHoleDetails.coreSample;
    var zxCompleteItems = this.data.zxCompleteItems;
    for (var i = 0, len = zxCompleteItems.length; i < len; ++i) {
      var text = zxCompleteItems[i].zxCompleteText;
      zxCompleteItems[i].checked = text == coreSample;
    }
    this.setData({
      zxCompleteItems: zxCompleteItems
    });

    //骨料分布
    var AggregateCoverItems = this.data.AggregateCoverItems;
    for (var i = 0, len = AggregateCoverItems.length; i < len; ++i) {
      var text = AggregateCoverItems[i].AggregateCoverText;
      AggregateCoverItems[i].checked = text == ZXHoleDetails.aggregateCover;
    }
    this.setData({
      AggregateCoverItems: AggregateCoverItems
    });

    //胶结
    var cementation = ZXHoleDetails.cementation;
    var cementationItems = this.data.cementationItems;
    for (var i = 0, len = cementationItems.length; i < len; ++i) {
      var text = cementationItems[i].cementationText;
      cementationItems[i].checked = text == cementation;
    }
    this.setData({
      cementationItems: cementationItems
    });

    //侧表面
    var str = ZXHoleDetails.sideSurface;
    console.log(str)
    if(str){
      var index = this.data.SideSurface.indexOf(str);
      this.setData({
        sideSurfaceIndex: index,
        SideSurfaceText: str
      });
    }
  

  },
  //回显搅拌桩试验汇总情况
  showZJgatherInfo: function (ZXHoleDetails) {
    //芯样呈
    var coreState = ZXHoleDetails.coreState;
    console.log(coreState)
    var coreStateText, coreStateFlag, otherCoreState;
    if ((coreState != '长柱状' && coreState != '柱状') && coreState) {
      coreStateText = '其他',
        coreStateFlag = true,
        otherCoreState = coreState.substring(0, coreState.length - 7);
    } else {
      coreStateText = coreState,
        coreStateFlag = false,
        otherCoreState = ""
    }

    var coreStateItems = this.data.coreStateItems;
    for (var i = 0, len = coreStateItems.length; i < len; ++i) {
      var text = coreStateItems[i].coreStateText;
      coreStateItems[i].checked = text == coreStateText;
    }
    this.setData({
      coreStateItems: coreStateItems,
      coreStateFlag: coreStateFlag,
      otherCoreState: otherCoreState
    });


    //断口
    var fractureText = ZXHoleDetails.fracture;
    var fractureItems = this.data.fractureItems;
    for (var i = 0, len = fractureItems.length; i < len; ++i) {
      var text = fractureItems[i].fractureText;
      fractureItems[i].checked = text == fractureText;
    }
    this.setData({
      fractureItems: fractureItems
    });

    //水泥搅拌
    var cementSoilMixing = ZXHoleDetails.cementSoilMixing;
    var cementSoilMixingText, cementSoilMixingFlag, otherCementSoilMixing;
    if ((cementSoilMixing != '均匀' && cementSoilMixing != '较均匀') && cementSoilMixing) {
      cementSoilMixingText = '不均匀';
      cementSoilMixingFlag = true;
      otherCementSoilMixing = cementSoilMixing.substring(0, cementSoilMixing.length - 4);

    } else {
      cementSoilMixingText = cementSoilMixing;
      cementSoilMixingFlag = false;
      otherCementSoilMixing = "";
    }

    var cementSoilMixingItems = this.data.cementSoilMixingItems;
    for (var i = 0, len = cementSoilMixingItems.length; i < len; ++i) {
      var text = cementSoilMixingItems[i].cementSoilMixingText;
      cementSoilMixingItems[i].checked = text == cementSoilMixingText;
    }
    this.setData({
      cementSoilMixingItems: cementSoilMixingItems,
      cementSoilMixingFlag: cementSoilMixingFlag,
      otherCementSoilMixing: otherCementSoilMixing
    });

    //搅拌桩胶结
    var ZJcementation = ZXHoleDetails.cementation;
    var ZJcementationText, ZJcementationFlag, otherZJcementation;
    if ((ZJcementation != '好' && ZJcementation != '较好') && ZJcementation) {
      ZJcementationText = '较差';
      ZJcementationFlag = true;
      otherZJcementation = ZJcementation.substring(0, ZJcementation.length - 3);

    } else {
      ZJcementationText = ZJcementation;
      ZJcementationFlag = false;
      otherZJcementation = "";
    }

    var ZJcementationItems = this.data.ZJcementationItems;
    for (var i = 0, len = ZJcementationItems.length; i < len; ++i) {
      var text = ZJcementationItems[i].cementationText;
      ZJcementationItems[i].checked = text == ZJcementationText;
    }

    this.setData({
      ZJcementationItems: ZJcementationItems,
      ZJcementationFlag: ZJcementationFlag,
      otherZJcementation: otherZJcementation
    });

    //其他
    this.setData({
      other: ZXHoleDetails.other
    });
  },

  //共同的显示
  showZXGatherInfo: function (ZXHoleDetails) {
    var that = this;
    //砼底情况
    var bottomStateItems = this.data.bottomStateItems;
    var bottomStateText = ZXHoleDetails.bottomState;
    for (var i = 0, len = bottomStateItems.length; i < len; ++i) {
      var text = bottomStateItems[i].bottomStateText;
      bottomStateItems[i].checked = text == bottomStateText;
    }

    //沉渣情况
    var sedimentStatetext, sedimentStateFlag, sedimentDescribe;
    var sedimentState = ZXHoleDetails.sedimentState;
    if (sedimentState == 0) {
      sedimentStatetext = "无"
      sedimentStateFlag = false
      sedimentDescribe = ""
    } else {
      sedimentStatetext = "有"
      sedimentStateFlag = true
      sedimentDescribe = ZXHoleDetails.sedimentDescribe
    }
    var sedimentStateItems = this.data.sedimentStateItems;
    for (var i = 0, len = sedimentStateItems.length; i < len; ++i) {
      var text = sedimentStateItems[i].sedimentStatetext;
      sedimentStateItems[i].checked = text == sedimentStatetext;
    }

    this.setData({
      sedimentStateItems: sedimentStateItems,
      sedimentStateFlag: sedimentStateFlag,
      sedimentDescribe: sedimentDescribe,
      sedimentState: sedimentState
    });

    //芯样汇总图片
    var xyAttachment = ZXHoleDetails.xyAttachment;

    var chooseImage;

    //根据hash值获取图片base64 
    if (xyAttachment) {
      chooseImage = false
      WXAPI.GetPic(xyAttachment).then(res => {
        that.setData({
          base64Code: res.result
        });
      })

      that.setData({
        xyAttachment: xyAttachment,
        chooseImage: chooseImage
      });
    } else {
      that.setData({
        chooseImage: true
      });
    }
  },

  //显示图片
  previewGatherPic: function () {
    var base64 = 'data:image/jpg;base64,' + this.data.base64Code;
    until.base64src(base64, res => {
      console.log(res) // 返回图片地址，直接赋值到image标签即可
      wx.previewImage({
        current: res,
        urls: [res]
      })
    });
  },

  //删除之前的图片
  delBeforeImg: function () {
    var that = this;
    wx.showModal({
      title: '操作提醒',
      content: '确定要删除当前图片吗？',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          that.setData({
            files: [],
            xyAttachment: "",
            chooseImage: true
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  }
})