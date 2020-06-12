<template>
  <Form v-if="$store.state.user.loginType==='login'" ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" style="width: 100%">
    <p class="login-text">{{$t('loginFrom.welcomeText')}}</p>
    <Dropdown @on-click="selectLang">
      <Button class="login-local">
        {{ title }}
        <Icon type="md-arrow-dropdown" />
      </Button>
      <DropdownMenu slot="list" style="text-align: center">
        <DropdownItem name="zh-CN">{{$t('lang.zh-CN')}}</DropdownItem>
        <DropdownItem name="en-US" divided>{{$t('lang.en-US')}}</DropdownItem>
        <DropdownItem name="id-ID" divided>{{$t('lang.id-ID')}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <div icon="log-in">
      <div class="form-con">
        <FormItem prop="accountNo">
          <div class="login-item">
            <p>{{$t('loginFrom.userName')}}</p>
            <input v-model="form.accountNo" :placeholder="$t('loginFrom.prompt.userName')" :show-word-limit="true" maxlength="20">
          </div>

        </FormItem>
        <FormItem prop="password">
          <div class="login-item">
            <p>{{$t('loginFrom.password')}}</p>
            <input v-model="form.password" type="password" :placeholder="$t('loginFrom.prompt.password')" :show-word-limit="true" maxlength="20">
          </div>
        </FormItem>
<!--        <FormItem prop="code">-->
<!--          <div class="login-item">-->
<!--            <input v-model="form.verifyCode" :placeholder="$t('loginFrom.prompt.code')" style="width:50%;margin: 17px 0" maxlength="5">-->
<!--            <input v-model="code" @click="createCode()" class="code" readonly="readonly" style="width:50%;margin: 12px 0">-->
<!--          </div>-->
<!--        </FormItem>-->
        <FormItem style="padding-top: 30px">
          <Row>
            <i-col span="10" offset="1">
              <Button type="primary" shape="circle" @click="handleRegister('register')" long ghost>{{$t('register')}}</Button>
            </i-col>
            <i-col span="10" offset="2">
              <Button @click="handleSubmit" type="primary" :loading="loading" shape="circle" long>{{$t('login')}}</Button>
            </i-col>
          </Row>
        </FormItem>
      </div>
    </div>

  </Form>
</template>
<script>
import { encrypt } from '@/libs/util'
import { picturecode } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  name: 'LoginForm',
  props: {
    // userNameRules: {
    //   type: Array
    // },
    // passwordRules: {
    //   type: Array
    // },
    // codeRules: {
    //   type: Array
    // },
    lang: String
  },
  data () {
    return {
      loading: null,
      code: null,
      form: {
        accountNo: '',
        password: '',
        verifyCode: '',
        ck: ''
      }
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang
    }
  },
  computed: {
    rules () {
      return {
        accountNo: { required: true, message: this.$t('loginFrom.prompt.userNameNull'), trigger: 'blur' },
        password: { required: true, message: this.$t('loginFrom.prompt.passwordNull'), trigger: 'blur' },
        code: { required: true, message: this.$t('loginFrom.prompt.codeNull'), trigger: 'blur' }
      }
    },
    title () {
      return this.$t('lang')[this.lang]
    }
  },
  mounted () {
    this.createCode()
  },
  methods: {
    ...mapActions([
      'setLogin'
    ]),
    handleRegister (data) {
      this.setLogin(data)
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // let strcookie = document.cookie;//获取cookie字符串
          // if(strcookie){
          //   let arrcookie = strcookie.split("; ");
          //   //遍历匹配
          //   for ( let i = 0; i < arrcookie.length; i++) {
          //     let arr = arrcookie[i].split("=");
          //     if (arr[0] === 'ck'){
          //       this.form.ck = arr[1];
          //     }
          //   }
          // }
          this.$emit('on-success-valid', {
            accountNo: this.form.accountNo,
            password: encrypt(this.form.password)
          })
        }
      })
    },
    setType () {
      this.loading = false
      this.createCode()
    },
    setLoading () {
      this.loading = false
    },
    createCode () {
      // picturecode().then(res => {
      //   if (res.data.success) {
      //     // this.code=res.data.data;
      //     // console.log(res.data);
      //   } else {
      //     this.$Message.error(res.data.message)
      //   }
      // })
    },
    selectLang (name) {
      this.$emit('lang-change', name)
    }
  }
}
</script>
<style scoped lang="less">
  .login-item{
    text-align: left;
    background-color: #ffffff;
    border:1px solid rgba(221,221,221,1);
    padding-left: 15px;
    input{
      border: 0;  // 去除未选中状态边框
      outline: none; // 去除选中状态边框
    }
    .code{
      color: #000000;
      font-size: 18px;
      font-weight:bold;
      text-align: right;
      padding-right: 30px;
    }
    .code:hover{
      cursor: pointer;
    }
  }
  .login-item:hover{
    text-align: left;
    background-color: #ffffff;
    border-top:1px solid rgba(221,221,221,1);
    border-right:1px solid rgba(221,221,221,1);
    border-bottom:1px solid rgba(221,221,221,1);
    border-left:6px solid #4D7EF4;
    padding-left: 15px;
  }
  .login-item:focus{
    text-align: left;
    background-color: #ffffff;
    border-top:1px solid rgba(221,221,221,1);
    border-right:1px solid rgba(221,221,221,1);
    border-bottom:1px solid rgba(221,221,221,1);
    border-left:6px solid #4D7EF4;
    padding-left: 15px;
  }
  button{
    font-size: 18px;
  }
</style>
