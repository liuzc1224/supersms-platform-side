<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('rechargeCenter.currentOffer.internationalNumber')">
              <Input
                v-model="searchForm.countryCallingCode"
                :placeholder="$t('rechargeCenter.currentOffer.prompt.internationalNumber')"
                maxlength="20"
              ></Input>
            </FormItem>
            <FormItem :label="$t('rechargeCenter.currentOffer.countryChinese')">
              <Input
                v-model="searchForm.nameInChinese"
                :placeholder="$t('rechargeCenter.currentOffer.prompt.countryChinese')"
                maxlength="20"
              ></Input>
            </FormItem>
            <FormItem :label="$t('rechargeCenter.currentOffer.countryEnglish')">
              <Input
                v-model="searchForm.nameInEnglish"
                :placeholder="$t('rechargeCenter.currentOffer.prompt.countryEnglish')"
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
  import { formatDate } from '../../assets/js/date'
  import { currentPriceInfo } from '@/api/recharge_center'
  export default {
    name: 'current-offer',
    data () {
      return {
        tableLoading: false,
        pageSize: 10,
        totalNumber: 0,
        currentPage: 1,
        searchForm: {
          countryCallingCode: null,
          nameInChinese: null,
          nameInEnglish: null
        },
        tableData: [],
        columns: [
          {
            title: this.$t('rechargeCenter.currentOffer.countryChinese'),
            key: 'nameInChinese',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.currentOffer.countryEnglish'),
            key: 'nameInEnglish',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.currentOffer.internationalNumber'),
            key: 'countryCallingCode',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.currentOffer.SingleRMB'),
            key: 'priceSingleRmb',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              if (params.row['priceSingleRmb'] != null) {
                return h('div', params.row['priceSingleRmb'].toFixed(3))
              }
            }
          },
          {
            title: this.$t('rechargeCenter.currentOffer.SingleUS'),
            key: 'priceSingleDollar',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              if (params.row['priceSingleDollar'] != null) {
                return h('div', params.row['priceSingleDollar'].toFixed(3))
              }
            }
          },
          {
            title: this.$t('rechargeCenter.currentOffer.creditLimit'),
            key: 'lineOfCredit',
            align: 'center',
            minWidth:100,
            tooltip:true,
            render: (h, params) => {
              if (params.row['lineOfCredit'] != null) {
                return h('div', params.row['lineOfCredit'].toFixed(3))
              }
            }
          },
          {
            title: this.$t('rechargeCenter.currentOffer.singleCharacter'),
            key: 'numberPerCharacter',
            align: 'center',
            minWidth:100,
          },
          {
            title: this.$t('rechargeCenter.currentOffer.MaxCharacter'),
            key: 'maxCharacterEverytime',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: this.$t('rechargeCenter.currentOffer.state'),
            key: 'status',
            minWidth:100,
            align: 'center',
            tooltip:true,
            render: (h, params) => {
              let type = this.$t('rechargeCenter.currentOffer.status')
              if (params.row.status != null) {
                let name = type.filter(item => {
                  return item.value === params.row.status
                })
                return h('div', name && name[0]['desc'] ? name[0]['desc'] : '')
              }
            }
          }
        ]
      }
    },
    mounted: function () {
      this.getTable();
    },
    methods: {
      search () {
        this.currentPage=1;
        this.getTable()
      },
      cleanSearch () {
        this.currentPage=1;
        this.searchForm.countryCallingCode = null;
        this.searchForm.nameInChinese = null;
        this.searchForm.nameInEnglish = null;
        this.getTable()
      },
      getTable () {
        let userInfo=JSON.parse(sessionStorage.getItem("loginInfo"));
        let params = {
          countryCallingCode: this.searchForm.countryCallingCode,
          nameInChinese: this.searchForm.nameInChinese,
          nameInEnglish: this.searchForm.nameInEnglish,
          userId : userInfo['id'],

          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
        this.tableLoading = true;
        currentPriceInfo(params).then(res => {
          this.tableLoading = false;
          if (res.data.success) {
            if (res.data.data && res.data.data.length !== 0) {
              this.tableData = res.data.data;
              this.currentPage = res.data.page.currentPage;
              this.pageSize = res.data.page.pageSize;
              this.totalNumber = res.data.page.totalNumber
            } else {
              this.tableData = [];
              this.currentPage = 1;
              this.pageSize = 10;
              this.totalNumber = 0
            }
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      changePage (params) {
        this.currentPage = params;
        this.getTable()
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
