import { createRouter, createWebHistory } from 'vue-router';
import IniCio from '../components/IniCio.vue';
import AcerCa from '../components/AcerCa.vue';
import EmpLeados from '../components/EmpLeados.vue';
import EstaDisticas from '../components/EstaDisticas.vue';
import TaReas from '../components/TaReas.vue';
import AvisoLegal from '../components/AvisoLegal.vue';
import PoliticaPrivacidad from '../components/PoliticaPrivacidad.vue';

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
    }, {
        path: '/avisolegal',
        name: 'AvisoLegal',
        component: AvisoLegal
    }, {
        path: '/politicadeprivacidad',
        name: 'PoliticaPrivacidad',
        component: PoliticaPrivacidad
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;