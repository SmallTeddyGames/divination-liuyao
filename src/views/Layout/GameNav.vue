<script setup lang="ts">
import ChangeGameStatus from '@/views/NavButton/ChangeGameStatus.vue'
import GitHubButton from '@/views/NavButton/GitHubButton.vue'
</script>

<template>
  <nav w-screen px4 py3 text-lg bg-transparent border="b base" color-white flex="~ gap-1 items-center">
    <div title="Game">六爻占卜</div>
    <div flex-auto></div>
    <!-- 游戏控制按钮 -->
    <ChangeGameStatus />
    <!-- github按钮 -->
    <GitHubButton />
  </nav>
</template>
