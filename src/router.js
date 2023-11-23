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
            path: "/editProfile",
            component: () => import("./components/manageUser/EditProfile.vue"),
        },
        {
            path: "/forgotPassword",
            component: () => import("./components/manageUser/ForgotPassword.vue"),
        },
        {
            path: "/changePassword",
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
            path: "/manageRequest",
            component: () => import("./components/manageRequest/ManageRequest.vue"),
        },
        {
            path: "/request/:type/:id",
            component: () => import("./components/manageRequest/RequestDetail.vue"),
        },
        {
            path: "/myRequest",
            component: () => import("./components/manageRequest/MyRequests.vue"),
        },

        {
            path: "/calendar",
            component: () => import("./components/calendar/CalendarReport.vue"),
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
        {
            path: "/report",
            component: () => import("./components/report/ReportSalary.vue"),
        },
        {
            path: "/statisticTimeKeeping",
            component: () => import("./components/statisticTimeKeeping/StatisticTimeKeeping.vue"),
        },
        {
            path: "/manageWorkingTime",
            component: () => import("./components/manageWorkingTime/ManageWorkingTime.vue"),
        }

    ],
});

router.beforeEach((to, from, next) => {
    const publicPages = [
        "/login",
        "/",
        "/forgotPassword"
    ];
    const userPages = [
        "/calendar",
        "/unpermist",
        "/logCheckUser",
        "/inLateOutEarlyUser",
        "/profile",
        "/request",
        "/changePassword",
        "/myRequest",
        "/editProfile",
        "/statisticTimeKeeping"
    ];
    const adminPages = [
        "/logCheckAdmin",
        "/inLateOutEarlyAdmin",
        "/manageUser",
        "/manageHoliday",
        "/managePosition",
        "/manageDepartment",
        "/report",
        "/manageRequest",
        "/manageWorkingTime"

    ];
    const managePages = [
        "/logCheckMod",
        "/inLateOutEarlyMod",
        "/manageRequest",
        "/inLateOutEarlyMod",
        "/report",
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
            userPages.includes(to.path) || to.path.startsWith("/request/") ||
            publicPages.includes(to.path)
        )
            next();
        else next("/unpermist");
    }
});
export default router;
