<script setup lang="ts">
import ChangeGameStatus from '@/views/NavButton/ChangeGameStatus.vue'
import ChangeLanguage from '../NavButton/ChangeLanguage.vue'
import GitHubButton from '@/views/NavButton/GitHubButton.vue'
import ColorSchemeToggle from '@/views/NavButton/ColorSchemeToggle.vue'
import FullScreenToggle from '@/views/NavButton/FullScreenToggle.vue'

const { t } = useI18n()
</script>

<template>
  <nav w-screen px4 py3 text-lg bg-transparent border="b base" color-white flex="~ gap-1 items-center">
    <div title="Game">{{ t('gameTitle') }}</div>
    <div flex-auto></div>
    <!-- 游戏控制按钮 -->
    <ChangeGameStatus />
    <!-- 语言切换按钮 -->
    <ChangeLanguage />
    <!-- github按钮 -->
    <GitHubButton />
    <!-- 颜色切换按钮 -->
    <ColorSchemeToggle />
    <!-- 全屏按钮 -->
    <FullScreenToggle />
  </nav>
</template>
