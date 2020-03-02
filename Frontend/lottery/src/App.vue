<template>
  <div id="app">
    <main-nav></main-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import mainNav from 'components/context/mainNav'
export default {
  name:'app',
  components:{
    mainNav,
  }
}
</script>

<style>
@import "assets/css/base.css";
</style>
