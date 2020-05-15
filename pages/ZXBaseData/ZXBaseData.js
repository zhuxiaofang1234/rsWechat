// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')

const x_MARGIN = 10;
const y_MARGIN = 10;



Page({
  /**
   * 页面的初始数据
   */
  data: {
    startDate: '2019-06-28',
    endDate: '2019-07-30',
    height: ["无", "有"],
    heightIndex: 0,
    overPileHeight: [{
      overPileHeightText: '无',
      value: 0,
      checked: 'true'
    },
    {
      coreStateText: '有',
      value: 1
    },
  ],
    isShowHeight: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {   
     // 通过 SelectorQuery 获取 Canvas 节点
     wx.createSelectorQuery()
     .select('#myCanvas')
     .fields({  //获取节点的相关信息。需要获取的字段在fields中指定
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
    this.drawCanvas(width,height,ctx);
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
  //设计桩顶标高
  bindHeightChange: function (e) {
    var heightIndex = e.detail.value;
    this.setData({
      heightIndex: heightIndex
    });
    if (heightIndex == 1) {
      this.setData({
        isShowHeight: false
      });
    } else {
      this.setData({
        isShowHeight: true
      });
    }
  },

  
  //返回上一级
  cancel: function () {
    App.back()
  },
  //画钻芯的孔位置
  drawCanvas: function (width,height,ctx) {
   console.log(width)
   console.log(height)

   
    //圆心坐标
    var ORIGIN = {
      x: width / 2,
      y: height / 2
    }
    //x轴的起点坐标
    var X_ORIGIN = {
      x: x_MARGIN,
      y: height / 2
    }
  console.log(X_ORIGIN);

    //x轴的终点坐标
    var X_END = {
      x: width - x_MARGIN,
      y: height / 2
    }
    console.log(X_END);

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
    ctx.arc(ORIGIN.x, ORIGIN.y, 50, 0, 2 * Math.PI);
    ctx.stroke();

    //填充文字
    ctx.fillText('E', X_END.x - 5, X_END.y - 10)
    ctx.fillText('N', Y_END.x + 10, Y_END.y + 5)

  }
})