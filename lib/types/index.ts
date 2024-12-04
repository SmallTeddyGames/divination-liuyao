export type BaZiType = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

export type BaGuaInfoType = {
  自然: string
  人体: string
  动物: string
  家人: string
  声音: string
  建筑: string
  八仙: string
  偏旁: string
}

export type HexagramInfoType = {
  no: number
  name: string
  qian: '上上卦' | '中上卦' | '上卦' | '中中卦' | '中下卦' | '下下卦'
  meaning: string
  description: string
  pinyin: string
}
