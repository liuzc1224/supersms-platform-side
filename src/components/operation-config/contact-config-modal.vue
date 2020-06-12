<template>
  <Modal v-model="showModal" :title="$t('contactConfig.title')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('contactConfig.country')">
        <Input v-model="formValidate.nameInChinese+'    '+formValidate.nameInEnglish+'    '+formValidate.countryCallingCode" readonly="readonly"></Input>
      </FormItem>
      <FormItem :label="$t('contactConfig.phoneRecharge')" prop="businessNumberRegistrationTel">
        <Input
          maxlength="50"
          v-model="formValidate.businessNumberRegistrationTel"
          :formatter="value => `${value}`"
          :parser="value => value.replace(/[^\d]/g,'')"
          :placeholder="$t('contactConfig.prompt.phoneRecharge')">
        </Input>
      </FormItem>
      <FormItem :label="$t('contactConfig.emailRecharge')" prop="businessNumberRegistrationEmail">
        <Input v-model="formValidate.businessNumberRegistrationEmail" :placeholder="$t('contactConfig.prompt.emailRecharge')" maxlength="50"></Input>
      </FormItem>
      <FormItem :label="$t('contactConfig.phoneMerchant')" prop="rechargeTel">
        <Input v-model="formValidate.rechargeTel"
               maxlength="50"
               :formatter="value => `${value}+''`"
               :parser="value => value.replace(/[^\d]/g,'')"
               :placeholder="$t('contactConfig.prompt.phoneMerchant')"></Input>
      </FormItem>
      <FormItem :label="$t('contactConfig.emailMerchant')" prop="rechargeEmail">
        <Input v-model="formValidate.rechargeEmail" :placeholder="$t('contactConfig.prompt.emailMerchant')" maxlength="50"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit('formValidate')">{{$t('setUpPage.submit')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { areaContactInfoUpdate } from "@/api/operation-config"
  export default {
    name: 'contact-config-modal',
    props: ['editModal', 'chooseItem'],
    data () {
      return {
        loading:false,
        file:null,
        fileContent:null,
        formValidate: {
          id:null,
          countryCallingCode:null,
          nameInChinese:null,
          nameInEnglish:null,

          rechargeEmail :null,
          rechargeTel:null,
          businessNumberRegistrationEmail:null,
          businessNumberRegistrationTel :null
        },
        ruleValidate: {
          businessNumberRegistrationEmail: [ { required: true, message: this.$t('contactConfig.prompt.emailRecharge'), trigger: 'blur',type:'email'} ],
          businessNumberRegistrationTel: [ { required: true, message: this.$t('contactConfig.prompt.phoneRecharge'), trigger: 'blur' } ],
          rechargeEmail: [ { required: true, message: this.$t('contactConfig.prompt.emailMerchant'), trigger: 'blur',type:'email' } ],
          rechargeTel: [ { required: true, message: this.$t('contactConfig.prompt.phoneMerchant'), trigger: 'blur' } ],
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.loading=true;
            let data={
              id:this.formValidate.id,
              businessNumberRegistrationEmail:this.formValidate.businessNumberRegistrationEmail,
              businessNumberRegistrationTel:this.formValidate.businessNumberRegistrationTel,
              rechargeEmail:this.formValidate.rechargeEmail,
              rechargeTel:this.formValidate.rechargeTel
            };
            areaContactInfoUpdate(data).then(res => {
              this.loading=false;
              if(res.data.success){
                this.$Message.success(this.$t('setUpPage.editSuccess'));
                this.$emit('editSuccess');
                this.cancelSubmit()
              }else{
                this.$Message.error(res.data.message)
              }
            })
          } else {
            this.$Message.error(this.$t('setUpPage.validateErrorMsg'))
          }
        })
      },
      cancelSubmit () {
        this.$emit('changeModal', false);
        this.$refs['formValidate'].resetFields();
      }
    },
    mounted () {
      this.formValidate = this.chooseItem
    },
    computed: {
      showModal: {
        get: function () {
          return this.editModal
        },
        set: function () {
        }
      }
    }
  }
</script>

<style lang="less">
  .left{
    padding-left: 20px;
  }
  .help-modal{
    .ivu-form-item{
      .ivu-input[disabled],.ivu-select-disabled .ivu-select-selection{
        background-color: #fff;
        color: #515a6e;
      }
    }
  }
  .avatar {
    cursor: pointer;
    position: relative;

    .input-file {
      width: 40%;
      height: 32px;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }

    .bg {
      width: 100%;
      height: 100%;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.3);
      text-align: center;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
    }

    .text {
      padding-top: 10px;
      color: lightblue;
    }
  }
  .fileName{
    margin-top: 10px;
  }
  .fileName:hover{
    background-color: #f2f2f2;
  }
  .table{
    border-collapse: collapse;
    tr{
      td{
        height: 40px;
        width: 100px;
        text-align: center;
        border: 1px solid black;
      }
    }
  }
</style>
