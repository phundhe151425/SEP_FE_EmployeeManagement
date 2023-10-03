<template>
    <div>
        <el-radio-group style="margin-bottom: 20px;">
            <el-button @click="changeMenu()"><i class="el-icon-more"/></el-button>
        </el-radio-group>
        <el-menu default-active="2" id="menu" class="el-menu-vertical-demo " :collapse="isCollapse">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">User</span>

                </template>
                <!--                <el-menu-item-group>-->
                <!--                    <span slot="title">Group One</span>-->
                <!--                    <el-menu-item index="1-1">item one</el-menu-item>-->
                <!--                    <el-menu-item index="1-2">item two</el-menu-item>-->
                <!--                </el-menu-item-group>-->
                <el-menu-item-group title="Profile">
                    <el-menu-item index="1-3">Profile</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Logout">
                    <el-menu-item index="1-4">Logout</el-menu-item>
                </el-menu-item-group>
                <!--                <el-submenu index="1-4">-->
                <!--                    <span slot="title">item four</span>-->
                <!--                    <el-menu-item index="1-4-1">Logout</el-menu-item>-->
                <!--                </el-submenu>-->
            </el-submenu>
            <router-link to="/test">
                <el-menu-item index="2">
                    <i class="el-icon-document"></i>
                    <span slot="title">test</span>
                </el-menu-item>
            </router-link>
            <router-link to="/login">
                <el-menu-item index="3">
                    <i class="el-icon-document"></i>
                    <span slot="title">login</span>
                </el-menu-item>
            </router-link>
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">Navigator Four</span>
            </el-menu-item>
        </el-menu>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" >
                <router-link to="/Login"><i class="el-icon-document"></i>Login</router-link>
            </el-menu-item>
<!--            <el-submenu index="2">-->
<!--                <template slot="title">Workspace</template>-->
<!--                <el-menu-item index="2-1">item one</el-menu-item>-->
<!--                <el-menu-item index="2-2">item two</el-menu-item>-->
<!--                <el-menu-item index="2-3">item three</el-menu-item>-->
<!--                <el-submenu index="2-4">-->
<!--                    <template slot="title">item four</template>-->
<!--                    <el-menu-item index="2-4-1">item one</el-menu-item>-->
<!--                    <el-menu-item index="2-4-2">item two</el-menu-item>-->
<!--                    <el-menu-item index="2-4-3">item three</el-menu-item>-->
<!--                </el-submenu>-->
<!--            </el-submenu>-->
            <el-menu-item index="2">
                <router-link to="/test"><i class="el-icon-document"></i>test</router-link>
            </el-menu-item>
            <el-submenu index="3" class="float-end">
                <template slot="title">User</template>
                <el-menu-item index="2-1">item one</el-menu-item>
                <el-menu-item index="2-2">item two</el-menu-item>
                <el-menu-item index="2-3">item three</el-menu-item>
            </el-submenu>
<!--            <el-menu-item index="4" ><a href="https://www.ele.me" target="_blank">User</a></el-menu-item>-->
        </el-menu>
    </div>

</template>
<script>
export default {
    // data() {
    //     return {
    //         isCollapse: false
    //     };
    // },
    // created() {
    //     this.changeMenu();
    // },
    // methods: {
    //     changeMenu() {
    //         this.isCollapse = !this.isCollapse
    //         console.log("change")
    //     },
    //
    // },
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1'
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }
    }


};
</script>
<style>
</style>

<style scoped>
* {
    font-family: "Montserrat", sans-serif;
}


.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}


</style>