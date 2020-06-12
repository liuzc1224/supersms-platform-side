<!--<template>-->
<!--  <div>-->
<!--    <Row :gutter="20">-->
<!--      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">-->
<!--        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">-->
<!--          <count-to :end="infor.count" count-class="count-style"/>-->
<!--          <p>{{ infor.title }}</p>-->
<!--        </infor-card>-->
<!--      </i-col>-->
<!--    </Row>-->
<!--    <Row :gutter="20" style="margin-top: 10px;">-->
<!--      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">-->
<!--        <Card shadow>-->
<!--          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>-->
<!--        </Card>-->
<!--      </i-col>-->
<!--      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">-->
<!--        <Card shadow>-->
<!--          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>-->
<!--        </Card>-->
<!--      </i-col>-->
<!--    </Row>-->
<!--    <Row>-->
<!--      <Card shadow>-->
<!--        <example style="height: 310px;"/>-->
<!--      </Card>-->
<!--    </Row>-->
<!--  </div>-->
<!--</template>-->

<!--<script>
// import InforCard from '_c/info-card'
// import CountTo from '_c/count-to'
// import { ChartPie, ChartBar } from '_c/charts'
// import Example from './example.vue'
// export default {
//   name: 'home',
//   components: {
    // InforCard,
    // CountTo,
    // ChartPie,
    // ChartBar,
    // Example
  // },
  // data () {
  //   return {
  //     inforCardData: [
  //       { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
  //       { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
  //       { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
  //       { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
  //       { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
  //       { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
  //     ],
  //     pieData: [
  //       { value: 335, name: '直接访问' },
  //       { value: 310, name: '邮件营销' },
  //       { value: 234, name: '联盟广告' },
  //       { value: 135, name: '视频广告' },
  //       { value: 1548, name: '搜索引擎' }
  //     ],
  //     barData: {
  //       Mon: 13253,
  //       Tue: 34235,
  //       Wed: 26321,
  //       Thu: 12340,
  //       Fri: 24643,
  //       Sat: 1322,
  //       Sun: 1324
  //     }
  //   }
  // },
  // mounted () {
    //
  }-->
<!--}-->
<!--</script>-->

<!--<style lang="less">-->
<!--.count-style{-->
<!--  font-size: 50px;-->
<!--}-->
<!--</style>-->
<template>
  <Card style="height: 100%">
    <h2>{{$t('loginFrom.welcomeText')}}</h2>
    <table>
      <tr>
        <td colspan="2" class="left">
          {{$t('personalInfo.account')}}
        </td>
      </tr>
      <tr>
        <td class="right">
          {{$t('personalInfo.businessNumber')}}
        </td>
        <td class="left">
          {{userInfo && userInfo.businessNo ? userInfo.businessNo : ''}}
        </td>
      </tr>
      <tr>
        <td class="right">
          {{$t('personalInfo.accountName')}}
        </td>
        <td class="left">
          {{userInfo && userInfo.mainAccountNo ? userInfo.mainAccountNo : ''}}
        </td>
      </tr>
      <tr>
        <td class="right">
          {{$t('personalInfo.company')}}
        </td>
        <td class="left">
          {{userInfo && userInfo.companyName ? userInfo.companyName : ''}}
        </td>
      </tr>
      <tr>
        <td class="right">
          {{$t('personalInfo.email')}}
        </td>
        <td class="left">
          {{userInfo && userInfo.email ? userInfo.email : ''}}
        </td>
      </tr>
      <tr>
        <td class="right">
          {{$t('personalInfo.balance')}}
        </td>
        <td class="left">
          {{userInfo && userInfo.balance ? userInfo.balance.toFixed(3)+'  RMB' : 0}}
        </td>
      </tr>
      <tr>
        <td class="right">
          {{$t('personalInfo.credits')}}
        </td>
        <td class="left">
          {{userInfo && userInfo.creditLimit ? userInfo.creditLimit.toFixed(3)+'  RMB ' : 0}}
        </td>
      </tr>
    </table>
  </Card>
</template>

<script>
  import { getUserInfo } from '@/api/user'
  export default {
    name: "home",
    data(){
      return{
        userInfo:null
      }
    },
    mounted() {
      getUserInfo().then(res => {
        if (res.data.success) {
          if (res.data.data) {
            this.userInfo = res.data.data;
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
</script>

<style scoped>
  .right{
    text-align: right;
    padding-right: 10px;
  }
  .left{
    padding-left: 10px;
  }
  table{
    border-collapse: collapse;
    width: 500px;
    margin-top: 10px;
  }
  tr{
    width: 500px;
  }
  td{
    width: 250px;
    border: 1px #cccccc solid;
    height: 40px;
    line-height: 40px;
  }
</style>
