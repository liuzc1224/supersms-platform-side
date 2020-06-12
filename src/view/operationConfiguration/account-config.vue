<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('accountConfig.createTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="createTimeStart"
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
                    ref="createTimeEnd"
                    :placeholder="$t('common.timeEnd')"
                    v-model="searchForm.createTimeEnd"
                  ></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('accountConfig.state')">
              <Select
                clearable
                style="min-width: 160px"
                v-model="searchForm.status"
                :placeholder="$t('accountConfig.prompt.state')"
              >
                <Option v-for="(item, i) in $t('accountConfig.status')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('accountConfig.account')">
              <Input
                maxlength="50"
                v-model="searchForm.account"
                :placeholder="$t('accountConfig.prompt.account')"
              ></Input>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card style="margin-top: 10px">
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('accountConfig.add')}}</Button>
        <account-config-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></account-config-modal>

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
  import {channelAccount} from "@/api/operation-config"
  import accountConfigModal from "@/components/operation-config/account-config-modal";
    export default {
        name: "account-config",
      components:{
        accountConfigModal
      },
      data(){
        return{
          editModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            createTimeStart:null,
            createTimeEnd:null,
            status:null,
            account: null
          },
          chooseItem:{
            id:null,
            account:null,
            password:null,
            ip: null,
            port: null,
            status: null
          },
          tableData: [],
          columns: [
            {
              title: this.$t("accountConfig.account"),
              key: "account",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("accountConfig.password"),
              key: "password",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("accountConfig.ip"),
              key: "ip",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("accountConfig.port"),
              key: "port",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("accountConfig.createTime"),
              key: "createTime",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['createTime']!==null){
                  return h('div',formatDate(new Date(params.row['createTime']),'yyyy-MM-dd hh:mm'));
                }
              }
            },
            {
              title: this.$t("accountConfig.state"),
              key: "status",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['status']!==null){
                  let data=this.$t('accountConfig.status');
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
      mounted(){
        this.getTable();
      },
      methods:{
        getTable(){
          let params = {
            createTimeStart:this.searchForm.createTimeStart,
            createTimeEnd:this.searchForm.createTimeEnd,
            account: this.searchForm.account,
            status: this.searchForm.status,

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
          channelAccount(params).then(res => {
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
        search() {
          this.currentPage=1;
          this.getTable();
        },
        cleanSearch() {
          this.currentPage=1;
          this.searchForm.createTimeStart = null;
          this.searchForm.createTimeEnd=null;
          this.searchForm.account = null;
          this.searchForm.status = null;
          this.getTable();
        },
        showModal () {
          this.editModal = true;
          this.modelItem({'row': {}});
        },
        changeModal(param) {
          this.editModal = param;
          this.modelItem({'row': {}});
        },
        modelItem(params){
          this.chooseItem.id = params.row.id;
          this.chooseItem.account = params.row.account;
          this.chooseItem.password = params.row.password;
          this.chooseItem.ip = params.row.ip;
          this.chooseItem.port = params.row.port;
          this.chooseItem.status = params.row.status!=null ? params.row.status : 1;
        },
        editSuccess () {
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
        },
      }
    }
</script>

<style scoped>

</style>
