import axios from '@/libs/api.request'

//消息通知
export const queryBusinessNotice = (params) => {
  return axios.request({
    url: '/notice/queryBusinessNotice',
    params:params,
    method: 'get'
  })
}

export const addBusinessNotice = (data) => {
  return axios.request({
    url: '/notice/addBusinessNotice',
    data:data,
    method: 'post'
  })
}
export const updateBusinessNotice = (data) => {
  return axios.request({
    url: '/notice/updateBusinessNotice',
    data:data,
    method: 'put'
  })
}
