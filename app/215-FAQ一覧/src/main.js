'use strict';

import Vue from 'vue';
import Vuetify from './plugins/vuetify';
import App from './components/App.vue';

kintone.events.on('app.record.index.show', (event) => {
  if (event.viewName !== 'リアルタイム検索') {
    return event;
  }

  (async () => {
    new Vue({
      // Vueを適用するelement, <div id="customize-view"></div> をカスタマイズビューで指定済み.
      el: '#customize-view',
      vuetify: Vuetify,
      render: (h) => h(App),
    });
    return event;
  })();
});
