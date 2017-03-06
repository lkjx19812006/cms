import Vue from 'vue'
import navConfig from './router.config.json';
import VueRouter from 'vue-router'
import login from './pages/login.vue'
Vue.use(VueRouter);

const registerRoute = (navConfig) => {
  let route = [];
  Object.keys(navConfig).forEach((lang, index) => {
    let navs = navConfig[lang];
    route.push({
      path: "/cms/"+lang,
      component: require("./pages/"+lang+"/home.vue"),
      redirect: `/${ lang }/main`,
      children: [],
       meta: {
        lang
      }
    });
    navs.forEach(nav => {
      if (nav.groups) {
        nav.groups.forEach(group => {
          group.list.forEach(nav => {
            addRoute(nav, lang, index);
          });
        });
      } else if (nav.children) {
        nav.children.forEach(nav => {
          addRoute(nav, lang, index);
        });
      } else {
        addRoute(nav, lang, index);
      }
    });
  });
  function addRoute(page, lang, index) {
    const component = require("./pages/"+lang+page.path+".vue");   
    let child = {
      path:'/cms/' + lang + '/' + page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
        lang
      },
      name: 'component-' + (page.title || page.name),
      component: component.default || component
    };

    route[index].children.push(child);
  }
  console.log(route);
  return route;
};

let routes = registerRoute(navConfig);
routes.push({
  path: '/cms/login',
  name: 'login',
  component: require('./pages/login.vue')
});

routes.push({
  path: '/',
  redirect: '/cms/login'
});

const router = new VueRouter({
    mode:'history',
    routes
});


export default router