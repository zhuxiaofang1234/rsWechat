// pages/ZXHoleBaseInfo/HolePic.js
const x_MARGIN = 10;
const y_MARGIN = 10;
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ponitX: 0,
    ponintY: 0,
    R: 100, //画图半径
    proportion: 1, //比例
    pileDiameter: 400
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var R = this.data.R;
    var pileDiameter = options.pileDiameter;
    var proportion = pileDiameter / (2 * R);
   
    this.setData({
      proportion,
      pileDiameter
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 通过 SelectorQuery 获取 Canvas 节点
    wx.createSelectorQuery()
      .select('#myCanvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))
  },

  init(res) {
    const width = res[0].width
    const height = res[0].height
    const canvas = res[0].node
    const ctx = canvas.getContext('2d');
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    this.drawCanvas(width, height, ctx);
    this.setData({
      canvas_width: width,
      canvas_height: height,
      destWidth: width * dpr,
      destHeight: height * dpr,
      ctx: ctx,
      canvas: canvas
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //画钻芯的孔位置
  drawCanvas: function (width, height, ctx) {
    //清空画布
    ctx.clearRect(0, 0, width, height);

    //画圆的半径
    var R = this.data.R;

    //圆心坐标
    var ORIGIN = {
      x: width / 2,
      y: height / 2
    }
    this.setData({
      ORIGIN: ORIGIN
    });
    //x轴的起点坐标
    var X_ORIGIN = {
      x: x_MARGIN,
      y: height / 2
    }
    //x轴的终点坐标
    var X_END = {
      x: width - x_MARGIN,
      y: height / 2
    }

    //y轴的起点坐标
    var Y_ORIGIN = {
      x: width / 2,
      y: height - y_MARGIN
    }

    //y轴的终点坐标
    var Y_END = {
      x: width / 2,
      y: y_MARGIN
    }

    //定义箭头长，宽

    var ARROW = {
      length: 5,
      width: 2
    }

    //x轴箭头坐标
    var X_TOP_ARROW = {
      x: X_END.x - ARROW.length,
      y: X_END.y - ARROW.width
    }

    var X_BOTTOM_ARROW = {
      x: X_END.x - ARROW.length,
      y: X_END.y + ARROW.width
    }

    //y轴箭头坐标
    var Y_LEFT_ARROW = {
      x: width / 2 - ARROW.width,
      y: Y_END.y + ARROW.length,
    }
    var Y_RIGHT_ARROW = {
      x: width / 2 + ARROW.width,
      y: Y_END.y + ARROW.length,
    }

    ctx.beginPath();
    ctx.moveTo(X_ORIGIN.x, X_ORIGIN.y);
    ctx.lineTo(X_END.x, X_END.y);
    ctx.moveTo(X_TOP_ARROW.x, X_TOP_ARROW.y)
    ctx.lineTo(X_END.x, X_END.y)
    ctx.lineTo(X_BOTTOM_ARROW.x, X_BOTTOM_ARROW.y)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(Y_ORIGIN.x, Y_ORIGIN.y);
    ctx.lineTo(Y_END.x, Y_END.y);
    ctx.moveTo(Y_LEFT_ARROW.x, Y_LEFT_ARROW.y)
    ctx.lineTo(Y_END.x, Y_END.y)
    ctx.lineTo(Y_RIGHT_ARROW.x, Y_RIGHT_ARROW.y)
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ORIGIN.x, ORIGIN.y, R, 0, 2 * Math.PI);
    ctx.stroke();

    //填充文字
    ctx.fillText('E', X_END.x - 5, X_END.y - 10)
    ctx.fillText('N', Y_END.x + 10, Y_END.y + 5);

    //画圆点
    var that = this;
    var ponitX = that.data.ponitX;
    var ponitY = that.data.ponitY;
    if (ponitX != 0 || ponitY != 0) {
      ctx.beginPath();
      ctx.arc(ponitX, ponitY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  //获取坐标孔的位置
  getPosition: function (e) {
    var proportion = this.data.proportion;
    var ORIGIN = this.data.ORIGIN;
    var x = e.touches[0].x;
    var y = e.touches[0].y;
    if (this.isCircle(x, y, ORIGIN.x, ORIGIN.y, 100)) {
      var ctx = this.data.ctx;
      var width = this.data.canvas_width;
      var height = this.data.canvas_height;
      this.setData({
        ponitX: x,
        ponitY: y
      })
      this.drawCanvas(width, height, ctx);

      //转换成实际坐标
      var holeXPosition = parseInt((x - ORIGIN.x) * proportion);
      var holeYPosition = parseInt((ORIGIN.y - y) * proportion);
      this.setData({
        holeXPosition,
        holeYPosition
      })
    }
  },

  /** 鼠标是否在坐标系(圆)内部 */
  isCircle: function (x, y, x0, y0, r) {
    var isIn = Math.sqrt(Math.pow(Math.abs(x - x0), 2) + Math.pow(Math.abs(y - y0), 2));
    var b = false;
    if (isIn < r) {
      b = true;
    }
    return b;
  },
  //获取孔位置信息
  getInfo: function () {
   var that = this;
    var canvas = this.data.canvas;
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    wx.showLoading({
      title: '生成图片中...',
    })
    //生成图片
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvas: canvas,
        destWidth: that.data.destWidth,
        destHeight: that.data.destHeight,
        fileType: 'jpg',
        success: function (res) {
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePath, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              wx.hideLoading();
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一个页面
              prevPage.setData({
                holeXPosition: that.data.holeXPosition,
                holeYPosition: that.data.holeYPosition,
                holeImageString:res.data
              });
              wx.navigateBack(1);
            }
          })
        }
      })
    }, 500)
  },
  //返回上一级
  cancel: function () {
    App.back()
  },
})