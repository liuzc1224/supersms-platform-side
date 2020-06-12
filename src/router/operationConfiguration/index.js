import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default [
  {
    path: '/operation-config',
    name: 'operation-config',
    meta: {
      icon: 'md-analytics',
      title: '地区营运配置'
    },
    component: Main,
    children: [
      {
        path: 'carrier-management',
        name: 'carrier-management',
        meta: {
          icon: 'ios-document',
          title: '地区运营商管理',
        },
        component: () => import('@/view/operationConfiguration/carrier-management.vue')
      },
      {
        path: 'sensitive-word',
        name: 'sensitive-word',
        meta: {
          icon: 'ios-document',
          title: '地区敏感词配置',
        },
        component: () => import('@/view/operationConfiguration/sensitive-word.vue')
      },
      {
        path: 'contact-config',
        name: 'contact-config',
        meta: {
          icon: 'ios-document',
          title: '地区联系方式配置',
        },
        component: () => import('@/view/operationConfiguration/contact-config.vue')
      },
      {
        path: 'balance-warning',
        name: 'balance-warning',
        meta: {
          icon: 'ios-document',
          title: '地区运营商账户余额预警',
        },
        component: () => import('@/view/operationConfiguration/balance-warning.vue')
      },
      {
        path: 'card-management',
        name: 'card-management',
        meta: {
          icon: 'ios-document',
          title: '卡发卡号配置',
        },
        component: () => import('@/view/operationConfiguration/card-management.vue')
      },
      {
        path: 'account-config',
        name: 'account-config',
        meta: {
          icon: 'ios-document',
          title: '通道账号配置',
        },
        component: () => import('@/view/operationConfiguration/account-config.vue')
      }
    ]
  }
]
