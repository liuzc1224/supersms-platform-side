import Main from '@/components/main'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    component: Main,
    meta:{
      hideInBread: false,
      hideInMenu:  false,
      access: [true]
    },
    children: [
      {
        path: '/account_management',
        name: 'account_management',
        meta: {
          icon: 'md-people',
          title: '账户管理'
        },
        component: () => import('@/view/account_management/account_management.vue')
      }
    ]
  },
  {
    path: '/sms_center',
    name: 'sms_center',
    component: Main,
    meta: {
      icon: 'ios-mail',
      title: '短信中心',
    },
    children: [
      {
        path: 'send_messages',
        name: 'send_messages',
        meta: {
          icon: 'ios-send',
          title: '发送短信'
        },
        component: () => import('@/view/sms_center/send_messages.vue')
      },
      {
        path: 'send_queue',
        name: 'send_queue',
        meta: {
          icon: 'md-square',
          title: '发送队列'
        },
        component: () => import('@/view/sms_center/send_queue.vue')
      },
      {
        path: 'send_record',
        name: 'send_record',
        meta: {
          icon: 'ios-document',
          title: '发送记录'
        },
        component: () => import('@/view/sms_center/send_record.vue')
      },
      {
        path: 'address_book',
        name: 'address_book',
        meta: {
          icon: 'ios-paper',
          title: '通讯录管理'
        },
        component: () => import('@/view/sms_center/address_book.vue')
      },
      {
        path: 'sms_content_template',
        name: 'sms_content_template',
        meta: {
          icon: 'ios-create',
          title: '短信内容模板配置'
        },
        component: () => import('@/view/sms_center/sms_content_template.vue')
      },
      {
        path: 'sms_short_chain',
        name: 'sms_short_chain',
        meta: {
          icon: 'ios-create',
          title: '短链生成器'
        },
        component: () => import('@/view/sms_center/sms_short_chain.vue')
      }
    ]
  },
  // {
  //   path: '/message',
  //   name: 'message',
  //   component: Main,
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   children: [
  //     {
  //       path: 'message_page',
  //       name: 'message_page',
  //       meta: {
  //         icon: 'md-notifications',
  //         title: '消息中心'
  //       },
  //       component: () => import('@/view/single-page/message/index.vue')
  //     }
  //   ]
  // },
  {
    path: '/recharge_center',
    name: 'recharge_center',
    component: Main,
    meta: {
      icon: 'logo-usd',
      title: '充值中心'
    },
    children: [
      {
        path: 'current_offer',
        name: 'current_offer',
        meta: {
          icon: 'md-calculator',
          title: '当前报价'
        },
        component: () => import('@/view/recharge_center/current_offer.vue')
      },
      {
        path: 'recharge_record',
        name: 'recharge_record',
        meta: {
          icon: 'md-cart',
          title: '充值记录'
        },
        component: () => import('@/view/recharge_center/recharge_record.vue')
      },
      {
        path: 'expenses_record',
        name: 'expenses_record',
        meta: {
          icon: 'md-analytics',
          title: '消费记录'
        },
        component: () => import('@/view/recharge_center/expenses_record.vue')
      }
    ]
  },
  {
      path: '/report-center',
      name: 'report_center',
      component: Main,
      meta: {
        icon: 'ios-stats',
        title: '报表中心'
      },
      children: [
        {
          path: 'consumption-trend',
          name: 'consumption_trend',
          meta: {
            icon: 'ios-pulse',
            title: '消费趋势'
          },
          component: () => import('@/view/report_center/consumption_trend.vue')
        },
        {
          path: 'monthly_bill',
          name: 'monthly_bill',
          meta: {
            icon: 'md-clipboard',
            title: '月度账单'
          },
          component: () => import('@/view/report_center/monthly_bill.vue')
        }
      ]
    },


  // {
  //   path: '/error_store',
  //   name: 'error_store',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_store_page',
  //       name: 'error_store_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/error-store/error-store.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_logger',
  //   name: 'error_logger',
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_logger_page',
  //       name: 'error_logger_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/single-page/error-logger.vue')
  //     }
  //   ]
  // },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
