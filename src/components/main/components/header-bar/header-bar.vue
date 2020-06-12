<template>
  <div class="header-bar">
    <div style="height: 30px;">
      {{timeDate}}<span style="padding-left: 20px" v-if="userInfo">{{$t("personalInfo.balance")}} : {{userInfo.balance.toFixed(3)}} RMB</span>
    </div>
<!--    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>-->
    <custom-bread-crumb show-icon style="margin-left: 0;" :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import { formatDate } from "@/assets/js/date";
import { getUserInfo,getServiceTime } from '@/api/user'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  data(){
    return{
      timeDate:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),
      userInfo:null
    }
  },
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  mounted(){
    getServiceTime().then(res => {
      if (res.data.success) {
        if (res.data.data) {
          this.timeDate=formatDate(new Date(res.data.data['now']),'yyyy-MM-dd hh:mm:ss');
          sessionStorage.setItem("dateTime",this.timeDate);
        }
      } else {
        this.$Message.error(res.data.message)
      }
    });
    let time=setInterval(()=>{
      this.timeDate=formatDate(new Date((new Date(this.timeDate)).getTime()+1000),'yyyy-MM-dd hh:mm:ss');
    },1000);
    let dateTime=setInterval(()=>{
      sessionStorage.setItem("dateTime",this.timeDate);
    },60000);
    let info=setInterval(()=>{
      if(this.$store.state.user.access){
        this.getInfo();
      }
    },60000)
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    },
    getInfo(){
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
}
</script>
<style>

</style>
