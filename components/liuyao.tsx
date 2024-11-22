'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COIN_YANG = "https://smallteddygames.github.io/divination-liuyao/coin-yang.png"
const COIN_YIN = "https://smallteddygames.github.io/divination-liuyao/coin-yin.png"

const generateRandomYao = () => {
  return Math.random() < 0.5 ? 'yin' : 'yang';
}

const baguaInfo = {
  '乾': { 自然: '天', 人体: '头', 动物: '马', 家人: '父亲', 声音: '金属声', 建筑: '京都', 八仙: '吕洞宾', 偏旁: '金字旁' },
  '兑': { 自然: '泽', 人体: '口', 动物: '羊', 家人: '少女', 声音: '说话吼叫声', 建筑: '井', 八仙: '张果老', 偏旁: '口字旁' },
  '离': { 自然: '火', 人体: '眼', 动物: '凤', 家人: '中女', 声音: '燃烧声', 建筑: '炉灶', 八仙: '汉钟离', 偏旁: '火字旁' },
  '震': { 自然: '雷', 人体: '足', 动物: '龙', 家人: '长男', 声音: '擂鼓声', 建筑: '门市', 八仙: '曹国舅', 偏旁: '木字旁' },
  '巽': { 自然: '风', 人体: '腿', 动物: '鸡', 家人: '长女', 声音: '风声', 建筑: '园艺', 八仙: '韩湘子', 偏旁: '草字头' },
  '坎': { 自然: '水', 人体: '耳', 动物: '鲤鱼', 家人: '中男', 声音: '水流声', 建筑: '厕所', 八仙: '铁拐李', 偏旁: '三点水' },
  '艮': { 自然: '山', 人体: '手', 动物: '狗', 家人: '少男', 声音: '山石声', 建筑: '门墙', 八仙: '蓝采和', 偏旁: '山字旁' },
  '坤': { 自然: '地', 人体: '腹', 动物: '牛', 家人: '母亲', 声音: '动土声', 建筑: '城市', 八仙: '仙姑', 偏旁: '土字旁' },
}

const yaoBodyParts = [
  '腿、脚、拇指',
  '腿、膝、肛门、生殖器',
  '腰、肚脐、腹部、臀部、生殖器',
  '胸、背、乳房、心口',
  '五官、脖子、臂、胸、背、手',
  '头、头发、面部、脸颊、两鬓',
]

const yaoFengShui = [
  '地基、水井、沟渠、河流、桥、邻居',
  '宅、灶、住家、屋内、正屋',
  '中门、里门、过厅、床、碓、碾子、墙壁、炕、为灶',
  '大门、窗户、厕所、客厅、院门',
  '路、住户、家主、走廊、楼梯、过道、人口',
  '屋顶、瓦梁、天棚、房盖、宗庙、祠堂、邻居',
]

const yaoFamilyMembers = [
  '子孙、晚辈',
  '妻子、女孩',
  '丈夫、兄弟',
  '妻子、妇女',
  '丈夫、父亲、长子、长女',
  '祖父母',
]

export function Liuyao() {
  const [yao, setYao] = useState(['yang', 'yang', 'yang', 'yang', 'yang', 'yang'])
  const [result, setResult] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipStates, setFlipStates] = useState(Array(6).fill(false))

  const generateRandomHexagram = () => {
    setIsFlipping(true)
    setFlipStates(Array(6).fill(true))
    
    // Start the coin flip animation
    setTimeout(() => {
      const newYao = Array(6).fill(null).map(() => generateRandomYao())
      setYao(newYao)
      setFlipStates(Array(6).fill(false))
      setIsFlipping(false)
    }, 500)
  }

  const handleYaoChange = (index: number) => {
    if (!isFlipping) {
      const newYao = [...yao]
      newYao[index] = newYao[index] === 'yang' ? 'yin' : 'yang'
      setYao(newYao)
    }
  }

  const interpretYao = () => {
    const lowerTrigram = yao.slice(0, 3).map(y => y === 'yang' ? '1' : '0').join('')
    const upperTrigram = yao.slice(3).map(y => y === 'yang' ? '1' : '0').join('')

    const trigramMap: { [key: string]: string } = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤'
    }

    const lowerGua = trigramMap[lowerTrigram]
    const upperGua = trigramMap[upperTrigram]

    let interpretation = `下卦为${lowerGua}，上卦为${upperGua}。\n\n`

    interpretation += '卦象解释：\n'
    interpretation += `下卦${lowerGua}：${Object.entries(baguaInfo[lowerGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n`
    interpretation += `上卦${upperGua}：${Object.entries(baguaInfo[upperGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n\n`

    interpretation += '爻位解释：\n'
    yao.forEach((y, index) => {
      interpretation += `第${index + 1}爻（${y === 'yang' ? '阳' : '阴'}）：\n`
      interpretation += `  人体：${yaoBodyParts[index]}\n`
      interpretation += `  风水：${yaoFengShui[index]}\n`
      interpretation += `  家庭成员：${yaoFamilyMembers[index]}\n\n`
    })

    setResult(interpretation)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>六爻解卦</CardTitle>
        <CardDescription>请选择每一爻的阴阳状态，然后点击解卦按钮</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4 mb-4">
            {yao.map((y, index) => (
              <button
                key={index}
                onClick={() => handleYaoChange(index)}
                className="focus:outline-none w-full aspect-square relative"
                disabled={isFlipping}
              >
                <div
                  className={`w-full h-full relative transition-transform duration-[500ms] preserve-3d ${
                    flipStates[index] ? 'animate-flip' : ''
                  }`}
                >
                  <img
                    src={y === 'yang' ? COIN_YANG : COIN_YIN}
                    alt={y === 'yang' ? '阳' : '阴'}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <Button onClick={generateRandomHexagram} className="flex-1" disabled={isFlipping}>
              随机生成卦象
            </Button>
            <Button onClick={interpretYao} className="flex-1" disabled={isFlipping}>
              解卦
            </Button>
          </div>
        </div>
        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}