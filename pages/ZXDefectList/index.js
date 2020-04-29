// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    ZXHoleDetails: '',
    zxHoleCoreDefectList: [],
    startPosition: "",
    endPosition: "",
    startX: 0,
    startY: 0,
    loadingPage: true,
    isShowDialog: false,
    checkboxItems: [{
        name: '轻度蜂窝麻面',
        value: '0',
        checked: true
      },
      {
        name: '中度蜂窝麻面',
        value: '1'
      },
      {
        name: '重度蜂窝麻面',
        value: '2'
      },
      {
        name: '沟槽',
        value: '3'
      },
      {
        name: '骨料分布不均匀',
        value: '4'
      },
      {
        name: '芯样破碎',
        value: '5'
      },
      {
        name: '芯样松散',
        value: '6'
      },
      {
        name: '夹泥',
        value: '7'
      },
      {
        name: '夹粉状物',
        value: '8'
      },
      {
        name: '断口',
        value: '9'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    var zxHoleCoreDefectList = [];
    ZXHoleDetails.zxHoleCoreDefectList.forEach(function (v, i) {
      v.isTouchMove = false
      zxHoleCoreDefectList.push(v)
    });
    //获取最后一个深度的取样编号
    var index;
    if (zxHoleCoreDefectList.length == 0) {
      index = 0;
    } else {
      var index = parseInt(zxHoleCoreDefectList[zxHoleCoreDefectList.length - 1].index);
    }
    this.setData({
      zxHoleCoreDefectList: zxHoleCoreDefectList,
      zxHoleId: ZXHoleDetails.id,
      ZXHoleDetails: ZXHoleDetails,
      index: index + 1
    });
  },
  //表单验证
  reg: function (e) {
    var that = this;
    var erroInfo;
    var data = e.detail.value;

    var defactType = data.defactType;
    var otherDefact = data.otherDefact;
    if (defactType.length == 0 && !otherDefact) {
      erroInfo = "请选择缺陷类型";
      this.errorTips(erroInfo);
      return;
    } else {
      var checkboxItems = this.data.checkboxItems;
      var type="";
      for (var i = 0; i < checkboxItems.length; i++) {
        var item = checkboxItems[i];
        for (var j = 0; j < defactType.length; j++) {
            if(item.value == defactType[j]){
              type+=item.name+',';
            }
        }
      }
    }

    if (!data.startPosition) {
      erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.startPosition)) {
      erroInfo = "深度起始位置只能是数值";
      this.errorTips(erroInfo);
      return
    }
    if (!data.endPosition) {
      erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.endPosition)) {
      erroInfo = "深度终止位置只能是数值";
      this.errorTips(erroInfo);
      return
    }
    data.id = null;
    data.index = this.data.index;
    data.zxHoleId = this.data.zxHoleId;
    data.type = type+otherDefact;
    this.submit(data);
  },
  //提交
  submit: function (data) {
    var that = this;
    WXAPI.UpdateZxHoleCoreDefect(data).then(res => {
      data.id = res.result.id
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function (res) {
          //更新钻芯的数据
          var zxHoleCoreDefectList = that.data.zxHoleCoreDefectList;
          var ZXHoleDetails = that.data.ZXHoleDetails;
          zxHoleCoreDefectList.push(data);
          ZXHoleDetails.zxHoleCoreDefectList.push(data);
          that.setData({
            zxHoleCoreDefectList: zxHoleCoreDefectList,
            index: parseInt(data.index) + 1,
            startPosition: '',
            endPosition: ''
          });
          //更新孔的详情信息缓存
          wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)
        }
      })
    })
  },
  toAddZxDefact: function (e) {
    this.showModal();
  },

  //编辑钻芯取样深度
  ZxDefactEdit: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      var currentDefactList = this.data.zxHoleCoreDefectList.filter(function (item, index) {
        return item.id == id
      });
      wx.navigateTo({
        url: '/pages/EditZXDefact/index?zxDefactData=' + JSON.stringify(currentDefactList[0]),
      })
    }
  },

  //手指触摸动作开始，记录起点x坐标
  touchstart: function (e) {
    //开始触摸时重置所有删除
    this.data.zxHoleCoreDefectList.forEach(function (v, i) {
      if (v.isTouchMove) {
        v.isTouchMove = false;
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      zxHoleCoreDefectList: this.data.zxHoleCoreDefectList
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
    that.data.zxHoleCoreDefectList.forEach(function (v, i) {
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
      zxHoleCoreDefectList: that.data.zxHoleCoreDefectList
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
        WXAPI.DeleteZxHoleCoreDefect(id).then(res => {

          that.data.zxHoleCoreDefectList.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            zxHoleCoreDefectList: that.data.zxHoleCoreDefectList,
          });
          var zxHoleCoreDefectList = that.data.ZXHoleDetails.zxHoleCoreDefectList;
          zxHoleCoreDefectList.forEach(function (v, i) {
            if (v.id = id) {
              zxHoleCoreDefectList.splice(i, 1)
            }
          });
            //更新孔的详情信息缓存
        wx.setStorageSync('ZXHoleDetails', that.data.ZXHoleDetails);
        });  
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
  },
  //缺陷类型
  checkboxChange: function (e) {
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  }
})