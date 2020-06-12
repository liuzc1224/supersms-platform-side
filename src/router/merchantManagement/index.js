import Main from '@/components/main'
export default [
  {
    path: '/merchant-management',
    name: 'merchant-management',
    meta: {
      icon: 'md-albums',
      title: '商户管理'
    },
    component: Main,
    children: [
      {
        path: 'account',
        name: 'account',
        meta: {
          icon: 'ios-document',
          title: '商户账号管理'
        },
        component: () => import('@/view/merchantManagement/account.vue')
      },
      {
        path: 'business-list',
        name: 'business-list',
        meta: {
          icon: 'ios-document',
          title: '商户列表'
        },
        component: () => import('@/view/merchantManagement/businessList.vue')
      },
      {
        path: 'business-details',
        name: 'business-details',
        meta: {
          icon: 'ios-document',
          title: '商户详情'
        },
        component: () => import('@/view/merchantManagement/businessDetails/index.vue')
      },
      {
        path: 'quote',
        name: 'quote',
        meta: {
          icon: 'ios-document',
          title: '商家报价管理'
        },
        component: () => import('@/view/merchantManagement/quote.vue')
      },
      {
        path: 'historical-quote',
        name: 'historical-quote',
        meta: {
          icon: 'ios-document',
          title: '查看历史报价'
        },
        component: () => import('@/view/merchantManagement/historicalQuote.vue')
      },
      {
        path: 'recharge-management',
        name: 'recharge-management',
        meta: {
          icon: 'ios-document',
          title: '充值管理'
        },
        component: () => import('@/view/merchantManagement/rechargeManagement.vue')
      }
    ]
  }
]
