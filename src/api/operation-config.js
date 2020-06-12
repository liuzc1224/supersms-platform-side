import axios from '@/libs/api.request'

//地区运营商管理
export const operatorInfo = (params) => {
  return axios.request({
    url: '/operatorInfo',
    params:params,
    method: 'get'
  })
};
//运营商信息更新
export const operatorInfoUpdate= (params) => {
  return axios.request({
    url: '/operatorInfo/update',
    data: params,
    method: 'put'
  })
};


//敏感词配置
export const senstiveWordsInfo = (params) => {
  return axios.request({
    url: '/senstiveWordsInfo',
    params:params,
    method: 'get'
  })
};
//敏感词更新
export const senstiveWordsInfoUpdate= (data) => {
  return axios.request({
    url: '/senstiveWordsInfo/update',
    data: data,
    method: 'put'
  })
};

//获取地区联系方式
export const areaContactInfo = (params) => {
  return axios.request({
    url: '/areaContactInfo',
    params:params,
    method: 'get'
  })
};
//运营商信息更新
export const areaContactInfoUpdate= (params) => {
  return axios.request({
    url: '/areaContactInfo/update',
    data: params,
    method: 'put'
  })
};
//卡发卡号  卡发卡号配置
export const getCard = (params) => {
  return axios.request({
    url: '/card',
    params:params,
    method: 'get'
  })
};
//检验账号 返回true可以使用 返回false 已存在
export const checkCard = (cardNo) => {
  return axios.request({
    url: '/card/check/'+cardNo,
    method: 'get'
  })
};
export const checkEffect = (data) => {
  return axios.request({
    url: '/card/checkEffect',
    data:data,
    method: 'put'
  })
};
//新增卡号
export const addCard = (data) => {
  return axios.request({
    url: '/card/create',
    data:data,
    method: 'post'
  })
};
//编辑
export const editCard = (params) => {
  return axios.request({
    url: '/card/update',
    data:params,
    method: 'put'
  })
};
//下载
export const downloadCard = (params) => {
  axios.request({
    url: '/card/export',
    method: 'get',
    responseType: 'blob'
  }).then((res) => {
    console.log(res.data);
    const link = document.createElement('a');
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);

    link.download = params['name']+".xlsx";//下载后文件名
    // link.download = data.fileName //下载的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }).catch(error => {
    // this.$Notice.error({
    //   title: '错误',
    //   desc: '网络连接错误'
    // })
    console.log(error)
  })
};
//导入
export const importCard = (params) => {
  return axios.request({
    url: '/card/download',
    data:params,
    method: 'post'
  })
};
//查询卡号
export const inquireCard = (params) => {
  return axios.request({
    url: '/card/'+params['id'],
    method: 'get'
  })
};


// 通道账号配置 : 通道账号配置
export const channelAccount = (params) => {
  return axios.request({
    url: '/channelAccount',
    params:params,
    method: 'get'
  })
};
// 检验账号 返回true可以使用 返回false 已存在
export const channelAccountCheck = (params) => {
  return axios.request({
    url: '/channelAccount/check/'+params['account'],
    method: 'get'
  })
};
export const getChannelAccount = (params) => {
  return axios.request({
    url: '/channelAccount/'+params['id'],
    method: 'get'
  })
};
//新增通道账号
export const addChannelAccount = (params) => {
  return axios.request({
    url: '/channelAccount/create',
    data:params,
    method: 'post'
  })
};
//编辑通道账号
export const updateChannelAccount = (params) => {
  return axios.request({
    url: '/channelAccount/update',
    data:params,
    method: 'put'
  })
};
