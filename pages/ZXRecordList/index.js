// pages/test/addTestData/testRecord.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ZXHoleDetails: '',
    zxHoleDrillingRecordList: [], //钻进记录列表
    startX: 0,
    startY: 0,
    loadingPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取缓存钻芯孔的数据
    var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
    var zxHoleDrillingRecordList = [];
    ZXHoleDetails.zxHoleDrillingRecordList.forEach(function (v, i) {
        v.isTouchMove = false
        zxHoleDrillingRecordList.push(v)
    });
    this.setData({
      zxHoleDrillingRecordList: zxHoleDrillingRecordList,
      ZXHoleDetails: ZXHoleDetails,
      pileId: options.pileId,
      holeId:ZXHoleDetails.id
   });
  },

  //添加钻芯回次记录
  toAddZXRecord:function(e){
    wx.navigateTo({
      url: '/pages/AddZXRecord/AddZXRecord?pileId='+this.data.pileId+'&holeId='+this.data.holeId,
    })
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
  }
})