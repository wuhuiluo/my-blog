import Vue from 'vue'
import {Carousel,Button,CarouselItem} from 'element-ui' //引入轮播组件
Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(Carousel)
Vue.use(Button)
Vue.use(CarouselItem)
