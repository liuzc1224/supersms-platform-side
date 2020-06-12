<template>
  <Modal v-model="showModal" :title=" formValidate.id ? $t('accountManagement.edit') : $t('accountManagement.add')"
         :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close"/>
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem :label="$t('accountManagement.accountName')" prop="accountNo">
        <Input v-model="formValidate.accountNo" :show-word-limit="true" maxlength="100" :placeholder="$t('accountManagement.prompt.accountName')"></Input>
      </FormItem>
      <FormItem :label="$t('accountManagement.password')" prop="password">
        <Input v-model="formValidate.password" type="password" :show-word-limit="true" :maxlength="18" :placeholder="$t('accountManagement.prompt.password')"></Input>
        <p>
          {{this.$t('accountManagement.tip')}}
        </p>
      </FormItem>

      <FormItem :label="$t('accountManagement.state')" prop="status">
        <Select v-model="formValidate.status" class="search-select-item" :placeholder="$t('accountManagement.prompt.state')">
          <Option v-for="(item,index) in $t('accountManagement.editStatus')" :key="index" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>

    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('common.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit()">{{$t('common.setting')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { checkExist } from '@/api/user'
  import { encrypt } from '@/libs/util'
  import { addAccount,updateAccount } from '@/api/account_management'
  export default {
    name: 'account_management_modal',
    props: ['editModal', 'chooseItem'],
    data () {
      const validateAccountNo = (rule, value, callback) => {
        if (this.formValidate.accountNo != null) {
          if(this.formValidate.id){
            callback();
          }else{
            let data = {
              name: this.formValidate.accountNo
            };
            checkExist(data).then(res => {
              if (res.data.success) {
                if (res.data.data) {
                  callback(new Error(this.$t('accountManagement.prompt.accountErr')));
                } else {
                  callback();
                }
              } else {
                this.$Message.error(res.data.message)
              }
            });
          }

        } else {
          callback(new Error(this.$t('accountManagement.prompt.accountName')));
        }
      };
      const validatePass = (rule, value, callback) => {
          if(this.formValidate.id){
            if (this.formValidate.password) {
              let regex = "^(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{6,18}$";
              if(new RegExp(regex).test(this.formValidate.password)){
                callback();
              }else{
                callback(new Error(this.$t('accountManagement.prompt.tip')));
              }
            } else {
              callback();
            }
          }else{
            if (this.formValidate.password) {
              let regex = "^(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{6,18}$";
              if(new RegExp(regex).test(this.formValidate.password)){
                callback();
              }else{
                callback(new Error(this.$t('accountManagement.prompt.tip')));
              }
            } else {
              callback(new Error(this.$t('accountManagement.prompt.password')));
            }
          }

      };
      return {
        template: 0,
        contentReadonly: false,
        loading: false,
        file: null,
        fileContent: null,
        formValidate: {
          id: null,
          accountNo: null,
          password: null,
          status: null
        },
        ruleValidate: {
          accountNo: [ { required: true, validator: validateAccountNo, trigger: 'blur' } ],
          password: [ { validator: validatePass, trigger: 'blur' } ],
          status: [ { required: true,  message: this.$t('accountManagement.prompt.state'), trigger: 'change',type:'number' } ]
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.loading = true;
            let data = {
              id:this.formValidate.id,
              accountNo:this.formValidate.accountNo,
              status:this.formValidate.status
            };
            if(this.formValidate.password){
              data['password']=encrypt(this.formValidate.password);
            }
            if(data['id']){
              updateAccount(data).then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$Message.success(this.$t('common.editSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit()
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }else{
              addAccount(data).then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$Message.success(this.$t('common.addSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit();
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }

          } else {
            this.$Message.error(this.$t('common.validateErrorMsg'))
          }
        })
      },
      cancelSubmit () {
        this.file = '';
        this.$emit('changeModal', false);
        this.loading = false;
        this.$refs['formValidate'].resetFields()
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

<style scoped lang="less">
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
    p{
      padding: 0 0 0 10px;
    }
  }
  .fileName:hover{
    background-color: #f8f8f9;
  }
  .icon:hover{
    cursor: pointer;
  }
</style>
