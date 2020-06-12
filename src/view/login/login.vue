<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-right">
      <div class="login-con">
        <login-form ref="loginFormChild" @on-success-valid="handleSubmit" :lang="local" @lang-change="setLocal" style="position: relative"></login-form>
        <register-form @on-success-valid="handleLogin" style="position: relative"></register-form>
      </div>
    </div>
    <Modal v-model="waitActivationModal" width="500">
      <div slot="close">
        <Icon @click="cancelWaitActivationModal()" type="ios-close-circle" style="font-size: 23px;padding-top: 5px" />
      </div>
      <p slot="header" style="text-align:left">
        <span>{{$t('loginFrom.waitActivation')}}</span>
      </p>
      <p style="text-align: left" v-html="$t('loginFrom.waitActivationText')"></p>
      <br/>
      <p>{{$t('loginFrom.phone')}} {{phoneData && phoneData['businessNumberRegistrationEmail'] ? phoneData['businessNumberRegistrationTel'] : ''}}</p>
      <p>{{$t('loginFrom.email')}} {{phoneData && phoneData['businessNumberRegistrationEmail'] ? phoneData['businessNumberRegistrationEmail'] : ''}}</p>
      <br/>
      <br/>
      <div slot="footer">
        <Button  shape="circle" type="primary" size="large" @click="cancelWaitActivationModal()">{{$t('loginFrom.btn')}}</Button>
      </div>
    </Modal>
    <Modal v-model="refuseModal" width="400" :mask-closable="false">
      <div slot="close">
        <Icon @click="cancelRefuseModal()" type="ios-close-circle" style="font-size: 23px;padding-top: 5px" />
      </div>
      <p slot="header" style="text-align:left;">
        <span>{{$t('loginFrom.refuse')}}</span>
      </p>
      <p style="text-align: left" v-html="$t('loginFrom.refuseText1')+statusUpdateNote+$t('loginFrom.refuseText2')"></p>
      <br/>
      <br/>
      <br/>
      <div slot="footer">
        <Button shape="circle" type="primary" size="large" @click="cancelRefuseModal()">{{$t('loginFrom.btn')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import RegisterForm from '_c/register-form'
import { mapActions, mapMutations } from 'vuex'
import { rechargeRecordInfoId } from '@/api/recharge_center'
export default {
  components: {
    LoginForm,
    RegisterForm
  },
  data(){
    return{
      waitActivationModal:false,
      refuseModal:false,
      phoneData:null,
      statusUpdateNote:null
    }
  },
  computed: {
    local () {
      return this.$store.state.app.local
    }
  },
  mounted () {
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
  },
  methods: {
    ...mapMutations([
      'setLocal',
      'initTagNavList'
    ]),
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ accountNo, password }) {
      this.handleLogin({ accountNo, password }).then(res => {
        if (res.success) {
          this.statusUpdateNote=res.data['statusUpdateNote'];
          if(res.data.status===0){
            let data={
              id : res.data['id']
            };
            rechargeRecordInfoId(data).then(res => {
              this.$refs.loginFormChild.setLoading();
              if (res.data.success) {
                if (res.data.data) {
                  this.phoneData=res.data.data;
                  this.waitActivationModal=true;
                }
              } else {
                this.$Message.error(res.data.message)
              }
            });
            return;
          }
          if(res.data.status===3){
            this.$refs.loginFormChild.setLoading();
            this.refuseModal=true;
            return;
          }
          if(res.data.status===2){
            this.$refs.loginFormChild.setLoading();
            this.$Message.error(this.$t('loginFrom.disable'));
            return;
          }
          if(res.data.status===10){
            this.$refs.loginFormChild.setLoading();
            this.$Message.error(this.$t('loginFrom.disableMain'));
            return;
          }
          if(res.data.status===1){
            this.$refs.loginFormChild.setLoading();
            sessionStorage.setItem('loginInfo', JSON.stringify(res['data']));
            this.initTagNavList([]);
            this.$router.push({
              name: this.$config.homeName
            })
          }
        } else {
          this.$refs.loginFormChild.setLoading();
          this.$refs.loginFormChild.setType();
          this.$Message.error(res.message)
        }
      })
    },
    cancelWaitActivationModal(){
      this.waitActivationModal=false;
    },
    cancelRefuseModal(){
      this.refuseModal=false;
    }
  }
}
</script>

<style>
.ivu-modal-header{
  /*background-color: rgba(240,242,246,1);*/
}
</style>
