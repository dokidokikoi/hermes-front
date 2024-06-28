import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home/index.vue";
import { ElMessage } from 'element-plus'
import { getItem, setItem } from "../utlis/localStorage";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          path: "",
          name: "welcome",
          meta: {
            title: "主页"
          },
          component: () => import("../views/Home/Welcome.vue"),
        },
        {
          path: "scraper/game",
          name: "game_scraper",
          meta: {
            title: "游戏刮削"
          },
          component: () => import("../views/Scraper/game.vue"),
        },
        {
          path: "game",
          name: "game_index",
          meta: {
            title: "游戏"
          },
          component: () => import("../views/Game/index.vue"),
        },
        {
          path: "game/:id",
          name: "game_detail",
          meta: {
            title: "游戏详情"
          },
          component: () => import("../views/Game/detail.vue"),
        },
        {
          path: "system/setting",
          name: "game_setting",
          meta: {
            title: "系统设置"
          },
          component: () => import("../views/System/setting.vue"),
        },
        {
          path: "category",
          name: "category",
          meta: {
            title: "分类"
          },
          component: () => import("../views/Category/index.vue"),
        },
        {
          path: "tag",
          name: "tag",
          meta: {
            title: "标签"
          },
          component: () => import("../views/Tag/index.vue"),
        },
        {
          path: "series",
          name: "series",
          meta: {
            title: "系列"
          },
          component: () => import("../views/Series/index.vue"),
        },
        {
          path: "developer",
          name: "developer",
          meta: {
            title: "开发商"
          },
          component: () => import("../views/Developer/index.vue"),
        },
        {
          path: "publisher",
          name: "publisher",
          meta: {
            title: "发行商"
          },
          component: () => import("../views/Publisher/index.vue"),
        },
        {
          path: "character",
          name: "character",
          meta: {
            title: "角色"
          },
          component: () => import("../views/Character/index.vue"),
        },
        {
          path: "character/:id",
          name: "character_detail",
          meta: {
            title: "角色详情"
          },
          component: () => import("../views/Character/detail.vue"),
        },
        {
          path: "person",
          name: "person",
          meta: {
            title: "人员"
          },
          component: () => import("../views/Person/index.vue"),
        }
      ]
    },
    {
      path: "/:catchAll(.*)",
      name: "404",
      meta: {
        title: "404"
      },
      component: () => import("../views/404/index.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 将页面滚动到顶部
    return { top: 0 };
  },
});


router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title === "harukaze" ? to.meta.title:"harukaze | "+to.meta.title
  }
  // document.body.scrollTop = 0;
  // document.documentElement.scrollTop = 0;
  // window.pageYOffset = 0;
  // const body = document.querySelector('.el-main')
  // if (body) body.scrollTop = 0
  // nprogress.done()
})

export default router;
