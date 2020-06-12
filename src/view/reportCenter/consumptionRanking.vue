<template>
  <Row>
    <i-col :span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" style="margin-top: 20px" inline>
          <FormItem :label="$t('consumptionTrend.statisticalDate')">
            <Row>
              <i-col span="11">
                <DatePicker
                  type="date"
                  ref="start"
                  :placeholder="$t('common.timeStart')"
                  v-model="searchForm.start"
                  style="width:100%;"
                ></DatePicker>
              </i-col>
              <i-col span="2" style="text-align: center">
                ~
              </i-col>
              <i-col span="11">
                <DatePicker
                  type="date"
                  ref="end"
                  :placeholder="$t('common.timeEnd')"
                  v-model="searchForm.end"
                ></DatePicker>
              </i-col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>
      <Row style="margin-top: 20px;margin-bottom: 20px">
        <i-col :span="24">
          <Button :class="dayType===1 ? 'primary' : ''" @click="setType(1)" >{{$t('consumptionTrend.sevenDays')}}</Button>
          <Button :class="dayType===2 ? 'primary' : ''" @click="setType(2)" style="margin-left: 30px" >{{$t('consumptionTrend.month')}}</Button>
        </i-col>
      </Row>
      <Card>
        <Table
          border
          class="person-table"
          :columns="columns"
          :data="tableData"
          :loading="tableLoading"
          style="margin-top: 10px"
        />
<!--        <div style="margin: 10px;overflow: hidden">-->
<!--          <div style="float: right;margin-bottom: 2px;">-->
<!--            <Page-->
<!--              :total="totalNumber"-->
<!--              :current="currentPage"-->
<!--              :page-size-opts="[10, 20, 30, 50]"-->
<!--              @on-change="changePage"-->
<!--              @on-page-size-change="pageSizeChange"-->
<!--              show-elevator-->
<!--              show-sizer-->
<!--              show-total-->
<!--            ></Page>-->
<!--          </div>-->
<!--        </div>-->
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { consumeRank } from "@/api/reportCenter"
  import { formatDate } from "@/assets/js/date";
    export default {
      name: "consumptionRanking",
      data(){
        return{
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          dayType:1,
          searchForm: {
            start:null,
            end:null
          },
          chartLottery:null,
          chartWinning:null,
          tableData: [],
          columns: [
            {
              title: this.$t("consumptionRanking.sort"),
              key: "order",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("consumptionRanking.businessNumber"),
              key: "businessNo",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("consumptionRanking.company"),
              key: "company",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("consumptionRanking.consumptionAmount"),
              key: "amount",
              align: "center",
              minWidth:100,
              render: (h, params) => {
                if (params.row['amount'] != null) {
                  return h('div', params.row['amount'].toFixed(3))
                }
              }
            }
          ]
        }
      },
      mounted(){
        let data=new Date();
        this.searchForm.start=this.sevenDays();
        this.searchForm.end=data;
        this.getData();
      },
      methods:{
        setType(data){
          this.dayType=data;
          if(data===1){
            let data=new Date();
            this.searchForm.start=this.sevenDays();
            this.searchForm.end=data;
            this.getData();
          }
          else if(data===2){
            let data=new Date();
            this.searchForm.start=this.months();
            this.searchForm.end=data;
            this.getData();
          }
        },
        sevenDays(){
          let date1 = new Date();
          let time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
          let date2 = new Date(date1);
          date2.setDate(date1.getDate()-7);
          let time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
          return formatDate(new Date(time2),"yyyy-MM-dd");
        },
        months(){
          let date1 = new Date();
          let time1=date1.getFullYear()+"-"+(date1.getMonth())+"-"+date1.getDate();//time1表示当前时间
          return formatDate(new Date(time1),"yyyy-MM-dd");
        },
        getData(){
          let params = {
            start:this.searchForm.start,
            end:this.searchForm.end,
            // pageSize: this.pageSize,
            // currentPage: this.currentPage
          };
          if(params.start && params.end){
            params.start=formatDate(new Date(params.start), "yyyy-MM-dd")+" 00:00:00";
            params.end=formatDate(new Date(params.end), "yyyy-MM-dd")+" 23:59:59";
          }else{
            params.start=null;
            params.end=null;
          }

          let start=(new Date(params.start)).getTime();
          let end=(new Date(params.end)).getTime();
          if( start - end >0 ){
            params.start=null;
            params.end=null;
          }
          this.tableLoading = this.tableLoading === false ? true : this.tableLoading;
          consumeRank(params).then(res => {
            this.tableLoading = false;
            if(res.data.success){
              if( res.data.data && res.data.data.length !==0 ){
                this.tableData = res.data.data;
                // this.currentPage = res.data.page.currentPage;
                // this.pageSize = res.data.page.pageSize;
                // this.totalNumber = res.data.page.totalNumber;
              }else{
                this.tableData = [];
                // this.currentPage = 1;
                // this.pageSize = 10;
                // this.totalNumber = 0;
              }
            }else{
              this.$Message.error(res.data.message)
            }
          });
        },
        search(){
          this.currentPage=1;
          let start=(new Date(formatDate(this.searchForm.start,"yyyy-MM-dd"))).getTime();
          let end=(new Date(formatDate(this.searchForm.end,"yyyy-MM-dd"))).getTime();
          if((new Date(formatDate(new Date(),"yyyy-MM-dd"))).getTime()===end && (new Date(this.sevenDays())).getTime()===start){
            this.dayType=1;
          }
          else if((new Date(formatDate(new Date(),"yyyy-MM-dd"))).getTime()===end && (new Date(this.months())).getTime()===start){
            this.dayType=2;
          }
          else {
            this.dayType=null;
          }
          this.getData();
        },
        cleanSearch(){
          this.dayType=1;
          let data=new Date();
          this.searchForm.start=this.sevenDays();
          this.searchForm.end=data;
          this.searchForm.userType=null;
          this.currentPage=1;
          this.getData();
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
  .primary{
    background-color: #2d8cf0;
    color: #ffffff;
  }
  table{
    border-collapse: collapse;
    width: 100%;
  }
  tr{
    width: 100%;
  }
  td{
    border: 1px #cccccc solid;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  tr td:last-child{
    width: 40%;
  }
</style>
