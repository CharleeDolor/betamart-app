import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import ProductsListPage from '@/components/ProductsListPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'allProducts',
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem('token')){
        next();
      } else {
        next('/');
      }
    },
    component: ProductsListPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
