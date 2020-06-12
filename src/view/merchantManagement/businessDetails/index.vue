<template>
  <div class="demo-tabs-style2">
    <Tabs type="card" value="businessDetails">
      <TabPane :label="$t('businessDetails.title')" name="businessDetails">
        <business-details></business-details>
      </TabPane>
      <TabPane :label="$t('rechargeRecord.title')" name="rechargeRecord">
        <recharge-record></recharge-record>
      </TabPane>
      <TabPane :label="$t('expensesRecord.title')" name="expensesRecord">
        <expenses-record></expenses-record>
      </TabPane>
      <TabPane :label="$t('auditRecord.title')" name="auditRecord">
        <audit-record></audit-record>
      </TabPane>
    </Tabs>
  </div>

</template>

<script>
  import businessDetails  from './business-details'
  import rechargeRecord  from './recharge-record'
  import expensesRecord  from './expenses-record'
  import auditRecord  from './audit-record'
  export default {
    name: "index",
    components:{
      businessDetails,
      rechargeRecord,
      expensesRecord,
      auditRecord
    }
  }
</script>

<style>
  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
  }
  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
  }
  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
