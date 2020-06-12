<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('quote.businessNumber')">
              <Input v-model="searchForm.businessNo" :placeholder="$t('quote.prompt.businessNumber')" maxlength="50"></Input>
            </FormItem>
            <FormItem :label="$t('quote.operatingArea')">
              <Select
                style="min-width: 160px"
                v-model="searchForm.businessArea"
                :placeholder="$t('quote.prompt.operatingArea')"
                class="search-select-item"
              >
                <Option v-for="(item, i) in $t('quote.operatingAreas')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('quote.state')">
              <Select
                style="min-width: 160px"
                v-model="searchForm.status"
                :placeholder="$t('quote.prompt.state')"
                class="search-select-item"
              >
                <Option v-for="(item, i) in $t('quote.status')" :value="item.value" :key="i">{{item.desc}}</Option>
              </Select>
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
        <quote-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></quote-modal>
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { businessPriceInfo } from "@/api/merchantManagement"
  import quoteModal from "@/components/merchantManagement/quote-modal";
import { formatDate } from "@/assets/js/date";
  export default {
    name: "quote",
    components:{
      quoteModal
    },
    data(){
      return{
        tableLoading: false,
        editModal: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          businessNo:null,
          businessArea	: null,
          status: null
        },
        chooseItem:{
          id:null,
          businessNo:null,
          businessArea:null,
          priceSingleRmb:null,
          priceSingleDollar:null,
          creditLimit:null,
          sort:null
        },
        tableData: [],
        columns: [
          {
            title: this.$t("quote.businessNumber"),
            key: "businessNo",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("quote.operatingArea"),
            key: "businessArea",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['businessArea']!==null){
                let data=this.$t('quote.operatingAreas');
                let type=data.filter(v => {
                  return v.value===params.row['businessArea'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }

            }
          },
          {
            title: this.$t("quote.SingleRMB"),
            key: "priceSingleRmb",
            align: "center",
            minWidth:100,
            render: (h, params) => {
              if (params.row['priceSingleRmb'] != null) {
                return h('div', params.row['priceSingleRmb'].toFixed(3))
              }
            }
          },
          {
            title: this.$t("quote.SingleUS"),
            key: "priceSingleDollar",
            align: "center",
            minWidth:100,
            render: (h, params) => {
              if (params.row['priceSingleDollar'] != null) {
                return h('div', params.row['priceSingleDollar'].toFixed(3))
              }
            }
          },
          {
            title: this.$t("quote.creditLimit"),
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
            title: this.$t("quote.weights"),
            key: "sort",
            align: "center",
            minWidth:100
          },
          {
            title: this.$t("quote.state"),
            key: "status",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['status']!==null){
                if(params.row['status']!==1){
                  params.row['status']=2;
                }
                let data=this.$t('quote.status');
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
            minWidth: 200,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h('span', {
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
                }, this.$t('common.edit')),
                h('span', {
                  props: {
                    type: 'text', size: 'large', icon: 'md-menu'
                  },
                  class: 'edit-btn',
                  style: {
                    color: "#57a3f3",
                    paddingLeft: '15px',
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'historical-quote',
                        query: { id: params.row.id }
                      })
                    }
                  }
                }, this.$t('quote.view'))
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
        this.searchForm.businessNo = null;
        this.searchForm.businessArea=null;
        this.searchForm.status = null;
        this.getTable();
      },
      changeModal(param) {
        this.editModal = param;
        this.modelItem({'row': {}});
      },
      getTable(){
        let params = {
          businessNo: this.searchForm.businessNo,
          businessArea: this.searchForm.businessArea,
          status: this.searchForm.status,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        this.tableLoading =  true;
        businessPriceInfo(params).then(res => {
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
        this.chooseItem.businessNo  = params.row.businessNo ;
        this.chooseItem.businessArea = params.row.businessArea;
        this.chooseItem.priceSingleRmb = params.row.priceSingleRmb;
        this.chooseItem.priceSingleDollar = params.row.priceSingleDollar;
        this.chooseItem.creditLimit = params.row.creditLimit;
        this.chooseItem.sort = params.row.sort;
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
