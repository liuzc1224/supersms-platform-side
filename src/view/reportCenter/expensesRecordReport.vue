<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('expensesRecordReport.createTime')">
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
            <FormItem :label="$t('expensesRecordReport.endTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="finishTimeStart"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.finishTimeStart"
                    style="width:100%;"
                  ></DatePicker>
                </i-col>
                <i-col span="2" style="text-align: center">
                  ~
                </i-col>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="finishTimeEnd"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.finishTimeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('expensesRecordReport.state')">
              <Select
                clearable
                style="min-width: 160px"
                v-model="searchForm.sendStatus"
                class="search-select-item"
                :placeholder="$t('expensesRecordReport.prompt.state')"
              >
                <Option v-for="(item, i) in $t('expensesRecordReport.status')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('expensesRecordReport.businessNumber')">
              <Input v-model="searchForm.consumerId" :placeholder="$t('expensesRecordReport.prompt.businessNumber')" maxlength="50"></Input>
            </FormItem>
            <FormItem :label="$t('expensesRecordReport.id')">
              <Input v-model="searchForm.consumerCode" :placeholder="$t('expensesRecordReport.prompt.id')" maxlength="50"></Input>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
            <Button style="margin-left: 30px" @click="recordExport">{{$t('common.export')}}</Button>
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
  import { consumeRecord,consumeRecordExport } from "@/api/reportCenter"
  import { formatDate } from "@/assets/js/date";
  export default {
    name: "expensesRecordReport",
    data(){
      return{
        editModal: false,
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          createTimeStart:null,
          createTimeEnd: null,
          finishTimeStart: null,
          finishTimeEnd: null,
          consumerId: null,
          consumerCode: null,
          sendStatus: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t("expensesRecordReport.businessNumber"),
            key: "businessNo",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.id"),
            key: "consumerCode",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.createTime"),
            key: "createTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.sendTime"),
            key: "sendTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.sendNumber"),
            key: "smsCount",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.successNumber"),
            key: "smsSuccessCount",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.failureNumber"),
            key: "smsFailedCount",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.billNumber"),
            key: "smsTakeCount",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.consumptionAmount"),
            key: "amount",
            align: "center",
            minWidth:100,
            render: (h, params) => {
              if (params.row['amount'] != null) {
                return h('div', params.row['amount'].toFixed(3))
              }
            }
          },
          {
            title: this.$t("expensesRecordReport.endTime"),
            key: "endTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("expensesRecordReport.state"),
            key: "status",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['status']!==null){
                let data=this.$t('expensesRecordReport.status');
                let type=data.filter(v => {
                  return v.value===params.row['status'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }

            }
          }
        ]
      }
    },
    mounted: function () {
      this.getTable();
    },
    methods: {
      recordExport(){
        let params={
          createTimeStart: this.searchForm.createTimeStart,
          createTimeEnd: this.searchForm.createTimeEnd,
          finishTimeStart: this.searchForm.finishTimeStart,
          finishTimeEnd: this.searchForm.finishTimeEnd,
          consumerId: this.searchForm.consumerId,
          consumerCode: this.searchForm.consumerCode,
          sendStatus: this.searchForm.sendStatus,
          name:this.$t('expensesRecordReport.title')
        };
        if (params.createTimeStart && params.createTimeEnd) {
          params.createTimeStart = formatDate(new Date(params.createTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
          params.createTimeEnd = formatDate(new Date(params.createTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
          let start = (new Date(params.createTimeStart)).getTime();
          let end = (new Date(params.createTimeEnd)).getTime();
          if (start - end > 0) {
            params.createTimeStart = null;
            params.createTimeEnd = null
          }
        }else{
          params.createTimeStart=null;
          params.createTimeEnd = null
        }
        consumeRecordExport(params)
      },
      search() {
        this.currentPage=1;
        this.getTable();
      },
      cleanSearch() {
        this.currentPage=1;
        this.searchForm.createTimeStart = null;
        this.searchForm.createTimeEnd=null;
        this.searchForm.finishTimeStart = null;
        this.searchForm.finishTimeEnd = null;
        this.searchForm.consumerId = null;
        this.searchForm.consumerCode = null;
        this.searchForm.sendStatus = null;
        this.getTable();
      },
      getTable(){
        let params = {
          createTimeStart: this.searchForm.createTimeStart,
          createTimeEnd: this.searchForm.createTimeEnd,
          finishTimeStart: this.searchForm.finishTimeStart,
          finishTimeEnd: this.searchForm.finishTimeEnd,
          consumerId: this.searchForm.consumerId,
          consumerCode: this.searchForm.consumerCode,
          sendStatus: this.searchForm.sendStatus,

          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        this.tableLoading = true;
        if (params.createTimeStart && params.createTimeEnd) {
          params.createTimeStart = formatDate(new Date(params.createTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
          params.createTimeEnd = formatDate(new Date(params.createTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
          let start = (new Date(params.createTimeStart)).getTime();
          let end = (new Date(params.createTimeEnd)).getTime();
          if (start - end > 0) {
            params.createTimeStart = null;
            params.createTimeEnd = null
          }
        }else{
          params.createTimeStart=null;
          params.createTimeEnd = null
        }
        if (params.finishTimeStart && params.finishTimeEnd) {
          params.finishTimeStart = formatDate(new Date(params.finishTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
          params.finishTimeEnd = formatDate(new Date(params.finishTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
          let start = (new Date(params.finishTimeStart)).getTime();
          let end = (new Date(params.finishTimeEnd)).getTime();
          if (start - end > 0) {
            params.finishTimeStart = null;
            params.finishTimeEnd = null
          }
        }else{
          params.finishTimeStart=null;
          params.finishTimeEnd = null
        }
        consumeRecord(params).then(res => {
          this.tableLoading = false;
          if(res.data.success){
            if( res.data.data && res.data.data.length !==0 ){
              this.tableData = res.data.data;
              this.currentPage = res.data.page.currentPage;
              this.pageSize = res.data.page.pageSize;
              this.totalNumber = res.data.page.totalNumber;
            }else{
              this.tableData = [];
              this.currentPage = 1;
              this.pageSize = 10;
              this.totalNumber = 0;
            }
          }else{
            this.$Message.error(res.data.message)
          }
        })
      },
      changePage (params) {
        this.currentPage = params;
        this.getTable();
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
