import { createRouter, createWebHistory } from 'vue-router';
import IniCio from '../components/IniCio.vue';
import AcerCa from '../components/AcerCa.vue';
import EmpLeados from '../components/EmpLeados.vue';
import EstaDisticas from '../components/EstaDisticas.vue';
import TaReas from '../components/TaReas.vue';

const routes = [
    {
        path: '/',
        name: 'IniCio',
        component: IniCio
    }, {
        path: '/empleados',
        name: 'EmpLeados',
        component: EmpLeados
    }, {
        path: '/tareas',
        name: 'TaReas',
        component: TaReas
    }, {
        path: '/estadisticas',
        name: 'EstaDisticas',
        component: EstaDisticas
    }, {
        path: '/about',
        name: 'AcerCa',
        component: AcerCa
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;