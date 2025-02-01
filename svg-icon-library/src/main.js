import { createApp } from 'vue';
import App from './App.vue';
import VueLazyload from 'vue-lazyload';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

const app = createApp(App);

app.use(VueLazyload);
app.component('VueSlider', VueSlider);

app.mount('#app');
