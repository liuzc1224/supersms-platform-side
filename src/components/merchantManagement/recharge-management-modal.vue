<template>
  <Modal v-model="showModal" :title="formValidate.id ? $t('rechargeManagement.edit') : $t('rechargeManagement.add')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('rechargeManagement.businessNumber')" prop="merchantId">
        <Input v-model="formValidate.businessNo" :readonly="readonlyType" :placeholder="$t('rechargeManagement.prompt.businessNumber')"></Input>
      </FormItem>
      <FormItem :label="$t('rechargeManagement.rechargeMethod')" prop="rechargeType">
        <Select
          clearable
          :disabled="readonlyType==='readonly'"
          style="min-width: 160px"
          v-model="formValidate.rechargeType"
          class="search-select-item"
          :placeholder="$t('rechargeManagement.prompt.rechargeMethod')"
        >
          <Option v-for="(item, i) in $t('rechargeManagement.rechargeMethods')" :value="item.value" :key="i">{{item.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('rechargeManagement.transactionNumber')" prop="transactionId">
        <Input v-model="formValidate.transactionId" :readonly="readonlyType" :placeholder="$t('rechargeManagement.prompt.transactionNumber')"></Input>
      </FormItem>
      <FormItem :label="$t('rechargeManagement.rechargeAmount')" prop="rechargeAmount">
        <Row>
          <i-col span="15">
            <InputNumber :readonly="readonlyType"  :max="100000000.00" :min="0.00" :step="0.01" v-model="formValidate.rechargeAmount" :placeholder="$t('rechargeManagement.prompt.rechargeAmount')" style="width: 100%"></InputNumber>
          </i-col>
          <i-col span="8" offset="1">
            <Select
              :disabled="true"
              v-model="formValidate.monetaryUnit"
              class="search-select-item"
              :placeholder="$t('rechargeManagement.currencyUnit')"
            >
              <Option v-for="(item, i) in $t('rechargeManagement.units')" :value="item.value" :key="i">{{item.desc}}</Option>
            </Select>
          </i-col>
        </Row>

      </FormItem>
      <FormItem v-if="formValidate.id" :label="$t('rechargeManagement.rechargeType')" prop="rechargeStatus">
        <Select
          clearable
          style="min-width: 160px"
          v-model="formValidate.rechargeStatus"
          class="search-select-item"
          :placeholder="$t('rechargeManagement.prompt.rechargeType')"
        >
          <Option v-for="(item, i) in $t('rechargeManagement.rechargeTypes')" :value="item.value" :key="i">{{item.desc}}</Option>
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
  import { addRechargeRecordInfo,updateRechargeRecordInfo } from "@/api/merchantManagement"
  export default {
    name: 'recharge-management-modal',
    props: ['editModal', 'chooseItem','readonlyType'],
    data () {
      return {
        loading:false,
        formValidate: {
          id:null,
          businessNo:null,
          rechargeType:null,
          transactionId:null,

          rechargeAmount :null,
          monetaryUnit:null,
          rechargeStatus:null
        },
        ruleValidate: {
          businessNo: [ { required: true, message: this.$t('quote.prompt.businessNumber'), trigger: 'blur'} ],
          transactionId: [ { required: true, message: this.$t('rechargeManagement.prompt.transactionNumber'), trigger: 'blur' } ],
          rechargeAmount: [ { required: true, message: this.$t('rechargeManagement.prompt.rechargeAmount'), trigger: 'blur',type:'number' } ],
          rechargeStatus: [ { required: true, message: this.$t('rechargeManagement.prompt.rechargeType'), trigger: 'change',type:'number' } ],
          rechargeType: [ { required: true, message: this.$t('rechargeManagement.prompt.rechargeMethod'), trigger: 'change',type:'number' } ],
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.loading=true;
            let data=this.formValidate;
            data['createType']=1;
            if(data['id']){
              updateRechargeRecordInfo(data).then(res => {
                this.loading=false;
                if(res.data.success){
                  this.$Message.success(this.$t('setUpPage.editSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit()
                }else{
                  this.$Message.error(res.data.message)
                }
              })
            }else{
              data['status']=1;
              addRechargeRecordInfo(data).then(res => {
                this.loading=false;
                if(res.data.success){
                  this.$Message.success(this.$t('setUpPage.addSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit()
                }else{
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
