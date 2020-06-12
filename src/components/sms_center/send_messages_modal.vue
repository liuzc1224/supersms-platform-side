<template>
  <Modal v-model="showModal" :title="$t('smsCenter.sendMessages.addSmsType')"
         :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close"/>
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem :label="$t('smsCenter.sendMessages.sendContentTemplate')" prop="template">
        <Select v-model="template" class="search-select-item" @on-change="changeTemplate" :placeholder="$t('smsCenter.sendMessages.prompt.sendContentTemplate')">
          <Option v-for="(item,index) in templateData" :key="index" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('smsCenter.sendMessages.smsContent')" prop="msgContent">
        <Input v-model="formValidate.msgContent" type="textarea" :readonly="contentReadonly" :autosize="{minRows: 5,maxRows: 5}" :show-word-limit="true" :maxlength="maxCharacterEverytime" :placeholder="$t('smsCenter.sendMessages.prompt.smsContent')" @on-blur="SMSLength"></Input>
        <p>
          {{this.$t('smsCenter.sendMessages.tip')}}
        </p>
        <p v-if="formValidate.msgContent">{{this.$t('smsCenter.sendMessages.smsTip1')}} {{smsLength}} {{this.$t('smsCenter.sendMessages.smsTip2')}}</p>
      </FormItem>

      <FormItem :label="$t('smsCenter.sendMessages.receiverPhone')" prop="phoneNumberList">
        <Input v-model="formValidate.phoneNumberList" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :show-word-limit="true" :maxlength="500" :placeholder="$t('smsCenter.sendMessages.prompt.receiverPhone')"></Input>
        <p>
          {{this.$t('smsCenter.sendMessages.phoneTip')}}
        </p>
<!--      </FormItem>-->
<!--      <FormItem :label="$t('smsCenter.sendMessages.uploadPhone')">-->
        <Row class="avatar">
          <Button type="primary">{{$t('smsCenter.sendMessages.uploadPhone')}}</Button>
          <input
            type="file"
            class="input-file"
            name="avatar"
            ref="avatarInput"
            @change="changeFile($event)"
            accept=".xls,.xlsx"
          >
        </Row>
        <Row v-if="file && file.name" class="fileName">
          <i-col span="20">
            <p>{{file.name}}</p>
          </i-col>
          <i-col span="3">
            <Icon class="icon" type="md-close" @click="file=null"/>
          </i-col>
        </Row>
      </FormItem>

      <FormItem :label="$t('smsCenter.sendMessages.smsType')" prop="sendType">
        <Select clearable v-model="formValidate.sendType" class="search-select-item" :placeholder="$t('smsCenter.sendMessages.prompt.smsType')">
          <Option v-for="(item,index) in $t('smsCenter.sendMessages.smsTypes')" :key="index" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
        <Row v-if="formValidate.sendType==1">
          <i-col span="13">
            <FormItem :label="$t('smsCenter.sendMessages.sendTime')" prop="sendTime">
              <DatePicker
                type="date"
                :options="options"
                format="yyyy-MM-dd"
                ref="createTimeStart"
                :placeholder="$t('common.date')"
                v-model="formValidate.sendTime"
                style="width:100%;"
                @on-change="setSendDate"
              ></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="10" offset="1">
            <FormItem :label-width="0" prop="dateTime">
              <TimePicker format="HH:mm" v-model="formValidate.dateTime"
                :readonly="!formValidate.sendTime"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                :placeholder="$t('common.time')"
                @on-change="setSendTime"
              >
              </TimePicker>
              </FormItem>
          </i-col>
          <i-col span="19" offset="5">{{$t('smsCenter.sendMessages.timeTip')}}</i-col>
        </Row>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('common.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit()">{{$t('smsCenter.sendMessages.send')}}</Button>
    </div>
  </Modal>
</template>

<script>
import { formatDate } from '@/assets/js/date'
import { addMsgSend,checkSMSLength } from '@/api/sms_center'
export default {
  name: 'send_messages_modal',
  props: ['editModal', 'chooseItem', 'templateData','maxCharacterEverytime','numberPerCharacter'],
  data () {
    const validatePass = (rule, value, callback) => {
      if (!this.formValidate.phoneNumberList && !this.file) {
        callback(new Error(this.$t('smsCenter.sendMessages.prompt.receiverPhone')))
      } else {
        callback()
      }
    };
    const validateDate = (rule, value, callback) => {
      if (!this.formValidate.sendTime) {
        callback(new Error(this.$t('smsCenter.sendMessages.prompt.sendTime')))
      } else {
        callback()
      }
    };
    const validateDateTime = (rule, value, callback) => {
      if (!this.formValidate.dateTime) {
        callback(new Error(this.$t('smsCenter.sendMessages.prompt.sendTime')))
      } else {
        let day=new Date().getDay();
        let nowDay=new Date(this.formValidate.sendTime).getDay();
        if(day===nowDay){
          let time= new Date(formatDate(new Date(),'yyyy-MM-dd')+' '+this.formValidate.dateTime).getTime();
          let nowTime= new Date(sessionStorage.getItem("dateTime")).getTime();
          if(time<nowTime){
            callback(new Error(this.$t('smsCenter.sendMessages.prompt.sendError')))
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
    };
    return {
      disabledHours:[],
      disabledMinutes:[],
      dateTime:null,
      template: 0,
      contentReadonly: false,
      loading: false,
      file: null,
      fileContent: null,
      smsLength: 1,
      formValidate: {
        consumerId: null,
        msgContent: null,
        phoneNumberList: null,
        sendType: null,
        sendTime: null,
        dateTime: null
      },
      options: {
        disabledDate (date) {
          return  date.getTime() < new Date(sessionStorage.getItem("dateTime")).getTime() - 24 * 60 * 60 * 1000;
        }
      },
      ruleValidate: {
        // template: [{
        //   required: true,
        //   message: this.$t('smsCenter.sendMessages.prompt.sendContentTemplate'),
        //   trigger: 'change',
        //   type: 'number'
        // }],
        msgContent: [{
          required: true,
          message: this.$t('smsCenter.sendMessages.prompt.smsContent'),
          trigger: 'blur',
          type: 'string'
        }],
        phoneNumberList: [
          {  required: true,validator: validatePass, trigger: 'blur' }
        ],
        sendType: [{
          required: true,
          message: this.$t('smsCenter.sendMessages.prompt.smsType'),
          trigger: 'change',
          type: 'number'
        }],
        sendTime: [{
          required: true,
          validator: validateDate,
          trigger: 'blur',
        }],
        dateTime: [{
          required: true,
          validator: validateDateTime,
          trigger: 'change',
        }]
      }
    }
  },
  methods: {
    SMSLength () {
      if(this.formValidate.msgContent){
        let data={
          smsText:this.formValidate.msgContent
        };
        checkSMSLength(data).then(res => {
          if (res.data.success) {
            this.smsLength=res.data.data;
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    },
    handleSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          let data = this.formValidate;
          if (data['status'] == null) {
            data['status'] = 1
          }
          let formData = new FormData();
          // formData.append('consumerId','');
          if (data.msgContent) {
            let str = data.msgContent.toUpperCase();
            let arr = this.$t('smsCenter.sendMessages.sensitiveWord');
            let words = [];
            arr.forEach(v => {
              if (str.includes(v)) {
                words.push(v)
              }
            });
            if (words && words.length > 0) {
              this.$Message.error(this.$t('smsCenter.sendMessages.error') + words.join(';'));
              this.loading = false;
              return
            }
            formData.append('msgContent', data['msgContent'])
          }
          if (data.sendType == 1) {
            let time=formatDate(data['sendTime'],'yyyy-MM-dd')+' '+this.formValidate.dateTime;
            formData.append('sendTime', time)
          }
          if (this.file) {
            formData.append('phoneNumberExcel', this.file)
          }
          formData.append('sendType', data['sendType']);
          if (data.phoneNumberList) {
            let str = data.phoneNumberList;
            if (str.includes(';')) {
              str = str.replace(/;/g, ',')
            }
            if (str.includes('；')) {
              str = str.replace(/；/g, ',')
            }
            str = str.replace(/\s*/g, '')
            let arr = str.split(',')
            // arr = Array.from(new Set(arr))
            arr.forEach(v => {
              formData.append('phoneNumberList', v)
            })
          }
          formData.append('status', data['status']);
          formData.append('creator', '1');
          this.loading = true;
          addMsgSend(formData).then(res => {
            this.loading = false;
            if (res.data.success) {
              this.$Message.success(this.$t('common.editSuccess'));
              this.dateTime=null;
              this.$emit('editSuccess');
              this.cancelSubmit()
            } else {
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error(this.$t('common.validateErrorMsg'))
        }
      })
    },
    cancelSubmit () {
      this.file = '';
      this.dateTime=null;
      this.$emit('changeModal', false);
      this.loading = false;
      this.$refs['formValidate'].resetFields()
    },
    changeFile (e) {
      let file = e.target.files[0];
      this.file = file;
      this.$refs['avatarInput'].value = ''
    },
    changeTemplate (data) {
      if (data > 0) {
        this.contentReadonly = true;
        this.formValidate.msgContent = this.templateData[data]['content'];
      } else {
        this.formValidate.msgContent = "";
        this.contentReadonly = false
      }
    },
    setSendDate(data){
      let day=new Date().getDay();
      let nowDay=new Date(data).getDay();
      if(day===nowDay){
        let hours=new Date(sessionStorage.getItem("dateTime")).getHours();
        if(hours>0){
          for(let i=0;i<hours;i++) {
            this.disabledHours.push(i);
          }
        }
        let minutes=new Date(sessionStorage.getItem("dateTime")).getMinutes();
        if(minutes>0){
          for(let i=0;i<minutes+1;i++) {
            this.disabledMinutes.push(i);
          }
        }
      }else{
        this.disabledHours=[];
        this.disabledMinutes=[];
      }
    },
    setSendTime(data){
      let day=new Date().getDay();
      let nowDay=new Date(this.formValidate.sendTime).getDay();
      if(day===nowDay){
        if(data){
          let hours=parseInt(data.substring(0,2));
          let nowHours=new Date(sessionStorage.getItem("dateTime")).getHours();
          if(hours===nowHours){
            let minutes=new Date(sessionStorage.getItem("dateTime")).getMinutes();
            if(minutes>0){
              for(let i=0;i<minutes+1;i++) {
                this.disabledMinutes.push(i);
              }
            }
          }else{
            this.disabledMinutes=[];
          }
        }
      }
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
