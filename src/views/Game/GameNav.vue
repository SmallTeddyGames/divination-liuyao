<script setup lang="ts">
import GitHubButton from './GitHubButton.vue'
</script>

<template>
  <nav w-screen px4 py3 text-lg bg-transparent h-42px border="b base" color-white flex="~ gap-1 items-center">
    <div title="Game">六爻占卜</div>
    <div flex-auto></div>
    <!-- github按钮 -->
    <GitHubButton />
  </nav>
</template>
