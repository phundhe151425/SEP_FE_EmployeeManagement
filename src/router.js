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
            path: "/manageUser",
            component: () => import("./components/manageUser/ManageUser.vue"),
        },
        {
            path: "/profile",
            component: () => import("./components/manageUser/Profile.vue"),
        },
        {
            path: "/calendar",
            component: () => import("./components/calendar/calendarReport.vue"),
        },

    ],
});

// router.beforeEach((to, from, next) => {
//     const publicPages = [
//         "/login",
//         "/register",
//         "/home",
//         "/forgotPassword",
//         "/confirmForgot",
//         "/",
//         "/selfie"
//     ];
//     const userPages = [
//         "/user",
//         "/calender",
//         "/profile",
//         "/changepassword",
//         "/unpermist",
//         "/myFurlough",
//         "/managerequest",
//         "/requestdetail"
//     ];
//     const adminPages = [
//         "/add-user",
//         "/manage",
//         "/timesheetadmin",
//         "/report",
//         "/reportFurlough",
//         "/manageholiday"
//     ];
//     const managePages = ["/timesheetmod", "/report", "/reportFurlough"];
//     const authRequired = !publicPages.includes(to.path);
//     const loggedIn = localStorage.getItem("user");
//     if (
//         authRequired &&
//         !loggedIn &&
//         !to.path.startsWith("/reset_password-tokenLink")
//     ) {
//         next("/login");
//     }
//     if (
//         (!authRequired && !loggedIn) ||
//         to.path.startsWith("/reset_password-tokenLink")
//     ) {
//         next();
//     } else {
//         const admin = JSON.parse(localStorage.getItem("user")).roles.includes(
//             "ROLE_ADMIN"
//         );
//         const manage = JSON.parse(localStorage.getItem("user")).roles.includes(
//             "ROLE_MANAGE"
//         );
//         if (
//             ((adminPages.includes(to.path) || to.path.startsWith("/user/")) && admin) ||
//             (managePages.includes(to.path) && manage) ||
//             userPages.includes(to.path) ||
//             publicPages.includes(to.path)
//         )
//             next();
//         else next("/unpermist");
//     }
// });
export default router;
