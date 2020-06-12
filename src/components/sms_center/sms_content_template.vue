<template>
  <Modal v-model="showModal" :title="formValidate.id ? $t('smsCenter.smsContentTemplate.edit') : $t('smsCenter.smsContentTemplate.add')"
         :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close"/>
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem :label="$t('smsCenter.smsContentTemplate.theme')" prop="subject">
        <Input v-model="formValidate.subject" :placeholder="$t('smsCenter.smsContentTemplate.prompt.theme')" maxlength="20"></Input>
      </FormItem>
      <FormItem :label="$t('smsCenter.smsContentTemplate.content')" prop="content">
        <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :maxlength="maxCharacterEverytime" :show-word-limit="true" :placeholder="$t('smsCenter.smsContentTemplate.prompt.content')" @on-blur="SMSLength"></Input>
        <p>
          {{this.$t('smsCenter.sendMessages.tip')}}
        </p>
        <p v-if="formValidate.content">{{this.$t('smsCenter.sendMessages.smsTip1')}} {{smsLength}} {{this.$t('smsCenter.sendMessages.smsTip2')}}</p>

      </FormItem>
      <FormItem :label="$t('smsCenter.smsContentTemplate.state')" prop="status">
        <Select clearable v-model="formValidate.status" :placeholder="$t('smsCenter.smsContentTemplate.prompt.state')" style="min-width: 150px">
          <Option v-for="(item,index) in $t('smsCenter.smsContentTemplate.status')" :key="`state${index}`" :value="item.value">{{item.desc}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="cancelSubmit()">{{$t('common.cancel')}}</Button>
      <Button type="primary" size="large" :loading="loading" @click="handleSubmit()">{{$t('common.setting')}}</Button>
    </div>
  </Modal>
</template>

<script>
import { updateMsgTemplate, addMsgTemplate,checkSMSLength  } from '@/api/sms_center'
export default {
  name: 'sms_content_template',
  props: ['editModal', 'chooseItem','maxCharacterEverytime','numberPerCharacter'],
  data () {
    return {
      smsLength: 1,
      loading: false,
      formValidate: {
        subject: null,
        content: null,
        status: null,
        id: null
      },
      ruleValidate: {
        subject: [{
          required: true,
          message: this.$t('smsCenter.smsContentTemplate.prompt.theme'),
          trigger: 'blur',
          type: 'string'
        }],
        content: [{
          required: true,
          message: this.$t('smsCenter.smsContentTemplate.prompt.content'),
          trigger: 'blur',
          type: 'string'
        }],
        status: [{
          required: true,
          message: this.$t('smsCenter.smsContentTemplate.prompt.state'),
          trigger: 'change',
          type: 'number'
        }]
      }
    }
  },
  methods: {
    SMSLength () {
      if(this.formValidate.content){
        let data={
          smsText:this.formValidate.content
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
          this.loading = true;
          let data = this.formValidate;
          if (data['status'] == null) {
            data['status'] = 1
          }
          if (data.id) {
            updateMsgTemplate(data).then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$Message.success(this.$t('common.editSuccess'));
                this.$emit('editSuccess');
                this.cancelSubmit()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            addMsgTemplate(data).then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$Message.success(this.$t('common.addSuccess'));
                this.$emit('editSuccess');
                this.cancelSubmit()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          }
        } else {
          this.$Message.error(this.$t('common.validateErrorMsg'))
        }
      })
    },
    cancelSubmit () {
      this.$emit('changeModal', false);
      this.loading = false;
      this.$refs['formValidate'].resetFields()
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

<style scoped>

</style>
