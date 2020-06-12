<template>
  <Card>
    <Row>
      <i-col span="24">
        <table>
          <tr>
            <td>
              {{$t('businessDetails.table.state')}}
            </td>
            <td>
              {{ tableData && tableData['status']!=null ? $t('businessDetails.status')[tableData['status']] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.businessNo')}}
            </td>
            <td>
              {{ tableData && tableData['businessNo']!=null ? tableData['businessNo'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.mainUserId')}}
            </td>
            <td>
<!--              <span v-if="tableData && tableData['isMain']  && tableData['isMain']===0">-->
                {{ tableData && tableData['accountNo']!=null ? tableData['accountNo'] : ''}}
<!--              </span>-->
<!--              <span v-if="tableData && tableData['isMain']  && tableData['isMain']===1">-->
<!--                {{ tableData && tableData['businessNo']!=null ? tableData['businessNo'] : ''}}-->
<!--              </span>-->
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.companyName')}}
            </td>
            <td>
              {{ tableData && tableData['companyName']!=null ? tableData['companyName'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.businessArea')}}
            </td>
            <td>
              {{ tableData && tableData['businessArea']!=null ? $t('businessDetails.operatingAreas')[tableData['businessArea']] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.email')}}
            </td>
            <td>
              {{ tableData && tableData['email']!=null ? tableData['email'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.contact')}}
            </td>
            <td>
              {{ tableData && tableData['contact']!=null ? tableData['contact'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.contactPhoneNumber')}}
            </td>
            <td>
              {{ tableData && tableData['contactPhoneNumber']!=null ? tableData['contactPhoneNumber'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.balance')}}
            </td>
            <td>
              {{ tableData && tableData['balance']!=null ? tableData['balance'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.rmb')}}
            </td>
            <td>
              {{ tableData && tableData['priceSingleRmb']!=null ? tableData['priceSingleRmb'] : ''}}
            </td>
          </tr>
          <tr>
            <td>
              {{$t('businessDetails.table.us')}}
            </td>
            <td>
              {{ tableData && tableData['priceSingleDollar']!=null ? tableData['priceSingleDollar'] : ''}}
            </td>
          </tr>
        </table>
      </i-col>
    </Row>
  </Card>

</template>

<script>
  import { merchantInfo } from "@/api/merchantManagement"
    export default {
      name: "business-details",
      data(){
        return{
          tableData:{},
        }
      },
      mounted() {
        this.getTable();
      },
      methods:{
        getTable(){
          let data={
            id:this.$route.query.userId
          };
          merchantInfo(data).then(res => {
            this.loading=false;
            if (res.data.success) {
              this.tableData=res.data.data;
              console.log(res.data);
            } else {
              this.$Message.error(res.data.message)
            }
          })
        }
      },
      watch: {
        $route: {
          handler: function(val, oldVal){
            this.getTable();
          },
          // 深度观察监听
          deep: true
        }
      }
    }
</script>

<style scoped>
  table,tr{
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  td{
    width: 50%;
    border: 1px solid #c3c3c3;
    height: 40px;
  }
</style>
