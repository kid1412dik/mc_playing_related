<template>  
  <div id='tabbar' >
    <div v-for="(item,index) in pool" :key="index"></div>
    <div class="prise">你的背包:{{}}</div>
  </div>
</template>
<script>
export default {
  name:"tabbar",
  props:{
    pool:{
      type:Array,
      default(){
        return []
      }
    }
  }
    
}
</script>


<style>
#tabbar {
  background-color: #f2f2f2;
  height: 60px;
  width: 1440px;
  box-shadow: 0px -1.5px 10px rgba(69, 149, 160, 0.2)
}
.prise {
  line-height: 60px;
  height: 60px;
  float: right;
  margin-right: 100px;
}
</style>
