//充值中心
import axios from '@/libs/api.request'


//获取当前报价
export const currentPriceInfo =(params)=>{
  return axios.request({
    url: '/currentPriceInfo',
    params: params,
    method: 'get'
  })
}
//获取消费记录
export const expenseCalendarInfo =(params)=>{
  return axios.request({
    url: '/expenseCalendarInfo',
    params: params,
    method: 'get'
  })
}
//获取充值记录
export const rechargeRecordInfo =(params)=>{
  return axios.request({
    url: '/rechargeRecordInfo',
    params: params,
    method: 'get'
  })
}
//用户ID获取充值弹窗
export const rechargeRecordInfoId =(params)=>{
  return axios.request({
    url: '/rechargeRecordInfo/'+params['id'],
    method: 'get'
  })
}
