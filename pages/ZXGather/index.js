// pages/test/addTestData/addTestData.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coreStateFlag:false,
    sedimentStateFlag: false, //有无沉渣标识
    SideSurface: ['光滑', '较光滑', '气孔', '蜂窝麻面'],
    SideSurfaceText: '光滑',
    sideSurfaceIndex: 0,
    ZXComplete: '连续完整',
    zxCompleteItems: [{ //芯样完整性
        name: 'zxComplete',
        zxCompleteText: '连续完整',
        value: 0,
        checked: 'true'
      },
      {
        name: 'zxComplete',
        zxCompleteText: '基本完整',
        value: 1
      }
    ],
    AggregateCover: '均匀',
    AggregateCoverItems: [{ //骨料分布
        name: ' AggregateCover',
        AggregateCoverText: '均匀',
        value: 0,
        checked: 'true'
      },
      {
        name: ' AggregateCover',
        AggregateCoverText: '基本均匀',
        value: 1,
      }
    ],
    coreState: '长柱状',
    coreStateItems: [{
        name: 'coreState',
        coreStateText: '长柱状',
        value: 0,
        checked: 'true'
      },
      {
        name: 'coreState',
        coreStateText: '柱状',
        value: 1
      },
      {
        name: 'coreState',
        coreStateText: '其他',
        value: 2
      },
    ],
    fractureItems: [{ //搅拌桩断口
        name: 'fracture',
        fractureText: '吻合',
        value: 0,
        checked: 'true'
      }, {
        name: 'fracture',
        fractureText: '基本吻合',
        value: 1
      },
      {
        name: 'fracture',
        fractureText: '不吻合',
        value: 2
      }
    ],
    cementSoilMixingFlag:false,
    cementSoilMixingItems:[ //水泥搅拌
      {
        name: 'cementSoilMixing',
        cementSoilMixingText: '均匀',
        value: 0,
        checked: 'true'
      },
      {
        name: 'cementSoilMixing',
        cementSoilMixingText: '较均匀',
        value: 1
      },
      {
        name: 'cementSoilMixing',
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
    ZJcementationFlag:false,
    ZJcementation: '',
    ZJcementationItems: [{ //胶结
        name: 'ZJcementationItems',
        cementationText: '好',
        value: 0,
        checked: 'true'
      },
      {
        name: 'ZJcementationItems',
        cementationText: '较好',
        value: 1
      },
      {
        name: 'ZJcementationItems',
        cementationText: '较差',
        value: 2
      }
    ],
    bottomState: '清晰',
    bottomStateItems: [{ //砼底情况
        name: 'bottomState',
        bottomStateText: '清晰',
        value: 0,
        checked: 'true'
      },
      {
        name: 'bottomState',
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
    uploadtext: '上传成功',
    uploadFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var TestModeCode = wx.getStorageSync('testModeCode');
    var pileType, ZXType;
    if (TestModeCode == 'ZG') {
      pileType = 0,
        ZXType = '混凝土芯样情况'
    } else {
      pileType = 1,
        ZXType = '搅拌桩芯样情况'
    }
    console.log(TestModeCode);
    this.setData({
      pileType: pileType,
      ZXType: ZXType
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
    if (value == 2) {
        this.setData({
          coreStateFlag:true
        });
    }else{
      this.setData({
        coreStateFlag:false
      });
    }
  },

  //水泥搅拌
  cementSoilMixingChange:function(e){
    var value = e.detail.value,
    cementSoilMixingFlag; 
      if (value == 2) {
        cementSoilMixingFlag = true
      } else {
        cementSoilMixingFlag = false
      }
      this.setData({
        cementSoilMixingFlag: cementSoilMixingFlag
      });
  },
  
  //搅拌桩
  ZJcementationChange:function(e){
    var value = e.detail.value,
    ZJcementationFlag; 
      if (value == 2) {
        ZJcementationFlag = true
      } else {
        ZJcementationFlag = false
      }
      this.setData({
        ZJcementationFlag: ZJcementationFlag
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
    console.log(checkedaggregateCover);
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
            isShowUploader: false
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
            that.setData({
              xyAttachment: Imghash,
              uploadtext: '上传成功',
              uploadFlag: true
            });
          } else {
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
    submitData.pileType = this.data.pileType;
    submitData.coreSample = this.data.ZXComplete; //芯样完整性
    submitData.bottomState = this.data.bottomState; //砼底情况
    submitData.aggregateCover = this.data.AggregateCover; //骨料分布
    submitData.cementation = this.data.cementation; //胶结
    submitData.sedimentState = data.sedimentState; //沉渣厚度
    submitData.sideSurface = this.data.SideSurfaceText; //侧表面
    submitData.xyAttachment = this.data.xyAttachment; //芯样附件

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
    wx.setStorageSync('zxGather', submitData);

    wx.navigateTo({
      url: '/pages/ZXresult/index',
    })
  }
})