<template>
  <Modal v-model="showModal" :title="$t('balanceWarning.edit')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="200" class="push-modal">
      <FormItem :label="$t('balanceWarning.operator')" prop="operatorName">
        <Input v-model="formValidate.operatorName" readonly="readonly"></Input>
      </FormItem>
      <FormItem :label="$t('balanceWarning.estimate')" prop="balanceExpected">
        <InputNumber class="inputNumber" :max="1000000000" :min="0" v-model="formValidate.balanceExpected" :placeholder="$t('balanceWarning.prompt.input')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('balanceWarning.pricing')" prop="priceSingleRmb">
        <InputNumber class="inputNumber" :max="1000000000" :min="0" v-model="formValidate.priceSingleRmb" :placeholder="$t('balanceWarning.prompt.input')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('balanceWarning.warning')" prop="balanceWarning">
        <InputNumber class="inputNumber" :max="1000000000" :min="0" v-model="formValidate.balanceWarning" :placeholder="$t('balanceWarning.prompt.input')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('balanceWarning.earlyWarningEmail')" prop="emailWarning">
        <Input v-model="formValidate.emailWarning" type="email" :placeholder="$t('balanceWarning.prompt.input')" maxlength="50"></Input>
      </FormItem>
      <FormItem :label="$t('balanceWarning.state')" prop="status">
        <Select
          clearable
          v-model="formValidate.status"
          :placeholder="$t('balanceWarning.prompt.state')"
        >
          <Option v-for="(item, i) in $t('balanceWarning.status')" :value="item.value" :key="i">{{item.desc}}</Option>
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
    name: 'balance-warning-modal',
    props: ['editModal', 'chooseItem'],
    data () {
      return {
        loading:false,
        file:null,
        fileContent:null,
        formValidate: {
          id:null,
          operatorName:null,
          balanceExpected:null,
          balanceWarning: null,
          emailWarning: null,
          status: null
        },
        ruleValidate: {
          operatorName: [ { required: true, message: this.$t('balanceWarning.prompt.input')+this.$t('balanceWarning.operator'), trigger: 'blur' }],
          balanceExpected: [ { required: true, message: this.$t('balanceWarning.prompt.input')+this.$t('balanceWarning.estimate'), trigger: 'blur',type:'number' }],
          priceSingleRmb: [ { required: true, message: this.$t('balanceWarning.prompt.input')+this.$t('balanceWarning.pricing'), trigger: 'blur',type:'number' } ],
          balanceWarning: [ { required: true, message: this.$t('balanceWarning.prompt.input')+this.$t('balanceWarning.warning'), trigger: 'blur',type:'number' } ],
          emailWarning: [ { required: true, message: this.$t('balanceWarning.prompt.input')+this.$t('balanceWarning.earlyWarningEmail'), trigger: 'blur',type:'email' } ],
          status: [ { required: true, message: this.$t('balanceWarning.prompt.state'), trigger: 'change', type: 'number' } ],
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.loading=true;
            let data=this.formValidate;
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
.inputNumber{
  width: 100%;
}
</style>
