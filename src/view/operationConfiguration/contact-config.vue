<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('contactConfig.internationalNumber')">
              <Input
                maxlength="50"
                @on-keyup="setInput('countryCallingCode')"
                v-model="searchForm.countryCallingCode"
                :placeholder="$t('contactConfig.prompt.internationalNumber')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('contactConfig.countryChinese')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInChinese"
                :placeholder="$t('contactConfig.prompt.countryChinese')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('contactConfig.countryEnglish')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInEnglish"
                :placeholder="$t('contactConfig.prompt.countryEnglish')"
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
                <contact-config-modal
                  class="admin-modal"
                  :editModal="editModal"
                  :chooseItem="chooseItem"
                  v-on:changeModal="changeModal"
                  v-on:editSuccess="editSuccess"
                ></contact-config-modal>

        <Table
          border
          class="person-table"
          :columns="columns"
          :data="tableData"
          :loading="tableLoading"
          style="margin-top: 10px"
        />
      </Card>
    </i-col>
  </Row>
</template>

<script>
import { areaContactInfo } from "@/api/operation-config"
import contactConfigModal from "@/components/operation-config/contact-config-modal";
  export default {
    name: "contact-config",
    components:{
      contactConfigModal
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
          nameInChinese: null,
          nameInEnglish: null
        },
        chooseItem:{
          id:null,
          countryCallingCode:null,
          nameInChinese:null,
          nameInEnglish:null,

          rechargeEmail :null,
          rechargeTel:null,
          businessNumberRegistrationEmail:null,
          businessNumberRegistrationTel :null
        },
        tableData: [],
        columns: [
          {
            title: this.$t("contactConfig.countryChinese"),
            key: "nameInChinese",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("contactConfig.countryEnglish"),
            key: "nameInEnglish",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("contactConfig.internationalNumber"),
            key: "countryCallingCode",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("contactConfig.phoneRecharge"),
            key: "businessNumberRegistrationTel",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("contactConfig.emailRecharge"),
            key: "businessNumberRegistrationEmail",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("contactConfig.phoneMerchant"),
            key: "rechargeTel",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("contactConfig.emailMerchant"),
            key: "rechargeEmail",
            align: "center",
            minWidth:100,
            tooltip:true,
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
        this.searchForm.countryCallingCode = null;
        this.searchForm.nameInChinese=null;
        this.searchForm.nameInEnglish = null;
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
          countryCallingCode: this.searchForm.countryCallingCode,
          nameInChinese: this.searchForm.nameInChinese,
          nameInEnglish: this.searchForm.nameInEnglish,
          // pageSize: this.pageSize,
          // currentPage: this.currentPage,
        };
        this.tableLoading = true;
        areaContactInfo(params).then(res => {
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
        this.chooseItem.rechargeEmail = params.row.rechargeEmail;
        this.chooseItem.rechargeTel = params.row.rechargeTel+'';
        this.chooseItem.businessNumberRegistrationEmail = params.row.businessNumberRegistrationEmail;
        this.chooseItem.businessNumberRegistrationTel = params.row.businessNumberRegistrationTel+'';
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
