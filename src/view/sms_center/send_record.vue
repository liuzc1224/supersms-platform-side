<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('smsCenter.sendRecord.sendTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="createTimeStart"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.createTimeStart"
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
                    v-model="searchForm.createTimeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendRecord.sendResult')">
              <Select clearable v-model="searchForm.resCode" :placeholder="$t('smsCenter.sendRecord.prompt.sendResult')" style="min-width: 160px">
                <Option v-for="(item,index) in $t('smsCenter.sendRecord.sendResults')" :key="`type${index}`" :value="item['value']">{{item['desc']}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendRecord.recipientNumber')">
              <Input
                v-model="searchForm.phoneNumber"
                :placeholder="$t('smsCenter.sendRecord.prompt.recipientNumber')"
                maxlength="20"
              ></Input>
            </FormItem>
            <FormItem :label="$t('smsCenter.sendRecord.id')">
              <Input
                v-model="searchForm.consumerCode"
                :placeholder="$t('smsCenter.sendRecord.prompt.id')"
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
import { queryMsgSendRecord } from '@/api/sms_center'
export default {
  name: 'send_record',
  data () {
    return {
      tableLoading: false,
      pageSize: 10,
      totalNumber: 0,
      currentPage: 1,
      searchForm: {
        createTimeStart: null,
        createTimeEnd: null,
        phoneNumber: null,
        resCode: null,
        consumerCode: null
      },
      tableData: [],
      columns: [
        {
          title: this.$t('smsCenter.sendRecord.sendTime'),
          key: 'createTime',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendRecord.accountNo'),
          key: 'realSenderAccountNo',
          minWidth:100,
          align: 'center',
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendRecord.id'),
          key: 'consumerCode',
          minWidth:100,
          align: 'center',
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendRecord.recipientNumber'),
          key: 'phoneNumber',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendRecord.sendContent'),
          key: 'msgText',
          minWidth:100,
          align: 'center',
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.sendRecord.sendResult'),
          key: 'resCode',
          minWidth:100,
          tooltip:true,
          align: 'center',
          render: (h, params) => {
            if (params.row.resCode != null) {
              let str;
              if(params.row.resCode===0){
                str=this.$t('smsCenter.sendRecord.success')
              }
              else{
                str=this.$t('smsCenter.sendRecord.failure')
              }
              return h('div', str)
            }
          }
        }
      ]
    }
  },
  mounted: function () {
    this.getTable()
  },
  methods: {
    search () {
      this.currentPage=1;
      this.getTable()
    },
    cleanSearch () {
      this.currentPage=1;
      this.searchForm.createTimeStart = null;
      this.searchForm.createTimeEnd = null;
      this.searchForm.phoneNumber = null;
      this.searchForm.resCode = null;
      this.searchForm.consumerCode = null;
      this.getTable()
    },
    getTable () {
      let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
      let params = {
        createTimeStart: this.searchForm.createTimeStart,
        createTimeEnd: this.searchForm.createTimeEnd,
        phoneNumber: this.searchForm.phoneNumber,
        resCode: this.searchForm.resCode,
        consumerId: userInfo['id'],
        consumerCode: this.searchForm.consumerCode,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      if (params.createTimeStart && params.createTimeEnd) {
        params.createTimeEnd = formatDate(new Date(params.createTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
        params.createTimeStart = formatDate(new Date(params.createTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
        let start = (new Date(params.createTimeStart)).getTime();
        let end = (new Date(params.createTimeEnd)).getTime();
        if (start - end > 0) {
          params.createTimeStart = null
          params.createTimeEnd = null
        }
      }else{
        params.createTimeStart=null;
        params.createTimeEnd = null
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading;
      queryMsgSendRecord(params).then(res => {
        this.tableLoading = false;
        if (res.data.success) {
          if (res.data.data && res.data.data.length !== 0) {
            this.tableData = res.data.data;
            this.currentPage = res.data.page.currentPage;
            this.pageSize = res.data.page.pageSize;
            this.totalNumber = res.data.page.totalNumber
          } else {
            this.tableData = [];
            this.currentPage = 1;
            this.pageSize = 10;
            this.totalNumber = 0
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    changePage (params) {
      this.currentPage = params;
      this.getTable()
    },
    pageSizeChange (params) {
      this.pageSize = params;
      this.getTable()
    }
  }
}
</script>

<style scoped>

</style>
