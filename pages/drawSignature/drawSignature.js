// canvas 全局配置
const WXAPI = require('../../utils/main.js');
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
//获取系统信息
wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth;//设备宽度
    canvash = res.windowHeight; //设备高度
  }
});
//注册页面
Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  canvasStart: function (event) {//笔迹开始
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);  //CanvasTouch 对象
    arry.push(event.changedTouches[0].y);

  },
  canvasMove: function (event) {
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

    context.clearRect(0, 0, 700, 730);
    context.setStrokeStyle('#000'); //设置字体颜色
    context.setLineWidth(4);    //设置线条的宽度
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();

    context.draw(false); //不保留上一次的绘制结果
  }, 

   //笔迹停止
  canvasEnd: function (event) {
    isButtonDown = false;
  },

  //清除画布
  cleardraw: function () {
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, 700, 730);
    context.draw(true);
  },

  //保存到手机
  getImg: function () {
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
      fileType:'png',
      success: function (res) {
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res) { 
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
    wx.getFileSystemManager().readFile({
      filePath: res.tempFilePath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        console.log('data:image/png;base64,' + res.data)
      }
    })
  },

  //提交签名到后台
 subCanvas:function(){
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
     destWidth:50,
     destHeight:80,
     fileType: 'png',
     success: function (res) {
       console.log(res.tempFilePath);
       wx.getFileSystemManager().readFile({
         filePath: res.tempFilePath, //选择图片返回的相对路径
         encoding: 'base64', //编码格式
         success: res => { //成功的回调
           console.log('data:image/png;base64,' + res.data);
          var data={}; 
           data.userStampString = res.data
           WXAPI.ModifyUserStamp(data).then(res=>{
             wx.showToast({
               title: '已提交成功',
               icon: 'success',
               duration: 2000
             })

           },err=>{

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
  onLoad: function (options) {
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
  }
})