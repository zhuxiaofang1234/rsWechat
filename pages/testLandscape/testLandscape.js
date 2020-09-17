// canvas 全局配置
const WXAPI = require('../../utils/main.js');

var context = null; // 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;
var isReDraw = true;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;

//注册页面
Page({
  canvasIdErrorCallback: function(e) {
    console.error(e.detail.errMsg)
  },
  canvasStart: function(event) { //笔迹开始
    if (isReDraw) { //是否重绘
      isButtonDown = true;
      arrz.push(0);
      arrx.push(event.changedTouches[0].x); //CanvasTouch 对象
      arry.push(event.changedTouches[0].y);
    }
  },
  canvasMove: function(event) {
    if (isReDraw) {
      if (isButtonDown) {
        arrz.push(1);
        arrx.push(event.changedTouches[0].x);
        arry.push(event.changedTouches[0].y);
      };

      //开始渲染
      for (var i = 0; i < arrx.length; i++) {
        if (arrz[i] == 0) {
          context.moveTo(arrx[i], arry[i])
        } else {
          context.lineTo(arrx[i], arry[i])
        };
      };
      context.setStrokeStyle('#000'); //设置字体颜色
      context.setLineWidth(4); //设置线条的宽度
      context.setLineCap('round');
      context.setLineJoin('round');
      context.stroke();
      context.draw(false); //不保留上一次的绘制结果
    }
  },

  //笔迹停止
  canvasEnd: function(event) {
    isButtonDown = false;
  },

  //清除画布
  cleardraw: function() {
    isReDraw = true;
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, 700, 730);
    context.draw(true);
  },

  //获取签名
  getImg: function(hash) {
    WXAPI.GetPic(hash).then(res => {
      var src = "data:image/jpg;base64," + res.result;
    }, err => {})
  },

  //提交签名到后台
  subCanvas: function() {
    var that = this;
    if (!isReDraw){
      return;
    }
    if (arrx.length == 0) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    };
    //生成图片
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      destWidth: 230,
      destHeight: 100,
      fileType: 'png',
      success: function(res) {
        console.log(res)
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            var data = {};
            data.userStampString = res.data
            wx.showLoading({
              title: '提交中...',
            })
            WXAPI.ModifyUserStamp(data).then(res => {
              wx.hideLoading();
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000,
                success:function(){
                  //返回上一页并刷新页面 
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2];
                  prevPage.setData({
                    isSign: '去查看'
                  });
                  //刷新深度列表
                  wx.navigateBack({
                    delta: 1
                  })

                  //更新签名缓存
                  that.updateUserStamp()
                }
              })
            }, err => {

            })
          }
        })
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    src: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
   
    //获取hash值
    var userStamp = wx.getStorageSync('userStamp');
    if (userStamp) {
      isReDraw = false
      //获取图片的src
      WXAPI.GetPic(userStamp).then(res => {
        var base64Code = "data:image/jpg;base64," + res.result;
        //声明文件系统
        const fs = wx.getFileSystemManager();
        //随机定义路径名称
        var times = new Date().getTime();
        var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
        //将base64图片写入
        fs.writeFile({
          filePath: codeimg,
          data: base64Code.slice(22),
          encoding: 'base64',
          success: () => {
            context.drawImage(codeimg, 0, 0, 470, 200);
            context.draw();
          }
        });
      })
    }
  },
  //更新 userStamp的缓存
updateUserStamp(){
  WXAPI.GetUserStamp().then(res=>{
    var newUserStamp = res.result;
    wx.setStorageSync('userStamp', newUserStamp)
  })
}
})