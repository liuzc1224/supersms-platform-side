<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('rechargeCenter.expensesRecord.createTime')">
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
            <FormItem :label="$t('rechargeCenter.expensesRecord.endTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="endTimeStart"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.endTimeStart"
                    style="width:100%;"
                  ></DatePicker>
                </i-col>
                <i-col span="2" style="text-align: center">
                  ~
                </i-col>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="endTimeEnd"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.endTimeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('rechargeCenter.expensesRecord.state')">
              <Select clearable v-model="searchForm.expenseStatus" :placeholder="$t('rechargeCenter.expensesRecord.prompt.state')" style="min-width: 160px">
                <Option v-for="(item,index) in $t('rechargeCenter.expensesRecord.status')" :key="`state${index}`" :value="item.value">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('rechargeCenter.expensesRecord.id')">
              <Input
                v-model="searchForm.consumerCode"
                :placeholder="$t('rechargeCenter.expensesRecord.prompt.id')"
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
  import { expenseCalendarInfo } from '@/api/recharge_center'
  export default {
    name: 'expenses_record',
    data () {
      return {
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          createTimeStart: null,
          createTimeEnd: null,
          endTimeStart: null,
          endTimeEnd: null,
          expenseStatus: null,
          consumerCode: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t('rechargeCenter.expensesRecord.id'),
            key: 'consumerCode',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.accountNo'),
            key: 'accountNo',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.createTime'),
            key: 'createTimeStr',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.sendTime'),
            key: 'sendTimeStr',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.sendContent'),
            key: 'sendMessage',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.sendNumber'),
            key: 'sendNumber',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.successNumber'),
            key: 'sendSuccessNumber',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.failureNumber'),
            key: 'sendFailNumber',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.billNumber'),
            key: 'chargingNumber',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.consumptionAmount'),
            key: 'totalMoney',
            minWidth:100,
            tooltip:true,
            align: 'center',
            render: (h, params) => {
              if (params.row['totalMoney'] != null) {
                return h('div', Number(params.row['totalMoney']).toFixed(3))
              }
            }
          },
          {
            title: this.$t('rechargeCenter.expensesRecord.state'),
            key: 'expenseStatus',
            minWidth:100,
            tooltip:true,
            align: 'center',
            render: (h, params) => {
              let type = this.$t('rechargeCenter.expensesRecord.status')
              if (params.row.expenseStatus != null) {
                let name = type.filter(item => {
                  return item.value === params.row.expenseStatus
                });
                return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
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
        this.searchForm.endTimeStart = null;
        this.searchForm.endTimeEnd = null;
        this.searchForm.expenseStatus = null;
        this.searchForm.consumerCode = null;
        this.getTable()
      },
      getTable () {
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let params = {
          createTimeStart: this.searchForm.createTimeStart,
          createTimeEnd: this.searchForm.createTimeEnd,
          endTimeStart: this.searchForm.endTimeStart,
          endTimeEnd: this.searchForm.endTimeEnd,
          expenseStatus: this.searchForm.expenseStatus,
          consumerCode: this.searchForm.consumerCode,
          userId : userInfo['id'],

          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
        if (params.createTimeStart && params.createTimeEnd) {
          params.createTimeEnd = formatDate(new Date(params.createTimeEnd), 'yyyy-MM-dd') + ' 23:59:59'
          params.createTimeStart = formatDate(new Date(params.createTimeStart), 'yyyy-MM-dd') + ' 00:00:00'
          let start = (new Date(params.createTimeStart)).getTime()
          let end = (new Date(params.createTimeEnd)).getTime()
          if (start - end > 0) {
            params.createTimeStart = null
            params.createTimeEnd = null
          }
        }else{
          params.createTimeStart=null;
          params.createTimeEnd = null
        }
        if (params.endTimeStart && params.endTimeEnd) {
          params.endTimeEnd = formatDate(new Date(params.endTimeEnd), 'yyyy-MM-dd') + ' 23:59:59'
          params.endTimeStart = formatDate(new Date(params.endTimeStart), 'yyyy-MM-dd') + ' 00:00:00'
          let start = (new Date(params.endTimeStart)).getTime()
          let end = (new Date(params.endTimeEnd)).getTime()
          if (start - end > 0) {
            params.endTimeStart = null
            params.endTimeEnd = null
          }
        }else{
          params.endTimeStart=null;
          params.endTimeEnd = null
        }
        this.tableLoading = true;
        expenseCalendarInfo(params).then(res => {
          this.tableLoading = false
          if (res.data.success) {
            if (res.data.data && res.data.data.length !== 0) {
              this.tableData = res.data.data
              this.currentPage = res.data.page.currentPage
              this.pageSize = res.data.page.pageSize
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
        this.currentPage = params
        this.getTable()
      },
      pageSizeChange (params) {
        this.pageSize = params
        this.getTable()
      }
    }
  }
</script>

<style scoped>

</style>
