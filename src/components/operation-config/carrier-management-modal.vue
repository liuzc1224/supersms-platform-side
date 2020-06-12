<template>
  <Modal v-model="showModal" :title="$t('carrierManagement.carrierManagement')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('carrierManagement.country')">
        <Input v-model="formValidate.nameInChinese+'    '+formValidate.nameInEnglish+'    '+formValidate.countryCallingCode" readonly="readonly"></Input>
<!--        <span>{{formValidate.nameInChinese }}</span>-->
<!--        <span class="left">{{formValidate.nameInEnglish}}</span>-->
<!--        <span class="left">{{formValidate.countryCallingCode}}</span>-->
      </FormItem>
<!--      <FormItem :label="$t('carrierManagement.operator')">-->
<!--        <Input v-model="formValidate.operatorName" readonly="readonly"></Input>-->
<!--&lt;!&ndash;        <span>{{formValidate.operatorName}}</span>&ndash;&gt;-->
<!--      </FormItem>-->
<!--      <FormItem :label="$t('carrierManagement.operatorNumberSegment')" prop="supportThemRoughly">-->
<!--        <Input v-model="formValidate.supportThemRoughly" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :maxlength="1000" :placeholder="$t('carrierManagement.prompt.numberSegment')"></Input>-->
<!--        <p>{{$t('carrierManagement.tip')}}</p>-->
<!--      </FormItem>-->
      <FormItem :label="$t('carrierManagement.singleCharacter')" prop="numberPerCharacter">
        <InputNumber :max="10000" :min="0" :step="1" style="width: 100%"
                     :formatter="value => `${value}`"
                     :parser="value => value.replace('.', '')"
                     v-model="formValidate.numberPerCharacter" :placeholder="$t('carrierManagement.prompt.input')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('carrierManagement.MaxCharacter')" prop="maxCharacterEverytime">
        <InputNumber :max="10000" :min="0" :step="1"
                     :formatter="value => `${value}`"
                     :parser="value => value.replace('.', '')"
                     style="width: 100%" v-model="formValidate.maxCharacterEverytime" :placeholder="$t('carrierManagement.prompt.input')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('carrierManagement.state')" prop="status">
        <Select
          clearable
          v-model="formValidate.status"
          :placeholder="$t('carrierManagement.prompt.state')"
        >
          <Option v-for="(item, i) in $t('carrierManagement.status')" :value="item.value" :key="i">{{item.desc}}</Option>
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
  import { operatorInfoUpdate } from "@/api/operation-config"
  export default {
    name: 'carrier-management-modal',
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
          // operatorName: null,
          // supportThemRoughly: null,
          maxCharacterEverytime : null,
          numberPerCharacter: null,
          status: null
        },
        ruleValidate: {
          supportThemRoughly: [ { required: true, message: this.$t('carrierManagement.prompt.numberSegment'), trigger: 'blur'} ],
          numberPerCharacter: [ { required: true, message: this.$t('carrierManagement.prompt.singleCharacter'), trigger: 'blur',type:'number'}],
          maxCharacterEverytime: [ { required: true, message: this.$t('carrierManagement.prompt.MaxCharacter'), trigger: 'blur',type:'number' } ],
          status: [ { required: true, message: this.$t('carrierManagement.prompt.state'), trigger: 'change', type: 'number' } ],
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
              supportThemRoughly:this.formValidate.supportThemRoughly,
              numberPerCharacter:this.formValidate.numberPerCharacter,
              maxCharacterEverytime:this.formValidate.maxCharacterEverytime,
              status:this.formValidate.status
            };
            if(data.supportThemRoughly){
              let str=data.supportThemRoughly;
              if(str.includes('，')){
                console.log(1)
                str=str.replace(/，/g,",")
              }
              if(str.includes(';')){
                console.log(2)
                str=str.replace(/;/g,",")
              }
              if(str.includes('；')){
                console.log(3)
                str=str.replace(/；/g,",")
              }
              data.supportThemRoughly=str;
            }
            operatorInfoUpdate(data).then(res => {
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
