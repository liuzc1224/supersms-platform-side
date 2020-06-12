<template>
  <Modal v-model="showModal" :title="$t('userInfo.message')"
         :mask-closable="false">
    <div slot="close">
      <Icon @click="cancelSubmit()" type="ios-close"/>
    </div>
    <div class="demo-spin-container" style="height: 400px;overflow-y: scroll;padding: 10px">
      <Spin fix v-if="spinShow"></Spin>
      <Card v-for="item in tableData" :key="item['id']" style="margin-bottom: 10px">
        <div v-if="item['status']===0" @click="updateState(item)" style="width: 100%">
          <Badge text="new">
            <p style="width: 100%">{{item['title'] ? item['title'] : ''}}<span style="padding-left: 20px">{{item['createTime'] ? item['createTime'] : ''}}</span></p>
            <p>{{item['text'] ? item['text'] : ''}}</p>
          </Badge>
        </div>
        <div v-else>
          <p style="width: 100%">{{item['title'] ? item['title'] : ''}}<span style="padding-left: 20px">{{item['createTime'] ? item['createTime'] : ''}}</span></p>
          <p>{{item['text'] ? item['text'] : ''}}</p>
        </div>
      </Card>
      <div v-if="tableData.length===0 && !spinShow" style="font-size: 30px;line-height: 400px;text-align: center">
          {{$t('msg.none')}}
      </div>
    </div>
    <div slot="footer">
      <Button size="large" :disabled="tableData.length===0" :loading="deleteLoading" @click="deleteAll()">{{$t('msg.delete')}}</Button>
      <Button size="large" :disabled="tableData.length===0" :loading="editLoading" @click="editAll()">{{$t('msg.editAll')}}</Button>
      <Button type="primary" size="large" @click="cancelSubmit()">{{$t('msg.close')}}</Button>
    </div>
<!--    <Spin size="large" fix v-if="spinShow"></Spin>-->
  </Modal>
</template>

<script>
  import { getNews,alreadyreadPost,alreadyreadDelete} from '@/api/user'
  import { mapActions } from 'vuex'
    export default {
      name: "msgNews",
      props: ['editModal'],
      data(){
          return{
            spinShow:false,
            tableData:[],
            deleteLoading:false,
            editLoading:false
          }
      },
      mounted(){
        // this.getData();
      },
      methods:{
        ...mapActions([
          'setMessageCount'
        ]),
        getData(){
          this.spinShow=true;
          getNews().then(res => {
            this.spinShow=false;
            if (res.data.success) {
              if (res.data.data && res.data.data.length !== 0) {
                this.tableData = res.data.data;
              } else {
                this.tableData = [];
              }
            } else {
              this.$Message.error(res.data.message)
            }
          })
        },
        deleteAll(){
          this.deleteLoading=true;
          this.spinShow=true;
          alreadyreadDelete().then(res => {
            this.deleteLoading=false;
            this.spinShow=false;
            if (res.data.success) {
              this.$Message.success(this.$t('common.deleteSuccess'));
              this.getData();
            } else {
              this.$Message.error(res.data.message)
            }
          })
        },
        editAll(){
          this.editLoading=true;
          this.spinShow=true;
          let data={
            type:1
          };
          alreadyreadPost(data).then(res => {
            this.editLoading=false;
            this.spinShow=false;
            if (res.data.success) {
              this.$Message.success(this.$t('common.markSuccess'));
              this.setMessageCount(0);
              this.getData();
            } else {
              this.$Message.error(res.data.message)
            }
          })
        },
        updateState(data){
          if(data['status']===0){
            let postData={
              newsId:data['id'],
              type:0
            };
            alreadyreadPost(postData).then(res => {
              if (res.data.success) {
                this.getData();
              } else {
                this.$Message.error(res.data.message)
              }
            })
          }

        },
        cancelSubmit() {
          this.$emit('changeMsgNewsModal', false);
        }
      },
      computed: {
        showModal: {
          get: function () {
            return this.editModal
          },
          set: function () {
          }
        }
      }
    }
</script>

<style scoped>
  .demo-spin-container{
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
</style>
