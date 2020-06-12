<template>
  <Modal v-model="showModal" :mask-closable="false">
    <p slot="header">
      <span v-if="titleType==='add'">{{$t('account.add')}}</span>
      <span v-else-if="titleType==='review'">{{$t('account.review')}}</span>
      <span v-else="titleType==='edit'">{{$t('account.edit')}}</span>
    </p>
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
      <FormItem v-if="titleType!=='add'" :label="$t('account.businessNumber')" prop="businessNo">
        <Input v-model="formValidate.businessNo" :placeholder="$t('account.prompt.businessNumber')" :readonly="'readonly'" style="width: 100%"  maxlength="30"></Input>
      </FormItem>
      <FormItem :label="$t('account.company')" prop="companyName" key="companyName">
        <Input v-model="formValidate.companyName"  :readonly="readonlyType" :placeholder="$t('account.prompt.company')" style="width: 100%"  maxlength="30"></Input>
      </FormItem>
      <FormItem v-if="titleType!=='review'" :label="$t('account.operatingArea')" prop="businessArea" key="businessArea">
        <Select clearable v-model="formValidate.businessArea" class="search-select-item" :placeholder="$t('account.prompt.operatingArea')">
          <Option v-for="(item,index) in $t('account.operatingAreas')" :key="`businessArea-${index}`" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="titleType!=='review'" :label="$t('account.accountName')" prop="accountNo">
        <Input v-model="formValidate.accountNo" :placeholder="$t('account.prompt.accountName')" :maxlength="100" style="width: 100%" ></Input>
      </FormItem>
      <FormItem v-if="titleType==='edit'" :label="$t('account.password')" prop="password" key="editPassword">
        <Input v-model="formValidate.password" type="password" :placeholder="$t('account.prompt.password')" :maxlength="18" style="width: 100%"></Input>
        <p>{{$t('account.prompt.passwordTip')}}</p>
      </FormItem>
      <FormItem v-if="titleType==='add'" :label="$t('account.password')" prop="password1" key="addPassword">
        <Input v-model="formValidate.password" type="password" :placeholder="$t('account.prompt.password')" :maxlength="18" style="width: 100%"></Input>
        <p>{{$t('account.prompt.passwordTip')}}</p>
      </FormItem>
      <FormItem v-if="titleType!=='review'" :label="$t('account.mailbox')" prop="email">
        <Input v-model="formValidate.email" :placeholder="$t('account.prompt.mailbox')" :maxlength="100" style="width: 100%"></Input>
      </FormItem>
      <FormItem v-if="titleType!=='review'" :label="$t('account.contact')" prop="contact">
        <Input v-model="formValidate.contact" :placeholder="$t('account.prompt.contact')" :maxlength="100" style="width: 100%"></Input>
      </FormItem>
      <FormItem v-if="titleType!=='review'" :label="$t('account.contactNumber')" prop="contactPhoneNumber">
        <Input v-model="formValidate.contactPhoneNumber" :placeholder="$t('account.prompt.contactNumber')" :maxlength="100" style="width: 100%"></Input>
      </FormItem>

      <FormItem v-if="titleType==='review'" :label="$t('account.reviewState')" prop="reviewState">
        <Select clearable v-model="formValidate.reviewState" class="search-select-item" :placeholder="$t('account.prompt.reviewState')" @on-change="setReviewState">
          <Option v-for="(item,index) in $t('account.reviewStatue')" :key="index" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="titleType==='edit'" :label="$t('account.state')" prop="status">
        <Select clearable v-model="formValidate.status" class="search-select-item" :placeholder="$t('account.prompt.state')" @on-change="setStatus">
          <Option v-for="(item,index) in $t('account.editStatus')" :key="index" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="this.formValidate.reviewState===1" :label="$t('account.remarks')" :key="'remarks'">
        <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :show-word-limit="true" :maxlength="500" :placeholder="$t('account.prompt.remarks')"></Input>
      </FormItem>

      <FormItem v-if="this.formValidate.reviewState===3" :label="$t('account.refuseReason')" prop="refuseReason"  :key="'refuseReason'">
        <Input v-model="formValidate.refuseReason" type="textarea" :autosize="{minRows: 5,maxRows: 5}"  :show-word-limit="true" :maxlength="500" :placeholder="$t('account.prompt.refuseReason')"></Input>
      </FormItem>

      <FormItem v-if="titleType==='edit' && this.formValidate.status===1" :label="$t('account.remarks')"  :key="'editRemarks'">
        <Input v-model="formValidate.statusUpdateNote" name="statusStatusUpdateNote" type="textarea" :autosize="{minRows: 3,maxRows: 3}"  :show-word-limit="true" :maxlength="500" :placeholder="$t('account.prompt.remarks')"></Input>
      </FormItem>

      <FormItem v-if="titleType==='edit' && this.formValidate.status===2" :label="$t('account.disableReason')" prop="statusUpdateNote"  :key="'statusUpdateNote'">
        <Input v-model="formValidate.statusUpdateNote" name="statusStatusUpdateNote" type="textarea" :autosize="{minRows: 3,maxRows: 3}" :show-word-limit="true" :maxlength="500" :placeholder="$t('account.prompt.disableReason')"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit('formValidate')">{{$t('setUpPage.submit')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { encrypt } from '@/libs/util'
  import { operatorInfoUpdate,checkExist,operatorInfoAdd } from '@/api/merchantManagement'
  export default {
    name: "account-modal",
    props: ['editModal', 'chooseItem','titleType','readonlyType'],
    data () {
      const validatePass = (rule, value, callback) => {
        if(this.formValidate.id){
          if (this.formValidate.password) {
            let regex = "^(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{6,18}$";
            if(new RegExp(regex).test(this.formValidate.password)){
              callback();
            }else{
              callback(new Error(this.$t('account.prompt.tip')));
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
              callback(new Error(this.$t('account.prompt.tip')));
            }
          } else {
            callback(new Error(this.$t('account.prompt.password')));
          }
        }

      };
      const validateBusinessArea=(rule, value, callback) => {
        if(this.titleType==='review'){
          callback();
        }else{
          if (this.formValidate.businessArea!=null) {
            callback();
          }else{
            callback(new Error(this.$t('account.prompt.operatingArea')));
          }
        }
      };
      const validateAccountNo = (rule, value, callback) => {
        if (this.formValidate.accountNo!=null) {
          let data={
            name: this.formValidate.accountNo
          };
          checkExist(data).then(res => {
            if (res.data.success) {
              if(res.data.data!=null){
                if(this.titleType==='add') {
                  callback(new Error(this.$t('account.prompt.accountNameErr')));
                }else{
                  if(res.data.data===this.formValidate.id){
                    callback();
                  }else{
                    callback(new Error(this.$t('account.prompt.accountNameErr')));
                  }
                }
              }else{
                callback();
              }
            } else {
              this.$Message.error(res.data.message)
            }
          });
        } else {
          callback(new Error(this.$t('account.prompt.accountName')));
        }
      };
      return {
        loading:false,
        formValidate: {
          reviewState:null,
          remarks:null,
          refuseReason:null,

          id:null,
          businessNo:null,
          companyName:null,
          businessArea:null,

          accountNo :null,
          password:null,
          email:null,
          contact:null,
          contactPhoneNumber :null,
          statusUpdateNote :null,
          status  :null,
        },
        ruleValidate: {
          businessNo: [ { required: true, message: this.$t('account.prompt.businessNumber'), trigger: 'blur'} ],
          companyName: [ { required: true, message: this.$t('account.prompt.company'), trigger: 'blur' } ],
          businessArea: [ { required: true, validator: validateBusinessArea, trigger: 'change',type:'number' } ],
          accountNo: [ { required: true, validator: validateAccountNo, trigger: 'blur' } ],
          password: [ {  validator: validatePass, trigger: 'blur' } ],
          password1: [ { required: true, validator: validatePass, trigger: 'blur' } ],
          email: [ { required: true, message: this.$t('account.prompt.mailbox'), trigger: 'blur',type:'email' } ],
          contact: [ { required: true, message: this.$t('account.prompt.contact'), trigger: 'blur' } ],
          contactPhoneNumber: [ { required: true, message: this.$t('account.prompt.contactNumber'), trigger: 'blur' } ],
          // status: [ { required: true, validator: validateStatus, trigger: 'change',type:'number' } ],
          reviewState: [ { required: true,  message: this.$t('account.prompt.reviewState'), trigger: 'change',type:'number' } ],
          refuseReason: [ { required: true,  message: this.$t('account.prompt.refuseReason'), trigger: 'blur' } ],
          status: [ { required: true,  message: this.$t('account.prompt.state'), trigger: 'change',type:'number' } ],
          statusUpdateNote: [ { required: true,  message: this.$t('account.prompt.disableReason'), trigger: 'blur' } ],

          // statusUpdateNote: [ { required: true, validator: validateStatusUpdateNote, trigger: 'blur' } ],
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            let data={
              id:this.formValidate.id,
              businessNo:this.formValidate.businessNo,
              companyName:this.formValidate.companyName,
              businessArea:this.formValidate.businessArea,

              accountNo :this.formValidate.accountNo,
              password:this.formValidate.password!=null ? encrypt(this.formValidate.password) : null,
              email:this.formValidate.email,
              contact:this.formValidate.contact,
              contactPhoneNumber :this.formValidate.contactPhoneNumber,
              statusUpdateNote :this.formValidate.statusUpdateNote,
              status  :this.formValidate.status,
            };
            console.log(data);
            this.loading=true;
            let userInfo=JSON.parse(sessionStorage.getItem('loginInfo'))
            if(data['id']){
              console.log(userInfo);
              data['authOperator']=userInfo['username'];
              if(this.titleType==='edit'){
                if(data['status']===1){
                  data.operate=4;
                }
                if(data['status']===2){
                  data.operate=3;
                }
                if(data['status']==null){
                  data.operate=0;
                }
                console.log(data);
                operatorInfoUpdate(data).then(res => {
                  this.loading=false;
                  if (res.data.success) {
                    if(this.titleType==='review'){
                      this.$Message.success(this.$t('common.reviewSuccess'));
                    }
                    if(this.titleType==='edit'){
                      this.$Message.success(this.$t('common.editSuccess'));
                    }
                    this.$emit('editSuccess');
                    this.cancelSubmit();
                  } else {
                    this.$Message.error(res.data.message)
                  }
                })
              }
              if(this.titleType==='review'){
                let params={
                  id:this.formValidate.id,
                  status:this.formValidate.reviewState,
                  authOperator:userInfo['username']
                };
                if(this.formValidate.reviewState===1){
                  params.operate=1;
                  params['statusUpdateNote']=this.formValidate.remarks;
                }
                if(this.formValidate.reviewState===3){
                  params.operate=2;
                  params['statusUpdateNote']=this.formValidate.refuseReason;
                }
                console.log(params)
                operatorInfoUpdate(params).then(res => {
                  this.loading=false;
                  if (res.data.success) {
                    this.$Message.success(this.$t('common.reviewSuccess'));
                    this.$emit('editSuccess');
                    this.cancelSubmit();
                  } else {
                    this.$Message.error(res.data.message)
                  }
                })
              }
            }else{
              data['createOperator']=userInfo['username'];
              data.operate=0;
              operatorInfoAdd(data).then(res => {
                this.loading=false;
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
            this.$Message.error(this.$t('setUpPage.validateError'))
          }
        })
      },
      cancelSubmit () {
        this.$emit('changeModal', false);
        this.loading=false;
        this.$refs['formValidate'].resetFields()
      },
      setStatus(){
        this.formValidate.refuseReason=null;
        this.formValidate.statusUpdateNote=null;
      },
      setReviewState(){
        this.formValidate.remarks=null;
      }
    },
    mounted () {
      this.formValidate = this.chooseItem;
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
