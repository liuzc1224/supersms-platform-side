import axios from '../libs/api.request'

export const login = (data) => {
  return axios.request({
    url: '/user/login',
    data: data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: '/user/info',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

// 获取验证码
export const picturecode = () => {
  return axios.request({
    url: '/picturecode',
    method: 'get'
  })
}
// 注册
export const register = (data) => {
  return axios.request({
    url: '/user/register',
    data,
    method: 'post'
  })
}
//账户名是否存在
export const checkExist= (params) => {
  return axios.request({
    url: '/user/checkExist/'+params['name'],
    method: 'get'
  })
};
//修改密码
export const updateUser= (data) => {
  return axios.request({
    url: '/user',
    data:data,
    method: 'put'
  })
};
//消息中心
export const getNews= () => {
  return axios.request({
    url: '/news',
    method: 'get'
  })
};
//是否有未读消息
export const getNewsStatus= () => {
  return axios.request({
    url: '/news/status',
    method: 'get'
  })
};
export const alreadyreadDelete= () => {
  return axios.request({
    url: '/news/alreadyread',
    method: 'delete'
  })
};
export const alreadyreadPost= (data) => {
  return axios.request({
    url: '/news/alreadyread',
    data:data,
    method: 'post'
  })
};
export const getServiceTime= () => {
  return axios.request({
    url: '/sms/getServiceTime',
    method: 'get'
  })
};
