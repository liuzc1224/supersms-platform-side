<template>
  <Form v-if="$store.state.user.loginType==='register'" ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" style="width: 100%">
    <p class="register-text">{{$t('registerFrom.welcomeText')}}</p>
    <div icon="log-in">
      <div class="form-con">
        <FormItem prop="companyName">
          <div class="login-item">
            <p>{{$t('registerFrom.company')}}</p>
            <input v-model="form.companyName" :placeholder="$t('registerFrom.prompt.input')" maxlength="20">
          </div>

        </FormItem>
        <FormItem prop="businessArea">
          <div class="login-item">
            <p>{{$t('registerFrom.operatingArea')}}</p>
            <Select clearable v-model="form.businessArea" :placeholder="$t('registerFrom.prompt.select')">
              <Option v-for="(item,index) in $t('operatingAreas')" :key="index" :value="item.value">{{item.desc}}</Option>
            </Select>
<!--            <input v-model="form.businessArea" :placeholder="$t('registerFrom.prompt.select')" readonly="readonly">-->
          </div>
        </FormItem>
        <FormItem prop="accountNo">
          <div class="login-item">
            <p>{{$t('registerFrom.account')}}</p>
            <input v-model="form.accountNo" :placeholder="$t('registerFrom.prompt.input')" maxlength="20">
          </div>
        </FormItem>
        <FormItem prop="password">
          <div class="login-item">
            <p>{{$t('registerFrom.password')}}</p>
            <input type="password" v-model="form.password" :placeholder="$t('registerFrom.prompt.input')" maxlength="20">
          </div>

        </FormItem>
        <FormItem prop="email">
          <div class="login-item">
            <p>{{$t('registerFrom.mailbox')}}</p>
            <input v-model="form.email" :placeholder="$t('registerFrom.prompt.input')" maxlength="20">
          </div>
        </FormItem>
        <FormItem prop="contact">
          <div class="login-item">
            <p>{{$t('registerFrom.contact')}}</p>
            <input v-model="form.contact" :placeholder="$t('registerFrom.prompt.input')" maxlength="20">
          </div>
        </FormItem>
        <FormItem prop="contactPhoneNumber">
          <div class="login-item">
            <p>{{$t('registerFrom.contactPhone')}}</p>
            <input v-model="form.contactPhoneNumber" :placeholder="$t('registerFrom.prompt.input')" maxlength="20">
          </div>
        </FormItem>
        <Row class="protocol">
          <Checkbox v-model="single" size="large">{{$t('registerFrom.agree')}}</Checkbox><a href="#">{{$t('registerFrom.protocol')}}</a>
        </Row>
        <FormItem style="padding-top: 30px">
          <Row>
            <i-col span="10" offset="1">
              <Button type="primary" shape="circle" @click="tabLogin('login')" long ghost>{{$t('login')}}</Button>
            </i-col>
            <i-col span="10" offset="2">
              <Button @click="handleSubmit" type="primary" shape="circle" long>{{$t('register')}}</Button>
            </i-col>
          </Row>
        </FormItem>
      </div>
    </div>

  </Form>
</template>
<script>
import { encrypt } from '@/libs/util'
import { register,checkExist } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  name: 'RegisterForm',
  data () {
    return {
      single: false,
      form: {
        companyName: '',
        businessArea: 0,
        accountNo: '',
        password: '',
        email: '',
        contact: '',
        contactPhoneNumber: ''
      }
    }
  },
  computed: {
    rules () {
      const validateAccountNo = (rule, value, callback) => {
        if (this.form.accountNo!=='') {
          let data={
            name: this.form.accountNo
          };
          checkExist(data).then(res => {
            if (res.data.success) {
              if(res.data.data){
                callback(new Error(this.$t('registerFrom.prompt.accountErr')));
              }else{
                callback();
              }
            } else {
              this.$Message.error(res.data.message)
            }
          });
        } else {
          callback(new Error(this.$t('registerFrom.prompt.account')));
        }
      };
      return {
        companyName: { required: true, message: this.$t('registerFrom.prompt.company'), trigger: 'blur' },
        businessArea: { required: true, message: this.$t('registerFrom.prompt.operatingArea'), trigger: 'blur', type: 'number' },
        accountNo: { required: true, validator: validateAccountNo, trigger: 'blur' },
        password: { required: true, message: this.$t('registerFrom.prompt.password'), trigger: 'blur' },
        email: { required: true, message: this.$t('registerFrom.prompt.mailbox'), trigger: 'blur' },
        contact: { required: true, message: this.$t('registerFrom.prompt.contact'), trigger: 'blur' },
        contactPhoneNumber: { required: true, message: this.$t('registerFrom.prompt.contactPhone'), trigger: 'blur' }
      }
    }
  },
  methods: {
    ...mapActions([
      'setLogin'
    ]),
    tabLogin (data) {
      this.setLogin(data);
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (!this.single) {
            this.$Message.error(this.$t('registerFrom.prompt.checkError'));
            return
          }
          let data ={
            companyName: this.form.companyName,
            businessArea: this.form.businessArea,
            accountNo: this.form.accountNo,
            password: this.form.password!=null ? encrypt(this.form.password) : null,
            email: this.form.email,
            contact: this.form.contact,
            contactPhoneNumber: this.form.contactPhoneNumber
          };
          register(data).then(res => {
            if (res.data.success) {
              this.$Message.success(this.$t('common.registerSuccess'))
              this.setLogin('login')
            } else {
              this.$Message.error(res.data.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
  .register-text{
    margin-top: 30px;
    text-align: left;
    font-weight:500;
    font-size:24px;
    color:rgba(109,125,148,1);
  }
  .login-item{
    text-align: left;
    background-color: #ffffff;
    border:1px solid rgba(221,221,221,1);
    padding-left: 15px;
    input{
      border: 0;  // 去除未选中状态边框
      outline: none; // 去除选中状态边框
    }
    .ivu-select .ivu-select-selection{
      border: none;
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
  button{
    font-size: 18px;
  }
  .protocol{
    font-size: 14px;
    text-align: left;
    color: #4D7EF4;
  }
</style>
