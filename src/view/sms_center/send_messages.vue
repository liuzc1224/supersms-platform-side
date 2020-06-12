<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('smsCenter.sendMessages.sendTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="sendTimeStart"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.sendTimeStart"
                    style="width:100%;"
                  ></DatePicker>
                </i-col>
                <i-col span="2" style="text-align: center">
                  ~
                </i-col>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="createTimeEnd"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.sendTimeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendMessages.smsType')">
              <Select clearable v-model="searchForm.sendType" :placeholder="$t('smsCenter.sendMessages.prompt.smsType')" style="min-width: 160px">
                <Option v-for="(item,index) in $t('smsCenter.sendMessages.smsTypes')" :key="`type${index}`" :value="item['value']">{{item['desc']}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendMessages.state')">
              <Select clearable v-model="searchForm.sendStatus" :placeholder="$t('smsCenter.sendMessages.prompt.state')" style="min-width: 160px">
                <Option v-for="(item,index) in $t('smsCenter.sendMessages.status')" :key="`state${index}`" :value="item.value">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendMessages.id')">
              <Input
                v-model="searchForm.consumerCode"
                :placeholder="$t('smsCenter.sendMessages.prompt.id')"
                maxlength="20"
              ></Input>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card style="margin-top: 10px">
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('smsCenter.sendMessages.sendSms')}}</Button>
        <Button style="margin-left: 20px" @click="exportTemplate">{{$t('smsCenter.sendMessages.downTemplate')}}</Button>
        <send-messages-modal
          :editModal="editModal"
          :chooseItem="chooseItem"
          :templateData="templateData"
          :maxCharacterEverytime="maxCharacterEverytime"
          :numberPerCharacter="numberPerCharacter"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></send-messages-modal>

        <Table
          border
          class="person-table"
          :columns="columns"
          :data="tableData"
          :loading="tableLoading"
          style="margin-top: 10px"
        />
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;margin-bottom: 2px;">
            <Page
              :total="totalNumber"
              :current="currentPage"
              :page-size-opts="[10, 20, 30, 50]"
              @on-change="changePage"
              @on-page-size-change="pageSizeChange"
              show-elevator
              show-sizer
              show-total
            ></Page>
          </div>
        </div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import { formatDate } from '../../assets/js/date'
import sendMessagesModal from '@/components/sms_center/send_messages_modal.vue'
import { queryMsgTemplate, downloadTemplate, queryMsgSend, pause } from '@/api/sms_center'
import { currentPriceInfo } from '@/api/recharge_center'
import config from '@/config'
import { mapActions } from 'vuex'
export default {
  name: 'send_messages',
  components: {
    sendMessagesModal
  },
  data () {
    return {
      num: null,
      templateData: [],
      imgLoading: false,
      editModal: false,
      tableLoading: false,
      pageSize: 10,
      totalNumber: 0,
      currentPage: 1,
      timedTask: null,
      maxCharacterEverytime:null,
      numberPerCharacter:null,
      ws:new WebSocket("ws://"+config.baseUrl.dev.substring(7)+"/webSocket"),
      // ws: new WebSocket('ws://121.40.73.203:8090/webSocket'),
      searchForm: {
        sendTimeStart: null,
        sendTimeEnd: null,
        sendType: null,
        sendStatus: null,
        consumerCode: null
      },
      chooseItem: {
        consumerId: null,
        msgContent: null,
        phoneNumberList: null,
        sendType: null,
        sendTime: null,
        dateTime: null
      },
      tableData: [],
      columns: [
        {
          title: this.$t('smsCenter.sendMessages.id'),
          key: 'consumerCode',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.accountNo'),
          key: 'currentConsumerNo',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.releaseTime'),
          key: 'sendTime',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.smsType'),
          key: 'sendType',
          align: 'center',
          minWidth:100,
          tooltip:true,
          render: (h, params) => {
            let type = this.$t('smsCenter.sendMessages.smsTypes')
            if (params.row.sendType != null) {
              let name = type.filter(item => {
                return item.value === params.row.sendType
              });
              return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
            }
          }
        },
        {
          title: this.$t('smsCenter.sendMessages.sendContent'),
          key: 'msgContent',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.sendNumber'),
          key: 'totalSendCount',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.successNumber'),
          key: 'successSendCount',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.failureNumber'),
          key: 'failSendCount',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        // {
        //   title: this.$t('smsCenter.sendMessages.consumptionCost'),
        //   key: 'fee',
        //   align: 'center',
        //   tooltip: true
        // },
        // {
        //   title: this.$t('smsCenter.sendMessages.creator'),
        //   key: 'creator',
        //   align: 'center',
        //   tooltip: true
        // },
        {
          title: this.$t('smsCenter.sendMessages.createTime'),
          key: 'createTime',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendMessages.state'),
          key: 'sendStatus',
          align: 'center',
          minWidth:100,
          tooltip:true,
          render: (h, params) => {
            let type = this.$t('smsCenter.sendMessages.status')
            if (params.row.sendStatus != null) {
              let name = type.filter(item => {
                return item.value === params.row.sendStatus
              })
              return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
            }
          }
        },
        {
          title: this.$t('common.operating'),
          key: 'action',
          minWidth: 220,
          align: 'center',
          render: (h, params) => {
            let str;
            if (params.row.sendStatus === 1 || params.row.sendStatus === 2) {
              str = [
                h('Button', {
                  props: {
                    type: 'text', size: 'default', icon: 'md-menu'
                  },
                  class: 'edit-btn',
                  style: {
                    color: '#57a3f3',
                    backgroundColor: 'transparent'
                  },
                  on: {
                    click: () => {
                      let data = {
                        id: params.row.id,
                        sendStatus: 1
                      };
                      this.setPause(data)
                    }
                  }
                }, this.$t('common.pause')),
                h('Button', {
                  props: {
                    type: 'text', size: 'default', icon: 'md-trash'
                  },
                  class: 'edit-btn',
                  style: {
                    color: '#ed4014',
                    backgroundColor: 'transparent'
                  },
                  on: {
                    click: () => {
                      let data = {
                        id: params.row.id,
                        sendStatus: 3
                      };
                      this.setPause(data)
                    }
                  }
                }, this.$t('common.cancel'))
              ]
            }
            if (params.row.sendStatus === 3) {
              str = [
                h('Button', {
                  props: {
                    type: 'text', size: 'default', icon: 'md-menu'
                  },
                  class: 'edit-btn',
                  style: {
                    color: '#57a3f3',
                    backgroundColor: 'transparent'
                  },
                  on: {
                    click: () => {
                      let data = {
                        id: params.row.id,
                        sendStatus: 2
                      };
                      this.setPause(data)
                    }
                  }
                }, this.$t('common.carryOn')),
                h('Button', {
                  props: {
                    type: 'text', size: 'default', icon: 'md-trash'
                  },
                  class: 'edit-btn',
                  style: {
                    color: '#ed4014',
                    backgroundColor: 'transparent'
                  },
                  on: {
                    click: () => {
                      let data = {
                        id: params.row.id,
                        sendStatus: 3
                      }
                      this.setPause(data)
                    }
                  }
                }, this.$t('common.cancel'))
              ]
            }
            return h('div', str)
          }
        }
      ]
    }
  },
  mounted: function () {
    this.getTemplateData();
    this.getTable();
    if(!this.$store.state.user.WebSocket) {
      this.setWebSocket(true);
      this.ws.onopen = (evt) => {
        console.log('WebSocket开启成功');
        let userInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
        this.ws.send(userInfo['token']);
      };

      this.ws.onmessage = (evt) => {
        console.log( "收到回复数据: " + evt.data);
        if (evt.data) {
          let arr = JSON.parse(evt.data)['webSocketModuleChild1'];
          if (this.num === 1) {
            let i = null;
            if(arr && arr['id']){
              this.tableData.forEach((v, index) => {
                if (v.id === arr['id']) {
                  i = index
                }
              });
              if (i != null) {
                this.tableData[i].sendStatus = arr['code']
              }
            }

          }
        }
      };
      this.ws.onclose = (evt) => {
        console.log('WebSocket已关闭')
      }
    }
  },
  methods: {
    ...mapActions([
      'setWebSocket'
    ]),
    getTemplateData () {
      let params = {
        isPaging: false
      };
      queryMsgTemplate(params).then(res => {
        if (res.data.success) {
          this.templateData.push(this.$t('smsCenter.sendMessages.template'))
          if (res.data.data && res.data.data.length !== 0) {
            let tableData = res.data.data.filter(item => {
              return item['status'] === 1
            });
            if (tableData) {
              tableData.forEach((v, index) => {
                let obj = {
                  desc: v.subject,
                  value: index + 1,
                  content: v.content
                };
                this.templateData.push(obj)
              });
            }
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    search () {
      this.currentPage=1;
      this.getTable()
    },
    cleanSearch () {
      this.currentPage=1;
      this.searchForm.sendTimeStart = null
      this.searchForm.sendTimeEnd = null
      this.searchForm.sendType = null
      this.searchForm.sendStatus = null
      this.searchForm.consumerCode = null
      this.getTable()
    },
    showModal () {
      let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
      let data={
        userId : userInfo['id']
      };
      currentPriceInfo(data).then(res => {
        if (res.data.success) {
          this.maxCharacterEverytime =res.data.data && res.data.data[0] && res.data.data[0]['maxCharacterEverytime'] ? res.data.data[0]['maxCharacterEverytime'] : 500;
          this.numberPerCharacter =res.data.data && res.data.data[0] && res.data.data[0]['numberPerCharacter'] ? res.data.data[0]['numberPerCharacter'] : 60;
          this.editModal = true;
          this.modelItem({ 'row': {} })
        } else {
          this.$Message.error(res.data.message)
        }
      });
    },
    changeModal (param) {
      this.editModal = param;
      this.modelItem({ 'row': {} })
    },
    getTable () {
      let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
      let params = {
        sendTimeStart: this.searchForm.sendTimeStart,
        sendTimeEnd: this.searchForm.sendTimeEnd,
        sendType: this.searchForm.sendType,
        consumerId: userInfo['id'],
        sendStatus: this.searchForm.sendStatus,
        consumerCode: this.searchForm.consumerCode,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      if (params.sendTimeStart && params.sendTimeEnd) {
        params.sendTimeStart = formatDate(new Date(params.sendTimeStart), 'yyyy-MM-dd') + ' 00:00:00'
        params.sendTimeEnd = formatDate(new Date(params.sendTimeEnd), 'yyyy-MM-dd') + ' 23:59:59'
        let start = (new Date(params.sendTimeStart)).getTime()
        let end = (new Date(params.sendTimeEnd)).getTime()
        if (start - end > 0) {
          params.sendTimeStart = null;
          params.sendTimeEnd = null
        }
      }else{
        params.sendTimeStart=null;
        params.sendTimeEnd = null
      }
      this.tableLoading = true;
      queryMsgSend(params).then(res => {
        this.tableLoading = false;
        if (res.data.success) {
          if (res.data.data && res.data.data.length !== 0) {
            this.num = 1;
            this.tableData = res.data.data;
            this.currentPage = res.data.page.currentPage;
            this.pageSize = res.data.page.pageSize;
            this.totalNumber = res.data.page.totalNumber;
            this.openTimedTask();
          } else {
            this.tableData=[];
            this.currentPage = 1;
            this.pageSize = 10;
            this.totalNumber = 0
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    setPause (data) {
      pause(data).then(res => {
        // this.loading=false;
        if (res.data.success) {
          this.$Message.success(this.$t('common.editSuccess'));
          this.getTable()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    modelItem (params) {
      this.chooseItem.consumerId = params.row.consumerId;
      this.chooseItem.msgContent = params.row.msgContent;
      this.chooseItem.phoneNumberList = params.row.phoneNumberList;
      this.chooseItem.sendType = params.row.sendType;
      this.chooseItem.sendTime = params.row.sendTime;
      this.chooseItem.dateTime = null;
    },
    editSuccess (param) {
      this.tableLoading = true
      this.getTable()
    },
    changePage (params) {
      this.currentPage = params
      this.getTable()
    },
    pageSizeChange (params) {
      this.pageSize = params
      this.getTable()
    },
    exportTemplate () {
      downloadTemplate()
    },
    openTimedTask(){
      this.timedTask=setInterval(()=>{
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let params = {
          sendTimeStart: this.searchForm.sendTimeStart,
          sendTimeEnd: this.searchForm.sendTimeEnd,
          sendType: this.searchForm.sendType,
          consumerId: userInfo['id'],
          sendStatus: this.searchForm.sendStatus,
          consumerCode: this.searchForm.consumerCode,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        };
        if (params.sendTimeStart && params.sendTimeEnd) {
          params.sendTimeStart = formatDate(new Date(params.sendTimeStart), 'yyyy-MM-dd') + ' 00:00:00'
          params.sendTimeEnd = formatDate(new Date(params.sendTimeEnd), 'yyyy-MM-dd') + ' 23:59:59'
          let start = (new Date(params.sendTimeStart)).getTime()
          let end = (new Date(params.sendTimeEnd)).getTime()
          if (start - end > 0) {
            params.sendTimeStart = null;
            params.sendTimeEnd = null
          }
        }else{
          params.sendTimeStart=null;
          params.sendTimeEnd = null
        }
        queryMsgSend(params).then(res => {
          if (res.data.success) {
            if (res.data.data && res.data.data.length !== 0) {
              let tabData=res.data.data;
              if(tabData!=this.tableData){
                this.tableData=tabData;
              }
              let state=this.tableData.filter(v=>{
                return v['sendStatus']===1;
              });
              if(state.length===0){
                clearInterval(this.timedTask);
              }
            }
          }
        })
      },120000);
    }
  }
}
</script>

<style scoped>
</style>
