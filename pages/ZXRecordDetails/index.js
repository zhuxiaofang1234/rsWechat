// pages/ZXRecordDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取缓存钻芯孔的数据
      var recordId = options.id;
      var ZXHoleDetails = wx.getStorageSync('ZXHoleDetails');
      console.log(ZXHoleDetails);
      var zxHoleDrillingRecordList = ZXHoleDetails.zxHoleDrillingRecordList;
    
      if(zxHoleDrillingRecordList.length!=0){
        var curRecord = zxHoleDrillingRecordList.filter(function(item){
          return item.id == recordId
        })
      }  
      this.setData({
        recordData:curRecord[0]
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
   //点击查看图片
   toPreviewImg: function (e) {
    var hash = e.currentTarget.dataset.hash;
    var host =  wx.getStorageSync('rshostName');
    var url = host+'/api/Resurce/FileResult/'+hash;
    var urls=[];
    urls.push(url);
      wx.previewImage({
        current: urls[0],
        urls:urls,
        success:function(data){
          console.log(data)
        },
        fail:function(err){
          console.log(err)
        }
      })
  }


})