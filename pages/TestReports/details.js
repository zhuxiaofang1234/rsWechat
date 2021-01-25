// pages/Inspections/testInfo.js
const WXAPI = require('../../utils/main.js');
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowBtn: true,
    id: "", //报告id
    show: false,
    showMessage: "true",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = JSON.parse(options.params);
    console.log(params);
    this.setData({
      id: params.id,
      entrustid: params.entrustid,
      pageType: params.pageType,
      reportFlag: params.reportFlag,
      reportcancelflag: params.reportcancelflag
    });
    this.GetReportDetails();
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


  //获取指定数据详情
  GetReportDetails: function () {
    let that = this;
    if (this.data.pageType == 'ReportSubmit') {
      let id = this.data.entrustid
      WXAPI.GetReportSubmitDetails(id).then(res => {
        that.setData({
          projectInfo: res.result.project
        })
      })
    } else {
      WXAPI.GetReportDetails(this.data.pageType, this.data.id).then(res => {
        that.setData({
          projectInfo: res.result.project
        })
      })
    }
  },

  //预览pdf
  toPreviewReport: function () {
    var params = this.data.params;
    var _Token = wx.getStorageSync('rsAccessToken');
    var host = wx.getStorageSync('rshostName');
    wx.showLoading({
      title: '加载中...',
    })
    wx.downloadFile({
      url: host + '/api/services/app/ReportPreview/' + this.data.id,
      header: {
        'Authorization': "Bearer " + _Token,
      },
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功');
            wx.hideLoading()
          }
        })
      }
    })
  },

  //关闭
  cancelBtn: function () {
    this.setData({
      show: false
    })
  },

  //提交报告
  ReportSubmit: function (e) {
    let personUrl = '/api/services/app/ReportSubmit/GetCheckPersonListById?Id=' + this.data.entrustid;
    this.setData({
      show: true,
      showMessage: false,
      title: '提交报告',
      personType: '指定校核人',
      url: '/api/services/app/ReportSubmit/SumbitReport',
      type: 'ReportSubmit'
    })
    this.GetPersonListById(personUrl);
  },

  //校核通过
  toCheckPass: function () {
    let that = this;
    let personUrl = '/api/services/app/ReportCheck/GetVerifyPersonListById?Id=' + this.data.id;
    this.GetPersonListById(personUrl);
    this.setData({
      show: true,
      title: '校核通过',
      personType: '指定审核人',
      url: '/api/services/app/ReportCheck/CheckPass',
      showMessage: false,
      message: "",
      type: 'checkPass'
    })
  },

  //校核驳回
  toCheckReject: function () {
    this.setData({
      show: true,
      title: '校核驳回',
      showMessage: true,
      placeHolderText: '请填写校核驳回的原因',
      url: '/api/services/app/ReportCheck/CheckBack',
      type: 'checkReject'
    });
  },

  //审核通过
  toVerifyPass: function () {
    let that = this;
    let personUrl = '/api/services/app/ReportVerify/GetApprovalPersonListById?Id=' + this.data.id;
    this.GetPersonListById(personUrl);
    this.setData({
      show: true,
      title: '审核通过',
      personType: '指定批准人',
      url: '/api/services/app/ReportVerify/VerifyPass',
      showMessage: false,
      message: "",
      type: 'VerifyPass'
    })
  },

  //审核驳回
  toVerifyReject: function () {
    this.setData({
      show: true,
      title: '审核驳回',
      url: '/api/services/app/ReportVerify/VerifyBack',
      showMessage: true,
      placeHolderText: '请填写审核驳回的原因',
      type: 'VerifyReject'
    });
  },

  //批准通过
  toApprovalPass: function () {
    this.setData({
      url: '/api/services/app/ReportApproval/ApprovalPass',
      type: 'ApprovalPass'
    });
    this.formSubmit()
  },

  //批准驳回
  toApprovalReject: function () {
    this.setData({
      show: true,
      title: '批准驳回',
      url: '/api/services/app/ReportApproval/ApprovalBack',
      showMessage: true,
      placeHolderText: '请填写批准驳回的原因',
      type: 'ApprovalBack'
    })
  },

  //签发报告
  toReportSign: function () {
    var url = '/api/services/app/ReportPublish/Publish';
    this.putData(url, data);
  },

  //申请作废报告
  toReportInvalid: function () {
    this.setData({
      show: true,
      url: '/api/services/app/ReportSign/Invalid',
      dialogTitle: "申请作废",
      showMessage: true,
      placeHolderText: '请填写申请作废的原因',
      type: 'ReportInvalid'
    });
  },

  //确认作废
  toInvalidVerify: function () {
    this.setData({
      show: true,
      url: '/api/services/app/ReportInValid/InvalidVerify',
      dialogTitle: "确认作废",
      message: "",
      placeHolderText: '请填写确认作废的原因',
      type: 'InvalidVerify'
    });
  },

  //撤销作废
  toInvalidRevoke: function () {
    this.setData({
      show: true,
      url: '/api/services/app/ReportInValid/InvalidRevoke',
      dialogTitle: "撤销作废",
      message: "",
      placeHolderText: '请填写撤销作废的原因',
      type: "InvalidRevoke"
    });
  },

  //提交
  formSubmit: function () {
    let url = this.data.url;
    let data = {};
    let id = this.data.id;
    let operatePersonId = this.data.operatePersonId;
    let message = this.data.message;
    let type = this.data.type;
    switch (type) {
      case 'checkPass':
      case 'VerifyPass':
        data.id = id;
        data.operatePersonId = operatePersonId;
        break;
      case 'ApprovalPass': //批准
        data.id = id;
        break;
      case 'checkReject':
      case 'VerifyReject':
      case 'ApprovalBack':
      case 'ReportInvalid':
      case 'InvalidVerify': //确认作废
      case 'InvalidRevoke': //撤销作废
        data.id = id;
        data.message = message;
        if (!message) {
          this.setData({
            error: true
          })
          return
        }
        break;
    }
    WXAPI.changeReportStatus(url, data).then(res => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            prePage.setData({
              page: 0,
              testList: [],
              Filter: '',
            });
            prePage.getPage();
          }
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      message: e.detail.value,
      error: false
    })
  },

  //获取可校核人员列表
  GetPersonListById: function (personUrl) {
    let that = this;
    WXAPI.GetPersonListById(personUrl).then(res => {
      console.log(res)
      that.setData({
        personList: res.result
      })
    })
  },


  //选择指定校核人
  bindPickerChange: function (e) {
    var index = e.detail.value;
    var currentId = this.data.personList[index].id;
    this.setData({
      index: e.detail.value,
      operatePersonId: currentId
    })
  },

  cancel: function () {
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
})