// pages/test/addTestData/testList.js
/*选择测点号的桩列表 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pileList: [],
    hasVaildPile:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var pileList = wx.getStorageSync('pileList');
    this.filterPileList(pileList);
    this.setData({
      pileList: pileList
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  //选择测点号
  radioChange: function(e) {
    var pileList = this.data.pileList;
    for (var i = 0, len = pileList.length; i < len; ++i) {
    
      pileList[i].checked = pileList[i].id == e.detail.value;
    }
    this.setData({
      pileList: pileList
    });
    this.getPointInfo(e.detail.value);
  },
  //根据id获取选择测点的信息
  getPointInfo: function(id) {
    var pileList = this.data.pileList;
    for (var i = 0, len = pileList.length; i < len; ++i) {
      if (pileList[i].id == id) {
        //返回上一页并刷新页面 
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        
          prevPage.setData({
            id: pileList[i].id,
            pileNo: pileList[i].pileNo,
            pileBearing: pileList[i].pileBearing,
            height1: pileList[i].height1,
            height2: pileList[i].height2
          }); 

          setTimeout(function(){
            wx.navigateBack({
              delta: 1 //想要返回的层级
            })
          },100) 
      }
    }
  },
  filterPileList: function (pileList){
    if (pileList.length!=0){
      for (var item in pileList) {
        if (pileList[item].pileNo != "") {
          this.setData({
            hasVaildPile: true
          });
        }
      }
    }
  },
  toUpdateTestList:function(){
    wx.navigateTo({
      url: '/pages/test/testList/testList',
    })
  }
})