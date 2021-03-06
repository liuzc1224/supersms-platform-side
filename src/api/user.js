import axios from '@/libs/api.request'

export const login = ({
  username,
  password
}) => {
  let data = new FormData();
  data.append('username', username);
  data.append('password', password);
  return axios.request({
    url: '/employee/login',
    data,
    method: 'post'
    // headers:{"Content-Type":"application/x-www-form-urlencoded"}
  })
};

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
};

//获取用户注册列表
export const getRegUserList = query => {
  return axios.request({
    url: '/user',
    method: 'get',
    params: query
  })
};
//账单列表
export const bill = query => {
  return axios.request({
    url: '/userInfo/detail/bill',
    method: 'get',
    params: query
  })
};
//资金账户
export const account = query => {
  return axios.request({
    url: '/userInfo/detail/account',
    method: 'get',
    params: query
  })
};
//消费记录
export const consumption = query => {
  return axios.request({
    url: '/userInfo/detail/consumption',
    method: 'get',
    params: query
  })
};
//邀请记录
export const inviteRecord = query => {
  return axios.request({
    url: '/userInfo/invite',
    method: 'get',
    params: query
  })
};
export const getList = query => {
  return axios.request({
    url: '/userInfo/getList',
    method: 'get',
    params: query
  })
};

//获取黑白名单列表
export const getBlackandWhiteList = query => {
  return axios.request({
    url: '/blackandwhite/getList',
    method: 'get',
    params: query
  })
};
//删除黑白名单
export const deleteBlackandWhiteList = id => {
  return axios.request({
    url: `/blackandwhite/${id}`,
    method: 'delete'
  })
};

//新增黑白名单
export const addBlackandWhiteList = params => {
  return axios.request({
    url: '/blackandwhite',
    method: 'post',
    data: params
  })
};
//修改黑白名单
export const putBlackandWhiteList = params => {
  return axios.request({
    url: '/blackandwhite',
    method: 'put',
    data: params
  })
};
//修改密码

export const password = params => {
  return axios.request({
    url: '/employee/password/update',
    method: 'put',
    data: params
  })
};
export const employee = params => {
  return axios.request({
    url: '/employee/phonenum/update',
    method: 'put',
    data: params
  })
};
export const getUserInfo = params => {
  return axios.request({
    url: '/employee/'+params['id'],
    method: 'get',
    data: params
  })
};
