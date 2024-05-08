const router = createRouter({
    history: createWebHistory('/divination-liuyao/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Game/Home.vue')
        }
    ]
})

export default router
