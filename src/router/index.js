import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TasksView from '../views/TasksView.vue'; 
import FriendsView from '../views/FriendsView.vue';
import Shop from '../views/Shop.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView, 
  },
  {
    path: '/friends',
    name: 'friends',
    component: FriendsView,
  },
  {
    path: '/shop',
    name: 'shop',
    component: Shop,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
