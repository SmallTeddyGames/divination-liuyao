'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { baguaInfo } from '@/lib/constants/bagua'
import { hexagramInfo } from '@/lib/constants/hexagram'
import { yaoBodyParts, yaoFengShui, yaoFamilyMembers } from '@/lib/constants/yao'

const COIN_YANG = "https://smallteddygames.github.io/divination-liuyao/coin-yang.png"
const COIN_YIN = "https://smallteddygames.github.io/divination-liuyao/coin-yin.png"

const generateRandomYao = () => {
  return Math.random() < 0.5 ? 'yin' : 'yang';
}

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
    const fullHexagram = yao.map(y => y === 'yang' ? '1' : '0').join('')

    const trigramMap: { [key: string]: string } = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤'
    }

    const lowerGua = trigramMap[lowerTrigram]
    const upperGua = trigramMap[upperTrigram]

    let interpretation = `下卦为${lowerGua}，上卦为${upperGua}。\n\n`

    // 添加六十四卦的解释
    if (hexagramInfo[fullHexagram]) {
      const { name, pinyin, meaning, description } = hexagramInfo[fullHexagram]
      interpretation += `卦名：${name}\n`
      interpretation += `拼音：${pinyin}\n`
      interpretation += `卦意：${meaning}\n`
      interpretation += `解释：${description}\n\n`
    }

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
