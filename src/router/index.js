import { createRouter, createWebHistory } from "vue-router";
import Todo from '../views/Todo.vue'
const routes = [
    {
        path: '/',
        name: 'Components',
        component: Todo
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

console.log('🚀 Router created with inline component');

export default router;