export default {
  common: {
    units:[
      {
        desc:'$',
        value:1
      },
      {
        desc:'RMB',
        value:0
      }
    ],
    time: '时间',
    validateErrorMsg: '请输入每一项',
    timeStart: '开始时间',
    timeEnd: '结束时间',
    operating: '操作',
    pause: '暂停',
    cancel: '取消',
    delete: '删除',
    carryOn: '继续',
    select: '请选择...',
    input: '请输入...',
    search: '搜索',
    reset: '重置',
    define: '确定',
    edit: '编辑',
    setting: '设置',
    editSuccess: '编辑成功',
    deleteSuccess: '删除成功',
    markSuccess: '标记成功',
    addSuccess: '新增成功',
    imgSuccess: '图片上传成功',
    copySuccess: '复制成功',
    registerSuccess: '注册成功',
    message: '请输入每一项',
    img: '图片',
    deleteTitle: '删除提示',
    deleteTip: '确认删除？',
    date:'日期',
    closeAll:'关闭所有',
    closeOthers:'关闭其他',
  },
  menu:{
    personal_info:'个人信息',
    login: '登录',
    register: '注册',
    consumption_trend:'消费趋势',
    monthly_bill:'月度账单',
    report_center:'报表中心',
    sms_center: '短信中心',
    recharge_center: '充值中心',
    account_management: '账户管理',
    send_messages: '发送短信',
    send_queue: '发送队列',
    send_record: '发送记录',
    address_book: '通讯录管理',
    sms_content_template: '短信内容模版',
    home: '首页',
    current_offer:'当前报价',
    recharge_record:'充值记录',
    expenses_record:'消费记录'
  },
  userInfo:{
    password:"修改密码",
    usrInfo:"个人信息",
    old:"输入旧密码",
    inputOld:"请输入旧密码",
    new:"输入新密码",
    inputNew:"请输入新密码",
    repeatNew:"重复输入新密码",
    inputRepeatNew:"请重复输入新密码",
    error:"两次密码输入不一致",
    name: "真实姓名",
    inputName: "请输入真实姓名",
    department: "所属部门",
    inputDepartment: "请输入所属部门",
    post: "岗位",
    inputPost: "请输入岗位",
    permission: "角色权限",
    inputPermission: "请输入角色权限",
    phone: "手机号",
    inputPhone: "请输入手机号",
    mailbox: "邮箱",
    inputMailbox: "请输入邮箱",
    tip:'请输入6-18位，含数字、字母、特殊字符任意两种类型',
    logout:'退出登录',
    message:'消息中心',
    personalInfo:'个人信息'
  },
  login: '登录',
  register: '注册',
  components: '组件',
  lang: {
    'zh-CN': '中文',
    'en-US': '英文',
    'id-ID': '印尼语'
  },
  operatingAreas:[
    {
      desc:'印尼',
      value:0
    }
  ],
  //登录
  loginFrom: {
    welcomeText: '感谢使用SuperSMS系统！',
    userName: '账号',
    password: '密码',
    code: '验证码',
    prompt: {
      userName: '请输入账号',
      password: '请输入密码',
      code: '请输入验证码',
      userNameNull: '账号不能为空',
      passwordNull: '密码不能为空',
      codeNull: '验证码不能为空',
      codeError: '请输入正确的验证码'
    },
    waitActivation:'商户账号-待激活',
    waitActivationText:'客服将在您注册后24小时内联系您，进行账号激活操作，请耐心等待～<br/>如需帮助，可主动联系客服处理。',
    phone:'客服电话:',
    email:'客服邮箱:',
    refuse:'账户注册被拒绝',
    refuseText1:'尊敬的用户您好，<br/>由于"',
    refuseText2:'"，该商户账号注册申请已被平台拒绝。',
    disable:'该商户账号已被停用',
    disableMain:'该商户主账号已被停用',
    btn:'已知晓'
  },
  //注册
  registerFrom: {
    welcomeText: 'SMS商户注册！',
    agree: '同意',
    protocol: '《SMS使用协议》',
    company: '公司',
    operatingArea: '营运区域',
    account: '账号',
    password: '密码',
    mailbox: '消费提醒邮箱',
    contact: '联系人',
    contactPhone: '联系人电话',
    prompt: {
      passwordTip:'6-18位，含数字、字母、特殊字符任意两种类型',
      tip:'请输入6-18位，含数字、字母、特殊字符任意两种类型',
      input: '请输入',
      select: '请选择',
      code: '请输入验证码',
      company: '公司不能为空',
      operatingArea: '营运区域不能为空',
      account: '账号不能为空',
      password: '密码不能为空',
      mailbox: '消费提醒邮箱不能为空',
      contact: '联系人不能为空',
      contactPhone: '联系人电话不能为空',
      checkError: '请勾选协议',
      accountErr: '账号已注册'
    }
  },
  //个人信息
  personalInfo:{
    businessNumber:'商户号',
    account:'公司账户',
    accountName:'开户账户名',
    company: '公司名称',
    email:'消费提示邮箱',
    balance:'余额',
    credits:'信用额度'
  },
  //消息列表
  msg:{
    messageNotification:'消息提醒',
    none:'暂无消息',
    delete:'删除已读',
    editAll:'全部标为已读',
    close:'关闭'
  },
  //短信中心
  smsCenter: {
    sendMessages: {
      sensitiveWord: [
        'KODE RAHASIA',
        'AKTIVASI',
        'GUNAKAN KODE',
        'KODE AKTIVASI',
        'KODE VERIFIKASI',
        'VALIDATION CODE',
        'VERIFICATION',
        'REGISTRASI',
        'TOKEN',
        'VERIFIKASI',
        'OTP',
        'VALIDASI',
        'KODE ANDA',
        'KODE TOKEN'
      ],
      prompt: {
        smsContent: '请输入短信内容',
        sendContentTemplate: '请选择短信内容模版',
        receiverPhone: '请输入接收人号码',
        sendTime: '请选择发送时间',
        smsType: '请选择短信类型',
        state: '请选择发送状态',
        id: '请输入队列ID'
      },
      template: {
        desc: '不使用模板',
        value: 0
      },
      smsTip1:'需要发送',
      smsTip2:'条短信',
      uploadPhone: '批量上传号码',
      sendTime: '发送时间',
      smsType: '短信类型',
      addSmsType: '新增短信',
      state: '发送状态',
      id: '队列ID',
      releaseTime: '发布时间',
      sendContent: '发布内容',
      sendNumber: '发送条数',
      successNumber: '成功条数',
      failureNumber: '失败条数',
      consumptionCost: '消费费用',
      creator: '创建人',
      receiverPhone: '接收人号码',
      updatePhone: '批量上传号码',
      createTime: '创建时间',
      sendSms: '发送短信',
      send: '发送',
      smsContent: '短信内容',
      sendContentTemplate: '短信内容模版',
      error: '触发敏感词：',
      tip: '请不要发送敏感词或其他违反当地法律法规、短信发送政策的词汇',
      phoneTip: '每个号码请用 " ; " 或者 " ；" 分割',
      downTemplate: '下载短信接收人模版',
      smsTypes: [
        {
          desc: '定时发送',
          value: 1
        },
        {
          desc: '实时发送',
          value: 2
        }
      ],
      status: [
        {
          desc: '发送中',
          value: 1
        },
        {
          desc: '等待',
          value: 2
        },
        {
          desc: '暂停',
          value: 3
        },
        {
          desc: '已取消',
          value: 4
        },
        {
          desc: '发送完成',
          value: 5
        },
        {
          desc: '暂停后失效',
          value: 6
        },
        {
          desc: '发送失败',
          value: 7
        }
      ]
    },
    sendQueue: {
      sendTime: '发送时间',
      smsType: '短信类型',
      state: '发送状态',
      creator: '创建人',
      sendContent: '发布内容',
      id: '队列ID',
      prompt: {
        smsType: '请选择短信类型',
        state: '请选择发送状态'
      },
      smsTypes: [
        {
          desc: '定时发送',
          value: 1
        },
        {
          desc: '实时发送',
          value: 2
        }
      ],
      status: [
        {
          desc: '发送中',
          value: 1
        },
        {
          desc: '等待',
          value: 2
        },
        {
          desc: '暂停',
          value: 3
        }
      ]
    },
    sendRecord: {
      sendTime: '发送时间',
      sendResult: '发送结果',
      sendContent: '发送内容',
      smsType: '短信类型',
      state: '发送状态',
      creator: '创建人',
      id: '队列ID',
      phone: '手机号',
      prompt: {
        sendResult: '请选择发送结果',
        id: '请输入队列ID',
        recipientNumber: '请输入接收人号码'
      },
      businessNumber: '商户号',
      recipientNumber: '接收人号码',
      success:'发送成功',
      failure:'发送失败',
      sendResults: [
        {
          desc: '发送成功',
          value: 0
        },
        {
          desc: '发送失败',
          value: 1
        }
      ]
    },
    addressBook: {
      sendFailure: '发送失败次数',
      phone: '接收人号码',
      sendNumber: '累计发送次数',
      sendSuccessNumber: '累计发送成功次数',
      sendFailureNumber: '累计发送失败次数',
      prompt: {
        sendFailure: '请输入发送失败次数',
        phone: '请输入接收人号码'
      }
    },
    smsContentTemplate: {
      id: '短信ID',
      add: '新增短信内容模版',
      edit: '编辑短信内容模版',
      theme: '短信主题',
      content: '短信内容',
      prompt: {
        theme: '请输入短信主题',
        content: '请输入短信内容',
        state: '请选择状态'
      },
      createTime: '创建时间',
      state: '状态',
      status: [
        {
          desc: '失效',
          value: 0
        },
        {
          desc: '有效',
          value: 1
        }
      ]
    }
  },
  //账户管理
  accountManagement:{
    createTime:'创建时间',
    accountName:'账户名',
    add:'新增账户',
    edit:'编辑账户',
    password:'密码',
    company: '所属公司',
    accountType: '账户类型',
    prompt:{
      passwordTip:'6-18位，含数字、字母、特殊字符任意两种类型',
      tip:'请输入6-18位，含数字、字母、特殊字符任意两种类型',
      accountName:'请输入账户名',
      password:'请输入密码',
      accountErr: '账号已注册',
      state:'请选择状态'
    },
    tip:'6-18位，含数字、字母、特殊字符任意两种类型',
    state:'状态',
    editStatus:[
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:2
      }
    ],
    status:[
      {
        desc:'待激活',
        value:0
      },
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:2
      },
      {
        desc:'审核被拒',
        value:3
      }
    ],
    accountTypes:[
      {
        desc:'主账户',
        value:true
      },
      {
        desc:'子账户',
        value:false
      }
    ],
  },
  //报表中心
  reportCenter:{
    consumptionTrend:{
      week:'最近一周',
      month:'最近一个月',
      statisticData:'统计日期',
      sendNumber:'发送条数',
      successNumber:'发送成功条数',
      failureNumber:'发送失败条数',
      consumptionCost:'消费费用',
    },
    monthlyBill:{
      month:'月份',
      exportData:'导出',
      businessNumber:'商户号',
      company:'公司',
      operatingArea:'运营地区',
      operatingAreas:[
        {
          desc:'印尼',
          value:0
        },
        {
          desc:'越南',
          value:1
        }
      ],
      monthlyBillingNumber:'月度计费条数',
      monthlyFee:'月度费用（$）',
    }
  },
  //充值中心
  rechargeCenter:{
    //当前报价
    currentOffer:{
      internationalNumber:'国际区号',
      countryChinese:'国家-中文',
      countryEnglish:'国家-英文',
      SingleRMB:'单条计费（RMB）',
      SingleUS:'单条计费（美元）',
      creditLimit:'信用额度（RMB）',
      singleCharacter:'单条字符数',
      MaxCharacter:'每次发送最大字符数',
      state:'状态',
      status:[
        {
          desc:'激活',
          value:1
        },
        {
          desc:'停用',
          value:0
        }
      ],
      prompt:{
        internationalNumber:'请输入国际区号',
        countryChinese:'请输入国家-中文',
        countryEnglish:'请输入国家-英文',
      }
    },
    //充值记录
    rechargeRecord:{
      recharge:'充值',
      rechargeTip:'充值，请联系客服处理。',
      rechargePhone:'客服电话：',
      rechargeEmail:'客服邮箱：',
      transactionTime:'充值时间',
      createTime:'创建时间',
      transactionNumber:'交易单号',
      businessNumber:'商户号',
      rechargeMethod:'充值方式',
      rechargeMethods:[
        {
          desc:'在线充值',
          value:0
        },
        {
          desc:'人工充值',
          value:1
        }
      ],
      rechargeAmount:'充值金额',
      currencyUnit:'货币单位',
      rechargeType:'充值状态',
      rechargeTypes:[
        {
          desc:'充值成功',
          value:1
        },
        {
          desc:'充值失败',
          value:0
        }
      ],
      completeTime:'交易完成时间',
    },
    //消费记录
    expensesRecord:{
      createTime:'创建时间',
      endTime:'结束时间',
      sendContent:'发送内容',
      state: '状态',
      status: [
        {
          desc: '已取消',
          value: 0
        },
        {
          desc: '已完成',
          value: 1
        },
        {
          desc: '暂停失效',
          value: 2
        }
      ],
      id:'队列ID',
      sendTime: '发送时间',
      sendNumber: '发送条数',
      successNumber: '成功条数',
      failureNumber: '失败条数',
      billNumber: '计费条数',
      consumptionAmount: '消费金额',
      prompt:{
        state: '请选择状态',
        id:'请输入队列ID'
      }
    }
  }
}
