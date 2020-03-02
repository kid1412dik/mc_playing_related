<template>
  <div id="userView">
    <tabbar class="tabbar"></tabbar>
    <pool-Ui class="poolShower"></pool-Ui>
  </div>
</template>

<script>
import tabbar from 'views/userView/userComp/tabbar'
import poolUi from 'views/userView/userComp/poolUi'
import {getmultdata} from 'network/userView.js'

export default {
  name:'userView',
   data(){
    return {
      pool:[]
    }
  },
  created(){
    // this.getmultdata()
  },
  components:{
    tabbar,
    poolUi,
  },
  methods:{
    getmultdata(){
      getmultdata().then(
        res => {
        }
      )
    }
  }
}
</script>

<style>
#userView {
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: #666;
}
.tabbar {
  position: absolute;
  margin: auto;
  top: 30px;
  left: 0px;
  right: 0px;
}
.poolShower {
  position: absolute;
  margin: auto;
  top: 110px;
  left: 0px;
  right: 0px;
}


</style>