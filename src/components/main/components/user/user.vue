<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
<!--      <Badge :dot="!!messageUnreadCount">-->
<!--        <Avatar :src="userAvatar"/>-->
        <Avatar style="background-color: #87d068" icon="ios-person"/>
        <span class="nameTitle">{{setName(userName)}}</span>
<!--      </Badge>-->
<!--      <Badge :count="messageUnreadCount">-->
      <Icon :size="26" type="md-arrow-dropdown"></Icon>
<!--      </Badge>-->
      <DropdownMenu slot="list">
<!--        <DropdownItem name="message">-->
<!--          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
<!--          {{$t('userInfo.message')}}<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
<!--        </DropdownItem>-->
<!--        <DropdownItem name="personalInfo">-->
<!--          {{$t('userInfo.personalInfo')}}-->
<!--        </DropdownItem>-->
        <DropdownItem name="password">
          {{$t('userInfo.password')}}
        </DropdownItem>
<!--        <DropdownItem name="logout">退出登录</DropdownItem>-->
        <DropdownItem name="logout">{{$t('userInfo.logout')}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <password
      :editModal="passwordModal"
      v-on:changeModal="changeModal"
    ></password>
  </div>
</template>

<script>
import './user.less'
import Password from "../../../common/password";
import { mapActions } from 'vuex'
export default {
  name: 'User',
  components: {Password},
  data(){
    return {
      passwordModal: false,
      userName:JSON.parse(sessionStorage.getItem("loginInfo"))['accountNo'] || ''
    }
  },
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    changeModal(param) {
      this.passwordModal = param;
    },

    personalInfo(){
      this.$router.push({
        name: 'personal_info'
      })
    },
    password(){
      this.passwordModal= true;
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout();
          break;
        case 'password': this.password();
          break;
        // case 'message': this.messageData();
        //   break;
        // case 'personalInfo': this.personalInfo();
        //   break
      }
    },
    setName(data){
      let str;
      if(data && data.length>10){
        str=data.substring(0,7)+'***'
      }else{
        str=data;
      }
      return str;
    }
  }
}
</script>
<style>
  .nameTitle{
    padding-left: 10px;
  }
</style>
