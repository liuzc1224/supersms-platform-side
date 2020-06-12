<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('carrierManagement.internationalNumber')">
              <Input
                maxlength="50"
                @on-keyup="setInput('countryCallingCode')"
                v-model="searchForm.countryCallingCode"
                :placeholder="$t('carrierManagement.prompt.internationalNumber')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('carrierManagement.countryChinese')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInChinese"
                :placeholder="$t('carrierManagement.prompt.countryChinese')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('carrierManagement.countryEnglish')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInEnglish"
                :placeholder="$t('carrierManagement.prompt.countryEnglish')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('carrierManagement.operator')">
              <Input
                maxlength="50"
                v-model="searchForm.operatorName"
                :placeholder="$t('carrierManagement.prompt.operator')"
              ></Input>
            </FormItem>
<!--            <FormItem :label="$t('carrierManagement.numberSegment')">-->
<!--              <Input-->
<!--                @on-keyup="setInput('supportThemRoughly')"-->
<!--                v-model="searchForm.supportThemRoughly"-->
<!--                :placeholder="$t('carrierManagement.prompt.numberSegment')"-->
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
        <carrier-management-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></carrier-management-modal>

        <Table
          border
          class="person-table"
          :columns="columns"
          :data="tableData"
          :loading="tableLoading"
          style="margin-top: 10px"
        />

        <!--<Modal v-model="deleteModal" :title="$t('setUpPage.deleteTitle')" @on-ok="deleteItem">-->
        <!--<p>{{$t('setUpPage.deleteTip')}}</p>-->
        <!--</Modal>-->
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
  import carrierManagementModal from "@/components/operation-config/carrier-management-modal";
    export default {
      name: "carrier-management",
      components:{
        carrierManagementModal
      },
      data(){
        return{
          editModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            countryCallingCode:null,
            nameInChinese:null,
            nameInEnglish: null,
            operatorName: null,
            supportThemRoughly: null
          },
          chooseItem:{
            id:null,
            countryCallingCode:null,
            nameInChinese:null,
            nameInEnglish: null,
            operatorName: null,
            supportThemRoughly: null,
            maxCharacterEverytime : null,
            numberPerCharacter: null,
            status: null
          },
          tableData: [],
          columns: [
            {
              title: this.$t("carrierManagement.countryChinese"),
              key: "nameInChinese",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("carrierManagement.countryEnglish"),
              key: "nameInEnglish",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("carrierManagement.internationalNumber"),
              key: "countryCallingCode",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            // {
            //   title: this.$t("carrierManagement.operator"),
            //   key: "operatorName",
            //   align: "center",
            //   minWidth:100,
            // },
            // {
            //   title: this.$t("carrierManagement.numberSegment"),
            //   key: "supportThemRoughly",
            //   align: "center",
            //   minWidth:100,
            // },
            {
              title: this.$t("carrierManagement.singleCharacter"),
              key: "numberPerCharacter",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("carrierManagement.MaxCharacter"),
              key: "maxCharacterEverytime",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("carrierManagement.state"),
              key: "status",
              align: "center",
              minWidth:100,
              render:(h,params)=>{
                if(params.row['status']!==null){
                  let data=this.$t('carrierManagement.status');
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
              minWidth: 120,
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
      mounted: function () {
        this.getTable();
      },
      methods: {
        search() {
          this.currentPage=1;
          this.getTable();
        },
        cleanSearch() {
          this.searchForm.countryCallingCode = null;
          this.searchForm.nameInChinese=null;
          this.searchForm.nameInEnglish = null;
          // this.searchForm.operatorName = null;
          this.searchForm.supportThemRoughly = null;
          this.currentPage=1;
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
        getTable(){
          let params = {
            countryCallingCode:this.searchForm.countryCallingCode,
            nameInChinese:this.searchForm.nameInChinese,
            nameInEnglish: this.searchForm.nameInEnglish,
            // operatorName: this.searchForm.operatorName,
            supportThemRoughly: this.searchForm.supportThemRoughly,
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
        modelItem(params){
          this.chooseItem.id = params.row.id;
          this.chooseItem.countryCallingCode = params.row.countryCallingCode;
          this.chooseItem.nameInChinese = params.row.nameInChinese;
          this.chooseItem.nameInEnglish = params.row.nameInEnglish;
          // this.chooseItem.operatorName = params.row.operatorName;
          // this.chooseItem.supportThemRoughly = params.row.supportThemRoughly;
          this.chooseItem.maxCharacterEverytime = params.row.maxCharacterEverytime;
          this.chooseItem.numberPerCharacter = params.row.numberPerCharacter;
          this.chooseItem.status = params.row.status-0;
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
        },
        setInput(data){
          this.searchForm[data]=this.searchForm[data] ? this.searchForm[data].replace(/[^\d]/g,'') : null;
        }
      }
    }
</script>

<style scoped>

</style>
