import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function suppressReloadPlugin() {
  return {
    name: 'suppress-reload-plugin',
    transform(code: string, id: string) {
      if (id.includes('client.mjs') || id.includes('@vite/client')) {
        return code.replaceAll('location.reload()', 'console.warn("[vite] auto-reload suppressed")');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [suppressReloadPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
      watch: null,
    },
  };
});
