import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        activities: resolve(__dirname, 'activities.html'),
        contact: resolve(__dirname, 'contact.html'),
        game: resolve(__dirname, 'game.html'),
        history: resolve(__dirname, 'history.html'),
        profile: resolve(__dirname, 'profile.html'),
        tool: resolve(__dirname, 'tool.html')
      }
    }
  }
});