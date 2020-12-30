import Vue from 'vue';
import VueRouter from 'vue-router';
import Puzzle from "../games/puzzle";
import MineSweeper from '../games/mine-sweeper';
import Wey2048 from "../games/wey2048";
import Elsfk from "../games/elsfk";

Vue.use(VueRouter);
export default new VueRouter({
  routes: [
    {path: '/', redirect: '/elsfk'},
    {path: '/puzzle', component: Puzzle},
    {path: '/sweeper', component: MineSweeper},
    {path: '/wey2048', component: Wey2048},
    {path: '/elsfk', component: Elsfk},
  ]
})
