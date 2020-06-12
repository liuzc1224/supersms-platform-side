<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('smsCenter.sendQueue.sendTime')">
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
                    ref="sendTimeEnd"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.sendTimeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendQueue.smsType')">
              <Select class="select" clearable v-model="searchForm.sendType" :placeholder="$t('smsCenter.sendQueue.prompt.smsType')">
                <Option v-for="(item,index) in $t('smsCenter.sendQueue.smsTypes')" :key="`type${index}`" :value="item['value']">{{item['desc']}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendQueue.state')">
              <Select class="select" clearable v-model="searchForm.sendStatus" :placeholder="$t('smsCenter.sendQueue.prompt.state')">
                <Option v-for="(item,index) in $t('smsCenter.sendQueue.status')" :key="`state${index}`" :value="item.value">{{item.desc}}</Option>
              </Select>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card style="margin-top: 10px">
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
import { queryMsgSend ,pause} from '@/api/sms_center'
export default {
  name: 'send_queue',
  data () {
    return {
      tableLoading: false,
      pageSize: 10,
      totalNumber: 0,
      currentPage: 1,
      timedTask:null,
      searchForm: {
        sendTimeStart: null,
        sendTimeEnd: null,
        sendType: null,
        sendStatus: null
      },
      tableData: [],
      // ws:new WebSocket("ws://192.168.1.154:8888/webSocket"),
      ws: new WebSocket('ws://121.40.73.203:8090/webSocket'),
      columns: [
        {
          title: this.$t('smsCenter.sendQueue.sendTime'),
          key: 'sendTime',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendQueue.id'),
          key: 'consumerCode',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendQueue.accountNo'),
          key: 'currentConsumerNo',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendQueue.smsType'),
          key: 'sendType',
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
          title: this.$t('smsCenter.sendQueue.sendContent'),
          key: 'msgContent',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendQueue.state'),
          key: 'sendStatus',
          minWidth:100,
          tooltip:true,
          render: (h, params) => {
            let type = this.$t('smsCenter.sendMessages.status')
            if (params.row.sendStatus != null) {
              let name = type.filter(item => {
                return item.value === params.row.sendStatus
              });
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
                      }
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
                      }
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
                      }
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
    this.getTable()
    // this.ws.onopen = (evt) => {
    //   console.log('WebSocket开启成功');
    //   let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
    //   this.ws.send(userInfo['token']);
    // };
    //
    // this.ws.onmessage = (evt) => {
    //   // console.log( "收到回复数据: " + evt.data);
    //   if (evt.data) {
    //     let arr = JSON.parse(evt.data)['webSocketModuleChild1'];
    //     if (this.num === 1) {
    //       let i = null;
    //       this.tableData.map((v, index) => {
    //         if (v.id === arr['id']) {
    //           i = index
    //         }
    //       });
    //       if (i != null) {
    //         this.tableData[i].sendStatus = arr['code'];
    //       }
    //     }
    //   }
    // }
    // this.ws.onclose = (evt) => {
    //   console.log('WebSocket已关闭')
    // }
  },
  methods: {
    search () {
      this.currentPage=1;
      this.getTable()
    },
    cleanSearch () {
      this.currentPage=1;
      this.searchForm.sendTimeStart = null;
      this.searchForm.sendTimeEnd = null;
      this.searchForm.sendType = null;
      this.searchForm.sendStatus = null;
      this.getTable()
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
    getTable () {
      let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
      let params = {
        sendTimeStart: this.searchForm.sendTimeStart,
        sendTimeEnd: this.searchForm.sendTimeEnd,
        sendStatus: this.searchForm.sendStatus,
        sendType: this.searchForm.sendType,
        consumerId: userInfo['id'],
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      if (!this.searchForm.sendStatus) {
        params.sendStatus = '1,2,3'
      }
      if (params.sendTimeStart && params.sendTimeEnd) {
        params.sendTimeEnd = formatDate(new Date(params.sendTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
        params.sendTimeStart = formatDate(new Date(params.sendTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
        let start = (new Date(params.sendTimeStart)).getTime();
        let end = (new Date(params.sendTimeEnd)).getTime();
        if (start - end > 0) {
          params.sendTimeStart = null;
          params.sendTimeEnd = null;
        }
      }else{
        params.sendTimeStart=null;
        params.sendTimeEnd = null;
      }
      this.tableLoading = true ;
      queryMsgSend(params).then(res => {
        this.tableLoading = false
        if (res.data.success) {
          if (res.data.data && res.data.data.length !== 0) {
            this.tableData = res.data.data
            this.currentPage = res.data.page.currentPage
            this.pageSize = res.data.page.pageSize
            this.totalNumber = res.data.page.totalNumber
          } else {
            this.tableData=[];
            this.currentPage = 1
            this.pageSize = 10
            this.totalNumber = 0
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    changePage (params) {
      this.currentPage = params
      this.getTable()
    },
    pageSizeChange (params) {
      this.pageSize = params;
      this.getTable()
    },
    openTimedTask(){
      this.timedTask=setInterval(()=>{
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let params = {
          sendTimeStart: this.searchForm.sendTimeStart,
          sendTimeEnd: this.searchForm.sendTimeEnd,
          sendStatus: this.searchForm.sendStatus,
          sendType: this.searchForm.sendType,
          consumerId: userInfo['id'],
          pageSize: this.pageSize,
          currentPage: this.currentPage
        };
        if (!this.searchForm.sendStatus) {
          params.sendStatus = '1,2,3'
        }
        if (params.sendTimeStart && params.sendTimeEnd) {
          params.sendTimeEnd = formatDate(new Date(params.sendTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
          params.sendTimeStart = formatDate(new Date(params.sendTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
          let start = (new Date(params.sendTimeStart)).getTime();
          let end = (new Date(params.sendTimeEnd)).getTime();
          if (start - end > 0) {
            params.sendTimeStart = null;
            params.sendTimeEnd = null;
          }
        }else{
          params.sendTimeStart=null;
          params.sendTimeEnd = null;
        }
        this.tableLoading = true ;
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
      },20000);
    }
  }
}
</script>

<style scoped>
  .select{
    min-width: 160px;
  }
</style>
