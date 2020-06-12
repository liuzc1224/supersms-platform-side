<template>
  <Modal v-model="showModal" :title="formValidate.id!=null ? $t('accountConfig.edit') : $t('accountConfig.add')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('accountConfig.account')" prop="account">
        <Input v-model="formValidate.account" type="text" maxlength="50" :placeholder="$t('accountConfig.prompt.account')"></Input>
      </FormItem>
      <FormItem v-if="formValidate.id!=null" :label="$t('accountConfig.password')"  key="password">
        <Input v-model="formValidate.password" type="text" maxlength="50" :placeholder="$t('accountConfig.prompt.password')"></Input>
      </FormItem>
      <FormItem v-else :label="$t('accountConfig.password')" prop="password1" key="password1">
        <Input v-model="formValidate.password" type="text" maxlength="50" :placeholder="$t('accountConfig.prompt.password')"></Input>
      </FormItem>
      <FormItem :label="$t('accountConfig.ip')" prop="ip">
        <Input v-model="formValidate.ip" type="text" maxlength="50" :placeholder="$t('accountConfig.prompt.ip')"></Input>
      </FormItem>
      <FormItem :label="$t('accountConfig.port')" prop="port">
        <Input v-model="formValidate.port" type="text" maxlength="50" :placeholder="$t('accountConfig.prompt.port')"></Input>
      </FormItem>
      <FormItem :label="$t('accountConfig.state')" prop="status">
        <Select
          clearable
          style="min-width: 160px"
          v-model="formValidate.status"
          :placeholder="$t('accountConfig.prompt.state')"
        >
          <Option v-for="(item, i) in $t('accountConfig.status')" :value="item.value" :key="i">{{item.desc}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit('formValidate')">{{$t('setUpPage.submit')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { channelAccountCheck,addChannelAccount,updateChannelAccount,getChannelAccount } from "@/api/operation-config"
  export default {
    name: 'account-config-modal',
    props: ['editModal', 'chooseItem'],
    data () {
      const validatePass = (rule, value, callback) => {
        if(this.formValidate.id){
          if (this.formValidate.password) {
            callback();
          } else {
            callback();
          }
        }else{
          if (this.formValidate.password) {
            callback();
          } else {
            callback(new Error(this.$t('accountConfig.prompt.password')));
          }
        }

      };
      return {
        loading:false,
        file:null,
        fileContent:null,
        formValidate: {
          id:null,
          account:null,
          password:null,
          ip: null,
          port: null,
          status: null
        },
        ruleValidate: {
          account: [ { required: true, message: this.$t('accountConfig.prompt.account'), trigger: 'blur' } ],
          ip: [ { required: true, message: this.$t('accountConfig.prompt.ip'), trigger: 'blur' } ],
          port: [ { required: true, message: this.$t('accountConfig.prompt.port'), trigger: 'blur' } ],
          password: [ {validator: validatePass, trigger: 'blur' } ],
          password1: [ { required: true, validator: validatePass, trigger: 'blur' } ],
          status: [ { required: true, message: this.$t('accountConfig.prompt.state'), trigger: 'change', type: 'number' } ],
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
              account:this.formValidate.account,
              password:this.formValidate.password ? this.formValidate.password : null,
              ip:this.formValidate.ip,
              port:this.formValidate.port,
              status:this.formValidate.status
            };
            if(data['id']){
              let params={
                id:this.formValidate.id
              };
              getChannelAccount(params).then(res => {
                if(res.data.success){
                  if(res.data.data){
                    if(res.data.data['account']===this.formValidate.account){
                      this.edit(data);
                    }else{
                      channelAccountCheck(data).then(request => {
                        if(request.data.success){
                          if(request.data.data){
                            this.edit(data);
                          }else{
                            this.$Message.error(this.$t('accountConfig.error'))
                          }
                        }else{
                          this.loading=false;
                          this.$Message.error(request.data.message)
                        }
                      })
                    }
                  }else{
                    this.loading=false;
                  }
                }else{
                  this.loading=false;
                  this.$Message.error(res.data.message)
                }
              });
            }else{
              channelAccountCheck(data).then(res => {
                if(res.data.success){
                  if(res.data.data){
                    this.add(data)
                  }else{
                    this.$Message.error(this.$t('accountConfig.error'))
                  }
                }else{
                  this.loading=false;
                  this.$Message.error(res.data.message)
                }
              })
            }
          } else {
            this.$Message.error(this.$t('setUpPage.validateErrorMsg'))
          }
        })
      },
      cancelSubmit () {
        this.$emit('changeModal', false);
      },
      add(data){
        addChannelAccount(data).then(request => {
          this.loading=false;
          if(request.data.success){
            this.$Message.success(this.$t('setUpPage.addSuccess'));
            this.$emit('editSuccess');
            this.cancelSubmit()
          }else{
            this.$Message.error(request.data.message)
          }
        })
      },
      edit(data){
        updateChannelAccount(data).then(request => {
          this.loading=false;
          if(request.data.success){
            this.$Message.success(this.$t('setUpPage.editSuccess'));
            this.$emit('editSuccess');
            this.cancelSubmit()
          }else{
            this.$Message.error(request.data.message)
          }
        })
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

</style>
