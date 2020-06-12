import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// 添加短信发送
export const addMsgSend = (data) => {
  return axios.request({
    url: '/sms/addMsgSend',
    data: data,
    method: 'post'
  })
}
// 短信中心首页 短信发送 查询
export const queryMsgSend = (data) => {
  return axios.request({
    url: '/sms/queryMsgSend',
    params: data,
    method: 'get'
  })
}

// 编辑短信发送
export const updateMsgSend = (data) => {
  return axios.request({
    url: '/sms/updateMsgSend',
    data: data,
    method: 'put'
  })
}
// 下载短信接收人模版
export const downloadTemplate = (data) => {
  // location.href = baseUrl + '/sms/downloadTemplate'
  location.href = 'http://file.dolphinftsms.com/sendMobileTemplage.xlsx'
  // return axios.request({
  //   url: '/sms/downloadTemplate',
  //   method: 'get',
  //   responseType: 'blob'
  // })
}
// 发送队列，暂停，继续，取消
export const pause = (data) => {
  return axios.request({
    url: '/sms/pause',
    data: data,
    method: 'put'
  })
}
//发送记录
export const queryMsgSendRecord = (data) => {
  return axios.request({
    url: '/sms/queryMsgSendRecord',
    params: data,
    method: 'get'
  })
}
//发送短信数量
export const checkSMSLength = (data) => {
  return axios.request({
    url: '/sms/checkSMSLength',
    data: data,
    method: 'post'
  })
}

// 添加短信模板
export const addMsgTemplate = (data) => {
  return axios.request({
    url: '/sms/addMsgTemplate',
    data: data,
    method: 'post'
  })
}
// 查询短信模板
export const queryMsgTemplate = (data) => {
  return axios.request({
    url: '/sms/queryMsgTemplate',
    params: data,
    method: 'get'
  })
}
// 编辑短信模板
export const updateMsgTemplate = (data) => {
  return axios.request({
    url: '/sms/updateMsgTemplate',
    data: data,
    method: 'put'
  })
};
// 删除短信模板
export const deleteMsgTemplate = (data) => {
  return axios.request({
    url: '/sms/deleteMsgTemplate/'+data['id'],
    method: 'DELETE'
  })
};


// 通讯录管理
export const sendStatistics = (data) => {
  return axios.request({
    url: '/sms/sendStatistics',
    params: data,
    method: 'get'
  })
};

export const test1 = (data) => {
  return axios.request({
    url: '/testtest/test1/' + data['id'],
    method: 'get'
  })
};

export const shortLink = (data) => {
  return axios.request({
    url: '/shortLink',
    params: data,
    method: 'get'
  })
};
export const shortLinkTransform = (data) => {
  return axios.request({
    url: '/shortLink/transform',
    params: data,
    method: 'get'
  })
};
