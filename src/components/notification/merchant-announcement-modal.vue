<template>
  <Modal v-model="showModal" :title="formValidate.id ? $t('merchantAnnouncement.edit') : $t('merchantAnnouncement.add')" :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close" />
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
      <FormItem :label="$t('merchantAnnouncement.theme')" prop="title">
        <Input v-model="formValidate.title" maxlength="50" :readonly="typeReadonly" :placeholder="$t('merchantAnnouncement.prompt.theme')" style="width: 100%"></Input>
      </FormItem>
      <FormItem :label="$t('merchantAnnouncement.content')" prop="content">
        <Input v-model="formValidate.content" :readonly="typeReadonly" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :show-word-limit="true" :maxlength="1000" :placeholder="$t('merchantAnnouncement.prompt.content')"></Input>
      </FormItem>
        <Row>
          <i-col span="15">
            <FormItem :label="$t('merchantAnnouncement.releaseTime')" prop="sendTime">
              <DatePicker
                type="date"
                :readonly="typeReadonly"
                :options="options"
                format="yyyy-MM-dd"
                ref="createTimeStart"
                :placeholder="$t('common.date')"
                v-model="formValidate.sendTime"
                style="width:100%;"
              ></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="8" offset="1">
            <FormItem :label-width="0" prop="dateTime">
              <TimePicker
                :readonly="typeReadonly"
                format="HH:mm"
                v-model="formValidate.dateTime"
                :disabled-hours="hours"
                :disabled-minutes="minutes"
                :placeholder="$t('common.time')" ></TimePicker>
            </FormItem>
          </i-col>
        </Row>
<!--        <DatePicker-->
<!--          type="datetime"-->
<!--          :disabled="readonlyType==='readonly'"-->
<!--          ref="startTime"-->
<!--          :placeholder="$t('merchantAnnouncement.prompt.releaseTime')"-->
<!--          v-model="formValidate.sendTime"-->
<!--          style="width:100%;"-->
<!--        ></DatePicker>-->
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit('formValidate')">{{$t('setUpPage.submit')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { formatDate } from "@/assets/js/date";
  import { addBusinessNotice,updateBusinessNotice } from "@/api/notification"
  export default {
    name: "merchant-announcement-modal",
    props: ['editModal', 'chooseItem','readonlyType','disabledMinutes','disabledHours'],
    data () {
      const validateDate = (rule, value, callback) => {
        if (!this.formValidate.sendTime) {
          callback(new Error(this.$t('merchantAnnouncement.prompt.releaseTime')))
        } else {
          callback()
        }
      };
      const validateDateTime = (rule, value, callback) => {
        if (!this.formValidate.dateTime) {
          callback(new Error(this.$t('merchantAnnouncement.prompt.releaseTime')))
        } else {
          let time= new Date(formatDate(new Date(),'yyyy-MM-dd')+' '+this.formValidate.dateTime).getTime();
          let nowTime= new Date().getTime();
          if(time<nowTime){
            callback(new Error(this.$t('merchantAnnouncement.prompt.releaseTime')))
          }else{
            callback()
          }
        }
      };
      return {
        loading:false,
        options: {
          disabledDate (date) {
            return  date.getTime() < new Date(sessionStorage.getItem("dateTime")).getTime() - 24 * 60 * 60 * 1000;
          }
        },
        formValidate: {
          id:null,
          title:null,
          content:null,
          sendTime:null,
          dateTime:null
        },
        ruleValidate: {
          title: [ { required: true, message: this.$t('merchantAnnouncement.prompt.theme'), trigger: 'blur' } ],
          content: [ { required: true, message: this.$t('merchantAnnouncement.prompt.content'), trigger: 'blur' } ],
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
      handleSubmit () {
        if(this.typeReadonly){
          this.$emit('changeModal', false);
          this.loading=false;
          this.$refs['formValidate'].resetFields()
          return;
        }
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            let data=this.formValidate;
            let time=formatDate(data['sendTime'],'yyyy-MM-dd')+' '+this.formValidate.dateTime;
            data['sendTime']=time;
            console.log(data);
            this.loading=true;
            data['status']=1;
            if(data['id']){
              updateBusinessNotice(data).then(res => {
                this.loading=false;
                if (res.data.success) {
                  this.$Message.success(this.$t('common.editSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit();
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }else{
              addBusinessNotice(data).then(res => {
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
      },
      typeReadonly: {
        get: function () {
          console.log(this.readonlyType);
          return this.readonlyType
        },
        set: function () {
        }
      },minutes: {
        get: function () {
          return this.disabledMinutes
        },
        set: function () {
        }
      },hours: {
        get: function () {
          return this.disabledHours
        },
        set: function () {
        }
      },
    }
  }
</script>

<style scoped>

</style>
