// pages/SceneRecordZXForceLayer/SceneRecordZXForceLayer.js
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    ZXHoleDetails: '',
    ZxHoleForceLayerList: [],
    zxHoleId: null,
    startPosition: '',
    endPosition: '',
    startX:0,
    startY:0
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
     this.setData({
        ZxHoleForceLayerList: ZxHoleForceLayerList,
        zxHoleId: ZXHoleDetails.id,
        ZXHoleDetails: ZXHoleDetails,
       index: ZxHoleForceLayerList.length + 1
     });
  },

  //获取表单数据，并验证
  reg:function(e){
  var data = e.detail.value;
    var erroInfo;
    if (!data.index) {
      erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.startPosition) {
      erroInfo = "请填写岩层起始深度";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.endPosition) {
      erroInfo = "请填写岩层中止深度";
      this.errorTips(erroInfo);
      return;
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
    console.log(e);
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
  }
})