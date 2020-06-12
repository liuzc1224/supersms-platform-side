//地区营运配置
const operationConfigurationCN = {
  //地区运营商管理
  carrierManagement:{
    input:'请输入......',
    internationalNumber:'国际区号',
    tip:'输入英文“,”后录入下一个号段',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    operator:'运营商',
    numberSegment:'支持号段',
    carrierManagement:'管理运营商',
    country:'国家',
    operatorNumberSegment:'运营商支持号段',
    singleCharacter:'单条字符数',
    MaxCharacter:'每次发送最大字符数',
    state:'状态',
    prompt:{
      state:'请选择状态',
      input:'请输入0-10000',
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      operator:'请输入运营商',
      singleCharacter:'请输入单条字符数',
      MaxCharacter:'请输入每次发送最大字符数',
      numberSegment:'请输入支持号段',
    },
    status:[
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:0
      }
    ]
  },
  //地区敏感词配置
  sensitiveWord:{
    country:'国家',
    internationalNumber:'国际区号',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    sensitiveWord:'敏感词',
    addSensitiveWord:'新增敏感词',
    updateSensitiveWord:'地区敏感词配置',
    tip:'中文或英文“；”切换下一个敏感词',
    updater:'更新人',
    updateTime:'更新时间',
    state:'状态',
    prompt:{
      state:'请选择状态',
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      sensitiveWord:'请输入敏感词',
    },
    status:[
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:0
      }
    ]
  },
  //地区联系方式配置
  contactConfig:{
    title:'地区联系方式配置',
    country:'国家',
    prompt:{
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      phoneRecharge:'请输入商户号注册客服电话',
      emailRecharge:'请输入商户号注册客服邮箱',
      phoneMerchant:'请输入充值客服电话',
      emailMerchant:'请输入充值客服邮箱',
    },
    internationalNumber:'国际区号',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    phoneRecharge:'商户号注册客服电话',
    emailRecharge:'商户号注册客服邮箱',
    phoneMerchant:'充值客服电话',
    emailMerchant:'充值客服邮箱',
  },
  //地区运营商账户余额预警
  balanceWarning:{
    prompt:{
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      operator:'请输入运营商',
      numberSegment:'请输入号段',
      input:"请输入",
      state:"请选择状态",
    },
    edit:"编辑账户余额预警",
    estimate:"预估平台账户余额",
    pricing:"运营商单条定价",
    warning:"平台账户余额预警值",
    earlyWarningEmail:"平台账户余额预警邮箱",
    internationalNumber:'国际区号',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    operator:'运营商',
    numberSegment:'号段',
    balanceEstimate:"账户余额预估（¥）",
    singlePricing:"运营商单条定价（¥）",
    earlyWarning:"账户余额预警值（¥）",
    email:"账户余额预警邮箱",
    state:"状态",
    status:[
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:0
      }
    ]
  },
  //卡发虚拟卡号配置
  cardManagement:{
    import:"导入卡号",
    template:"卡号模板",
    down:"下载卡号模版",
    add:"新增卡号",
    edit:"编辑卡号",
    importTime:"导入时间",
    msgType:"短信类型",
    cardNumber:"卡号",
    state:"状态",
    sendFailure: '发送失败次数',
    phone: '接收人号码',
    sendNumber: '累计发送次数',
    sendFailureNumber: '累计失败次数',
    check:"校验",
    checkCard:"校验卡号",
    error:"卡号已存在",
    cardNumberCheck:"要校验的卡发卡号",
    msgContent:"发送短信内容",
    success:"回执返回成功",
    fail:"回执返回失败",
    no:"暂无回执",
    prompt:{
      cardNumber:"请输入卡号",
      msgType:"请选择短信类型",
      state:"请选择状态",
      msgContent:"请输入短信内容",
      phone: '请输入接收人号码',
    },
    status:[
      {
        desc:"激活",
        value:1
      },
      {
        desc:"停用",
        value:0
      }
    ],
    type:[
      {
        desc: '定时发送',
        value: 1
      },
      {
        desc: '实时发送',
        value: 2
      }
    ]
  },
  //通道账号配置
  accountConfig:{
    add:"新增通道账号",
    edit:"编辑通道账号",
    createTime:"创建时间",
    error:"通道账号已存在",
    state:"状态",
    status:[
      {
        desc:"激活",
        value:1
      },
      {
        desc:"停用",
        value:0
      }
    ],
    account:"通道账号",
    password:"密码",
    ip:"IP",
    port:"端口",
    prompt:{
      account:"请输入通道账号",
      password:"请输入密码",
      ip:"请输入IP",
      state:"请选择状态",
      port:"请输入端口",
    }
  }
};

const operationConfigurationBR = {
//地区运营商管理
  //地区运营商管理
  carrierManagement:{
    input:'请输入......',
    internationalNumber:'国际区号',
    tip:'输入英文“,”后录入下一个号段',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    operator:'运营商',
    numberSegment:'支持号段',
    carrierManagement:'管理运营商',
    country:'国家',
    operatorNumberSegment:'运营商支持号段',
    singleCharacter:'单条字符数',
    MaxCharacter:'每次发送最大字符数',
    state:'状态',
    prompt:{
      state:'请选择状态',
      input:'请输入0-10000',
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      operator:'请输入运营商',
      singleCharacter:'请输入单条字符数',
      MaxCharacter:'请输入每次发送最大字符数',
      numberSegment:'请输入支持号段',
    },
    status:[
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:0
      }
    ]
  },
  //地区敏感词配置
  sensitiveWord:{
    country:'国家',
    internationalNumber:'国际区号',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    sensitiveWord:'敏感词',
    addSensitiveWord:'新增敏感词',
    updateSensitiveWord:'地区敏感词配置',
    tip:'中文或英文“；”切换下一个敏感词',
    updater:'更新人',
    updateTime:'更新时间',
    state:'状态',
    prompt:{
      state:'请选择状态',
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      sensitiveWord:'请输入敏感词',
    },
    status:[
      {
        desc:'激活',
        value:1
      },
      {
        desc:'停用',
        value:0
      }
    ]
  },
  //地区联系方式配置
  contactConfig:{
    title:'地区联系方式配置',
    country:'国家',
    prompt:{
      internationalNumber:'请输入国际区号',
      countryChinese:'请输入国家-中文',
      countryEnglish:'请输入国家-英文',
      phoneRecharge:'请输入商户号注册客服电话',
      emailRecharge:'请输入商户号注册客服邮箱',
      phoneMerchant:'请输入充值客服电话',
      emailMerchant:'请输入充值客服邮箱',
    },
    internationalNumber:'国际区号',
    countryChinese:'国家-中文',
    countryEnglish:'国家-英文',
    phoneRecharge:'商户号注册客服电话',
    emailRecharge:'商户号注册客服邮箱',
    phoneMerchant:'充值客服电话',
    emailMerchant:'充值客服邮箱',
  }
};

export {
  operationConfigurationCN,
  operationConfigurationBR
}
