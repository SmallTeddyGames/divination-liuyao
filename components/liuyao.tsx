'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { baguaInfo } from '@/lib/constants/bagua'
import { hexagramInfo } from '@/lib/constants/hexagram'
import { yaoBodyParts, yaoFengShui, yaoFamilyMembers } from '@/lib/constants/yao'

const COIN_YANG = "https://smallteddygames.github.io/divination-liuyao/coin-yang.png"
const COIN_YIN = "https://smallteddygames.github.io/divination-liuyao/coin-yin.png"

type YaoType = {
  value: 'yin' | 'yang',
  changing: boolean,
  name: string
}

type ThrowResult = {
  coins: boolean[],  // true代表正面（字），false代表背面
  yao: YaoType
}

const throwCoins = (): ThrowResult => {
  const coins = [
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5
  ]
  
  const yangCount = coins.filter(c => c).length
  
  let yao: YaoType
  switch (yangCount) {
    case 3:
      yao = { value: 'yin', changing: true, name: '老阴' }
      break
    case 2:
      yao = { value: 'yin', changing: false, name: '少阴' }
      break
    case 1:
      yao = { value: 'yang', changing: false, name: '少阳' }
      break
    case 0:
      yao = { value: 'yang', changing: true, name: '老阳' }
      break
    default:
      yao = { value: 'yang', changing: false, name: '少阳' }
  }

  return { coins, yao }
}

export function Liuyao() {
  const [yao, setYao] = useState<YaoType[]>(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
  const [throwResults, setThrowResults] = useState<ThrowResult[]>([])
  const [currentThrow, setCurrentThrow] = useState(0)
  const [result, setResult] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)

  const throwNextCoins = () => {
    if (currentThrow >= 6) return

    setIsFlipping(true)
    
    setTimeout(() => {
      const throwResult = throwCoins()
      const newThrowResults = [...throwResults, throwResult]
      setThrowResults(newThrowResults)
      
      const newYao = [...yao]
      newYao[currentThrow] = throwResult.yao
      setYao(newYao)
      
      setCurrentThrow(prev => prev + 1)
      setIsFlipping(false)
    }, 500)
  }

  const resetDivination = () => {
    setYao(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
    setThrowResults([])
    setCurrentThrow(0)
    setResult('')
  }

  const interpretYao = () => {
    const lowerTrigram = yao.slice(0, 3).map(y => y.value === 'yang' ? '1' : '0').join('')
    const upperTrigram = yao.slice(3).map(y => y.value === 'yang' ? '1' : '0').join('')
    const fullHexagram = yao.map(y => y.value === 'yang' ? '1' : '0').join('')

    const trigramMap: { [key: string]: string } = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤'
    }

    const lowerGua = trigramMap[lowerTrigram]
    const upperGua = trigramMap[upperTrigram]

    let interpretation = `下卦为${lowerGua}，上卦为${upperGua}。\n\n`

    if (hexagramInfo[fullHexagram]) {
      const { no, name, pinyin, meaning, description } = hexagramInfo[fullHexagram]
      interpretation += `第${no}卦\n`
      interpretation += `卦名：${name}\n`
      interpretation += `拼音：${pinyin}\n`
      interpretation += `卦意：${meaning}\n`
      interpretation += `解释：${description}\n\n`
    } else {
      interpretation += `未找到对应的卦象解释（二进制码：${fullHexagram}）\n\n`
    }

    interpretation += '爻位解释：\n'
    yao.forEach((y, index) => {
      interpretation += `第${index + 1}爻（${y.name}）：\n`
      interpretation += `  人体：${yaoBodyParts[index]}\n`
      interpretation += `  风水：${yaoFengShui[index]}\n`
      interpretation += `  家庭成员：${yaoFamilyMembers[index]}\n`
      if (y.changing) {
        interpretation += `  ⚠️ 此爻为变爻\n`
      }
      interpretation += '\n'
    })

    interpretation += '卦象解释：\n'
    interpretation += `下卦${lowerGua}：${Object.entries(baguaInfo[lowerGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n`
    interpretation += `上卦${upperGua}：${Object.entries(baguaInfo[upperGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n`

    setResult(interpretation)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>六爻解卦</CardTitle>
        <CardDescription>
          三枚硬币摇卦法说明：<br />
          1. 一背面两字面：少阳🌱<br />
          2. 两背面一字面：少阴🍃<br />
          3. 三个字面：老阴🌺（变爻）<br />
          4. 三个背面：老阳☀️（变爻）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 显示投掷结果历史 */}
          <div className="space-y-2">
            {throwResults.map((result, index) => (
              <div key={index} className="flex items-center space-x-4 p-2 bg-gray-100 rounded">
                <span className="font-bold">第{index + 1}次：</span>
                <div className="flex space-x-2">
                  {result.coins.map((isYang, coinIndex) => (
                    <img
                      key={coinIndex}
                      src={isYang ? COIN_YANG : COIN_YIN}
                      alt={isYang ? '正面' : '反面'}
                      className="w-6 h-6"
                    />
                  ))}
                </div>
                <span className="text-gray-500">→</span>
                <span className="text-gray-600">
                  {result.coins.map(isYang => isYang ? '正' : '反').join('')}
                </span>
                <span className="text-gray-500">→</span>
                <span className="font-medium">{result.yao.name}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {currentThrow < 6 ? (
              <Button 
                onClick={throwNextCoins} 
                className="flex-1" 
                disabled={isFlipping}
              >
                投掷硬币（第{currentThrow + 1}次）
              </Button>
            ) : (
              <>
                <Button onClick={interpretYao} className="flex-1">
                  解卦
                </Button>
                <Button onClick={resetDivination} className="flex-1" variant="outline">
                  重新开始
                </Button>
              </>
            )}
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
