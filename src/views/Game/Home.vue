<script lang="ts" setup>
import GameNav from "./GameNav.vue";
import GameContent from './GameContent.vue'
import { getAssetsFile } from '@/utils'
</script>

<template>
  <main h-100dvh h-screen w-screen of-hidden bg-cover bg-center grid="~ rows-[max-content_1fr]"
    :style="{ backgroundImage: `url(${getAssetsFile('game-bg.jpg')})` }">
    <GameNav />
    <GameContent />
  </main>
</template>
