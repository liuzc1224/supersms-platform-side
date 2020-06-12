<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" inline>
          <Row>
            <FormItem :label="$t('smsCenter.smsContentTemplate.theme')">
              <Input
                v-model="searchForm.subject"
                :placeholder="$t('smsCenter.smsContentTemplate.prompt.theme')"
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
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('smsCenter.smsContentTemplate.add')}}</Button>
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
        <sms-content-template
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
          :maxCharacterEverytime="maxCharacterEverytime"
          :numberPerCharacter="numberPerCharacter"
        ></sms-content-template>
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
import { queryMsgTemplate,deleteMsgTemplate } from '@/api/sms_center'
import smsContentTemplate from '@/components/sms_center/sms_content_template.vue'
import { currentPriceInfo } from '@/api/recharge_center'
export default {
  name: 'sms_content_template',
  components: {
    smsContentTemplate
  },
  data () {
    return {
      deleteModal:false,
      deleteLoading:false,
      editModal: false,
      tableLoading: false,
      pageSize: 10,
      maxCharacterEverytime:null,
      numberPerCharacter:null,
      totalNumber: 0,
      currentPage: 1,
      searchForm: {
        subject: null
      },
      chooseItem: {
        subject: null,
        content: null,
        status: null,
        id: null
      },
      tableData: [],
      columns: [
        {
          title: this.$t('smsCenter.smsContentTemplate.id'),
          key: 'id',
          minWidth:100,
          align: 'center',
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.smsContentTemplate.theme'),
          key: 'subject',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.smsContentTemplate.content'),
          key: 'content',
          minWidth:100,
          align: 'center',
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.smsContentTemplate.createTime'),
          key: 'createTime',
          minWidth:100,
          align: 'center',
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.smsContentTemplate.state'),
          key: 'status',
          minWidth:100,
          tooltip:true,
          align: 'center',
          render: (h, params) => {
            let type = this.$t('smsCenter.smsContentTemplate.status')
            if (params.row.status != null) {
              let name = type.filter(item => {
                return item.value === params.row.status
              })
              return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
            }
          }
        },
        {
          title: this.$t('common.operating'),
          key: 'action',
          minWidth: 230,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    this.deleteModal=true;
                    sessionStorage.setItem("deleteID",params.row.id)
                  }
                }
              }, this.$t('common.delete'))
            ])
          }
        }
      ]
    }
  },
  mounted: function () {
    this.getTable()
  },
  methods: {
    deleteMessage(){
      this.deleteLoading=true;
      let data={
        id : sessionStorage.getItem("deleteID")
      };
      deleteMsgTemplate(data).then(res => {
        this.deleteLoading = false;
        if (res.data.success) {
          this.$Message.success(this.$t('common.deleteSuccess'));
          this.getTable();
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    search () {
      this.currentPage=1;
      this.getTable()
    },
    cleanSearch () {
      this.currentPage=1;
      this.searchForm.subject = null
      this.getTable()
    },
    showModal () {
      let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
      let data={
        userId : userInfo['id']
      };
      currentPriceInfo(data).then(res => {
        if (res.data.success) {
          this.maxCharacterEverytime =res.data.data && res.data.data[0] && res.data.data[0]['maxCharacterEverytime'] ? res.data.data[0]['maxCharacterEverytime'] : 500;
          this.numberPerCharacter =res.data.data && res.data.data[0] && res.data.data[0]['numberPerCharacter'] ? res.data.data[0]['numberPerCharacter'] : 60;
          this.editModal = true;
          this.modelItem({ 'row': {} })
        } else {
          this.$Message.error(res.data.message)
        }
      });
    },
    changeModal (param) {
      this.editModal = param
      this.modelItem({ 'row': {} })
    },
    getTable () {
      let params = {
        subject: this.searchForm.subject,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      queryMsgTemplate(params).then(res => {
        this.tableLoading = false
        if (res.data.success) {
          if (res.data.data && res.data.data.length !== 0) {
            this.tableData = res.data.data
            this.currentPage = res.data.page.currentPage
            this.pageSize = res.data.page.pageSize
            this.totalNumber = res.data.page.totalNumber
          } else {
            this.tableData = [];
            this.currentPage = 1
            this.pageSize = 10
            this.totalNumber = 0
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    modelItem (params) {
      this.chooseItem.id = params.row.id
      this.chooseItem.content = params.row.content
      this.chooseItem.subject = params.row.subject
      this.chooseItem.status = params.row.status
    },
    editMessage (params) {
      let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
      let data={
        userId : userInfo['id']
      };
      currentPriceInfo(data).then(res => {
        if (res.data.success) {
          this.maxCharacterEverytime =res.data.data && res.data.data[0] && res.data.data[0]['maxCharacterEverytime'] ? res.data.data[0]['maxCharacterEverytime'] : 500;
          this.numberPerCharacter =res.data.data && res.data.data[0] && res.data.data[0]['numberPerCharacter'] ? res.data.data[0]['numberPerCharacter'] : 60;
          this.modelItem(params);
          this.editModal = true
        } else {
          this.$Message.error(res.data.message)
        }
      });
    },
    editSuccess (param) {
      this.tableLoading = true
      this.getTable()
    },
    changePage (params) {
      this.currentPage = params
      this.getTable()
    },
    pageSizeChange (params) {
      this.pageSize = params
      this.getTable()
    }
  }
}
</script>

<style scoped>

</style>
