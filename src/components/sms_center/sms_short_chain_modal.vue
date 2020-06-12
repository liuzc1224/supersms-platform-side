<template>
  <Modal v-model="showModal" :title="$t('smsCenter.smsShortChain.add')"
         :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close"/>
    </div>
    <Form ref="formValidate" :model="formValidate" :label-width="100">
      <FormItem :label="$t('smsCenter.smsShortChain.link')">
        <i-col span="16">
          <Input v-model="formValidate.longLink" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :show-word-limit="true" maxlength="500" :placeholder="$t('smsCenter.smsShortChain.prompt.link')"></Input>
        </i-col>
        <i-col span="8" style="text-align: center">
          <Button type="primary" :disabled="!formValidate.longLink" @click="generate()">{{$t('smsCenter.smsShortChain.generate')}}</Button>
        </i-col>
      </FormItem>
      <FormItem :label="$t('smsCenter.smsShortChain.shortLink')" v-if="shortLink">
        <Row>
          <i-col span="16">
            {{shortLink}}
          </i-col>
          <i-col span="8" style="text-align: center">
            <Button type="primary" :disabled="!shortLink" @click="copy()">{{$t('smsCenter.smsShortChain.copy')}}</Button>
          </i-col>
        </Row>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" size="large" @click="cancelSubmit()">{{$t('common.define')}}</Button>
    </div>
  </Modal>
</template>

<script>
  import { shortLinkTransform } from '@/api/sms_center'
    export default {
      name: "sms_short_chain_modal",
      props: ['editModal', 'chooseItem'],
      data () {
        return {
          loading: false,
          shortLink: null,
          formValidate: {
            longLink: null,
            id: null
          },
        }
      },
      methods: {
        cancelSubmit () {
          this.$emit('changeModal', false);
          this.loading = false;
          this.shortLink = null;
          this.$refs['formValidate'].resetFields();
        },
        generate(){
          let data={
            longLink : this.formValidate.longLink
          };
          shortLinkTransform(data).then(res => {
            if (res.status===200) {
              this.shortLink=res.data;
              console.log(this.formValidate);
            }
          })
        },
        copy(){
          const input = document.createElement('input');
          document.body.appendChild(input);
          input.setAttribute('value', this.shortLink);
          input.select();
          if (document.execCommand('copy')) {
            document.execCommand('copy');
            this.$Message.success(this.$t('common.copySuccess'));
          } else {
            this.$Message.error(this.$t('common.copyError'));
          }
          document.body.removeChild(input);
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
