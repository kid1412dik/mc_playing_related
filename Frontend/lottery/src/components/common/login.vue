<template>
  <div id="log">
    <div v-if="!islogin" class="logSelector">
      <div v-show="!boxShower" @click="logbox" class="logBtn">登录</div>
        <form v-show="boxShower" class="logForm">
          <input type="text" name="account" placeholder="账号">
          <input type="password" name="password" placeholder="密码">
          <input class="inBtn" type="submit" value="确认">
        </form>
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
  position: absolute;
  right: 0px;
  width: 270px;
  height: 100%;
}

.logSelector {
  perspective: 600px;
}

.logBtn {
  position: absolute;
  cursor: pointer;
  border: 2px;
  width: 100px;
  height: 50px;
  top: 20px;
  left: 0px;
  right: 0px;
  margin: auto;
  background-color: #fff;
  line-height: 50px;
  border-radius: 5px;
  transition: all 0.5s;
}

.logBtn:hover {
  transform: translateZ(60px)
}

.logForm {
  top: 20px;
  position: absolute;
}

input {
  margin: 5px;
  float: left;
  width: 150px;
}
.inBtn {
  width: 60px;
  height: 30px;
}


</style>