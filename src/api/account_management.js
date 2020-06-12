import axios from '@/libs/api.request'


//查询账户
export const getAccount =(params)=>{
  return axios.request({
    url: '/account',
    params: params,
    method: 'get'
  })
}
//修改账户
export const updateAccount =(data)=>{
  return axios.request({
    url: '/account',
    data: data,
    method: 'put'
  })
}
//增加子账户
export const addAccount =(data)=>{
  return axios.request({
    url: '/account/child',
    data: data,
    method: 'post'
  })
}
//删除子账户
export const deleteAccount =(params)=>{
  return axios.request({
    url: '/account/child/'+params['id'],
    method: 'delete'
  })
}

