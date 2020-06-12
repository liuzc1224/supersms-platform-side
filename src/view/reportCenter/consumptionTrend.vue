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
        <Row>
          <i-col :span="24" style="background-color: #cccccc;padding-left: 10px">
            <h1>{{$t('consumptionTrend.heatMap')}}</h1>
          </i-col>
        </Row>
        <Row style="margin-top: 10px" :gutter="10">
          <i-col :span="14">
            <c-chart :conf="chartDetailsData" v-if="chartDetailsData"></c-chart>
          </i-col>
          <i-col :span="10">
            <table style="margin-top: 70px">
              <tr>
                <td>
                  {{$t('consumptionTrend.sendNumber')}}
                </td>
                <td>{{tableData && tableData['smsCount'] ? tableData['smsCount'] : 0}}</td>
              </tr>
              <tr>
                <td>
                  {{$t('consumptionTrend.successNumber')}}
                </td>
                <td>{{tableData && tableData['smsSuccessCount'] ? tableData['smsSuccessCount'] : 0}}</td>
              </tr>
              <tr>
                <td>
                  {{$t('consumptionTrend.failureNumber')}}
                </td>
                <td>{{tableData && tableData['smsFailedCount'] ? tableData['smsFailedCount'] : 0}}</td>
              </tr>
              <tr>
                <td>
                  {{$t('consumptionTrend.consumptionCost')}}
                </td>
                <td>{{tableData && tableData['amount'] ? tableData['amount'].toFixed(2) : 0.00}}</td>
              </tr>
            </table>
          </i-col>
        </Row>
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { consumeTrend } from "@/api/reportCenter"
  import CChart from "@/components/charts/commonChart";
  import { formatDate } from "@/assets/js/date";
    export default {
      name: "consumptionTrend",
      components:{
        CChart
      },
      data(){
        return{
          dayType:1,
          searchForm: {
            start:null,
            end:null
          },
          tableData:[],
          chartDetailsData:null,
          detailsData:[],
          smsCountDetails:[],
          smsFailedCountDetails:[],
          smsSuccessCountDetails:[]
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
          date2.setDate(date1.getDate()-6);
          let time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
          return formatDate(new Date(time2),"yyyy-MM-dd");
        },
        months(){
          let date1 = new Date();
          let year=date1.getFullYear();
          let month=date1.getMonth();
          if(month===0){
            year=year-1;
            month=12;
          }
          let time1=year+"-"+month+"-"+date1.getDate();
          return formatDate(new Date(time1),"yyyy-MM-dd");
        },
        getData(){
          let params = {
            start:this.searchForm.start,
            end:this.searchForm.end,
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
          consumeTrend(params).then(res => {
            this.tableLoading = false;
            if(res.data.success) {
              if(res.data.data){
                this.tableData = res.data.data;
                if(res.data.data) {
                  this.detailsData = res.data.data['details'].sort(this.compare('date'));
                  this.smsCountDetails = res.data.data['smsCountDetails'].sort(this.compare('date'));
                  this.smsFailedCountDetails = res.data.data['smsFailedCountDetails'].sort(this.compare('date'));
                  this.smsSuccessCountDetails = res.data.data['smsSuccessCountDetails'].sort(this.compare('date'));
                  console.log(this.detailsData);
                  if (this.detailsData && this.detailsData.length > 0) {
                    let xAxisHeatMap=[],typeDataHeatMap=[
                      this.$t('consumptionTrend.sendNumber'),
                      this.$t('consumptionTrend.successNumber'),
                      this.$t('consumptionTrend.failureNumber'),
                      this.$t('consumptionTrend.consumptionCost')
                    ],seriesHeatMap=[];
                    let smsCountDetailsObj = {};
                    smsCountDetailsObj['name'] = this.$t('consumptionTrend.sendNumber');
                    smsCountDetailsObj['type'] = 'line';
                    smsCountDetailsObj['data'] = [];
                    this.smsCountDetails.forEach(item => {
                      let num = item['count'] ? item['count'].toFixed(2) : 0;
                      smsCountDetailsObj['data'].push(num);
                      xAxisHeatMap.push(item['date'])
                    });
                    seriesHeatMap.push(smsCountDetailsObj);


                    let smsSuccessCountDetailsOnj = {};
                    smsSuccessCountDetailsOnj['name'] = this.$t('consumptionTrend.successNumber');
                    smsSuccessCountDetailsOnj['type'] = 'line';
                    smsSuccessCountDetailsOnj['data'] = [];
                    this.smsSuccessCountDetails.forEach(item => {
                      let num = item['count'] ? item['count'].toFixed(2) : 0.00;
                      smsSuccessCountDetailsOnj['data'].push(num);
                    });
                    seriesHeatMap.push(smsSuccessCountDetailsOnj);

                    let smsFailedCountDetailsObj = {};
                    smsFailedCountDetailsObj['name'] = this.$t('consumptionTrend.failureNumber');
                    smsFailedCountDetailsObj['type'] = 'line';
                    smsFailedCountDetailsObj['data'] = [];
                    this.smsFailedCountDetails.forEach(item => {
                      let num = item['count'] ? item['count'] : 0;
                      smsFailedCountDetailsObj['data'].push(num);
                    });
                    seriesHeatMap.push(smsFailedCountDetailsObj);

                    let detailsDataObj = {};
                    detailsDataObj['name'] = this.$t('consumptionTrend.consumptionCost');
                    detailsDataObj['type'] = 'line';
                    detailsDataObj['data'] = [];
                    this.detailsData.forEach(item => {
                      let num = item['amount'] ? item['amount'] : 0;
                      detailsDataObj['data'].push(num);
                    });
                    seriesHeatMap.push(detailsDataObj);
                    console.log(seriesHeatMap);
                    this.chartDetailsData = {
                      tooltip: {
                        trigger: 'axis'
                      },
                      legend: {
                        data: typeDataHeatMap
                      },
                      calculable: true,
                      xAxis: [
                        {
                          type: 'category',
                          data: xAxisHeatMap
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value'
                        }
                      ],
                      series : seriesHeatMap
                    };
                  }
                }
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
          this.currentPage=1;
          this.dayType=1;
          let data=new Date();
          this.searchForm.start=this.sevenDays();
          this.searchForm.end=data;
          this.searchForm.userType=null;
          this.getData();
        },
        compare(property){
          return function(a,b){
            let value1 = new Date(a[property]).getTime();
            let value2 = new Date(b[property]).getTime();
            return value1 - value2;
          }
        },
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
