// pages/ZXForceLayerList/index.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ZXHoleDetails: '',
    ZxHoleForceLayerList: [],
    zxHoleId: null,
    startPosition: '',
    endPosition: '',
    startX:0,
    startY:0,
    loadingPage: true,
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    var ZxHoleForceLayerList = ZXHoleDetails.zxHoleForceLayerList; 
    ZxHoleForceLayerList.forEach(function(val,index){
      val.isTouchMove = false
    });
     //获取最后一个深度的取样编号
     var index;
     if (ZxHoleForceLayerList.length == 0) {
       index = 0;
     } else {
       var index = parseInt(ZxHoleForceLayerList[ZxHoleForceLayerList.length - 1].index);
     }
     this.setData({
        ZxHoleForceLayerList: ZxHoleForceLayerList,
        zxHoleId: ZXHoleDetails.id,
        ZXHoleDetails: ZXHoleDetails,
       index:index+1
     });
  },

  //显示添加页面
  toAddZXForceLayer:function(){
    this.showModal()
  },

  //去编辑持力层
  toEditZXForceLayer:function(e){
    var id = e.currentTarget.dataset.id;
    if (id) {
      var currentForceLayer = this.data.ZxHoleForceLayerList.filter(function (item, index) {
        return item.id == id
      });
      wx.navigateTo({
        url: '/pages/EditZXforceLayer/index?ZXForceLayer=' + JSON.stringify(currentForceLayer[0]),
      })
    }
  },
  //获取表单数据，并验证
  reg:function(e){
  var data = e.detail.value;
  var index = data.index;
  var startPosition = data.startPosition;
  var endPosition = data.endPosition;
  
    var erroInfo;
    if (!index) {
      erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(index)) {
      erroInfo = "取样编号请输入整数";
      this.errorTips(erroInfo);
      return
    }
    if (!startPosition) {
      erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(startPosition)) {
      erroInfo = "深度起始位置只能是数值";
      this.errorTips(erroInfo);
      return
    }
    if (!endPosition) {
      erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(endPosition)) {
      erroInfo = "深度终止位置只能是数值";
      this.errorTips(erroInfo);
      return
    }
    if (!data.weatheringDegree) {
      erroInfo = "请填写风化程度";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.type) {
      erroInfo = "请填写岩土类别";
      this.errorTips(erroInfo);
      return;
    }
    data.id=null,
    data.zxHoleId = this.data.zxHoleId;  
    this.submit(data)
  },
  submit:function(data){
    var that = this;
    WXAPI.UpdateZxHoleForceLayer(data).then(res => {
      data.id = res.result.id
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function (res) {
          //更新钻芯的数据
          var zxHoleForceLayerList = that.data.ZxHoleForceLayerList;
          var ZXHoleDetails = that.data.ZXHoleDetails;
          zxHoleForceLayerList.push(data);
          var index = data.index;

          that.setData({
            ZxHoleForceLayerList: zxHoleForceLayerList,
            index: parseInt(index) + 1,
            startPosition: '',
            endPosition: ''
          });
          //更新孔的详情信息缓存
          wx.setStorageSync('ZXHoleDetails', ZXHoleDetails)     
        }
      })
    })
  },

//手指触摸动作开始，记录起点x坐标
  touchstart: function (e) {
    //开始触摸时重置所有删除
    this.data.ZxHoleForceLayerList.forEach(function (v, i) {
      if (v.isTouchMove) {
        v.isTouchMove = false;
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      ZxHoleForceLayerList: this.data.ZxHoleForceLayerList
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
    that.data.ZxHoleForceLayerList.forEach(function (v, i) {
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
      ZxHoleForceLayerList: that.data.ZxHoleForceLayerList
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
  del:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['确认删除'],
      itemColor:'#FF5B5B',
      success(res) {
        WXAPI.DeleteZxHoleForceLayer(id).then(res=>{
        });
        that.data.ZxHoleForceLayerList.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          ZxHoleForceLayerList: that.data.ZxHoleForceLayerList,
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