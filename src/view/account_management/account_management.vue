<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('accountManagement.createTime')">
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
            <FormItem :label="$t('accountManagement.accountName')">
              <Input
                v-model="searchForm.accountNo"
                :placeholder="$t('accountManagement.prompt.accountName')"
                maxlength="20"
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
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('accountManagement.add')}}</Button>
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
        <account-management-modal
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></account-management-modal>
        <Modal v-model="deleteModal" :loading="deleteLoading" @on-ok="deleteMessage" width="300">
          <p slot="header" style="color:#f60;text-align:left">
            <Icon type="ios-information-circle"></Icon>
            <span>{{$t('common.deleteTitle')}}</span>
          </p>
          <p style="text-align: left">{{$t('common.deleteTip')}}</p>
        </Modal>
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { formatDate } from '../../assets/js/date'
  import accountManagementModal from '@/components/account_management/account_management_modal.vue'
  import { deleteAccount,getAccount } from '@/api/account_management'
  export default {
    name: 'account_management',
    components:{
      accountManagementModal
    },
    data () {
      return {
        editModal: false,
        deleteModal:false,
        deleteLoading:false,
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        chooseItem: {
          id: null,
          accountNo: null,
          password: null,
          status: null
        },
        searchForm: {
          createTimeStart: null,
          createTimeEnd: null,

          accountNo: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t('accountManagement.accountName'),
            key: 'accountNo',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          // {
          //   title: this.$t('accountManagement.password'),
          //   key: 'consumerId',
          //   align: 'center',
          // },
          {
            title: this.$t('accountManagement.company'),
            key: 'companyName',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('accountManagement.accountType'),
            key: 'isMain',
            minWidth:100,
            align: 'center',
            tooltip:true,
            render:(h,params)=>{
              if(params.row['isMain']!==null){
                let data=this.$t('accountManagement.accountTypes');
                let type=data.filter(v => {
                  return v.value===params.row['isMain'];
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }

            }
          },
          {
            title: this.$t('accountManagement.state'),
            key: 'status',
            minWidth:100,
            tooltip:true,
            align: 'center',
            render: (h, params) => {
              if (params.row.status != null) {
                let type = this.$t('accountManagement.status');
                if (params.row.status != null) {
                  let name = type.filter(item => {
                    return item.value === params.row.status
                  });
                  return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
                }
              }
            }
          },
          {
            title: this.$t('common.operating'),
            key: 'action',
            minWidth: 220,
            align: 'center',
            render: (h, params) => {
              let str;
              if(params.row['status']===1 || params.row['status']===2){
                if(!params.row['isMain']){
                //   str=[
                //     h('Button', {
                //       props: {
                //         type: 'text', size: 'default', icon: 'md-menu'
                //       },
                //       class: 'edit-btn',
                //       style: {
                //         color: '#57a3f3',
                //         backgroundColor: 'transparent'
                //       },
                //       on: {
                //         click: () => {
                //           this.editMessage(params)
                //         }
                //       }
                //     }, this.$t('common.edit')),
                //   ]
                // }else{
                  str=[
                    h('Button', {
                      props: {
                        type: 'text', size: 'default', icon: 'md-menu'
                      },
                      class: 'edit-btn',
                      style: {
                        color: '#57a3f3',
                        backgroundColor: 'transparent'
                      },
                      on: {
                        click: () => {
                          this.editMessage(params)
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
                          sessionStorage.setItem("deleteID",params.row.id)
                          this.deleteModal=true;
                        }
                      }
                    }, this.$t('common.delete'))
                  ]
                }
              }
              return h('div', str);
            }
          }
        ]
      }
    },
    mounted: function () {
      this.getTable()
    },
    methods: {
      search () {
        this.currentPage=1;
        this.getTable()
      },
      cleanSearch () {
        this.currentPage=1;
        this.searchForm.createTimeStart = null;
        this.searchForm.createTimeEnd = null;
        this.searchForm.accountNo = null;
        this.getTable();
      },
      getTable () {
        let params = {
          createTimeStart: this.searchForm.createTimeStart,
          createTimeEnd: this.searchForm.createTimeEnd,
          accountNo: this.searchForm.accountNo,

          // pageSize: this.pageSize,
          // currentPage: this.currentPage
        };
        if (params.createTimeStart && params.createTimeEnd) {
          params.createTimeEnd = formatDate(new Date(params.createTimeEnd), 'yyyy-MM-dd') + ' 23:59:59'
          params.createTimeStart = formatDate(new Date(params.createTimeStart), 'yyyy-MM-dd') + ' 00:00:00'
          let start = (new Date(params.createTimeStart)).getTime()
          let end = (new Date(params.createTimeEnd)).getTime()
          if (start - end > 0) {
            params.createTimeStart = null
            params.createTimeEnd = null
          }
        }else{
          params.createTimeStart=null;
          params.createTimeEnd = null
        }
        this.tableLoading = true;
        getAccount(params).then(res => {
          this.tableLoading = false;
          if (res.data.success) {
            if (res.data.data && res.data.data.length !== 0) {
              this.tableData = res.data.data.filter(v=>{
                return v.status!==9;
              });
              // this.currentPage = res.data.page.currentPage;
              // this.pageSize = res.data.page.pageSize;
              // this.totalNumber = res.data.page.totalNumber
            } else {
              this.tableData = [];
              // this.currentPage = 1;
              // this.pageSize = 10;
              // this.totalNumber = 0
            }
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      deleteMessage(){
        this.deleteLoading=true;
        let data={
          id : sessionStorage.getItem("deleteID")
        };
        deleteAccount(data).then(res => {
          this.deleteLoading = false;
          if (res.data.success) {
            this.$Message.success(this.$t('common.deleteSuccess'));
            this.getTable();
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      changePage (params) {
        this.currentPage = params
        this.getTable()
      },
      pageSizeChange (params) {
        this.pageSize = params
        this.getTable()
      },
      showModal () {
        this.editModal = true
        this.modelItem({ 'row': {} })
      },
      changeModal (param) {
        this.editModal = param;
        this.modelItem({ 'row': {} })
      },
      modelItem (params) {
        this.chooseItem.id = params.row.id;
        this.chooseItem.accountNo = params.row.accountNo;
        this.chooseItem.password = null;
        this.chooseItem.status = params.row.status;
      },
      editMessage (params) {
        this.modelItem(params);
        this.editModal = true
      },
      editSuccess (param) {
        this.tableLoading = true;
        this.getTable()
      },
    }
  }
</script>

<style scoped>

</style>
