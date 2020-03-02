<template>
    <div id='tabbar' >
        <slot></slot>
    </div>
</template>
<script>
export default {
    name:"tabbar"
}
</script>


<style>
#tabbar {
  display: flex;
  background-color: #f2f2f2;
  height: 40px;
  width: 1440px;
  box-shadow: 0px -1.5px 10px rgba(69, 149, 160, 0.2)
}

</style>
