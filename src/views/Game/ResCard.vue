<template>
  <div>
    {{ baseGua }}
  </div>
</template>

<script lang='ts' setup>
import { CoinClass, BaseGuaClass } from '../Class/GuaClass'
import { ResultClass } from '../Class/ResClass'
import { getAssetsFile } from '@/utils'

const firstYao = new CoinClass({ firstCoin: 3, secondCoin: 3, thirdCoin: 3 }).getYao()
const secondYao = new CoinClass({ firstCoin: 3, secondCoin: 3, thirdCoin: 3 }).getYao()
const thirdYao = new CoinClass({ firstCoin: 3, secondCoin: 3, thirdCoin: 3 }).getYao()
const fourYao = new CoinClass({ firstCoin: 3, secondCoin: 3, thirdCoin: 3 }).getYao()
const fiveYao = new CoinClass({ firstCoin: 3, secondCoin: 3, thirdCoin: 3 }).getYao()
const sixYao = new CoinClass({ firstCoin: 3, secondCoin: 3, thirdCoin: 3 }).getYao()

const baseGua = new BaseGuaClass({ firstYao, secondYao, thirdYao, fourYao, fiveYao, sixYao }).geyBaseGua()
</script>

<style scoped>
h3,
img {
  margin-bottom: 16px;
}
</style>
