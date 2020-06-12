<template>
  <Row>
    <i-col :span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" style="margin-top: 20px" inline>
          <FormItem :label="$t('reportCenter.consumptionTrend.statisticData')">
            <Row>
              <i-col span="11">
                <DatePicker
                  type="date"
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
                  type="date"
                  ref="timeEnd"
                  :placeholder="$t('common.timeEnd')"
                  v-model="searchForm.timeEnd"
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
          <Button :class="dayType===1 ? 'primary' : ''" @click="setType(1)" >{{$t('reportCenter.consumptionTrend.week')}}</Button>
          <Button :class="dayType===2 ? 'primary' : ''" @click="setType(2)" style="margin-left: 30px" >{{$t('reportCenter.consumptionTrend.month')}}</Button>
        </i-col>
      </Row>
      <Card>
        <Row style="margin-top: 10px" :gutter="10">
          <i-col :span="14">
            <c-chart :conf="chartDetailsData" v-if="chartDetailsData"></c-chart>
          </i-col>
          <i-col :span="10">
            <table style="margin-top: 80px">
              <tr>
                <td>
                  {{$t('reportCenter.consumptionTrend.sendTotal')}}
                </td>
                <td>{{tableData && tableData['sendTotal'] ? tableData['sendTotal'] : 0}}</td>
              </tr>
              <tr>
                <td>
                  {{$t('reportCenter.consumptionTrend.successTotal')}}
                </td>
                <td>{{tableData && tableData['successTotal'] ? tableData['successTotal'] : 0}}</td>
              </tr>
              <tr>
                <td>
                  {{$t('reportCenter.consumptionTrend.failTotal')}}
                </td>
                <td>{{tableData && tableData['failTotal'] ? tableData['failTotal'] : 0}}</td>
              </tr>
              <tr>
                <td>
                  {{$t('reportCenter.consumptionTrend.expenseTotal')}}
                </td>
                <td>{{tableData && tableData['expenseTotal']!=null ? tableData['expenseTotal'].toFixed(3) : 0.000}}</td>
              </tr>
            </table>
          </i-col>
        </Row>
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import CChart from "@/components/charts/commonChart";
  import {expenseStatementInfo} from "@/api/report_center";
  import { formatDate } from "@/assets/js/date";
  export default {
    name: "consumption_trend",
    components:{
      CChart
    },
    data(){
      return{
        dayType:1,
        searchForm: {
          timeStart:null,
          timeEnd:null
        },
        chartDetailsData:null,
        tableData:[],
      }
    },
    mounted(){
      let data=new Date();
      this.searchForm.timeStart=this.sevenDays();
      this.searchForm.timeEnd=data;
      this.getData();
    },
    methods:{
      setType(data){
        this.dayType=data;
        if(data===1){
          let data=new Date();
          this.searchForm.timeStart=this.sevenDays();
          this.searchForm.timeEnd=data;
          this.getData();
        }
        else if(data===2){
          let data=new Date();
          this.searchForm.timeStart=this.months();
          this.searchForm.timeEnd=data;
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
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let params = {
          timeStart:this.searchForm.timeStart,
          timeEnd:this.searchForm.timeEnd,
          userId: userInfo['id']
        };
        if(params.timeStart && params.timeEnd){
          params.timeStart=formatDate(new Date(params.timeStart), "yyyy-MM-dd")+" 00:00:00";
          params.timeEnd=formatDate(new Date(params.timeEnd), "yyyy-MM-dd")+" 23:59:59";
        }else{
          params.timeStart=null;
          params.timeEnd=null;
        }

        let start=(new Date(params.timeStart)).getTime();
        let end=(new Date(params.timeEnd)).getTime();
        if( start - end >0 ){
          params.timeStart=null;
          params.timeEnd=null;
        }
        this.tableLoading = true;
        expenseStatementInfo(params).then(res => {
          this.tableLoading = false;
          if(res.data.success) {
            if(res.data.data){
              this.tableData = res.data.data;
              if(res.data.data['listVOs']) {
                let detailsData = res.data.data['listVOs'];
                // let name=this.$t('reportCenter.consumptionTrend.expenseTotal');
                // console.log(name);
                if (detailsData && detailsData.length > 0) {
                  let heatMap=this.$t('reportCenter.data');
                  let xAxisHeatMap=[],typeDataHeatMap=[],seriesHeatMap=[];
                  heatMap.forEach(v=>{
                    xAxisHeatMap=[];
                    let tt=v  && v['desc'] ? v['desc'] : null;
                    if(tt){
                      typeDataHeatMap.push(tt);
                      let obj={};
                      let data=[];
                      obj['name']=tt;
                      obj['type']='line';
                      obj['data']=data;
                      detailsData.forEach(item=>{
                        let num=item[v['value']] ? item[v['value']] : 0;
                        obj['data'].push(num);
                        xAxisHeatMap.push(item['datePerDay'].toString().substring(0,10));

                      });
                      seriesHeatMap.push(obj)
                    }
                  });
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
          }
          else{
            this.$Message.error(res.data.message)
          }
        });
      },
      search(){
        let start=(new Date(formatDate(this.searchForm.timeStart,"yyyy-MM-dd"))).getTime();
        let end=(new Date(formatDate(this.searchForm.timeEnd,"yyyy-MM-dd"))).getTime();
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
        this.searchForm.timeStart=this.sevenDays();
        this.searchForm.timeEnd=data;
        this.searchForm.userType=null;
        this.getData();
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
