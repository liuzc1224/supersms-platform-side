<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('merchantAnnouncement.releaseTime')">
              <Row>
                <i-col span="11">
                  <DatePicker
                    type="date"
                    ref="startTime"
                    :placeholder="$t('common.timeStart')"
                    v-model="searchForm.sendTimeStart"
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
                    v-model="searchForm.sendTimeEnd"
                  ></DatePicker>
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
        <merchant-announcement-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          :disabledHours="disabledHours"
          :disabledMinutes="disabledMinutes"
          :readonlyType="readonlyType"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></merchant-announcement-modal>
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('merchantAnnouncement.add')}}</Button>
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
      <Modal v-model="deleteModal" :loading="deleteLoading" @on-ok="deleteMessage" width="300">
        <p slot="header" style="color:#f60;text-align:left">
          <Icon type="ios-information-circle"></Icon>
          <span>{{$t('common.deleteTitle')}}</span>
        </p>
        <p style="text-align: left">{{$t('common.deleteTip')}}</p>
      </Modal>
    </i-col>
  </Row>
</template>

<script>
  import { queryBusinessNotice,updateBusinessNotice } from "@/api/notification"
  import merchantAnnouncementModal from "@/components/notification/merchant-announcement-modal";
  import { formatDate } from "@/assets/js/date";
  export default {
    name: "merchantAnnouncement",
    components:{
      merchantAnnouncementModal
    },
    data(){
      return{
        readonlyType:null,
        editModal: false,
        deleteModal: false,
        deleteLoading: false,
        tableLoading: false,
        pageSize: 10,
        disabledHours:[],
        disabledMinutes:[],
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          sendTimeStart:null,
          sendTimeEnd: null
        },
        chooseItem:{
          id:null,
          title:null,
          content:null,
          sendTime:null,
          dateTime:null
        },
        tableData: [],
        columns: [
          {
            title: this.$t("merchantAnnouncement.id"),
            key: "id",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("merchantAnnouncement.theme"),
            key: "title",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("merchantAnnouncement.releaseTime"),
            key: "sendTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("merchantAnnouncement.createTime"),
            key: "createTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("merchantAnnouncement.updater"),
            key: "modifier",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("merchantAnnouncement.updateTime"),
            key: "modifyTime",
            align: "center",
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t("merchantAnnouncement.state"),
            key: "sendStatus",
            align: "center",
            minWidth:100,
            render:(h,params)=>{
              if(params.row['sendStatus']!==null){
                let data=this.$t('merchantAnnouncement.status');
                let type=data.filter(v => {
                  return v.value===params.row['sendStatus'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }

            }
          },
          {
            title: this.$t("common.operating"),
            key: "action",
            minWidth: 190,
            align: "center",
            render: (h, params) => {
              let str;
              if(params.row['sendStatus']===1){
                str=[
                  h('Button', {
                    props: {
                      type: 'text', size: 'default', icon: 'md-menu'
                    },
                    class: 'edit-btn',
                    style: {
                      color: "#57a3f3",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.modelItem(params);
                        this.readonlyType=null;
                        this.editModal=true;
                      }
                    }
                  }, this.$t('common.edit')),
                  h('Button', {
                    props: {
                      type: 'text', size: 'default', icon: 'md-trash'
                    },
                    class: 'edit-btn',
                    style: {
                      color: '#ed4014',
                      backgroundColor: 'transparent'
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem('deleteId',params.row.id);
                        this.deleteModal=true;
                      }
                    }
                  }, this.$t('common.delete'))
                ]
              }
              if(params.row['sendStatus']===2){
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
                        this.modelItem(params);
                        this.readonlyType='readonly';
                        this.editModal=true;

                      }
                    }
                  }, this.$t('merchantAnnouncement.info'))
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
        this.searchForm.sendTimeStart = null;
        this.searchForm.sendTimeEnd=null;
        this.getTable();
      },
      showModal () {
        this.readonlyType=null;
        this.editModal = true;
        this.modelItem({'row': {}});
      },
      deleteMessage(){
        this.deleteLoading=true;
        let data={
          id : sessionStorage.getItem("deleteId"),
          status : 0
        };
        updateBusinessNotice(data).then(res => {
          this.deleteLoading = false;
          if (res.data.success) {
            this.$Message.success(this.$t('common.deleteSuccess'));
            this.getTable();
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      changeModal(param) {
        this.editModal = param;
        this.modelItem({'row': {}});
      },
      getTable(){
        let params = {
          sendTimeStart: this.searchForm.sendTimeStart ? this.searchForm.sendTimeStart : null,
          sendTimeEnd: this.searchForm.sendTimeEnd ? this.searchForm.sendTimeEnd : null,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        if (params.sendTimeStart && params.sendTimeEnd) {
          params.sendTimeStart = formatDate(new Date(params.sendTimeStart), 'yyyy-MM-dd') + ' 00:00:00';
          params.sendTimeEnd = formatDate(new Date(params.sendTimeEnd), 'yyyy-MM-dd') + ' 23:59:59';
          let start = (new Date(params.sendTimeStart)).getTime();
          let end = (new Date(params.sendTimeEnd)).getTime();
          if (start - end > 0) {
            params.sendTimeStart = null;
            params.sendTimeEnd = null
          }
        }else{
          params.sendTimeStart=null;
          params.sendTimeEnd = null
        }
        this.tableLoading =  true ;
        queryBusinessNotice(params).then(res => {
          this.tableLoading = false;
          if(res.data.success){
            if( res.data.data && res.data.data.length !==0 ){
              this.tableData = res.data.data.filter(v=>{
                return v['status']===1;
              });
              this.currentPage = res.data.page.currentPage;
              this.pageSize = res.data.page.pageSize;
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
        this.chooseItem.title = params.row.title;
        this.chooseItem.content = params.row.content;
        this.chooseItem.sendTime = params.row.sendTime;
        this.chooseItem.dateTime = params.row.sendTime ? formatDate(new Date(params.row.sendTime),'hh:mm') : null;
        let hours=new Date(sessionStorage.getItem("dateTime")).getHours();
        if(hours>0){
          for(let i=0;i<hours;i++) {
            this.disabledHours.push(i);
          }
        }
        let minutes=new Date(sessionStorage.getItem("dateTime")).getMinutes();
        if(minutes>0){
          for(let i=0;i<=minutes;i++) {
            this.disabledMinutes.push(i);
          }
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
