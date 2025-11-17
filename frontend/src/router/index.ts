import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true, title: '登录' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { public: true, title: '注册' },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: '概览' },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/AnalyticsView.vue'),
      meta: { title: '分析' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: '设置' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/PersonalCenterView.vue'),
      meta: { title: '个人中心' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UserManagementView.vue'),
      meta: { title: '用户管理', admin: true },
    },
    {
      path: '/mobile-lab',
      name: 'mobile-lab',
      component: () => import('@/views/MobileLabView.vue'),
      meta: { title: '移动端模拟' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { public: true, title: '未找到' },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  if (!auth.initialized) {
    await auth.bootstrap();
  }

  if (!to.meta.public && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.public && auth.isAuthenticated && ['login', 'register'].includes(to.name?.toString() ?? '')) {
    next({ name: 'dashboard' });
    return;
  }

  if (to.meta.admin && auth.user?.role !== 'admin') {
    next({ name: 'dashboard' });
    return;
  }

  document.title = `${to.meta.title ?? '应用'} · Vue Portal`;
  next();
});

export default router;


