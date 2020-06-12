<template>
  <Modal v-model="showModal" :title="$t('cardManagement.checkCard')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('cardManagement.cardNumberCheck')">
        <Input v-model="formValidate.cardNo" readonly="readonly"></Input>
      </FormItem>
      <FormItem :label="$t('cardManagement.msgContent')" prop="msg">
        <Input v-model="formValidate.msg" type="textarea" show-word-limit :autosize="{minRows: 5,maxRows: 5}" :maxlength="500" :placeholder="$t('cardManagement.prompt.msgContent')"></Input>
      </FormItem>
      <FormItem :label="$t('cardManagement.phone')" prop="phone">
        <Input v-model="formValidate.phone" type="text" :placeholder="$t('cardManagement.prompt.phone')"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit('formValidate')">{{$t('setUpPage.submit')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { checkEffect } from "@/api/operation-config"
  export default {
    name: 'card-check-modal',
    props: ['editModal', 'chooseItem'],
    data () {
      return {
        loading:false,
        file:null,
        fileContent:null,
        formValidate: {
          id:null,
          cardNo:null,
          msg:null,
          phone:null
        },
        ruleValidate: {
          msg: [ { required: true, message: this.$t('cardManagement.prompt.msgContent'), trigger: 'blur' } ],
          phone: [ { required: true, message: this.$t('cardManagement.prompt.phone'), trigger: 'blur' } ],
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
              cardNo:this.formValidate.cardNo,
              msg:this.formValidate.msg,
              phone:this.formValidate.phone
            };
            checkEffect(data).then(res => {
              this.loading=false;
              if(res.data.success){
                if(res.data.data===1){
                  this.$Message.success(this.$t("cardManagement.success"))
                }else if(res.data.data===-1){
                  this.$Message.error(this.$t("cardManagement.fail"))
                }else if(res.data.data===0){
                  this.$Message.destroy(this.$t("cardManagement.no"))
                }
                // this.$Message.success(this.$t('setUpPage.editSuccess'));
                // this.$emit('editSuccess');
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

</style>
