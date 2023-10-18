import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/login",
            component: () => import("./components/auth/Login.vue"),
        },
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/unpermist",
            name: "unpermist",
            component: () => import("./components/error/UnPermist.vue"),
        },
        {
            path: "/manageUser",
            component: () => import("./components/manageUser/ManageUser.vue"),
        },
        {
            path: "/profile",
            component: () => import("./components/manageUser/Profile.vue"),
        },
        {
            path: "/editprofile",
            component: () => import("./components/manageUser/EditProfile.vue"),
        },
        {
            path: "/forgotPassword",
            component: () => import("./components/manageUser/ForgotPassword.vue"),
        },
        {
            path: "/changepassword",
            component: () => import("./components/manageUser/ChangePassword.vue"),
        },
        {
            path: "/manageHoliday",
            component: () => import("./components/manageHoliday/ManageHoliday.vue"),
        },
        {
            path: "/managePosition",
            component: () => import("./components/managePosition/ManagePosition.vue"),
        },
        {
            path: "/manageDepartment",
            component: () => import("./components/manageDepartment/ManageDepartment.vue"),
        },
        
        {
            path: "/calendar",
            component: () => import("./components/calendar/calendarReport.vue"),
        },
        {
            path: "/logCheckAdmin",
            component: () => import("./components/logCheckInOut/ViewLogCheckInOutAdmin.vue"),
        },
        {
            path: "/logCheckMod",
            component: () => import("./components/logCheckInOut/ViewLogCheckInOutMod.vue"),
        },
        {
            path: "/logCheckUser",
            component: () => import("./components/logCheckInOut/ViewLogCheckInOutUser.vue"),
        },
        {
            path: "/inLateOutEarlyAdmin",
            component: () => import("./components/logInLateOutEarly/LogInLateOutEarlyAdmin.vue"),
        },
        {
            path: "/inLateOutEarlyMod",
            component: () => import("./components/logInLateOutEarly/LogInLateOutEarlyMod.vue"),
        },
        {
            path: "/inLateOutEarlyUser",
            component: () => import("./components/logInLateOutEarly/LogInLateOutEarlyUser.vue"),
        },

    ],
});

router.beforeEach((to, from, next) => {
    const publicPages = [
        "/login",
        "/",

    ];
    const userPages = [
        "/calendar",
        "/unpermist",
        "/logCheckUser",
        "/inLateOutEarlyUser",
        "/profile"
    ];
    const adminPages = [
        "/logCheckAdmin",
        "/inLateOutEarlyAdmin",
        "/manageUser"
    ];
    const managePages = [
        "/logCheckMod",
        "/inLateOutEarlyMod"
    ];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem("user");
    if (
        authRequired &&
        !loggedIn

    ) {
        next("/login");
    }
    if (
        (!authRequired && !loggedIn)
    ) {
        next();
    } else {
        const admin = JSON.parse(localStorage.getItem("user")).roles.includes(
            "ROLE_ADMIN"
        );
        const manage = JSON.parse(localStorage.getItem("user")).roles.includes(
            "ROLE_MODERATOR"
        );
        if (
            ((adminPages.includes(to.path) || to.path.startsWith("/user/")) && admin) ||
            (managePages.includes(to.path) && manage) ||
            userPages.includes(to.path) ||
            publicPages.includes(to.path)
        )
            next();
        else next("/unpermist");
    }
});
export default router;
