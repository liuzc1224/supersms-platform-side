<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
<!--            <FormItem :label="$t('balanceWarning.internationalNumber')">-->
<!--              <Input-->
<!--                maxlength="50"-->
<!--                @on-keyup="setInput('countryCallingCode')"-->
<!--                v-model="searchForm.countryCallingCode"-->
<!--                :placeholder="$t('balanceWarning.prompt.internationalNumber')"-->
<!--              ></Input>-->
<!--            </FormItem>-->
            <FormItem :label="$t('balanceWarning.countryChinese')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInChinese"
                :placeholder="$t('balanceWarning.prompt.countryChinese')"
              ></Input>
            </FormItem>
<!--            <FormItem :label="$t('balanceWarning.countryEnglish')">-->
<!--              <Input-->
<!--                maxlength="50"-->
<!--                v-model="searchForm.nameInEnglish"-->
<!--                :placeholder="$t('balanceWarning.prompt.countryEnglish')"-->
<!--              ></Input>-->
<!--            </FormItem>-->
            <FormItem :label="$t('balanceWarning.operator')">
              <Input
                maxlength="50"
                v-model="searchForm.operatorName"
                :placeholder="$t('balanceWarning.prompt.operator')"
              ></Input>
            </FormItem>
<!--            <FormItem :label="$t('balanceWarning.numberSegment')">-->
<!--              <Input-->
<!--                maxlength="50"-->
<!--                v-model="searchForm.nameInEnglish"-->
<!--                :placeholder="$t('balanceWarning.prompt.numberSegment')"-->
<!--              ></Input>-->
<!--            </FormItem>-->
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card style="margin-top: 10px">
        <balance-warning-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></balance-warning-modal>

        <Table
          border
          class="person-table"
          :columns="columns"
          :data="tableData"
          :loading="tableLoading"
          style="margin-top: 10px"
        />
<!--        <div style="margin: 10px;overflow: hidden">-->
<!--          <div style="float: right;margin-bottom: 2px;">-->
<!--            <Page-->
<!--              :total="totalNumber"-->
<!--              :current="currentPage"-->
<!--              :page-size-opts="[10, 20, 30, 50]"-->
<!--              @on-change="changePage"-->
<!--              @on-page-size-change="pageSizeChange"-->
<!--              show-elevator-->
<!--              show-sizer-->
<!--              show-total-->
<!--            ></Page>-->
<!--          </div>-->
<!--        </div>-->
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { operatorInfo } from "@/api/operation-config"
import balanceWarningModal from "@/components/operation-config/balance-warning-modal";
    export default {
      name: "balance-warning",
      components:{
        balanceWarningModal
      },
      data(){
        return{
          editModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            nameInChinese: null,
            operatorName: null
          },
          chooseItem:{
            id:null,
            operatorName:null,
            balanceExpected:null,
            balanceWarning: null,
            emailWarning: null,
            status: null
          },
          tableData: [],
          columns: [
            {
              title: this.$t("balanceWarning.countryChinese"),
              key: "nameInChinese",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("balanceWarning.operator"),
              key: "operatorName",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("balanceWarning.balanceEstimate"),
              key: "balanceExpected",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("balanceWarning.singlePricing"),
              key: "priceSingleRmb",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("balanceWarning.earlyWarning"),
              key: "balanceWarning",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("balanceWarning.email"),
              key: "emailWarning",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("balanceWarning.state"),
              key: "status",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['status']!==null){
                  let data=this.$t('balanceWarning.status');
                  let type=data.filter(v => {
                    return v.value===params.row['status'];
                  });
                  let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                  return h('div',state);
                }

              },
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
            countryCallingCode:this.searchForm.countryCallingCode,
            nameInChinese:this.searchForm.nameInChinese,
            // nameInEnglish: this.searchForm.nameInEnglish,
            operatorName: this.searchForm.operatorName,
            // supportThemRoughly: this.searchForm.supportThemRoughly,
            // pageSize: this.pageSize,
            // currentPage: this.currentPage,
          };
          this.tableLoading = this.tableLoading === false ? true : this.tableLoading;
          operatorInfo(params).then(res => {
            this.tableLoading = false;
            if(res.data.success){
              if( res.data.data && res.data.data.length !==0 ){
                this.tableData = res.data.data;
                // this.currentPage = res.data.page.currentPage;
                // this.pageSize = res.data.page.pageSize;
                // this.totalNumber = res.data.page.totalNumber;
              }else{
                this.tableData = []
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
          this.searchForm.operatorName = null;
          this.searchForm.nameInChinese = null;
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
          this.chooseItem.operatorName = params.row.operatorName;
          this.chooseItem.balanceExpected = params.row.balanceExpected ? params.row.balanceExpected-0 : 0;
          this.chooseItem.priceSingleRmb = params.row.priceSingleRmb ? params.row.priceSingleRmb-0 : 0;
          this.chooseItem.balanceWarning = params.row.balanceWarning ? params.row.balanceWarning-0 : 0;
          this.chooseItem.emailWarning = params.row.emailWarning;
          this.chooseItem.status = params.row.status!=null ? params.row.status : null;
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
