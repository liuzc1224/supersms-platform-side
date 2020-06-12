import Main from '@/components/main'
export default [
  {
    path: '/notification',
    name: 'notification',
    meta: {
      icon: 'ios-text',
      title: '消息通知'
    },
    component: Main,
    children: [
      {
        path: 'merchant-announcement',
        name: 'merchant-announcement',
        meta: {
          icon: 'ios-document',
          title: '商家公告'
        },
        component: () => import('@/view/notification/merchantAnnouncement.vue')
      }
    ]
  }
]
