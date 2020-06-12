import axios from '@/libs/api.request'

//消费趋势
export const expenseStatementInfo =(params)=>{
  return axios.request({
    url: '/expenseStatementInfo',
    params: params,
    method: 'get'
  })
};
//月度账单
export const monthlyBillsStatementInfo =(params)=>{
  return axios.request({
    url: '/monthlyBillsStatementInfo',
    params: params,
    method: 'get'
  })
};
//导出
export const monthlyBillsStatementInfoExport =(params)=>{
  let data={
    userId: params['userId'],
    timeStart: params['timeStart'],
    timeEnd: params['timeEnd'],
  };
  axios.request({
    method: 'get',
    params:data,
    url: '/monthlyBillsStatementInfo/export',
    responseType: 'blob'
  }).then((res) => {
    const link = document.createElement('a');
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);

    link.download = params['name']; //下载后文件名
    // link.download = data.fileName //下载的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }).catch(error => {
    this.$Notice.error({
      title: '错误',
      desc: '网络连接错误'
    });
    console.log(error)
  })
};
