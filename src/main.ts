import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { vThousands } from './directives/thousands'
import { vAutoWidth } from './directives/autoWidth'

createApp(App)
  .use(router)
  .directive('thousands', vThousands)
  .directive('auto-width', vAutoWidth)
  .mount('#app')
