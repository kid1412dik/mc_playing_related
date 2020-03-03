<template>
  <div id="poolBtnlist">
    <div class="drawBtn">抽一发:{{}}</div>
    <div class="drawBtn">十连:{{}}</div>
    <div class="drawBtn">64响:{{}}</div>
  </div>
</template>

<script>
export default {
  name:'poolBtnlist'

}
</script>

<style>
#poolBtnlist {
  position: relative;
  width: 330;
  height: 100%;
}
.drawBtn {
  
  left: 0px;
  right: 0px;
  width: 220px;
  height: 50px;
  border: 2px solid red;
  margin: 20px;
  line-height: 50px;
}

</style>