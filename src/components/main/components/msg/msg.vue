<template>
  <div style="width: 25px;height: 25px;">
    <Badge :dot="!!messageUnreadCount" style="position: absolute;top:50px;width: 28px;height: 28px;">
      <img src="../../../../assets/images/xiaoxi.png" width="100%"  alt="" style="position: relative;top:-10px" @click="messageData"/>
    </Badge>
    <msg-news
      ref="msgCenter"
      :editModal="msgNewsModal"
      v-on:changeMsgNewsModal="changeMsgNewsModal">
    </msg-news>
  </div>
</template>

<script>
  import msgNews from "@/components/common/msgNews";
    export default {
      name: "msg",
      components:{msgNews},
      props: {
        messageUnreadCount: {
          type: Number,
          default: 0
        }
      },
      data(){
        return{
          msgNewsModal: false
        }
      },
      methods:{
        changeMsgNewsModal(param) {
          this.$emit('getUnreadMessageCount');
          this.msgNewsModal = param;
        },
        messageData () {
          // this.$router.push({
          //   name: 'message_page'
          // })
          this.$refs.msgCenter.getData();
          this.msgNewsModal=true;
        },
      }
    }
</script>

<style scoped>
img:hover{
  cursor: pointer;
}
</style>
