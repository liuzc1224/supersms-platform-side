import axios from '@/libs/api.request'
import {ObjToQuery} from "@/assets/js/date";
import config from '@/config'


// 消费排行
export const consumeRank = (params) => {
  return axios.request({
    url: '/statement/consume/rank',
    params:params,
    method: 'get'
  })
}
// 消费记录
export const consumeRecord = (params) => {
  return axios.request({
    url: '/statement/consume/record',
    params:params,
    method: 'get'
  })
};
// 消费记录导出
export const consumeRecordExport = (params) => {
  let data={
    createTimeStart: params.createTimeStart,
    createTimeEnd: params.createTimeEnd,
    finishTimeStart: params.finishTimeStart,
    finishTimeEnd: params.finishTimeEnd,
    consumerId: params.consumerId,
    queueId: params.queueId,
    sendStatus: params.sendStatus,
  };
  axios.request({
    method: 'get',
    params:data,
    url: '/statement/consume/record/export',
    responseType: 'blob'
  }).then((res) => {
    console.log(res.data);
    const link = document.createElement('a');
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob)

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
  // let baseUrl=config.baseUrl.pro+"/statement/consume/record/export";
  // if(params){
  //   let data=ObjToQuery(params);
  //   window.location.href = baseUrl+data.substring(0,data.length-1);
  //   return "";
  // }else{
  //   window.location.href = baseUrl;
  // }
};
// 消费趋势
export const consumeTrend = (params) => {
  return axios.request({
    url: '/statement/consume/trend',
    params:params,
    method: 'get'
  })
};
