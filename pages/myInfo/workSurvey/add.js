// pages/test/addTestData/addTestData.js
const App = getApp();
const WXAPI = require('../../../utils/main.js');
const Until = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    recordDate: '',
    files: [],
    isFitCondition: 1,
    isFitConditionItems: [{ //芯样完整性
        ConditionText: '是',
        checked: 'true',
        value: 1
      },
      {
        ConditionText: '否',
        value: 0
      }
    ],
    isShowUploader: false,
    ImghashList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wtId: options.Id
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取测试时间
    const nowDate = new Date();
    const testTime = App.format(nowDate);
    //检测日期默认当前时间
    this.setData({
      recordDate: testTime.substring(0, 10)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  //记录时间
  bindRecordDateChange: function (e) {
    this.setData({
      recordDate: e.detail.value
    })
  },

  //是否满足进场条件
  fitConditionChange: function (e) {
    this.setData({
      isFitCondition: e.detail.value
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
    var submitData = {};
    submitData.entrustId = this.data.wtId;
    //当前时间
    const nowDate = new Date();
    const testTime = App.format(nowDate);
    submitData.recordDate = this.data.recordDate + testTime.substring(10);
    submitData.recordMessage = e.detail.value.recordMessage;
    submitData.isFitCondition = this.data.isFitCondition;

    var erroInfo;
    if (!e.detail.value.recordMessage) {
      erroInfo = "请填写现场情况说明";
      this.errorTips(erroInfo);
      return;
    } 
    var files = this.data.files;
    if(files.length==0){
      erroInfo = "请上传现场照片";
      this.errorTips(erroInfo);
      return;
    }
    this.uploadFiles(submitData);
  },

  //提交表单
  submit: function (data) {
    var that = this;
    WXAPI.CreateZxHoleDrillingRecord(data).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function () {
          that.setData({
            lastHcEndDepth: data.hcEndDepth,
            hcNo: parseInt(data.hcNo) + 1,
            files: [],
            isShowUploader: false,
          });
        }
      })
    });
  },

  chooseImage: function (e) {
    var that = this,
      files = this.data.files;
    wx.chooseImage({
      count: 9 - files.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: files.concat(res.tempFilePaths),
          isShowUploader: true
        });
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
  delUploaderImg: function (e) {
    //要删除的图片的id
    var del_id = e.currentTarget.id;
    console.log(del_id);
    console.log(this.data.files);
    var files = this.data.files;
    var that = this;
    wx.showModal({
      title: '操作提醒',
      content: '确定要删除当前图片吗？',
      confirmColor: '#4cd964',
      success(res) {
        if (res.confirm) {
          for(var key in files){
            if(files[key]==del_id){
              files.splice(key,1)
            }
          }
          console.log(files)

          that.setData({
            files:files,
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },


  //批量上传图片
  uploadFiles: function (submitData) { //触发图片上传
    var files = this.data.files;
    wx.showLoading({
      title: '提交中....',
    })
    this.uploadImg({
      url: wx.getStorageSync('rshostName') + '/api/Resurce/Upload', //上传图片服务器API接口的路径 
      path: files,
      submitData:submitData
    });
  },
  //取消
  cancel: function () {
    App.back();
  },
  //批量上传图片
  uploadImg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的那张图片
      successNum = data.successNum ? data.successNum : 0, //上传成功的个数
      failNum = data.failNum ? data.failNum : 0, //失败的个数
      ImghashList = data.ImghashList ? data.ImghashList : []; //存储图片的hash值
    wx.uploadFile({
      filePath: data.path[i],
      name: 'file',
      url: data.url,
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': "Bearer " + wx.getStorageSync('rsAccessToken')
      },
      formData: null,
      success: (res) => {
        if (res.statusCode = 200) {
          successNum++;
          var responseData = JSON.parse(res.data);
          if (responseData.result) {
            var Imghash = responseData.result[0].hash;
            ImghashList.push(Imghash);
          } else {
            failNum++;
          }
        }
      },
      fail: (res) => {
        failNum++;
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用
          console.log('执行完毕')
          console.log('成功：' + successNum + " 失败：" + failNum);
         
          //收集表单数据，并提交
          var recordData = data.submitData;
          recordData.imageList = ImghashList
          console.log(recordData)
          that.submitRecod(recordData);

        } else {
          data.i = i;
          data.successNum = successNum;
          data.failNum = failNum;
          data.ImghashList = ImghashList;
          that.uploadImg(data);
        }
      }
    })
  },

  //提交
  submitRecod(data){
    WXAPI.AddSurveyRecord(data).then(res=>{
      wx.hideLoading();  
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        mask: true,
        success: function (res) {
          //跳转到详情页
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  
          prevPage.getSurveyRecordDetails(prevPage.data.wtId);
          App.back();     
      }
      })

    },err=>{
      wx.hideLoading();  
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

})