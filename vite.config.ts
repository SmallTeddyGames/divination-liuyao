import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig({
    base: './',
    plugins: [
        vue(),
        UnoCSS(),
        AutoImport({
            // targets to transform
            include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],

            // global imports to register
            imports: [
                // vue auto import
                'vue',
                // vue-router auto import
                {
                    'vue-router': [
                        'createRouter',
                        'createWebHistory'
                    ]
                },
                // @vueuse/core auto import
                {
                    '@vueuse/core': [
                        'createGlobalState',
                        'useStorage',
                        'useColorMode',
                        'useFullscreen'
                    ]
                },
                // @/store auto import
                {
                    '@/store': [
                        'useGlobalState'
                    ]
                },
                // i18n
                {
                    'vue-i18n': [
                        'useI18n',
                        'createI18n'
                    ]
                }
            ]
        }),
    ],
    resolve: {
        // 别名
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        // 忽略后缀
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
        port: 5173,
        host: true,
        open: true
    }
})
