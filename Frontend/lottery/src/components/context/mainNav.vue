<template>
  <div id="mainNav">
    <nav-bar>
       <div slot="right">
         <login class="login"></login>
       </div>
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
.login {
    position: absolute;
    right: 0px;
}

</style>