<template>
    <nav class="navbar fixed-top container-fluid" style="padding: 14px 0">
        <div class="user-detail nav-item dropdown ">
            <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
            >
                <b-avatar v-if="currentUser.userImage == null" class="mr-3"></b-avatar>
                <b-avatar v-if="currentUser.userImage != null" class="mr-3"
                          v-bind:src="this.beUrl+`api/file/avatar/` + currentUser.userImage"></b-avatar>
                {{ currentUser.username }}
            </a>

            <ul class="dropdown-menu" style="left: -90px">
                <li>
                    <a class="dropdown-item">
                        <router-link to="/profile" class="nav-link sel">
                            <font-awesome-icon icon="user"/>
                            Thông tin cá nhân
                        </router-link>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item">
                        <router-link to="/changepassword" class="nav-link">
                            <i class="el-icon-refresh-left"></i>
                            Thay đổi mật khẩu
                        </router-link>
                    </a>
                </li>
                <li>
                    <hr class="dropdown-divider"/>
                </li>
                <li>
                    <a class="dropdown-item" href="#">
                        <a class="nav-link sel" href @click.prevent="logOut">
                            <font-awesome-icon icon="sign-out-alt"/>
                            Đăng xuất
                        </a>
                    </a>
                </li>
            </ul>
        </div>
        <div class="container-fluid">
            <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasDarkNavbar"
                    aria-controls="offcanvasDarkNavbar"
                    href="#offcanvasDarkNavbar"
                    style="border: none"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <ul class="dropdown-menu navbar-brand" style="float: right">
                <li>
                    <a class="dropdown-item">
                        <router-link to="/profile" class="nav-link sel">
                            <font-awesome-icon icon="user"/>
                            Thông tin cá nhân
                        </router-link>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item">
                        <router-link to="/changepassword" class="nav-link">
                            <i class="el-icon-refresh-left"></i>
                            Thay đổi mật khẩu
                        </router-link>
                    </a>
                </li>
                <li>
                    <hr class="dropdown-divider"/>
                </li>
                <li>
                    <a class="dropdown-item" href="#">
                        <a class="nav-link sel" href @click.prevent="logOut">
                            <font-awesome-icon icon="sign-out-alt"/>
                            Đăng xuất
                        </a>
                    </a>
                </li>
            </ul>

            <div
                    class="offcanvas offcanvas-start"
                    tabindex="-1"
                    id="offcanvasDarkNavbar"
                    aria-labelledby="offcanvasDarkNavbarLabel"
            >
                <div class="offcanvas-header" style="margin: auto">
                    <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">
                        <img src="../../../public/emslogo1.png" width="140px"/>
                    </h5>
                    <button
                            type="button"
                            class="btn-close btn-close-white text-center"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                    ></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3 ">
                        <li class="nav-item ">
                            <a class="nav-link active"  aria-current="page">
                                <router-link to="/calendar" class="nav-link sel btn-drop" >
                                    <i class="el-icon-s-home"></i>
                                    Trang chủ
                                </router-link>
                            </a>
                        </li>
                        <li class="nav-item mb-1" v-if="currentUser">
                            <button class="nav-link sel btn-drop" aria-current="page"  data-bs-toggle="collapse" data-bs-target="#getting-started-collapse1" aria-expanded="false">
                                <i class="el-icon-star-on"/> Cá nhân <i class="el-icon-arrow-left"/>
                            </button>

                            <div class="collapse" id="getting-started-collapse1">
                                <ul class="list-unstyled fw-normal pb-1 small">
                                    <li class="nav-item" v-if="currentUser">
                                        <a class="nav-link">
                                            <router-link to="/logCheckUser" class="nav-link sel ">
                                                <i class="el-icon-view"></i>
                                                Xem log (In/Out) cá nhân
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="currentUser">
                                        <a class="nav-link">
                                            <router-link to="/inLateOutEarlyUser" class="nav-link sel">
                                                <i class="el-icon-guide"></i>
                                                Đến muộn/ Về sớm cá nhân
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="currentUser">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/myRequest" class="nav-link sel">
                                                <i class="el-icon-tickets"></i>
                                                Đề xuất của tôi
                                            </router-link>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li class="nav-item mb-1" v-if="isAdmin || isModerator">
                            <button class="nav-link sel btn-drop" aria-current="page" data-bs-toggle="collapse" data-bs-target="#getting-started-collapse2" aria-expanded="false">
                                <i class="el-icon-s-fold"/> Thông tin chấm công <i class="el-icon-arrow-left"/>
                            </button>

                            <div class="collapse" id="getting-started-collapse2">
                                <ul class="list-unstyled fw-normal pb-1 small">
                                    <li class="nav-item" v-if="isModerator">
                                        <a class="nav-link">
                                            <router-link to="/logCheckMod" class="nav-link sel">
                                                <i class="el-icon-view"></i>
                                                Xem log (In/Out)
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link">
                                            <router-link to="/logCheckAdmin" class="nav-link sel">
                                                <i class="el-icon-view"></i>
                                                Xem log (In/Out)
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="currentUser">
                                        <a class="nav-link">
                                            <router-link to="/statisticTimeKeeping" class="nav-link sel">
                                                <i class="el-icon-s-data"></i>
                                                Thống kê chấm công
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isModerator">
                                        <a class="nav-link">
                                            <router-link to="/inLateOutEarlyMod" class="nav-link sel">
                                                <i class="el-icon-guide"></i>
                                                Đến muộn/ Về sớm
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link">
                                            <router-link to="/inLateOutEarlyAdmin" class="nav-link sel">
                                                <i class="el-icon-guide"></i>
                                                Đến muộn/ Về sớm
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin || isModerator">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/report" class="nav-link sel">
                                                <i class="el-icon-edit-outline"></i>
                                                Báo cáo chấm công
                                            </router-link>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>






                        <li class="nav-item mb-1" v-if="isAdmin || isModerator">
                            <button class="nav-link sel btn-drop" aria-current="page" data-bs-toggle="collapse" data-bs-target="#getting-started-collapse3" aria-expanded="false">
                                <i class="el-icon-s-tools"/> Quản Lý <i class="el-icon-arrow-left"/>
                            </button>

                            <div class="collapse" id="getting-started-collapse3">
                                <ul class="list-unstyled fw-normal pb-1 small">
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/manageUser" class="nav-link sel">
                                                <i class="el-icon-office-building"></i>
                                                Quản lý nhân viên
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin || isModerator">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/manageRequest" class="nav-link sel">
                                                <i class="el-icon-paperclip"></i>
                                                Quản lý đề xuất
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/manageDepartment" class="nav-link sel">
                                                <i class="el-icon-price-tag"></i>
                                                Quản lý phòng ban
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/managePosition" class="nav-link sel">
                                                <i class="el-icon-s-check"></i>
                                                Quản lý chức vụ
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/manageHoliday" class="nav-link sel">
                                                <i class="el-icon-date"></i>
                                                Quản lý ngày nghỉ
                                            </router-link>
                                        </a>
                                    </li>
                                    <li class="nav-item" v-if="isAdmin">
                                        <a class="nav-link active" aria-current="page">
                                            <router-link to="/manageWorkingTime" class="nav-link sel">
                                                <i class="el-icon-c-scale-to-original"></i>
                                                Quản lý thời gian làm việc
                                            </router-link>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>




                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
import {FE_URL} from "@/http-common";
import {BE_URL} from "@/http-common";

export default {
    data() {
        return {
            feUrl: FE_URL,
            beUrl: BE_URL,
            logInUser: ''
        };
    },
    props: {},
    created() {
        // this.getUser()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
        isAdmin() {
            if (this.currentUser.roles) {
                return this.currentUser.roles.includes("ROLE_ADMIN");
            }
            return false;
        },
        isModerator() {
            if (this.currentUser.roles) {
                return this.currentUser.roles.includes("ROLE_MODERATOR");
            }
            return false;
        },
    },
    methods: {


        logOut() {
            this.$store.dispatch("auth/logout");
            // window.location.replace(this.feUrl + "login");
        },
    },
};
</script>
<style>
</style>

<style scoped>
* {
    font-family: "Montserrat", sans-serif;
}

.navbar {
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    font-weight: 600;
}

.btn-drop{
    color: #d18e41
}
.user-detail {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1030;
}

#offcanvasDarkNavbar {
    width: 16%;
}


.nav-link:hover {
    color: #75c4c0;
}

.nav-link:focus {
    color: #ed9696;
}

@media screen and (max-width: 700px) {
    #offcanvasDarkNavbar {
        width: 60%
    }
}

@media screen and (min-width: 750px) and (max-width: 950px) {
    #offcanvasDarkNavbar {
        width: 30%
    }
}

@media screen and (min-width: 1024px) and (max-width: 1280px) {
    #offcanvasDarkNavbar {
        width: 25%
    }
}


</style>
