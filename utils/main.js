const App = getApp();

const getToken = () => {
 return wx.getStorageSync('rsAccessToken')
}

const getHost = () => {
  return  wx.getStorageSync('rshostName')
}

/***封装网络请求*/
const request = (url, method, data) => {
  var host = getHost();
  var  _Token = getToken();
  var _url = host + url;
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': "Bearer " + _Token
      },
      success(request) {
        var code = request.statusCode;
        if (code == 200){
            resolve(request.data)
        } else if (code == 401){
          
            App.redirectToLogin();
           //token过期，清除缓存的数据
            App.removeLoginInfo();
            reject(request)
      
        } else{
          wx.showModal({
            title: '温馨提示',
            content: '操作失败！，请联系管理员',
            showCancel: false,
            confirmColor: '#4cd964'
          })  
          reject(request)
        } 
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        
      }
    })
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
  getToken,
  getHost,
  WorkRecordList: (data) => {
    return request('/api/services/app/WorkRecord/GetPaged?Sorting=id%20desc','GET',data)
  },
  GetEntrustDetails:(data) => { //获取委托单详情
    return request('/api/services/app/WorkRecord/GetEntrustInfoById', 'GET', data)
  },
  GetPileListByEntrustId:(wtId,modeType)=>{//根据委托单id获取测点列表
    return request('/api/services/app/' + modeType + 'Data/GetPileListByEntrustId?EntrustId=' + wtId, 'GET')
  },
  GetPileDetails:(data) => { //获取单根桩的详情信息
    return request('/api/services/app/WorkRecord/GetPileById', 'GET', data)
  },
  UpdatePile:(data) => { //更新测点信息
    return request('/api/services/app/WorkRecord/UpdatePile', 'PUT', data)
  },
  GetPileList: (data, modeType) => {//根据检测编号获取桩列表
    return request('/api/services/app/' + modeType +'Data/GetPileList', 'GET', data)
  },
  UUIDGenerator:() => { //生成baseInfoId
    return request('/api/Tools/UUIDGenerator', 'GET')
  },
  AddZtBaseData:(data) => { //添加触探试验基本数据
    return request('/api/services/app/ZTData/Create', 'POST',data)
  },
  AddZtRecord: (data) => {//添加触探试验记录
    return request('/api/services/app/ZTData/CreateDetails', 'POST', data)
 },
 GetDepthList: (data)=> { //获取触探深度列表
   return request('/api/services/app/ZTData/GetById', 'GET', data)
 },
  ReviseDetails: (data) => {//修订未分析触探的试验采样数据
    return request('/api/services/app/ZTData/ReviseDetails', 'POST', data)
  },
 GetDepthDetails: (data) => { //获取a深度详情
   return request('/api/services/app/ZTData/GetDetailById', 'GET', data)
  },
  UpDateZTDataBaseData:(data)=>{//更新圆锥动力触探基本实验信息
    return request('/api/services/app/ZTData/Update', 'PUT', data)
  },
  UpdateDepthDetails: (data) => { //更新深度信息
    return request('/api/services/app/ZTData/UpdateDetails', 'PUT', data)   
  },
  GetZTDatadetails:(data)=> { //获取触探试验数据详情
    return request('/api/services/app/ZTData/GetById', 'GET', data)
  },
  FinishZTtest:(data)=> { //结束触探试验
    return request('/api/services/app/ZTData/Finish', 'GET', data)
  },
  GetUserData: () => {//获取用户信息
    return request('/api/services/app/Session/GetCurrentLoginInformations', 'GET')   
  },
  GetMyTestTask: (data) => { //我的检测任务
    return request('/api/services/app/WorkSures/GetPaged?Sorting=id%20desc', 'GET',data)   
  },
  GetTaskDetails:(data)=>{//检测任务详情
    return request('/api/services/app/WorkSures/GetById', 'GET', data)   
  },
  TaskSure: (data) => {//工作确认或者驳回
    return request('/api/services/app/WorkSures/WorkSure', 'POST', data)  
  },
  GetZXPileList: (data)=> { //获取钻芯检测完成孔列表
    return request('/api/services/app/ZXData/GetPileList','GET',data)
  },
  GetHoleList: (PileId)=>{ //根据桩id获取钻芯孔的列表信息
    return request('/api/services/app/ZXData/GetHoleList?PileId='+PileId,'GET') 
  },
  EndHole: (data)=> {
    return request('/api/services/app/ZXData/EndHole', 'PUT', data)
  },
  CreateZxHoleDrillingRecord: (data)=> { //添加钻芯回次记录表
    return request('/api/services/app/ZXData/CreateZxHoleDrillingRecord', 'POST', data)
  },
  GetHoleDetailsInfo:(data)=>{ //获取钻芯的孔的详情信息
    return request('/api/services/app/ZXData/GetById','GET',data);
  },
  UpdateZxHoleSampleDepth:(data)=>{ //更新钻芯取样
    return request('/api/services/app/ZXData/UpdateZxHoleSampleDepth', 'PUT', data);
  },
  UpdateZxHoleForceLayer:(data)=>{ //更新持力层信息
    return request('/api/services/app/ZXData/UpdateZxHoleForceLayer', 'PUT', data);
  },
  DeleteZxHoleForceLayer:(id)=> {//删除持力层信息
    return request('/api/services/app/ZXData/DeleteZxHoleForceLayer?Id='+id,'DELETE')
  },
  DeleteZxHoleSampleDepth: (id) => {//删除芯样取样，持力层取样信息
    return request('/api/services/app/ZXData/DeleteZxHoleSampleDepth?Id=' + id, 'DELETE')
  },
  ModifyUserStamp:(data)=>{//修改当前用户签章
    return request('/api/services/app/Session/ModifyUserStamp', 'POST',data)
  },
  GetPic:(hash)=>{//获取图片
    return request('/api/Resurce/Base64/'+hash,'GET')
  },
  GetUserStamp:()=>{//获取用户签章
    return request('/api/services/app/Session/GetUserStamp', 'GET')
  }
}




