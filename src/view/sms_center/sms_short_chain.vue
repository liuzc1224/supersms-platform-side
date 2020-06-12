<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" inline>
          <Row>
            <FormItem :label="$t('smsCenter.smsShortChain.link')">
              <Input
                v-model="searchForm.longLink"
                :placeholder="$t('smsCenter.smsShortChain.prompt.link')"
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
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('smsCenter.smsShortChain.add')}}</Button>
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
        <sms-short-chain-modal
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
        ></sms-short-chain-modal>
      </Card>
    </i-col>
  </Row>
</template>

<script>
  import { shortLink } from '@/api/sms_center'
import smsShortChainModal from '@/components/sms_center/sms_short_chain_modal.vue'
    export default {
      name: "sms_short_chain",
      components:{
        smsShortChainModal
      },
      data(){
          return{
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
              longLink: null
            },
            chooseItem: {
              longLink: null,
              id: null
            },
            tableData: [],
            columns: [
              {
                title: this.$t('smsCenter.smsShortChain.link'),
                key: 'longLink',
                minWidth:100,
                align: 'center',
                tooltip:true,
              },
              {
                title: this.$t('smsCenter.smsShortChain.shortLink'),
                key: 'shortLink',
                align: 'center',
                minWidth:100,
                tooltip:true,
              },
              {
                title: this.$t('smsCenter.smsShortChain.createTime'),
                key: 'createTime',
                minWidth:100,
                align: 'center',
                tooltip:true,
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
                        type: 'text', size: 'default'
                      },
                      class: 'edit-btn',
                      style: {
                        color: '#57a3f3',
                        backgroundColor: 'transparent'
                      },
                      on: {
                        click: () => {
                          this.copy(params.row.longLink);
                        }
                      }
                    }, this.$t('smsCenter.smsShortChain.copyLink')),
                    h('Button', {
                      props: {
                        type: 'text', size: 'default'
                      },
                      class: 'edit-btn',
                      style: {
                        color: '#2b85e4',
                        backgroundColor: 'transparent'
                      },
                      on: {
                        click: () => {
                          this.copy(params.row.shortLink);
                        }
                      }
                    }, this.$t('smsCenter.smsShortChain.copyShortLink'))
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
        search () {
          this.currentPage=1;
          this.getTable()
        },
        cleanSearch () {
          this.currentPage=1;
          this.searchForm.longLink = null;
          this.getTable()
        },
        showModal () {
          this.editModal = true;
          this.modelItem({ 'row': {} })
        },
        changeModal (param) {
          this.editModal = param;
          this.modelItem({ 'row': {} });
          this.tableLoading = true;
          this.getTable();
        },
        getTable () {
          let params = {
            longLink: this.searchForm.longLink,
            pageSize: this.pageSize,
            currentPage: this.currentPage
          };
          this.tableLoading =true;
          shortLink(params).then(res => {
            this.tableLoading = false;
            if (res.data.success) {
              if (res.data.data && res.data.data.length !== 0) {
                this.tableData = res.data.data;
                this.currentPage = res.data.page.currentPage;
                this.pageSize = res.data.page.pageSize;
                this.totalNumber = res.data.page.totalNumber;
              } else {
                this.tableData = [];
                this.currentPage = 1;
                this.pageSize = 10;
                this.totalNumber = 0;
              }
            } else {
              this.$Message.error(res.data.message)
            }
          })
        },
        modelItem (params) {
          this.chooseItem.id = params.row.id;
          this.chooseItem.longLink = params.row.longLink;
        },
        copy(data){
          const input = document.createElement('input');
          document.body.appendChild(input);
          input.setAttribute('value', data);
          input.select();
          if (document.execCommand('copy')) {
            document.execCommand('copy');
            this.$Message.success(this.$t('common.copySuccess'));
          } else {
            this.$Message.error(this.$t('common.copyError'));
          }
          document.body.removeChild(input);
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
