import Main from '@/components/main'
export default [
  {
    path: '/report-center',
    name: 'report-center',
    meta: {
      icon: 'ios-list-box',
      title: '报表中心'
    },
    component: Main,
    children: [
      {
        path: 'expenses-record-report',
        name: 'expenses-record-report',
        meta: {
          icon: 'ios-document',
          title: '消费记录'
        },
        component: () => import('@/view/reportCenter/expensesRecordReport.vue')
      },
      {
        path: 'consumption-trend',
        name: 'consumption-trend',
        meta: {
          icon: 'ios-document',
          title: '商家消费趋势'
        },
        component: () => import('@/view/reportCenter/consumptionTrend.vue')
      },
      {
        path: 'consumption-ranking',
        name: 'consumption-ranking',
        meta: {
          icon: 'ios-document',
          title: '消费排行榜'
        },
        component: () => import('@/view/reportCenter/consumptionRanking.vue')
      }
    ]
  }
]
