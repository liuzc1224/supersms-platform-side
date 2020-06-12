<template>
  <Modal v-model="showModal" :title="$t('userInfo.password')"
             :mask-closable="false">
        <div slot="close">
          <Icon @click="cancelSubmit()" type="ios-close"/>
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <FormItem :label="$t('userInfo.old')" prop="oldPassword">
            <Input v-model="formValidate.oldPassword"  :placeholder="$t('userInfo.inputOld')" type="password" maxlength="20"></Input>
          </FormItem>
          <FormItem :label="$t('userInfo.new')" prop="newPassword">
            <Input v-model="formValidate.newPassword" :placeholder="$t('userInfo.inputNew')" type="password" maxlength="20"></Input>
          </FormItem>
          <FormItem :label="$t('userInfo.repeatNew')" prop="repeatNew">
            <Input v-model="formValidate.repeatNew"  :placeholder="$t('userInfo.inputRepeatNew')" type="password" maxlength="20"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancelSubmit()">{{$t('common.cancel')}}</Button>
          <Button type="primary" size="large" @click="handleSubmit('formValidate')">{{$t('common.define')}}</Button>
        </div>
      </Modal>
</template>

<script>
  import { encrypt } from '@/libs/util'
  import { updateUser} from '@/api/user'
  import {dateToString, getLoginInfo} from '@/libs/tools'
  import {sessionRead} from '@/libs/util'
  export default {
    name: "password",
    props: ['editModal'],
    data() {
      const validatePass = (rule, value, callback) => {
        if (this.formValidate.newPassword!=null) {
          let regex = "^(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{6,18}$";
          if(new RegExp(regex).test(this.formValidate.newPassword)){
            callback();
          }else{
            callback(new Error(this.$t('userInfo.tip')));
          }
        } else {
          callback(new Error(this.$t('userInfo.inputNew')));
        }
      };
      return {
        formValidate: {
          newPassword: "",
          old: "",
          repeatNew: ""
        },
        ruleValidate: {
          newPassword: [{
            required: true,
            validator: validatePass,
            trigger: 'blur',
            type: 'string'
          }],
          oldPassword:[{
            required: true,
            message: this.$t('userInfo.inputOld'),
            trigger: 'blur',
            type: 'string'
          }],
          repeatNew:[{
            required: true,
            message: this.$t('userInfo.inputRepeatNew'),
            trigger: 'blur',
            type: 'string'
          }],
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            let loginInfo = sessionRead('loginInfo');
            let data=this.formValidate;
            if(data.newPassword === data.repeatNew){
              let params={
                id:loginInfo['id'],
                oldPassword:encrypt(data.oldPassword),
                newPassword:encrypt(data.newPassword)
              };
              updateUser(params).then(res => {
                if (res.data.success) {
                  this.$Message.success(this.$t('common.editSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit();
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }else {
              this.$Message.error(this.$t('userInfo.error'))
            }

          }
        })
      },
      cancelSubmit() {
        this.$emit('changeModal', false);
        this.$refs['formValidate'].resetFields();
      },
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

<style scoped>

</style>
