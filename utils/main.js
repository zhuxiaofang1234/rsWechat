const App = getApp();

/***封装网络请求*/
const request = (url, method, data, type = "application/json") => {
  var host = wx.getStorageSync('rshostName');
  var _Token = wx.getStorageSync('rsAccessToken');
  var _url = host + url;
  let options = {
    url: _url,
    header: {
      "content-type": type
    },
    method,
    data,
    dataType: 'json',
  }
  if (_Token) options.header.Authorization = "Bearer " + _Token;

  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success(res) {
        let code = res.statusCode;
        if (code == 200) {
          resolve(res.data);

        } else if (code == 401) {
          checkStatus(url, method, data).then(res => {
            resolve(res)
          })
        } else if (code == 403) {
          wx.showModal({
            title: '温馨提示',
            content: '无访问权限！',
            showCancel: false,
            confirmColor: '#4cd964'
          })
          reject(res)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '操作失败！，请联系管理员',
            showCancel: false,
            confirmColor: '#4cd964'
          })
          reject(res)
        }
      }
    })
  })
}

let isRefreshing = true

function checkStatus(url, method, data) {
  // 刷新token的函数,这需要添加一个开关，防止重复请求
  if (isRefreshing) {
    refreshTokenRequst()
  }
  isRefreshing = false;
  // 将token刷新成功后的回调请求缓存
  const retryOriginalRequest = new Promise((resolve) => {
    addSubscriber(() => {
      resolve(request(url, method, data))
    })
  });
  return retryOriginalRequest;
}


// 观察者
let subscribers = [];

function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback();
  })
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

//刷新token函数
function refreshTokenRequst() {
  var refreshToken = wx.getStorageSync("refreshToken");
  var host = wx.getStorageSync('rshostName');
  wx.request({
    url: host + '/api/TokenAuth/RefreshToken?RefreshToken=' + refreshToken,
    method: "POST",
    dataType: "json",
    success: (res) => {
      if (res.statusCode == 200) {
        // 刷新完成后,将刷新token存储到本地
        var accessToken = res.data.result.accessToken;
        var refreshToken = res.data.result.refreshToken;
        var userId = res.data.result.userId;
        wx.setStorageSync("rsAccessToken", accessToken);
        wx.setStorageSync("refreshToken", refreshToken)
        wx.setStorageSync("userId", userId)

        // 并且将所有存储到观察者数组中的请求重新执行。
        onAccessTokenFetched();
        isRefreshing = true;
      } else {
        toLogin();
      }
    },
    fail: () => {
      toLogin()
    }
  })
}

// 前往登录页面 清空状态
function toLogin() {
  wx.showToast({
    title: '登录失效,重新登录',
    icon: "none",
    success: () => {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        })
        subscribers = [];
        isRefreshing = true;
      }, 1600);
    }
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  WorkRecordList: (data) => {
    return request('/api/services/app/WorkRecord/GetPaged?Sorting=id%20desc', 'GET', data)
  },
  GetEntrustDetails: (data) => { //获取委托单详情
    return request('/api/services/app/WorkRecord/GetEntrustInfoById', 'GET', data)
  },
  GetPileListByEntrustId: (wtId, modeType) => { //根据委托单id获取测点列表
    return request('/api/services/app/' + modeType + 'Data/GetPileListByEntrustId?EntrustId=' + wtId, 'GET')
  },
  GetPileDetails: (data) => { //获取单根桩的详情信息
    return request('/api/services/app/WorkRecord/GetPileById', 'GET', data)
  },
  UpdatePile: (data) => { //更新测点信息
    return request('/api/services/app/WorkRecord/UpdatePile', 'PUT', data)
  },
  GetPileList: (data, modeType) => { //根据检测编号获取桩列表
    return request('/api/services/app/' + modeType + 'Data/GetPileList', 'GET', data)
  },
  UUIDGenerator: () => { //生成baseInfoId
    return request('/api/Tools/UUIDGenerator', 'GET')
  },
  AddZtBaseData: (data) => { //添加触探试验基本数据
    return request('/api/services/app/ZTData/Create', 'POST', data)
  },
  AddZtRecord: (data) => { //添加触探试验记录
    return request('/api/services/app/ZTData/CreateDetails', 'POST', data)
  },
  GetDepthList: (data) => { //获取触探深度列表
    return request('/api/services/app/ZTData/GetById', 'GET', data)
  },
  ReviseDetails: (data) => { //修订未分析触探的试验采样数据
    return request('/api/services/app/ZTData/ReviseDetails', 'POST', data)
  },
  GetDepthDetails: (data) => { //获取a深度详情
    return request('/api/services/app/ZTData/GetDetailById', 'GET', data)
  },
  UpDateZTDataBaseData: (data) => { //更新圆锥动力触探基本实验信息
    return request('/api/services/app/ZTData/Update', 'PUT', data)
  },
  UpdateDepthDetails: (data) => { //更新深度信息
    return request('/api/services/app/ZTData/UpdateDetails', 'PUT', data)
  },
  GetZTDatadetails: (data) => { //获取触探试验数据详情
    return request('/api/services/app/ZTData/GetById', 'GET', data)
  },
  FinishZTtest: (data) => { //结束触探试验
    return request('/api/services/app/ZTData/Finish', 'GET', data)
  },
  GetUserData: () => { //获取用户信息
    return request('/api/services/app/Session/GetCurrentLoginInformations', 'GET')
  },
  GetMyTestTask: (data) => { //我的检测任务
    return request('/api/services/app/WorkSures/GetPaged?Sorting=id%20desc', 'GET', data)
  },
  GetTaskDetails: (data) => { //检测任务详情
    return request('/api/services/app/WorkSures/GetById', 'GET', data)
  },
  TaskSure: (data) => { //工作确认或者驳回
    return request('/api/services/app/WorkSures/WorkSure', 'POST', data)
  },
  GetZXPileList: (data) => { //获取钻芯检测完成孔列表
    return request('/api/services/app/ZXData/GetPileList', 'GET', data)
  },
  GetHoleList: (PileId) => { //根据桩id获取钻芯孔的列表信息
    return request('/api/services/app/ZXData/GetHoleList?PileId=' + PileId, 'GET')
  },
  EndHole: (data) => {
    return request('/api/services/app/ZXData/EndHole', 'PUT', data)
  },
  CreateZxHoleDrillingRecord: (data) => { //添加钻芯回次记录表
    return request('/api/services/app/ZXData/CreateZxHoleDrillingRecord', 'POST', data)
  },
  UpdateZxHoleDrillingRecord: (data) => { //更新钻芯回次记录表
    return request('/api/services/app/ZXData/UpdateZxHoleDrillingRecord', 'PUT', data)
  },
  GetHoleDetailsInfo: (data) => { //获取钻芯的孔的详情信息
    return request('/api/services/app/ZXData/GetById', 'GET', data);
  },
  UpdateZxHoleSampleDepth: (data) => { //更新钻芯取样
    return request('/api/services/app/ZXData/UpdateZxHoleSampleDepth', 'PUT', data);
  },
  UpdateZxHoleCoreDefect: (data) => { //更新芯样缺陷
    return request('/api/services/app/ZXData/UpdateZxHoleCoreDefect', 'PUT', data);
  },
  UpdateZxHoleForceLayer: (data) => { //更新持力层信息
    return request('/api/services/app/ZXData/UpdateZxHoleForceLayer', 'PUT', data);
  },
  UpdateHole: (data) => { //更新孔的信息
    return request('/api/services/app/ZXData/UpdateHole', 'PUT', data);
  },
  DeleteZxHoleForceLayer: (id) => { //删除持力层信息
    return request('/api/services/app/ZXData/DeleteZxHoleForceLayer?Id=' + id, 'DELETE')
  },
  DeleteZxHoleSampleDepth: (id) => { //删除芯样取样，持力层取样信息
    return request('/api/services/app/ZXData/DeleteZxHoleSampleDepth?Id=' + id, 'DELETE')
  },
  DeleteZxHoleCoreDefect: (id) => { //删除芯样缺陷描述
    return request('/api/services/app/ZXData/DeleteZxHoleCoreDefect?Id=' + id, 'DELETE')
  },
  ModifyUserStamp: (data) => { //修改当前用户签章
    return request('/api/services/app/Session/ModifyUserStamp', 'POST', data)
  },
  GetPic: (hash) => { //获取图片
    return request('/api/Resurce/Base64/' + hash, 'GET')
  },
  GetUserStamp: () => { //获取用户签章
    return request('/api/services/app/Session/GetUserStamp', 'GET')
  },
  DoDetect: (data) => { //进场
    return request('/api/services/app/WorkSures/DoDetect', 'PUT', data)
  },
  FinishDetect: (data) => { //出场
    return request('/api/services/app/WorkSures/FinishDetect', 'PUT', data)
  },
  SurveyRecord: (data) => { //获取现场踏勘
    return request('/api/services/app/SurveyRecord/GetPaged?Sorting=id%20desc', 'GET', data)
  },
  SurveyRecordDetails: (data) => { //踏勘记录详情
    return request('/api/services/app/SurveyRecord/GetById', 'GET', data)
  },
  AddSurveyRecord: (data) => { //新增踏勘记录
    return request('/api/services/app/SurveyRecord/AddRecord', 'POST', data)
  },
  JZMonitorList: (data) => { //获取测试中的数据
    return request('/api/services/app/Monitor/GetTestingByPageList', 'GET', data)
  },
  GetTestData: (data) => { //获取检测数据
    return request('/api/services/app/TestData/GetPaged', 'GET', data)
  },
  GetWorkSchedule: (type, data) => { //获取工作安排列表
    return request('/api/services/app/' + type + '/GetPaged?Sorting=id%20desc', 'GET', data)
  },
  GetReportPaged: (pageType, data) => {
    return request('/api/services/app/' + pageType + '/GetPaged', 'GET', data);
  },
  GetReportSubmitDetails: (id) => {
    return request('/api/services/app/ReportSubmit/GetInfoById?Id=' + id, 'GET');
  },
  GetReportDetails: (pageType, id) => {
    return request('/api/services/app/' + pageType + '/GetById?Id=' + id, 'GET');
  },
  GetPersonListById: (url) => {
    return request(url, 'GET');
  },
  SumbitReport: (data) => { //提交报告
    return request('/api/services/app/ReportSubmit/SumbitReport', 'POST', data)
  },
  changeReportStatus: (url, data) => { //报告校核、审核
    return request(url, 'PUT', data)
  },
  //获取工作安排委托详情
  WorkScheduleDetails: (type, id) => {
    return request('/api/services/app/' + type + '/GetById?Id=' + id, 'GET');
  },
  //修改工作安排委托详情
  UpdateWorkSchedule: (type,data) => {
    return request('/api/services/app/' + type + '/UpdateWorkSchedule', 'PUT', data)
  },
  //根据委托id选择人员列表
  GetPersonList: (url) => {
    return request(url, 'GET')
  },
  //根据委托id选择设备列表
  GetDeviceList: (type, id) => {
    return request('/api/services/app/' + type + '/GetTestDeviceListById?Id=' + id, 'GET');
  }
}