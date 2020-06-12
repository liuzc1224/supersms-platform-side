<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('rechargeCenter.rechargeRecord.transactionTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="startTime"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.startTime"
                    style="width:100%;"
                  ></DatePicker>
                </i-col>
                <i-col span="2" style="text-align: center">
                  ~
                </i-col>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="endTime"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.endTime"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card style="margin-top: 10px">
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('rechargeCenter.rechargeRecord.recharge')}}</Button>
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
      <Modal v-model="rechargeModal" :loading="rechargeLoading" @on-ok="rechargeOK" width="500">
        <p slot="header" style="text-align:left">
          <span>{{$t('rechargeCenter.rechargeRecord.recharge')}}</span>
        </p>
        <p>{{$t('rechargeCenter.rechargeRecord.rechargeTip')}}</p>
        <br/>
        <p>{{$t('rechargeCenter.rechargeRecord.rechargePhone')}}{{phoneData && phoneData['rechargeTel'] ? phoneData['rechargeTel'] : ''}}</p>
        <p>{{$t('rechargeCenter.rechargeRecord.rechargeEmail')}}{{phoneData && phoneData['rechargeEmail'] ? phoneData['rechargeEmail'] : ''}}</p>
        <br/>
        <br/>
        <br/>
      </Modal>
    </i-col>
  </Row>
</template>

<script>
  import { rechargeRecordInfo, rechargeRecordInfoId } from '@/api/recharge_center'
  import { formatDate } from '../../assets/js/date'
  export default {
    name: 'recharge_record',
    data () {
      return {
        phoneData:null,
        rechargeModal:false,
        tableLoading: false,
        rechargeLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          startTime: null,
          endTime: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t('rechargeCenter.rechargeRecord.createTime'),
            key: 'createTime',
            align: 'center',
            minWidth:100,
            tooltip:'true'
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.transactionNumber'),
            key: 'transactionId',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.businessNumber'),
            key: 'businessNo',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.rechargeMethod'),
            key: 'rechargeType',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              let type = this.$t('rechargeCenter.rechargeRecord.rechargeMethods')
              if (params.row.rechargeType != null) {
                let name = type.filter(item => {
                  return item.value === params.row.rechargeType
                })
                return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
              }
            }
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.rechargeAmount'),
            key: 'rechargeAmount',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              if (params.row['rechargeAmount'] != null) {
                return h('div', Number(params.row['rechargeAmount']).toFixed(3))
              }
            }
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.currencyUnit'),
            key: 'monetaryUnit',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              let type = this.$t('common.units');
              if (params.row.monetaryUnit != null) {
                let name = type.filter(item => {
                  return item.value == params.row.monetaryUnit
                });
                return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
              }
            }
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.rechargeType'),
            key: 'rechargeStatus',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              let type = this.$t('rechargeCenter.rechargeRecord.rechargeTypes');
              if (params.row.rechargeStatus != null) {
                let name = type.filter(item => {
                  return item.value === params.row.rechargeStatus
                });
                return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
              }
            }
          },
          {
            title: this.$t('rechargeCenter.rechargeRecord.completeTime'),
            key: 'createTime',
            minWidth:100,
            align: 'center',
            tooltip:true,
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
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;

        this.searchForm.phoneNumber = null;
        this.searchForm.resCode = null;
        this.searchForm.queueId = null;
        this.getTable()
      },
      getTable () {
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let params = {
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime,
          userId : userInfo['id'],
          pageSize: this.pageSize,
          currentPage: this.currentPage
        };
        if (params.startTime && params.endTime) {
          params.endTime = formatDate(new Date(params.endTime), 'yyyy-MM-dd') + ' 23:59:59'
          params.startTime = formatDate(new Date(params.startTime), 'yyyy-MM-dd') + ' 00:00:00'
          let start = (new Date(params.startTime)).getTime();
          let end = (new Date(params.endTime)).getTime();
          if (start - end > 0) {
            params.startTime = null
            params.endTime = null
          }
        }else{
          params.startTime=null;
          params.endTime = null
        }
        this.tableLoading = true;
        rechargeRecordInfo(params).then(res => {
          this.tableLoading = false;
          if (res.data.success) {
            if (res.data.data && res.data.data.length !== 0) {
              this.tableData = res.data.data;
              this.currentPage = res.data.page.currentPage;
              this.pageSize = res.data.page.pageSize;
              this.totalNumber = res.data.page.totalNumber;
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
      },
      showModal(){
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let data={
          id : userInfo['id']
        };
        rechargeRecordInfoId(data).then(res => {
          if (res.data.success) {
            if (res.data.data) {
              this.phoneData=res.data.data;
              this.rechargeModal=true;
            }
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      rechargeOK(){
        this.rechargeModal=false;
      }
    }
  }
</script>

<style scoped>

</style>
