// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sampleNo: 1,
    ZXHoleDetails: '',
    sampleList: [],
    zxHoleId: null,
    startPosition: "",
    endPosition: "",
    type: "",
    startX: 0,
    startY: 0,
    loadingPage: true,
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var title;
    if (type == 1) {
      title = "芯样取样"
    } else if (type == 2) {
      title = "持力层取样"
    }
    wx.setNavigationBarTitle({
      title: title
    })
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    var sampleList = [];
    ZXHoleDetails.zxHoleSampleDepthList.forEach(function (v, i) {
      if (v.type == type) {
        v.isTouchMove = false
        sampleList.push(v)
      }
    });
    //获取最后一个深度的取样编号
    var sampleNo;
    if (sampleList.length == 0) {
      sampleNo = 0;
    } else {
      var sampleNo = parseInt(sampleList[sampleList.length - 1].sampleNo);
    }
    this.setData({
      sampleList: sampleList,
      zxHoleId: ZXHoleDetails.id,
      ZXHoleDetails: ZXHoleDetails,
      sampleNo: sampleNo + 1,
      type: type
    });
  },
  //表单验证
  reg: function (e) {
    var that = this;
    var erroInfo;
    var data = e.detail.value;
    var zxHoleId = this.data.zxHoleId;
    if (!data.sampleNo) {
      erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(data.sampleNo)) {
      erroInfo = "取样编号请输入整数";
      this.errorTips(erroInfo);
      return
    }
    if (!data.startPosition) {
      erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.startPosition)) {
      erroInfo = "深度起始位置只能是整数";
      this.errorTips(erroInfo);
      return
    }
    if (!data.endPosition) {
      erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.endPosition)) {
      erroInfo = "深度终止位置只能是整数";
      this.errorTips(erroInfo);
      return
    }
    data.id = null;
    data.zxHoleId = zxHoleId;
    data.type = this.data.type;

    this.submit(data);
  },
  //提交
  submit: function (data) {
    var that = this;
    WXAPI.UpdateZxHoleSampleDepth(data).then(res => {
      data.id = res.result.id
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function (res) {
          //更新钻芯的数据
          var sampleList = that.data.sampleList;
          var ZXHoleDetails = that.data.ZXHoleDetails;
          sampleList.push(data);
          ZXHoleDetails.zxHoleSampleDepthList.push(data);
          that.setData({
            sampleList: sampleList,
            sampleNo: parseInt(data.sampleNo) + 1,
            startPosition: '',
            endPosition: ''
          });
          //更新孔的详情信息缓存
          wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)
        }
      })
    })
  },
  toAddZxSample: function (e) {
    this.showModal();
  },

  //编辑钻芯取样深度
  ZxHoleSampleDepthEdit: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      var currentDepth = this.data.sampleList.filter(function (item, index) {
        return item.id == id
      });
      wx.navigateTo({
        url: '/pages/EditZXSample/index?zxSampleData=' + JSON.stringify(currentDepth[0]),
      })
    }
  },

  //手指触摸动作开始，记录起点x坐标
  touchstart: function (e) {
    //开始触摸时重置所有删除
    this.data.sampleList.forEach(function (v, i) {
      if (v.isTouchMove) {
        v.isTouchMove = false;
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      sampleList: this.data.sampleList
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      id = e.currentTarget.dataset.id, //当前id
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化x坐标
      touchMoveY = e.changedTouches[0].clientY,

      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.sampleList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动角度超过30度角，return 
      if (Math.abs(angle) > 30) return;
      if (v.id == id) {
        if (touchMoveX > startX) { //右滑
          v.isTouchMove = false
        } else { //左滑
          v.isTouchMove = true
        }
      }
    })

    //更新数据
    that.setData({
      sampleList: that.data.sampleList
    })
  },

  //计算滑动角度
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y;
    //返回角度、Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['确认删除'],
      itemColor: '#FF5B5B',
      success(res) {
        WXAPI.DeleteZxHoleSampleDepth(id).then(res => {});
        that.data.sampleList.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          sampleList: that.data.sampleList,
        });
        var zxHoleSampleDepthList = that.data.ZXHoleDetails.zxHoleSampleDepthList;
        zxHoleSampleDepthList.forEach(function (v, i) {
          if (v.id = id) {
            zxHoleSampleDepthList.splice(i, 1)
          }
        });
        //更新孔的详情信息缓存
        wx.setStorageSync('ZXHoleDetails', that.data.ZXHoleDetails);
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
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

  // 显示遮罩层 
  showModal: function () {
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear',
      delay: 0,
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(600).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      isShowDialog: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
  },

  // 隐藏遮罩层 
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        isShowDialog: false
      })
    }, 200)
  }
})