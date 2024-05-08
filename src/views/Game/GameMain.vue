<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <div h-full w-screen color-white p8 flex="~ col" gap-8>
    <div h-full w-full of-hidden flex-center border="1px dashed #666" border-rd-2>{{ t('playerArea') }}</div>
    <div h-full w-full of-hidden flex-center border="1px dashed #666" border-rd-2>{{ t('computerArea') }}</div>
  </div>
</template>
