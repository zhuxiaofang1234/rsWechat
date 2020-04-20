// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../utils/main.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hcStartTime:'2019-06-28',
    hcEndTime:'2019-07-30',
    hcNo:1,
    files: [],
    isShowUploader:false,
    currentTime:"",
    lastHcStartDepth:0,
    lastHcDepth:0,
    hcXyCount:"",
    xyLength:"",
    endLength:0,
    startLength:0,
    xyResidual:0,
    Imghash:"",
    uploadtext:'上传成功',
    uploadFlag:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var date = App.format(new Date()) ;
    var zxDate = date.substring(0, 10);
    this.setData({
      currentTime: date.substring(date.length - 9),
      hcStartTime: zxDate,
      hcEndTime: zxDate,
      holeId: options.holeId,
      pileId:options.pileId
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

  //到底时余尺
  getEndLength:function(e){
    var EndLength = parseFloat(e.detail.value);
    var StartLength = parseFloat(this.data.startLength);
    var XyLength = parseFloat(EndLength - StartLength).toFixed(2);
    this.setData({
      xyLength: XyLength,
      endLength: EndLength
    });
  },

  //提钻时余尺
  getStartLength:function(e){
    var StartLength = parseFloat(e.detail.value);
    var EndLength = parseFloat(this.data.endLength);
    var XyLength = parseFloat(EndLength - StartLength).toFixed(2);
    this.setData({
      xyLength: XyLength,
      startLength: StartLength
    });
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

  //提交表单
  reg: function (e) {
    var data = e.detail.value;
    console.log(data);
    /**表单验证 */
    data.zxHoleId = this.data.holeId;
    data.pileId = this.data.pileId;
    var erroInfo;
    if (!data.hcNo) {
      erroInfo = "请填写回次编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.hcNo)) {
      erroInfo = "回次编号只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.hcXyCount) {
      erroInfo = "请填写芯样数量";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(data.hcXyCount)) {
      erroInfo = "芯样数量只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.endLength){
      erroInfo = "请填写到底时余尺";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.endLength)){
      erroInfo = "到底时余尺只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.startLength) {
      erroInfo = "请填写提钻时余尺";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.startLength)) {
      erroInfo = "提钻时余尺只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.xyLength) {
      erroInfo = "请填写芯样长度";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.xyLength)) {
      erroInfo = "芯样长度只能为数值";
      this.errorTips(erroInfo);
      return;
    }
    if (!data.xyResidual) {
      erroInfo = "请填写残留芯样";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(data.xyResidual)) {
      erroInfo = "残留芯样只能为数值";
      this.errorTips(erroInfo);
      return;
    }

    var startLength, endLength, xyLength, xyResidual, hcDepth;
    startLength = parseFloat(data.startLength) * 1000;  //提钻时余尺
    endLength = parseFloat(data.endLength) * 1000;  //到底时余尺
    xyLength = parseFloat(data.xyLength) * 1000;  //芯样长度
    xyResidual = parseFloat(data.xyResidual) * 1000; //残留芯样
    hcDepth = endLength - startLength; //钻进深度= 到底时余尺-提钻时余尺；

    var hcStartDepth = this.data.lastHcStartDepth * 1000 + this.data.lastHcDepth * 1000; //回次开始标尺 = 上一次的回次开始标尺+上一次的钻进深度。
    var hcEndDepth = hcStartDepth + hcDepth; //回次截止标尺 = 回次开始标尺 + 钻进深度

    data['startLength'] = startLength
    data['endLength'] = endLength
    data['xyLength'] = xyLength
    data['xyResidual'] = xyResidual
    data['hcDepth'] = hcDepth
    data['hcStartDepth'] = hcStartDepth
    data['hcEndDepth'] = hcEndDepth
    data['hcStartTime'] = this.data.hcStartTime + this.data.currentTime;
    data['hcEndTime'] = this.data.hcEndTime + this.data.currentTime;
    data['Imghash'] = this.data.Imghash;
    this.submit(data);
  },

  //提交表单
  submit:function(data){
    var that = this;
    WXAPI.CreateZxHoleDrillingRecord(data).then(res=>{
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {
          that.setData({
            lastHcStartDepth: data.hcStartDepth,
            lastHcDepth: data.hcDepth,
            hcNo: parseInt(data.hcNo)+1,
            files: [],
            isShowUploader: false,
            hcXyCount: "",
            xyLength: "",
            endLength: "",
            startLength: "",
            xyResidual: "",
          });
        }
      })
    });
  },
  //开钻时间
  bindStartDateChange: function (e) {
    this.setData({
      hcStartTime: e.detail.value
    })
  },
  //结束时间
  bindEndDateChange: function (e) {                          
    this.setData({
      hcEndTime: e.detail.value
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          isShowUploader:true
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
  delUploaderImg:function(e){
    var that = this;
    wx.showModal({
      title: '操作提醒',
      content: '确定要删除当前图片吗？',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          that.setData({
            files:[],
            Imghash:"",
            isShowUploader: false 
          });  
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })  
  },
  //上传图片
  uploadFile:function(){
    var that = this;
    var files = this.data.files;
    wx.uploadFile({
      url: wx.getStorageSync('rshostName')+'/api/Resurce/Upload',  //上传图片服务器API接口的路径 
      filePath: files[0],//要上传文件资源的路径 String类型
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",//记得设置
        'Authorization': "Bearer " + wx.getStorageSync('rsAccessToken')
      },
      success: function (res) { //当调用uploadFile成功之后，再次调用后台修改的操作
        console.log(res)
        if(res.statusCode = 200) {
         var responseData = JSON.parse(res.data);
         if(responseData.result){
          var Imghash = responseData.result[0].hash;
          that.setData({
            Imghash: Imghash,
            uploadtext:'上传成功',
            uploadFlag:true
          });
         }else{
          that.setData({
            uploadtext:'上传失败',
            uploadFlag:false
          });
         }    
        }
      } 
    }); 
  },
  //提交回次记录
  cancel: function () {
    App.back();
  }
})