<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('quote.updateTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="startTime"
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
                    ref="searchForm"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.createTimeEnd"
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
  import { formatDate } from "@/assets/js/date";
  import { businessPriceInfoHistory } from "@/api/merchantManagement"
  export default {
    name: "historicalQuote",
    data(){
      return{
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          createTimeStart:null,
          createTimeEnd: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t("quote.businessNumber"),
            key: "businessNo",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("quote.operatingArea"),
            key: "businessArea",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['businessArea']!==null){
                let data=this.$t('quote.operatingAreas');
                let type=data.filter(v => {
                  return v.value===params.row['businessArea'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }

            }
          },
          {
            title: this.$t("quote.SingleRMB"),
            key: "priceSingleRmb",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("quote.SingleUS"),
            key: "priceSingleDollar",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("quote.creditLimit"),
            key: "creditLimit",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("quote.updater"),
            key: "updator",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("quote.updateTime"),
            key: "createTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          }
        ]
      }
    },
    mounted: function () {
      this.getTable();
    },
    methods: {
      search() {
        this.currentPage=1;
        this.getTable();
      },
      cleanSearch() {
        this.currentPage=1;
        this.searchForm.createTimeStart = null;
        this.searchForm.createTimeEnd=null;
        this.getTable();
      },
      getTable(){
        let params = {
          businessId:this.$route.query.id,
          createTimeStart: this.searchForm.createTimeStart,
          createTimeEnd: this.searchForm.createTimeEnd,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
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
        this.tableLoading = true;
        businessPriceInfoHistory(params).then(res => {
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
