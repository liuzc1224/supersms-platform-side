<template>
  <Modal v-model="showModal" :title="$t('sensitiveWord.updateSensitiveWord')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('sensitiveWord.country')">
        <Input v-model="formValidate.nameInChinese+'    '+formValidate.nameInEnglish+'    '+formValidate.countryCallingCode" readonly="readonly"></Input>
      </FormItem>
      <FormItem :label="$t('sensitiveWord.sensitiveWord')" prop="sensitiveWords">
        <Input v-model="formValidate.sensitiveWords" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :maxlength="1000" :placeholder="$t('sensitiveWord.prompt.sensitiveWord')"></Input>
        <p>{{$t('sensitiveWord.tip')}}</p>
      </FormItem>
      <FormItem :label="$t('sensitiveWord.state')" prop="status">
        <Select
          clearable
          v-model="formValidate.status"
          :placeholder="$t('sensitiveWord.prompt.state')"
        >
          <Option v-for="(item, i) in $t('sensitiveWord.status')" :value="item.value" :key="i">{{item.desc}}</Option>
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
  import { senstiveWordsInfoUpdate } from "@/api/operation-config"
  export default {
    name: 'sensitive-word-modal',
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
          nameInEnglish: null,
          sensitiveWords: null,
          status: null
        },
        ruleValidate: {
          sensitiveWords: [ { required: true, message: this.$t('sensitiveWord.prompt.sensitiveWord'), trigger: 'blur'} ],
          status: [ { required: true, message: this.$t('sensitiveWord.prompt.state'), trigger: 'change', type: 'number' } ],
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
              sensitiveWords:this.formValidate.sensitiveWords,
              status:this.formValidate.status
            };
            if(data.sensitiveWords){
              let str=data.sensitiveWords;
              if(str.includes('，')){
                str=str.replace(/，/g,",")
              }
              if(str.includes(';')){
                str=str.replace(/;/g,",")
              }
              if(str.includes('；')){
                str=str.replace(/；/g,",")
              }
              data.sensitiveWords=str;
            }
            senstiveWordsInfoUpdate(data).then(res => {
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
