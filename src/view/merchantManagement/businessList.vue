<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" inline>
          <Row>
            <FormItem :label="$t('businessList.createTime')">
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
            <FormItem :label="$t('businessList.accountBalance')">
              <Row>
                <i-col span="7">
                  <Select
                    style="min-width: 50px"
                    v-model="searchForm.judge"
                    class="search-select-item"
                  >
                    <Option v-for="(item, i) in $t('businessList.type')" :value="item.value" :key="i">{{item.desc}}</Option>
                  </Select>
                </i-col>
                <i-col span="16" offset="1">
                  <InputNumber :max="100000000000000.000" :min="0.000" :step="0.001" v-model="searchForm.balance" :placeholder="$t('businessList.prompt.accountBalance')" style="width: 100%"></InputNumber>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('businessList.state')">
              <Select
                style="min-width: 160px"
                v-model="searchForm.status"
                :placeholder="$t('businessList.prompt.state')"
                class="search-select-item"
              >
                <Option v-for="(item, i) in $t('businessList.status')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('businessList.operatingArea')">
              <Select
                style="min-width: 160px"
                v-model="searchForm.businessArea"
                :placeholder="$t('businessList.prompt.operatingArea')"
                class="search-select-item"
              >
                <Option v-for="(item, i) in $t('businessList.operatingAreas')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Row>
                <i-col span="10">
                  <Select
                    style="min-width: 160px"
                    v-model="searchForm.select"
                    class="search-select-item"
                  >
                    <Option v-for="(item, i) in $t('businessList.input')" :value="item.value" :key="i">{{item.desc}}</Option>
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
  import { userListInfo } from "@/api/merchantManagement"
  import { formatDate } from "@/assets/js/date";
  export default {
    name: "businessList",
    data(){
      return{
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          select:'companyName',
          createTimeStart:null,
          createTimeEnd:null,
          status:null,
          judge:'>',
          balance:null,
          businessArea:null,
          accountNo:null,
          companyName:null,
          businessNo: null,
        },
        tableData: [],
        columns: [
          {
            title: this.$t("businessList.businessNumber"),
            key: "businessNo",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("businessList.company"),
            key: "companyName",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("businessList.operatingArea"),
            key: "businessArea",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['businessArea']!==null){
                let data=this.$t('businessList.operatingAreas');
                let type=data.filter(v => {
                  return v.value===params.row['businessArea'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }
            },
          },
          {
            title: this.$t("businessList.accountBalance"),
            key: "balance",
            align: "center",
            minWidth:100,
            render: (h, params) => {
              if (params.row['balance'] != null) {
                return h('div', params.row['balance'].toFixed(3))
              }
            }
          },
          {
            title: this.$t("businessList.credits"),
            key: "creditLimit",
            align: "center",
            minWidth:100,
            render: (h, params) => {
              if (params.row['creditLimit'] != null) {
                return h('div', params.row['creditLimit'].toFixed(3))
              }
            }
          },
          {
            title: this.$t("businessList.createTime"),
            key: "createTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("businessList.state"),
            key: "status",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['status']!==null){
                let data=this.$t('businessList.status');
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
              // if(params.row.status===1){
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
                        this.detailsView(params.row.id);
                      }
                    }
                  }, this.$t('businessList.view'))
                ]
              // }
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
        this.searchForm.createTimeStart = null;
        this.searchForm.createTimeEnd=null;
        this.searchForm.status = null;
        this.searchForm.judge='>';
        this.searchForm.balance=null;
        this.searchForm.businessArea=null;
        this.searchForm.select='companyName';
        this.searchForm.name=null;
        this.getTable();
      },
      getTable(){
        let params = {
          [this.searchForm.select]:this.searchForm.name,
          createTimeStart: this.searchForm.createTimeStart ? this.searchForm.createTimeStart : null,
          createTimeEnd: this.searchForm.createTimeEnd ? this.searchForm.createTimeEnd : null,
          balance:this.searchForm.balance,
          status: this.searchForm.status,
          businessArea: this.searchForm.businessArea,
          createType: this.searchForm.createType,


          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        if(params.balance!=null){
          params['judge']=this.searchForm.judge;
        }
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
        userListInfo(params).then(res => {
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
      },
      detailsView(id){
        this.$router.push({
          name: 'business-details',
          query: { userId: id }
        })
      }
    }
  }
</script>

<style scoped>

</style>

