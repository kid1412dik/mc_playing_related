<template>
  <div id="log">
    <div v-if="!islogin">
      <div @click="logbox" class="logBtn">登录</div>
      <div v-show="boxShower">
        <form>
          <input type="text" name="account" placeholder="账号"><br>
          <input type="password" name="password" placeholder="密码">
        </form>
      </div>
    </div>
    <div v-else>
      <span>用户id:{{userid}}
      用户名:{{username}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name:'login',
  data(){
    return {
      islogin: false,
      boxShower: false,
    }
  },
  props:{
    userid:{
      type:Number,
      default(){
        return 9999
      }
    },
    username:{
      type:String,
      default(){
        return ''
      }
    }
  },
  methods:{
    logbox(){
      this.boxShower = !this.boxShower
    }
  }
}
</script>

<style scoped>
#log {
  width: 150px;
}

.logBtn {
  cursor:pointer;
}

input {
  width: 100px;
  position: absolute;
  left: 0px;
}

</style>