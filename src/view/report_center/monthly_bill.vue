<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('reportCenter.monthlyBill.month')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="month"
                    ref="timeStart"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.timeStart"
                    style="width:100%;"
                  ></DatePicker>
                </i-col>
                <i-col span="2" style="text-align: center">
                  ~
                </i-col>
                <i-col span="11">
                  <DatePicker
                    type="month"
                    ref="timeEnd"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.timeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
            <Button style="margin-left: 30px" @click="monthlyBillsExportData">{{$t('reportCenter.monthlyBill.exportData')}}</Button>
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
  import {monthlyBillsStatementInfo,monthlyBillsStatementInfoExport} from "@/api/report_center";
  import axios from '@/libs/api.request'
  import { formatDate } from "@/assets/js/date";
    export default {
      name: "monthly_bill",
      data () {
        return {
          editModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            timeStart: this.getCurrentMonthFirst(),
            timeEnd: this.getCurrentMonthLast()
          },
          tableData: [],
          columns: [
            {
              title: this.$t('reportCenter.monthlyBill.month'),
              key: 'datePerMonth',
              minWidth:100,
              align: 'center',
              tooltip:true,
            },
            {
              title: this.$t('reportCenter.monthlyBill.businessNumber'),
              key: 'businessNo',
              align: 'center',
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t('reportCenter.monthlyBill.company'),
              key: 'companyName',
              align: 'center',
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t('reportCenter.monthlyBill.operatingArea'),
              key: 'operateArea',
              minWidth:100,
              tooltip:true,
              align: 'center',
              render: (h, params) => {
                if (params.row.operateArea != null) {
                  let type = this.$t('reportCenter.monthlyBill.operatingAreas')
                  let name = type.filter(item => {
                    return item.value === params.row.operateArea
                  });
                  return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
                }
              }
            },
            {
              title: this.$t('reportCenter.monthlyBill.monthlyBillingNumber'),
              key: 'monthlyChargingNumber',
              align: 'center',
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t('reportCenter.monthlyBill.monthlyFee'),
              key: 'monthlyExpense',
              minWidth:100,
              tooltip:true,
              align: 'center',
              render: (h, params) => {
                if (params.row['monthlyExpense'] != null) {
                  return h('div', Number(params.row['monthlyExpense']).toFixed(3))
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
        monthlyBillsExportData(){
          let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
          let params={
            userId: userInfo['id'],
            timeStart: this.searchForm.timeStart,
            timeEnd: this.searchForm.timeEnd,
            name:this.$t('menu.monthly_bill')
          };
          if (params.timeStart && params.timeEnd) {
            //当前月份第一天
            params.timeEnd = formatDate(new Date(new Date(params.timeEnd).getFullYear(),new Date(params.timeEnd).getMonth(),0),'yyyy-MM-dd')+ ' 23:59:59';
            //当前月份最后一天
            params.timeStart = formatDate(new Date(new Date(params.timeEnd).getFullYear(),new Date(params.timeEnd).getMonth(),1),'yyyy-MM-dd')+ ' 00:00:00';
            let start = (new Date(params.timeStart)).getTime();
            let end = (new Date(params.timeEnd)).getTime();
            if (start - end > 0) {
              params.timeStart = null;
              params.timeEnd = null
            }
          }else{
            params.timeStart=null;
            params.timeEnd = null
          }
          monthlyBillsStatementInfoExport(params);
        },
        getCurrentMonthFirst(){
          let date = new Date();
          date.setDate(1);
          let month = parseInt(date.getMonth()+1);
          let day = date.getDate();
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          return date.getFullYear() + '-' + month + '-' + day;
        },
        search () {
          this.currentPage=1;
          this.getTable()
        },
        getCurrentMonthLast(){
          let date=new Date();
          let currentMonth=date.getMonth();
          let nextMonth=++currentMonth;
          let nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
          let oneDay=1000*60*60*24;
          let lastTime = new Date(nextMonthFirstDay-oneDay);
          let month = parseInt(lastTime.getMonth()+1);
          let day = lastTime.getDate();
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          return new Date(date.getFullYear() + '-' + month + '-' + day );
        },
        cleanSearch () {
          this.currentPage=1;
          this.searchForm.timeStart = this.getCurrentMonthFirst();
          this.searchForm.timeEnd = this.getCurrentMonthLast();
          this.getTable()
        },
        getTable () {
          let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
          let params = {
            userId: userInfo['id'],
            timeStart: this.searchForm.timeStart,
            timeEnd: this.searchForm.timeEnd,

            pageSize: this.pageSize,
            currentPage: this.currentPage
          };
          if (params.timeStart && params.timeEnd) {
            //当前月份第一天
            params.timeEnd = formatDate(new Date(new Date(params.timeEnd).getFullYear(),new Date(params.timeEnd).getMonth()+1,0),'yyyy-MM-dd')+ ' 23:59:59';
            //当前月份最后一天
            params.timeStart = formatDate(new Date(new Date(params.timeStart).getFullYear(),new Date(params.timeStart).getMonth(),1),'yyyy-MM-dd')+ ' 00:00:00';
            let start = (new Date(params.timeStart)).getTime();
            let end = (new Date(params.timeEnd)).getTime();
            if (start - end > 0) {
              params.timeStart = null;
              params.timeEnd = null
            }
          }else{
            params.timeStart=null;
            params.timeEnd = null
          }
          this.tableLoading = true;
          monthlyBillsStatementInfo(params).then(res => {
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
