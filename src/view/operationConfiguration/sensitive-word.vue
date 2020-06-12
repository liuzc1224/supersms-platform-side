<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" inline>
          <Row>
            <FormItem :label="$t('sensitiveWord.state')">
              <Select clearable v-model="searchForm.status" class="search-select-item" :placeholder="$t('sensitiveWord.prompt.state')" style="min-width: 160px">
                <Option v-for="(item,index) in $t('sensitiveWord.status')" :key="index" :value="item['value']">{{item['desc']}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('sensitiveWord.internationalNumber')">
              <Input
                maxlength="50"
                @on-keyup="setInput('countryCallingCode')"
                v-model="searchForm.countryCallingCode"
                :placeholder="$t('sensitiveWord.prompt.internationalNumber')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('sensitiveWord.countryChinese')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInChinese"
                :placeholder="$t('sensitiveWord.prompt.countryChinese')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('sensitiveWord.countryEnglish')">
              <Input
                maxlength="50"
                v-model="searchForm.nameInEnglish"
                :placeholder="$t('sensitiveWord.prompt.countryEnglish')"
              ></Input>
            </FormItem>
            <FormItem :label="$t('sensitiveWord.sensitiveWord')">
              <Input
                maxlength="50"
                v-model="searchForm.sensitiveWords"
                :placeholder="$t('sensitiveWord.prompt.sensitiveWord')"
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
<!--        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('sensitiveWord.addSensitiveWord')}}</Button>-->
        <sensitive-word-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></sensitive-word-modal>

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
  import { senstiveWordsInfo } from "@/api/operation-config"
  import sensitiveWordModal from "@/components/operation-config/sensitive-word-modal";
  export default {
    name: "sensitive-word",
    components:{
      sensitiveWordModal
    },
    data(){
      return{
        editModal: false,
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          status:null,
          countryCallingCode:null,
          nameInChinese: null,
          nameInEnglish: null,
          sensitiveWords: null
        },
        chooseItem:{
          id:null,
          countryCallingCode:null,
          nameInChinese:null,
          nameInEnglish: null,
          sensitiveWords: null,
          status: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t("sensitiveWord.countryChinese"),
            key: "nameInChinese",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("sensitiveWord.countryEnglish"),
            key: "nameInEnglish",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("sensitiveWord.internationalNumber"),
            key: "countryCallingCode",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("sensitiveWord.sensitiveWord"),
            key: "sensitiveWords",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("sensitiveWord.updater"),
            key: "updator",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("sensitiveWord.updateTime"),
            key: "modifyTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("sensitiveWord.state"),
            key: "status",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['status']!==null){
                let data=this.$t('sensitiveWord.status');
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
        this.searchForm.status = null;
        this.searchForm.countryCallingCode=null;
        this.searchForm.nameInChinese = null;
        this.searchForm.nameInEnglish = null;
        this.searchForm.sensitiveWords = null;
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
          status: this.searchForm.status,
          countryCallingCode: this.searchForm.countryCallingCode,
          nameInChinese: this.searchForm.nameInChinese,
          nameInEnglish: this.searchForm.nameInEnglish,
          sensitiveWords: this.searchForm.sensitiveWords

          // pageSize: this.pageSize,
          // currentPage: this.currentPage,
        };
        this.tableLoading = true;
        senstiveWordsInfo(params).then(res => {
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
        this.chooseItem.countryCallingCode  = params.row.countryCallingCode ;
        this.chooseItem.nameInChinese = params.row.nameInChinese;
        this.chooseItem.nameInEnglish = params.row.nameInEnglish;
        this.chooseItem.sensitiveWords  = params.row.sensitiveWords ;
        this.chooseItem.status = params.row.status!=null ? params.row.status : null;
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
