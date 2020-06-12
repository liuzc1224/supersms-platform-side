<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" inline>
          <Row>
            <FormItem :label="$t('smsCenter.addressBook.sendFailure')">
              <Input
                v-model="searchForm.failSendCount"
                :placeholder="$t('smsCenter.addressBook.prompt.sendFailure')"
                maxlength="20"
              ></Input>
            </FormItem>
            <FormItem :label="$t('smsCenter.addressBook.phone')">
              <Input
                v-model="searchForm.phoneNumber"
                :placeholder="$t('smsCenter.addressBook.prompt.phone')"
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
import { sendStatistics } from '@/api/sms_center'
export default {
  name: 'address_book',
  data () {
    return {
      tableLoading: false,
      pageSize: 10,
      totalNumber: 0,
      currentPage: 1,
      searchForm: {
        failSendCount: null,
        phoneNumber: null
      },
      tableData: [],
      columns: [
        {
          title: this.$t('smsCenter.addressBook.phone'),
          key: 'phoneNumber',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.addressBook.sendNumber'),
          key: 'totalSendCount',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.addressBook.sendSuccessNumber'),
          key: 'successSendCount',
          align: 'center',
          minWidth:100,
          tooltip:true,
        },
        {
          title: this.$t('smsCenter.addressBook.sendFailureNumber'),
          key: 'failSendCount',
          align: 'center',
          minWidth:100,
          tooltip:true,
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
      this.searchForm.failSendCount = null
      this.searchForm.phoneNumber = null
      this.getTable()
    },
    getTable () {
      let params = {
        failSendCount: this.searchForm.failSendCount,
        phoneNumber: this.searchForm.phoneNumber,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      sendStatistics(params).then(res => {
        this.tableLoading = false
        if (res.data.success) {
          if (res.data.data && res.data.data.length !== 0) {
            this.tableData = res.data.data
            this.currentPage = res.data.page.currentPage
            this.pageSize = res.data.page.pageSize
            this.totalNumber = res.data.page.totalNumber
          } else {
            this.tableData=[];
            this.currentPage = 1
            this.pageSize = 10
            this.totalNumber = 0
          }
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
    }
  }
}
</script>

<style scoped>

</style>
