<template>
  <div id="mainNav">
     <nav-bar>
      <login class="login" slot="right"></login>
     </nav-bar>
  </div>
</template>

<script>

import navBar from 'components/common/NavBar'
import login from 'components/common/login'

export default {
  name:'mainNav',
  components: {
    navBar,
    login,
  }

}
</script>

<style scoped>
#mainNav {
  background-color:#345;
  color: aquamarine;
  position: relative;
    left: 0;
    right: 0;
    top: 0;
}
</style>