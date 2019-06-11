const App = getApp();
new Page({

  /**
   * 页面的初始数据
   */
  data: {
    pileNo:"" 
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
  reg:function(e){
   var entrustId =  wx.getStorageSync('wtId');
   var data =e.detail.value;
   this.setData({
     'pileNo': data.pileNo
   });
    data.entrustId = entrustId;
    this.submit(data);
  },
  //提交数据
  submit:function(data){
    var accessToken = wx.getStorageSync('accessToken');
    var host = App.globalData.host;
    var that = this;
 
     // 成功跳转的页面
      wx.request({
        url: host + '/api/services/app/WorkRecord/CreatePile',
        method: "POST",
        data: data,
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': "Bearer " + accessToken
        },
        success(res) {
          if (res.statusCode == 200) {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 3000,
              mask: true,
              success: function () {
                //返回上一页并刷新页面 
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                var PileList = prevPage.data.pileList;
                var item = {};
                item.pileNo = that.data.pileNo;
                item.id=100;
                setTimeout(() => {
                 PileList.push(item);  
                  prevPage.setData({
                    pileList: PileList
                  });
                  wx.navigateBack({
                    delta: 1 //想要返回的层级
                  })
                }, 2000)
              }
            })
          } else {
            wx.showModal({
              title: '操作失败',
              content: '当前状态已锁定',
              showCancel: false,
              confirmColor: '#4cd964'
            })
          }
        },
        fali() {
          console.log('接口调用失败');
        }
      })
  }
})