<style lang="stylus" >
body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color lighten(#eceef1, 30%)
  margin 0
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none


.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

</style>

<template>
  <div id="app" :style="{ height: wrapperHeight + 'px' }" style="position:relative">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
    data() {
        return {
            wrapperHeight: ''
        }
    },
    mounted() {
      let _self=this;
           window.onresize = function() {
                   _self.wrapperHeight = document.documentElement.clientHeight; 
                }
                this.wrapperHeight = document.documentElement.clientHeight; 
    }
}
</script>


