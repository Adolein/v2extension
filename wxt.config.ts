import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    web_accessible_resources: [
      {
        resources: ["injected.js", "searchfield.js", "suggestion.js"],
        matches: ["*://*/*"],
      },
    ],
    host_permissions: ["*://*.amazon.de/*"],
    permissions: ['activeTab', 'scripting', 'tabs'],
    background: {
      service_worker: 'background.ts',
    },
    action: {
      default_popup: 'index.html',
    },
  },
});