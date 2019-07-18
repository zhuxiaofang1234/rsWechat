// pages/login/login.js
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    paasword:'',
    serverType: ["http://test.rocksea.net.cn:9000/"],
    serverIndex: 0,
    defaultPicker:'请选择服务器'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.connectToSoap();
   
  },
  getAccount:function(e){
    this.setData({
      account: e.detail.value
    })
  },
  getPwd: function (e) {
    this.setData({
      paasword: e.detail.value
    })
  },

  //服务器类型
  bindServerChange: function (e) {
    var serverType = this.data.serverType;
    var serverIndex = e.detail.value;
    this.setData({
      defaultPicker: serverType[serverIndex]
    })
    App.globalData.host = this.data.defaultPicker
  },

  login:function(e){
    var account = this.data.account;
    var password = this.data.paasword;
    var host = App.globalData.host;
    if (account.length == 0 || password.length == 0) {
      wx.showModal({
        title: '登录失败',
        content: '账号或密码不能为空',
        showCancel:false,
        confirmColor:'#4cd964'
      })
    } else {
      // 成功跳转的页面
      wx.request({
        url: host +'/api/TokenAuth/Authenticate',
        method: "POST",
        data: {
          "userNameOrEmailAddress": account,
          "password": password,
          "rememberClient":true
        },  
        header: {
          'content-type':'application/json' // 默认值
        },
        success(res) {
          if (res.statusCode==200){
            var accessToken = res.data.result.accessToken;
        //存储token值
            wx.setStorageSync('accessToken', accessToken);
           
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 3000,
              mask:true,
              success: function () {
                //跳转到选择检测方法页面
                wx.redirectTo({
                  url: '/pages/testMode/index?page=first',
                })
              }
            }) 
          }else{
            wx.showModal({
              title: '登录失败',
              content: '账号或密码错误',
              showCancel: false,
              confirmColor: '#4cd964'
            })
          } 
        },
        fali(){
          console.log('接口调用失败');
        }
      })
    }
  },

  //webService接口
  connectToSoap: function () {
    var that = this;
    var method = 'ServerTransferShortInfoJsonListV3';                                  
    var wsdlurl='http://update.rocksea.com.cn/rsservice.asmx';       
    var tmpNamespace ='http://rsonline.net.cn/';

    var datacopy = '<?xml version="1.0" encoding="utf-8"?>';
    datacopy += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://rsonline.net.cn/">';
    datacopy += '<soapenv:Header/>';
    datacopy += '<soapenv:Body>';
    datacopy += '<ser:ServerTransferShortInfoJsonListV3>';
    datacopy += '</ser:ServerTransferShortInfoJsonListV3>';
    datacopy += '</soapenv:Body>';
    datacopy += '</soapenv:Envelope>';
    
    wx.request({
      url: wsdlurl,
      data: datacopy,
      method: 'POST',
      header: {
        'content-type': 'text/xml; charset=utf-8',
        'SOAPAction': tmpNamespace + method,              
},
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
    
      }
})
},
//解析XML



})