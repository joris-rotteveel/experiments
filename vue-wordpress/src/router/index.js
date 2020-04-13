import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Project from "../views/Project.vue";
import ProjectList from "../views/ProjectList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/projects",
    name: "Projects",
    component: ProjectList
  },
  {
    path: "/project/:id",
    name: "Project",
    component: Project,
    props: true
    // route level code-splitting
    // this generates a separate chunk (project.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "project" */ "../views/Project.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
