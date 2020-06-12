import {
  login,
  getNewsStatus
  // logout
  // getUserInfo,
  // getMessage,
  // getContentByMsgId,
  // hasRead,
  // removeReaded,
  // restoreTrash,
  // getUnreadCount
} from '../../api/user'
import { setToken, getToken } from '@/libs/util'
import config from '@/config'

export default {
  state: {
    loginType: 'login',
    unreadCount: 0,
    webStock:false,
    WebSocket:false,
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: sessionStorage.getItem('access') ? JSON.parse(sessionStorage.getItem('access') ) : '',
    hasGetInfo: false,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setLogin (state, name) {
      state.loginType = name
    },
    setWebSocket(state, name) {
      state.WebSocket = name
    },
    setWebStock(state, name){
      state.webStock = name
    },
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.unreadCount,
    // messageUnreadCount: state => state.messageUnreadList.length,
    // messageReadedCount: state => state.messageReadedList.length,
    // messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    setLogin ({ state, commit }, name) {
      commit('setLogin', name)
    },
    setWebSocket({ state, commit }, name) {
      commit('setWebSocket', name)
    },
    // 登录
    handleLogin ({ commit }, { accountNo, password }) {
      accountNo = accountNo.trim()
      return new Promise((resolve, reject) => {
        let postData = {
          accountNo,
          password
        };
        login(postData).then(res => {
          const data = res.data
          if (data.code === 0) {
            // commit('setToken', 'super_admin')
            commit('setToken', data.data.token);
            commit('setAvatar', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png');
            commit('setUserName', data.data.accountNo);
            commit('setUserId', data.data.id);
            // commit('setAccess', ['super_admin', 'admin']);
            commit('setAccess', [data.data['isMain']]);
            sessionStorage.setItem('access',JSON.stringify([data.data['isMain']]));
            commit('setHasGetInfo', true);
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        sessionStorage.removeItem('loginInfo');
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', '')
        resolve()
      })
    },
    // 获取用户相关信息
    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     try {
    //       getUserInfo(state.token).then(res => {
    //         const data = res.data
    //         commit('setAvatar', data.avatar)
    //         commit('setUserName', data.name)
    //         commit('setUserId', data.user_id)
    //         commit('setAccess', data.access)
    //         commit('setHasGetInfo', true)
    //         resolve(data)
    //       }).catch(err => {
    //         reject(err)
    //       })
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getNewsStatus().then(res => {
        const data = res.data;
        if (data.success === true) {
          if(data.data===0){
            commit('setMessageCount', 1)
          }else{
            commit('setMessageCount', 0)
          }
          if(!state.webStock){
            let ws=new WebSocket("ws://"+config.baseUrl.dev.substring(7)+"/webSocket");
            ws.onopen = (evt) => {
              console.log('WebSocket开启成功');
              commit('setWebStock', true);
              let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
              ws.send(userInfo['token']);
            };

            ws.onmessage = (evt) => {
              console.log( "收到回复数据: " + evt.data);
              if (evt.data) {
                let obj=JSON.parse(evt.data);
                if(obj && obj['count']){
                  commit('setMessageCount', obj['count'])
                }
              }
            };
            ws.onclose = (evt) => {
              console.log('WebSocket已关闭')
            }
          }
        }
      });
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    // getMessageList ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
        // getMessage().then(res => {
        //   const { unread, readed, trash } = res.data
        //   commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        //   commit('setMessageReadedList', readed.map(_ => {
        //     _.loading = false
        //     return _
        //   }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        //   commit('setMessageTrashList', trash.map(_ => {
        //     _.loading = false
        //     return _
        //   }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
    //   })
    // },
    // 根据当前点击的消息的id获取内容
    // getContentByMsgId ({ state, commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     let contentItem = state.messageContentStore[msg_id]
    //     if (contentItem) {
    //       resolve(contentItem)
    //     } else {
    //       getContentByMsgId(msg_id).then(res => {
    //         const content = res.data
    //         commit('updateMessageContentStore', { msg_id, content })
    //         resolve(content)
    //       })
    //     }
    //   })
    // },
    // 把一个未读消息标记为已读
    // hasRead ({ state, commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     hasRead(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageUnreadList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       commit('setMessageCount', state.unreadCount - 1)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 删除一个已读消息到回收站
    // removeReaded ({ commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     removeReaded(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageReadedList',
    //         to: 'messageTrashList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 还原一个已删除消息到已读消息
    // restoreTrash ({ commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     restoreTrash(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageTrashList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}
