<template>
  <div id="poolUi">
    <poolShower></poolShower>
    <poolBtnlist></poolBtnlist>
  </div>
</template>

<script>
import poolShower from 'views/userView/userComp/poolShower'
import poolBtnlist from 'views/userView/userComp/poolBtnlist'

export default {
  name:'poolUi',
  components:{
    poolShower,
    poolBtnlist
  }
}
</script>

<style scoped>
#poolUi {
  display: flex;
  background-color: #f2f2f2;
  height: 650px;
  width: 1440px;
  box-shadow: 0px -1.5px 10px rgba(69, 149, 160, 0.2)
}

</style>