//商户管理
import axios from '@/libs/api.request'

//商户账号管理
export const userInfo = (params) => {
  return axios.request({
    url: '/userInfo',
    params:params,
    method: 'get'
  })
};
export const operatorInfoUpdate= (params) => {
  return axios.request({
    url: '/userInfo/update',
    data: params,
    method: 'put'
  })
};
export const operatorInfoAdd= (params) => {
  return axios.request({
    url: '/userInfo/register',
    data: params,
    method: 'post'
  })
};
//账户名是否存在
export const checkExist= (params) => {
  return axios.request({
    url: '/userInfo/checkExist/'+params['name'],
    method: 'get'
  })
};

//商户列表
export const userListInfo = (params) => {
  return axios.request({
    url: '/userListInfo',
    params:params,
    method: 'get'
  })
};

//商户详情
export const merchantInfo = (params) => {
  return axios.request({
    url: '/userListInfo/'+params['id'],
    method: 'get'
  })
};

//充值记录
export const recharge = (params) => {
  return axios.request({
    url: '/userListInfo/recharge',
    params:params,
    method: 'get'
  })
};
//消费记录
export const expense = (params) => {
  return axios.request({
    url: '/userListInfo/expense',
    params:params,
    method: 'get'
  })
};
//审核记录
export const audit = (params) => {
  return axios.request({
    url: '/userListInfo/audit',
    params:params,
    method: 'get'
  })
};

//商户报价管理
//历史报价
export const businessPriceInfoHistory = (params) => {
  return axios.request({
    url: '/businessPriceInfo/history',
    params:params,
    method: 'get'
  })
};
export const businessPriceInfo = (params) => {
  return axios.request({
    url: '/businessPriceInfo',
    params:params,
    method: 'get'
  })
};
export const businessPriceInfoUpdate= (params) => {
  return axios.request({
    url: '/businessPriceInfo/update',
    data: params,
    method: 'put'
  })
};

//充值管理
export const rechargeRecordInfo = (params) => {
  return axios.request({
    url: '/RechargeRecordInfo',
    params:params,
    method: 'get'
  })
};
//新增充值
export const addRechargeRecordInfo = (params) => {
  return axios.request({
    url: '/RechargeRecordInfo/create',
    data:params,
    method: 'post'
  })
};
//编辑
export const updateRechargeRecordInfo = (params) => {
  return axios.request({
    url: '/RechargeRecordInfo/update',
    data:params,
    method: 'put'
  })
};
