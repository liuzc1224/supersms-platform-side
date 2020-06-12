<template>
  <Modal v-model="showModal" :title="$t('quote.edit')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="push-modal">
      <FormItem :label="$t('quote.businessNumber')">
        <Input v-model="formValidate.businessNo" readonly="readonly"></Input>
      </FormItem>
      <FormItem :label="$t('quote.operatingArea')">
        <Select v-model="formValidate.businessArea" class="search-select-item"  readonly="readonly">
          <Option v-for="(item,index) in $t('account.operatingAreas')" :key="index" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('quote.rmb')" prop="priceSingleRmb">
        <InputNumber :max="10000.000" :min="0.000" :step="0.001" style="width: 100%" v-model="formValidate.priceSingleRmb" :placeholder="$t('quote.prompt.rmb')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('quote.us')" prop="priceSingleDollar">
        <InputNumber :max="10000.000" :min="0.000" :step="0.001"  style="width: 100%" v-model="formValidate.priceSingleDollar" :placeholder="$t('quote.prompt.us')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('quote.creditLimit')" prop="creditLimit">
        <InputNumber :max="10000.000" :min="0.000" :step="0.001" style="width: 100%" v-model="formValidate.creditLimit" :placeholder="$t('quote.prompt.creditLimit')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('quote.weights')">
        <Select v-model="formValidate.sort" :placeholder="$t('quote.prompt.weights')" prop="sort">
          <Option v-for="(item) in 10" :key="`weights_${item}`" :value="item">{{item}}</Option>
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
  import { businessPriceInfoUpdate } from "@/api/merchantManagement"
  export default {
    name: 'quote-modal',
    props: ['editModal', 'chooseItem'],
    data () {
      return {
        loading:false,
        formValidate: {
          id:null,
          businessNo:null,
          businessArea:null,
          priceSingleRmb:null,
          priceSingleDollar:null,
          creditLimit:null,
          sort:null
        },
        ruleValidate: {
          priceSingleRmb: [ { required: true, message: this.$t('quote.prompt.rmb'), trigger: 'blur',type:'number'} ],
          priceSingleDollar: [ { required: true, message: this.$t('quote.prompt.us'), trigger: 'blur',type:'number' } ],
          creditLimit: [ { required: true, message: this.$t('quote.prompt.creditLimit'), trigger: 'blur',type:'number' } ],
          sort: [ { required: true, message: this.$t('quote.prompt.weights'), trigger: 'change',type:'number' } ],
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.loading=true;
            let data=this.formValidate;
            data['updator']=JSON.parse(sessionStorage.getItem('loginInfo'))['id'];
            console.log(data);
            businessPriceInfoUpdate(data).then(res => {
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

</style>
