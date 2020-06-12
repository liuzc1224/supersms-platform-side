const reportCenterCN={
  //消费记录
  expensesRecordReport:{
    title:'消费记录',
    createTime:'创建时间',
    endTime:'结束时间',
    state:'消费状态',
    status:[
      {
        desc:'已完成',
        value:5
      },
      {
        desc:'已取消',
        value:4
      },
      {
        desc:'暂停失效',
        value:6
      }
    ],
    id:'队列ID',
    prompt:{
      state:'请选择消费状态',
      businessNumber:'请输入商户号',
      id:'请输入队列ID'
    },
    businessNumber:'商户号',
    sendTime:'发送时间',
    sendNumber: '发送条数',
    successNumber: '成功条数',
    failureNumber: '失败条数',
    billNumber: '计费条数',
    consumptionAmount: '消费金额'
  },
  //商家消费趋势
  consumptionTrend:{
    date:'日期',
    statisticalDate:'统计日期',
    sevenDays:'最近七天',
    month:'最近一个月',
    heatMap:'消费热度图',
    sendNumber: '发送条数',
    successNumber: '发送成功条数',
    failureNumber: '发送失败条数',
    consumptionCost: '消费费用',
  },
  //消费排行榜
  consumptionRanking:{
    statisticalDate:'统计日期',
    sevenDays:'最近七天',
    month:'最近一个月',
    sort:'排序',
    businessNumber:'商户号',
    company:'所属公司',
    consumptionAmount: '消费金额'
  }
};
const reportCenterBR={
  //消费记录
  expensesRecordReport:{
    title:'消费记录',
    createTime:'创建时间',
    endTime:'结束时间',
    state:'消费状态',
    status:[
      {
        desc:'已完成',
        value:5
      },
      {
        desc:'已取消',
        value:4
      },
      {
        desc:'暂停失效',
        value:6
      }
    ],
    id:'队列ID',
    prompt:{
      state:'请选择消费状态',
      businessNumber:'请输入商户号',
      id:'请输入队列ID'
    },
    businessNumber:'商户号',
    sendTime:'发送时间',
    sendNumber: '发送条数',
    successNumber: '成功条数',
    failureNumber: '失败条数',
    billNumber: '计费条数',
    consumptionAmount: '消费金额'
  },
  //商家消费趋势
  consumptionTrend:{
    data:'日期',
    statisticalDate:'统计日期',
    sevenDays:'最近七天',
    month:'最近一个月',
    heatMap:'消费热度图',
    sendNumber: '发送条数',
    successNumber: '发送成功条数',
    failureNumber: '发送失败条数',
    consumptionCost: '消费费用'
  },
  //消费排行榜
  consumptionRanking:{
    statisticalDate:'统计日期',
    sevenDays:'最近七天',
    month:'最近一个月',
    sort:'排序',
    businessNumber:'商户号',
    company:'所属公司',
    consumptionAmount: '消费金额'
  }
};
export {
  reportCenterCN,
  reportCenterBR
}
