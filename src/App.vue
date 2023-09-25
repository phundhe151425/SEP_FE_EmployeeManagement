<template>
  <div id="app">
      <SideBar />
      <div class="container-fluid" style="margin-top: 100px">
          <router-view/>
      </div>
  </div>
</template>

<script>
import SideBar from "@/components/sidebar/SideBar.vue";
// import {sidebarWidth} from '@/components/sidebar/state'
// import {collapsed, toggleSidebar} from '@/components/sidebar/state'

export default {
    components: {SideBar},
    // setup() {
    //     return {sidebarWidth, collapsed, toggleSidebar}
    // },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
