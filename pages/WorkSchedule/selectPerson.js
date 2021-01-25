// pages/test/addTestData/testList.js
const WXAPI = require('../../utils/main.js');
const Until = require('../../utils/util.js');
/*选择测点号的桩列表 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadingPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var wtId = options.wtId;
    var that = this;
    this.setData({
      personId: options.personId,
      personType: options.type,
      pageType:options.pageType,
      wtId: options.wtId,
      disablePersonId: options.disablePerson
    });
    //加载人员列表
    that.GetPersonList(wtId);
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

  //选择测点号
  radioChange: function (e) {
    var personId = e.detail.value;
    this.getCheckPersonList(personId)
  },

  //获取人员列表
  GetPersonList: function (wtId) {
    var that = this;
    var url;
    if (that.data.personType == 'testLeader') {
      url = '/api/services/app/WorkSchedule/GetTestLeaderPersonListById?Id=' + wtId
    } else {
      if(this.data.pageType=='WorkSchedule'){
        url = '/api/services/app/WorkSchedule/GetArrangePersonListById?Id=' + wtId
      }else if(this.data.pageType=='PersonSchedule'){
        url = '/api/services/app/PersonSchedule/GetArrangePersonListById?Id=' + wtId
      }  
    }
    WXAPI.GetPersonList(url).then(res => {
      var personList = res.result;
      var personId = that.data.personId;
      var disablePersonId = that.data.disablePersonId;
      that.setData({
        loadingPage: false,
        personList: personList
      });
      that.getCheckPersonList(personId, disablePersonId,'first');
    })
  },

  getCheckPersonList: function (personId, disablePersonId,type) {
    var personList = this.data.personList;
    var personType = this.data.personType;
    var checkedPerson;
    var that = this;
    for (var i = 0, len = personList.length; i < len; ++i) {
      var id = personList[i].personId;
      personList[i].checked = id == personId;
      personList[i].disabled = id == disablePersonId;
      if (id == personId) {
        checkedPerson = personList[i]
      }
    }
    this.setData({
      personList: personList
    });

    if (checkedPerson && !type) {
      var personId = checkedPerson.personId;
      var personName = checkedPerson.personName
      let pages = getCurrentPages(); //页面对象
      let prevpage = pages[pages.length - 2]; //上一个页面对象
      if (personType == 'testLeader') {
        prevpage.setData({
          'testLeader.testLeaderId':personId,
          'testLeader.testLeaderName': personName
        })
      }else if(personType=='testPerson1'){
        prevpage.setData({
          'testPerson1.testPerson1Id':personId,  
          'testPerson1.testPerson1Name':personName
        })
      }else if(personType=='testPerson2'){
        prevpage.setData({
          'testPerson2.testPerson2Id':personId,  
          'testPerson2.testPerson2Name':personName
        })
      }
      wx.navigateBack({
        delta:1
      })
    }
  }
})