<template>
  <Card>
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
</template>

<script>
  import { recharge } from "@/api/merchantManagement"
    export default {
        name: "recharge-record",
      data(){
        return{
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            countryCallingCode:null,
            nameInChinese: null,
            nameInEnglish: null
          },
          tableData: [],
          columns: [
            {
              title: this.$t("rechargeRecord.createTime"),
              key: "createTimeStr",
              align: "center",
              tooltip:true,
              minWidth:100
            },
            {
              title: this.$t("rechargeRecord.transactionNumber"),
              key: "transactionId",
              align: "center",
              tooltip:true,
              minWidth:100
            },
            {
              title: this.$t("rechargeRecord.rechargeMethod"),
              key: "rechargeType",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['rechargeType']!==null){
                  let data=this.$t('rechargeRecord.rechargeMethods');
                  let type=data.filter(v => {
                    return v.value===params.row['rechargeType'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              }
            },
            {
              title: this.$t("rechargeRecord.rechargeAmount"),
              key: "rechargeAmount",
              align: "center",
              tooltip:true,
              minWidth:100
            },
            {
              title: this.$t("rechargeRecord.currencyUnit"),
              key: "monetaryUnit",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['monetaryUnit']!==null){
                  let data=this.$t('rechargeRecord.units');
                  let type=data.filter(v => {
                    return v.value==params.row['monetaryUnit'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              }
            },
            {
              title: this.$t("rechargeRecord.completeTime"),
              key: "endTimeStr",
              align: "center",
              tooltip:true,
              minWidth:100
            },
            {
              title: this.$t("rechargeRecord.rechargeType"),
              key: "rechargeStatus",
              align: "center",
              minWidth:100,
              tooltip:true,
              render:(h,params)=>{
                if(params.row['rechargeStatus']!==null){
                  let data=this.$t('rechargeRecord.rechargeTypes');
                  let type=data.filter(v => {
                    return v.value===params.row['rechargeStatus'];
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
        getTable(){
          let params = {
            id:this.$route.query.userId,
            pageSize: this.pageSize,
            currentPage: this.currentPage,
          };
          this.tableLoading = true;
          recharge(params).then(res => {
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
      },
      watch: {
        $route: {
          handler: function(val, oldVal){
            this.getTable();
          },
          // 深度观察监听
          deep: true
        }
      }
    }
</script>

<style scoped>

</style>
