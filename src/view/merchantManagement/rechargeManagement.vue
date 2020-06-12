<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('rechargeManagement.createTime')">
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
            <FormItem :label="$t('rechargeManagement.createType')">
              <Select
                clearable
                style="min-width: 160px"
                v-model="searchForm.createType"
                class="search-select-item"
                :placeholder="$t('rechargeManagement.prompt.createType')"
              >
                <Option v-for="(item, i) in $t('rechargeManagement.types')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('rechargeManagement.accountName')">
              <Input v-model="searchForm.account" :placeholder="$t('rechargeManagement.prompt.accountName')" maxlength="50"></Input>
            </FormItem>
            <FormItem :label="$t('rechargeManagement.businessNumber')">
              <Input v-model="searchForm.businessNo" :placeholder="$t('rechargeManagement.prompt.businessNumber')" maxlength="50"></Input>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card style="margin-top: 10px">
        <Button class="add-admin-btn" type="primary" @click="showModal">{{$t('rechargeManagement.add')}}</Button>
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
        <recharge-management-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          :readonlyType="readonlyType"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></recharge-management-modal>
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { formatDate } from "@/assets/js/date";
  import {rechargeRecordInfo} from "@/api/merchantManagement";
  import rechargeManagementModal from "@/components/merchantManagement/recharge-management-modal";
    export default {
        name: "rechargeManagement",
      components:{
        rechargeManagementModal
      },
      data(){
        return{
          readonlyType:null,
          editModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            createTimeStart:null,
            createTimeEnd: null,
            createType: null,
            account: null,
            businessNo: null
          },
          chooseItem:{
            id:null,
            businessNo:null,
            rechargeType:null,
            transactionId:null,

            rechargeAmount :null,
            monetaryUnit:null,
            rechargeStatus:null
          },
          tableData: [],
          columns: [
            {
              title: this.$t("rechargeManagement.createTime"),
              key: "createTimeStr",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            // {
            //   title: this.$t("rechargeManagement.accountName"),
            //   key: "account",
            //   align: "center",
            //   minWidth:100,
            // },
            {
              title: this.$t("rechargeManagement.transactionNumber"),
              key: "transactionId",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("rechargeManagement.businessNumber"),
              key: "businessNo",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("rechargeManagement.company"),
              key: "companyName",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("rechargeManagement.rechargeMethod"),
              key: "rechargeType",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['rechargeType']!==null){
                  let data=this.$t('rechargeManagement.rechargeMethods');
                  let type=data.filter(v => {
                    return v.value===params.row['rechargeType'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              }
            },
            {
              title: this.$t("rechargeManagement.rechargeAmount"),
              key: "rechargeAmount",
              align: "center",
              minWidth:100,
              render: (h, params) => {
                if (params.row['rechargeAmount'] != null) {
                  return h('div', params.row['rechargeAmount'].toFixed(3))
                }
              }
            },
            {
              title: this.$t("rechargeManagement.currencyUnit"),
              key: "monetaryUnit",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['monetaryUnit']!==null){
                  let data=this.$t('rechargeManagement.units');
                  let type=data.filter(v => {
                    return v.value==params.row['monetaryUnit'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              }
            },
            {
              title: this.$t("rechargeManagement.rechargeType"),
              key: "rechargeStatus",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['rechargeStatus']!==null){
                  let data=this.$t('rechargeManagement.rechargeTypes');
                  let type=data.filter(v => {
                    return v.value===params.row['rechargeStatus'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              }
            },
            // {
            //   title: this.$t("rechargeManagement.completeTime"),
            //   key: "endTimeStr",
            //   align: "center",
            //   minWidth:100,
            // },
            {
              title: this.$t("rechargeManagement.createType"),
              key: "createType",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['createType']!==null){
                  let data=this.$t('rechargeManagement.types');
                  let type=data.filter(v => {
                    return v.value===params.row['createType'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              }
            },
            {
              title: this.$t("common.operating"),
              key: "action",
              minWidth: 150,
              align: "center",
              render: (h, params) => {
                return h("div", [
                  h('Button', {
                    props: {
                      type: 'text', size: 'large', icon: 'md-menu'
                    },
                    class: 'edit-btn',
                    style: {
                      color: "#57a3f3",
                      marginRight: '5px',
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.modelItem(params);
                        this.readonlyType='readonly';
                        this.editModal=true;
                      }
                    }
                  }, this.$t('common.edit'))
                ])
              }
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
          this.searchForm.createType = null;
          this.searchForm.account = null;
          this.searchForm.businessNo = null;
          this.getTable();
        },
        showModal () {
          this.editModal = true;
          this.readonlyType=null;
          this.modelItem({'row': {}});
        },
        changeModal(param) {
          this.modelItem({'row': {}});
          this.editModal = param;
        },
        getTable(){
          let params = {
            createTimeStart:this.searchForm.createTimeStart ? this.searchForm.createTimeStart : null,
            createTimeEnd: this.searchForm.createTimeEnd ? this.searchForm.createTimeEnd : null,
            createType: this.searchForm.createType,
            account: this.searchForm.account,
            businessNo: this.searchForm.businessNo,
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
          this.tableLoading =  true;
          rechargeRecordInfo(params).then(res => {
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
        modelItem(params){
          this.chooseItem.id = params.row.id;
          this.chooseItem.businessNo = params.row.businessNo;
          this.chooseItem.rechargeType = params.row.rechargeType;
          this.chooseItem.transactionId = params.row.transactionId ? params.row.transactionId+'' : null;
          this.chooseItem.rechargeAmount = params.row.rechargeAmount ? params.row.rechargeAmount : 0;
          this.chooseItem.monetaryUnit = 0;
          this.chooseItem.rechargeStatus = params.row.rechargeStatus;
        },
        editSuccess (param) {
          this.tableLoading = true;
          this.getTable();
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
