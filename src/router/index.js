import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home/index.vue";
import { ElMessage } from 'element-plus'
import { getItem, setItem } from "../utlis/localStorage";
import { getHost } from "@/api/user"
import { useGlobalStore } from '@/stores/global'
import { storeToRefs } from 'pinia'

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
