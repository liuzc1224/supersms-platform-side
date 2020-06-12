<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('account.createTime')">
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
            <FormItem :label="$t('account.state')">
              <Select
                clearable
                style="min-width: 160px"
                v-model="searchForm.status"
                class="search-select-item"
                :placeholder="$t('account.prompt.state')"
              >
                <Option v-for="(item, i) in $t('account.status')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('account.operatingArea')">
              <Select
                clearable
                style="min-width: 160px"
                v-model="searchForm.businessArea"
                class="search-select-item"
                :placeholder="$t('account.prompt.operatingArea')"
              >
                <Option v-for="(item, i) in $t('account.operatingAreas')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
<!--            <FormItem :label="$t('account.createType')">-->
<!--              <Select-->
<!--                clearable-->
<!--                style="min-width: 160px"-->
<!--                v-model="searchForm.createType"-->
<!--                class="search-select-item"-->
<!--                :placeholder="$t('account.prompt.createType')"-->
<!--              >-->
<!--                <Option v-for="(item, i) in $t('account.createTypes')" :value="item.value" :key="i">{{item.desc}}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
            <FormItem>
              <Row>
                <i-col span="10">
                  <Select
                    style="min-width: 160px"
                    v-model="searchForm.select"
                    class="search-select-item"
                  >
                    <Option v-for="(item, i) in $t('account.input')" :value="item.value" :key="i">{{item.desc}}</Option>
                  </Select>
                </i-col>
                <i-col span="11" offset="3">
                  <Input v-model="searchForm.name" :placeholder="$t('common.input')" maxlength="50"></Input>
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
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('account.add')}}</Button>
        <account-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          :titleType="titleType"
          :readonlyType="readonlyType"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></account-modal>
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
  import { userInfo } from "@/api/merchantManagement"
  import accountModal from "@/components/merchantManagement/account-modal";
  import { formatDate } from "@/assets/js/date";
  export default {
    components:{
      accountModal
    },
    data(){
      return{
        readonlyType:null,
        titleType: 'add',
        editModal: false,
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          name:null,
          select:'accountNo',
          createTimeStart:null,
          createTimeEnd:null,
          status:null,
          // createType:null,
          accountNo:null,
          companyName: null,
          businessNo: null,
          contact: null,
          businessArea: null,
          authOperator: null,
          createOperator:null
        },
        chooseItem:{
          id:null,
          businessNo:null,
          companyName:null,
          businessArea:null,

          accountNo :null,
          password:null,
          email:null,
          contact:null,
          contactPhoneNumber :null,
          statusUpdateNote :null,
          status  :null,
        },
        tableData: [],
        columns: [
          {
            title: this.$t("account.businessNumber"),
            key: "businessNo",
            align: "center",
            fixed:'left',
            minWidth:150,
            tooltip:true,
          },
          {
            title: this.$t("account.company"),
            key: "companyName",
            align: "center",
            fixed:'left',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("account.operatingArea"),
            key: "businessArea",
            align: "center",
            render:(h,params)=>{
              if(params.row['businessArea']!==null){
                let data=this.$t('account.operatingAreas');
                let type=data.filter(v => {
                  return v.value===params.row['businessArea'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }
            },
            fixed:'left',
            minWidth:100,
          },
          {
            title: this.$t("account.accountName"),
            key: "accountNo",
            align: "center",
            tooltip:true,
            minWidth:100
          },
          {
            title: this.$t("account.accountType"),
            key: "isMain",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['isMain']!==null){
                let data=this.$t('account.accountTypes');
                let type=data.filter(v => {
                  return v.value===params.row['isMain'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }

            }
          },
          {
            title: this.$t("account.mailbox"),
            key: "email",
            align: "center",
            tooltip:true,
            minWidth:150
          },
          {
            title: this.$t("account.contact"),
            key: "contact",
            align: "center",
            tooltip:true,
            minWidth:100
          },
          {
            title: this.$t("account.contactNumber"),
            key: "contactPhoneNumber",
            align: "center",
            tooltip:true,
            minWidth:150
          },
          {
            title: this.$t("account.reviewer"),
            key: "authOperator",
            align: "center",
            tooltip:true,
            minWidth:100
          },
          {
            title: this.$t("account.reviewTime"),
            key: "auditTimeStr",
            align: "center",
            tooltip:true,
            minWidth:100
          },
          {
            title: this.$t("account.founder"),
            key: "createOperator",
            align: "center",
            tooltip:true,
            minWidth:100
          },
          {
            title: this.$t("account.createTime"),
            key: "createTimeStr",
            align: "center",
            tooltip:true,
            minWidth:100
          },
          {
            title: this.$t("account.state"),
            key: "status",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['status']!==null){
                let data=this.$t('account.status');
                let type=data.filter(v => {
                  return v.value===params.row['status'];
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
              let str;
              if(params.row.status===0){
                str= [h('Button', {
                  props: {
                    type: 'text', size: 'large', icon: 'md-build'
                  },
                  class: 'edit-btn',
                  style: {
                    color: "#ff9900",
                    marginRight: '5px',
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.editModal = true;
                      this.titleType='review';
                      this.readonlyType='readonly';
                      this.modelItem(params);
                    }
                  }
                }, this.$t('common.review'))]
              }
              if(params.row.status===1 || params.row.status===2){
                str=[
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
                        this.titleType='edit';
                        this.modelItem(params);
                        this.readonlyType=null;
                        this.editModal = true;
                        console.log(this.titleType);
                      }
                    }
                  }, this.$t('common.edit'))
                ]
              }
              return h("div", str)
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
        this.searchForm.name = null;
        this.searchForm.select='accountNo';
        this.searchForm.createTimeStart = null;
        this.searchForm.createTimeEnd = null;
        this.searchForm.status = null;
        this.searchForm.businessArea = null;
        // this.searchForm.createType = null;
        this.getTable();
      },
      showModal () {
        this.readonlyType=null;
        this.editModal = true;
        this.titleType='add';
        this.modelItem({'row': {}});
      },
      changeModal(param) {
        this.editModal = param;
        // this.modelItem({'row': {}});
      },
      getTable(){
        let params = {
          [this.searchForm.select]:this.searchForm.name,
          createTimeStart: this.searchForm.createTimeStart ? this.searchForm.createTimeStart : null,
          createTimeEnd: this.searchForm.createTimeEnd ? this.searchForm.createTimeEnd : null,
          status: this.searchForm.status,
          businessArea: this.searchForm.businessArea,
          createType: this.searchForm.createType,

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
        console.log(params);
        this.tableLoading =  true;
        userInfo(params).then(res => {
          if(res.data.success){
            this.tableLoading = false;
            if( res.data.data && res.data.data.length !==0 ){
              this.tableData = res.data.data;
              this.currentPage = res.data.page.currentPage;
              this.pageSize = res.data.page.pageSize;
              this.totalNumber = res.data.page.totalNumber;
            }else{
              this.tableLoading = false;
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
        if(this.titleType==='review'){
          this.chooseItem.id = params.row.id;
          this.chooseItem.businessNo = params.row.businessNo;
          this.chooseItem.companyName = params.row.companyName;
        }else{
          this.chooseItem.id = params.row.id;
          this.chooseItem.businessNo = params.row.businessNo;
          this.chooseItem.companyName = params.row.companyName;
          this.chooseItem.businessArea = params.row.businessArea;
          this.chooseItem.accountNo = params.row.accountNo;

          this.chooseItem.password = null;

          this.chooseItem.email = params.row.email;
          this.chooseItem.contact = params.row.contact;
          this.chooseItem.contactPhoneNumber = params.row.contactPhoneNumber;
          this.chooseItem.statusUpdateNote = params.row.statusUpdateNote;
          this.chooseItem.status = params.row.status!=null ? params.row.status : null;
        }
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
