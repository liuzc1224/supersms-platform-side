<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('cardManagement.importTime')">
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
<!--            <FormItem :label="$t('cardManagement.msgType')">-->
<!--              <Select-->
<!--                clearable-->
<!--                style="min-width: 160px"-->
<!--                v-model="searchForm.status"-->
<!--                :placeholder="$t('cardManagement.prompt.msgType')"-->
<!--              >-->
<!--                <Option v-for="(item, i) in $t('cardManagement.type')" :value="item.value" :key="i">{{item.desc}}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
            <FormItem :label="$t('cardManagement.state')">
              <Select
                clearable
                style="min-width: 160px"
                v-model="searchForm.status"
                :placeholder="$t('cardManagement.prompt.state')"
              >
                <Option v-for="(item, i) in $t('cardManagement.status')" :value="item.value" :key="i">{{item.desc}}</Option>
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
        <Button type="primary" @click="importData">{{$t('cardManagement.import')}}</Button>
        <Button class="left" type="primary" @click="downTemplate">{{$t('cardManagement.down')}}</Button>
        <Button class="left" type="primary" @click="showModal">{{$t('cardManagement.add')}}</Button>
        <card-management-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></card-management-modal>
        <cardCheckModal
          :editModal="checkModal"
          :chooseItem="checkItem"
          v-on:changeModal="changeCheckModal"
          v-on:editSuccess="editSuccess"
        ></cardCheckModal>
        <import-modal
          class="admin-modal"
          :editModal="isImportModal"
          v-on:changeModal="changeImportModal"
          v-on:editSuccess="editSuccess">
        </import-modal>
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
import importModal from "@/components/operation-config/import-modal";
import cardManagementModal from "@/components/operation-config/card-management-modal";
import cardCheckModal from "@/components/operation-config/card-check-modal";
import {getCard,downloadCard,inquireCard} from "@/api/operation-config"
import { formatDate } from "@/assets/js/date";
    export default {
      name: "card-management",
      components:{
        importModal,
        cardManagementModal,
        cardCheckModal
      },
      data(){
        return{
          editModal: false,
          isImportModal: false,
          checkModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 0,
          currentPage: 1,
          searchForm: {
            createTimeStart:null,
            createTimeEnd:null,
            status:null
          },
          chooseItem:{
            id:null,
            cardNo:null,
            status :null
          },
          checkItem:{
            id:null,
            cardNo:null
          },
          tableData: [],
          columns: [
            {
              title: this.$t("cardManagement.cardNumber"),
              key: "cardNo",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("cardManagement.importTime"),
              key: "createTime",
              align: "center",
              minWidth:100,
              tooltip:true,
            },
            {
              title: this.$t("cardManagement.sendNumber"),
              key: "sendTotal",
              align: "center",
              minWidth:150,
              tooltip:true,
            },
            {
              title: this.$t("cardManagement.sendFailureNumber"),
              key: "sendFail",
              align: "center",
              minWidth:150,
              tooltip:true,
            },
            {
              title: this.$t("cardManagement.state"),
              key: "status",
              align: "center",
              minWidth:100,
              tooltip:true,
              render: (h, params) => {
                if (params.row['status'] != null) {
                  let data=this.$t('cardManagement.status');
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
                      type: 'text', size: 'large'
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
                  h('Button', {
                    props: {
                      type: 'text', size: 'large'
                    },
                    class: 'edit-btn',
                    style: {
                      color: "#ff9900",
                      marginRight: '5px',
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.modelCheckItem(params);
                        this.checkModal=true;
                      }
                    }
                  }, this.$t('cardManagement.check'))
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
            createTimeStart: this.searchForm.createTimeStart,
            createTimeEnd: this.searchForm.createTimeEnd,
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
          this.tableLoading = true;
          getCard(params).then(res => {
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
          this.searchForm.status = null;
          this.searchForm.createTimeStart=null;
          this.searchForm.createTimeEnd = null;
          this.getTable();
        },
        downTemplate(){
          let data={
            name : this.$t('cardManagement.template')
          };
          downloadCard(data);
        },
        importData(){
          this.isImportModal=true;
        },
        showModal () {
          this.editModal = true;
          this.modelItem({'row': {}});
        },
        changeModal(param) {
          this.editModal = param;
          this.modelItem({'row': {}});
        },
        changeCheckModal(param) {
          this.checkModal = param;
          this.modelItem({'row': {}});
        },
        modelItem(params){
          this.chooseItem.id = params.row.id;
          this.chooseItem.cardNo = params.row.cardNo;
          this.chooseItem.status = params.row.status;
        },
        modelCheckItem(params){
          this.checkItem.id = params.row.id;
          this.checkItem.cardNo = params.row.cardNo;
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
        changeImportModal(param){
          this.isImportModal = param;
          this.getTable()
        }
      }
    }
</script>

<style scoped>
.left{
  margin-left: 20px;
}
</style>
