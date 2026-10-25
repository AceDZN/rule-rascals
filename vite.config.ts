import { defineConfig } from 'vite';
export default defineConfig({ base: './', server: { port: 5203, strictPort: true, host: '0.0.0.0' }, preview: { port: 4203, strictPort: true, host: '0.0.0.0' }, build: { target: 'es2022' } });
