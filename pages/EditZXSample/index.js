// pages/EditZXSample/index.js
const App = getApp();
const until = require('../../utils/util.js');
const WXAPI = require('../../utils/main.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zxSampleData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      zxSampleData:JSON.parse(options.zxSampleData)
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
 
  //提交修改的取样深度
  submitEditzxSampleData:function(e){
   var data = e.detail.value;
   console.log(data)
   var zxSampleData = this.data.zxSampleData;
    var that = this;
    var erroInfo;
    var sampleNo = data.sampleNo;
    var startPosition = data.startPosition;
    var endPosition = data.endPosition;

    if (!sampleNo) {
      erroInfo = "请填写取样编号";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isInt(sampleNo)) {
      erroInfo = "取样编号请输入整数";
      this.errorTips(erroInfo);
      return
    }
    if (!startPosition) {
      erroInfo = "请填写深度起始位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(startPosition)) {
      erroInfo = "深度起始位置只能是整数";
      this.errorTips(erroInfo);
      return
    }
    if (!endPosition) {
      erroInfo = "请填写深度终止位置";
      this.errorTips(erroInfo);
      return;
    } else if (!App.isNumber(endPosition)) {
      erroInfo = "深度终止位置只能是整数";
      this.errorTips(erroInfo);
      return
    }
    data.id = zxSampleData.id;
    data.sampleNo = sampleNo;
    data.zxHoleId = zxSampleData.zxHoleId;
    data.startPosition = startPosition;
    data.endPosition = endPosition;
    data.type = 1;
    this. UpdateZxHoleSampleDepth(data);
  },
  //更新钻芯取样深度
  UpdateZxHoleSampleDepth:function(data){     
        wx.showLoading({
          title: '保存中....',
        })
      WXAPI.UpdateZxHoleSampleDepth(data).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success:function(){
            //更新孔的基本信息
            var ZXHoleDetails =  wx.getStorageSync('ZXHoleDetails');
            var zxHoleSampleDepthList = ZXHoleDetails.zxHoleSampleDepthList;
            console.log(ZXHoleDetails);
            console.log(zxHoleSampleDepthList);
            //根据id找出修改元素的位置
            var currentIndex;
            for(var i= 0; i<zxHoleSampleDepthList.length;i++){
              if(zxHoleSampleDepthList[i].id==data.id){
                  currentIndex = i
              }
            }
            zxHoleSampleDepthList.splice(currentIndex,1,data);
              //返回上一页并刷新页面 
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                sampleList:zxHoleSampleDepthList
              });
              wx.navigateBack({
                delta: 1 //想要返回的层级
              })
            console.log(zxHoleSampleDepthList)
          }
        });     

      },err=>{
        wx.hideLoading();
      })
  },
  //错误提示
  errorTips: function(erroInfo) {
    var that = this;
    this.setData({
      showTopTips: true,
      erroInfo: erroInfo
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  }
})