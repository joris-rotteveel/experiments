import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Project from "../views/Project.vue";
// import ProjectGlobal from "../components/ProjectGlobal";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/project/:id",
    name: "Project",
    component: Project
    // route level code-splitting
    // this generates a separate chunk (project.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "project" */ "../views/Project.vue")
  }
];

console.log("start");
const router = new VueRouter({
  routes
});

export default router;
