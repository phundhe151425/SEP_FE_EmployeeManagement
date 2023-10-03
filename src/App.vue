<template>
  <div id="app">
<!--      <Navbar />-->
      <SidebarVue />
      <div class="container-fluid" style="margin-top: 100px">
        <DialogCreateUser></DialogCreateUser>
          <router-view/>
      </div>
  </div>
</template>

<script>
// import Navbar from "@/components/sidebar/NavBar.vue";
import SidebarVue from "@/components/sidebar/SidebarVue.vue";
import {sidebarWidth} from '@/components/sidebar/state.js'
import {collapsed, toggleSidebar} from '@/components/sidebar/state.js'
import DialogCreateUser from "@/components/manageUser/DialogCreateUser.vue";
export default {
    // components: {Navbar},
    components: {SidebarVue, DialogCreateUser},
    setup() {
        return {sidebarWidth, collapsed, toggleSidebar}
    },
}
</script>

<style>
#app {
    /*min-height: 100%;*/
    /*width: 100%;*/
    /*padding-top: 80px;*/
    /*!*padding-bottom: 80px;*!*/
    /*background-image: url("@/assets/background3.jpg") ;*/
    /*background-position: center; !* Center the image *!*/
    /*background-repeat: no-repeat; !* Do not repeat the image *!*/
    /*background-size: cover; !**/
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
