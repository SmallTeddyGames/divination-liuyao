<template>
  <div>
    <h3 text-2xl font-bold>卦名：{{ resInfo.name }}</h3>
    <h3 text-xl font-bold>卦象：{{ resInfo.phase }}</h3>
    <img :src="`${getAssetsFile(resInfo.image)}`" :alt="resInfo.name" />
    <h3 text-xl font-bold>卦名：{{ resInfo.moral }}</h3>
  </div>
</template>

<script lang='ts' setup>
import { qianGua, duiGua, liGua, zhenGua, xunGua, kanGua, genGua, kunGua } from '../Class/GuaClass'
import { ResultClass } from '../Class/ResClass'
import { getAssetsFile } from '@/utils'

const resGua = ref(qianGua.gua + qianGua.gua)
const resInfo = ref(new ResultClass()[resGua.value])

console.log(resInfo.value)
</script>

<style scoped>
h3,
img {
  margin-bottom: 16px;
}
</style>
