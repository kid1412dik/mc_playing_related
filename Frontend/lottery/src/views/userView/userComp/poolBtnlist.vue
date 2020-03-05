<template>
  <div id="poolBtnlist">
    <button class="drawBtn" @click="draw(1)">抽一发:{{onetTimes}}</button>
    <button class="drawBtn" @click="draw(10)">十连:{{onetTimes*10}}</button>
    <button class="drawBtn" @click="draw(64)">64响:{{onetTimes*64}}</button>
  </div>
</template>

<script>
export default {
  name:'poolBtnlist',
  props:{
    // onetTimes,
  },
  methods:{
    draw(times){
      let totalmoney = this.onetTimes * times;
      this.$storestore.dispatch('uploadBalance', totalmoney).then(res => {

      })

    }
  }
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