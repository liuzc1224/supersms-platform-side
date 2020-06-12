<template>
  <Modal v-model="showModal" :title="formValidate.id ? $t('cardManagement.add') : $t('cardManagement.edit')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('cardManagement.cardNumber')" prop="cardNo">
        <Input v-model="formValidate.cardNo" type="text" :placeholder="$t('cardManagement.prompt.cardNumber')" :readonly="formValidate.id ? 'readonly' : null"></Input>
      </FormItem>
      <FormItem :label="$t('cardManagement.state')" prop="status">
        <Select
          clearable
          v-model="formValidate.status"
          :placeholder="$t('cardManagement.prompt.state')"
        >
          <Option v-for="(item, i) in $t('cardManagement.status')" :value="item.value" :key="i">{{item.desc}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit()">{{$t('setUpPage.submit')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { addCard,editCard,checkCard,inquireCard } from "@/api/operation-config"
  export default {
    name: 'card-management',
    props: ['editModal', 'chooseItem'],
    data () {
      return {
        loading:false,
        file:null,
        fileContent:null,
        formValidate: {
          id:null,
          cardNo:null,
          status:null,
        },
        ruleValidate: {
          cardNo: [ { required: true, message: this.$t('cardManagement.prompt.cardNumber'), trigger: 'blur'} ],
          status: [ { required: true, message: this.$t('cardManagement.prompt.state'), trigger: 'change', type: 'number' } ]
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
              status:this.formValidate.status
            };
            if(data['id']){
              let params={
                id:this.formValidate.id
              };
              inquireCard(params).then(res => {
                if(res.data.success){
                  if(res.data.data){
                    if(res.data.data['cardNo']===this.formValidate.cardNo){
                      this.edit(data);
                    }else{
                      checkCard(data['cardNo']).then(request => {
                        if(request.data.success){
                          if(request.data.data){
                            this.edit(data);
                          }else{
                            this.loading=false;
                            this.$Message.error(this.$t('cardManagement.error'))
                          }
                        }else{
                          this.loading=false;
                          this.$Message.error(request.data.message)
                        }
                      })
                    }
                  }else{
                    this.loading=false;
                    this.$Message.error(res.data.message)
                  }
                }else{
                  this.loading=false;
                  this.$Message.error(res.data.message)
                }
              });
            }else{
              checkCard(data['cardNo']).then(res => {
                if(res.data.success){
                  if(res.data.data){
                    this.add(data)
                  }else{
                    this.loading=false;
                    this.$Message.error(this.$t('cardManagement.error'))
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
        this.$refs['formValidate'].resetFields();
      },
      add(data){
        addCard(data).then(request => {
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
        editCard(data).then(request => {
          this.loading=false;
          if(request.data.success){
            this.$Message.success(this.$t('setUpPage.editSuccess'));
            this.$emit('editSuccess');
            this.cancelSubmit()
          }else{
            this.$Message.error(this.$t('setUpPage.repeat'))
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
