<template>
  <div id="cardShower">
    <div class="box">
      <div class="front" @click="turn" :class='{active:toward}'>
        <slot name="front"></slot>
      </div>
      <div class="back">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"cardShower",
  data(){
    return {
      toward:false
    }
  },
  methods:{
    turn(){
      this.toward = true

    }
  },
}
</script>

<style>
.box {
  width: 224px;
  height: 224px; 
}
.front,.back {
  transition: all 1s;
}
.front {
  z-index: 1; 
  backface-visibility: hidden;
}
.active {
  transform:rotateY(180deg);
}


</style>