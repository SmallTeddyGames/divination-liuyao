'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { baguaInfo } from '@/lib/constants/bagua'
import { hexagramInfo } from '@/lib/constants/hexagram'
import { yaoBodyParts, yaoFengShui, yaoFamilyMembers } from '@/lib/constants/yao'

const COIN_YANG = "https://smallteddygames.github.io/divination-liuyao/coin-yang.png"
const COIN_YIN = "https://smallteddygames.github.io/divination-liuyao/coin-yin.png"
const RIGHT_ALLOW = "https://smallteddygames.github.io/divination-liuyao/right-allow.png"

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

// 添加 GitHub 图标组件
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-gray-700 hover:text-gray-900"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

// 规则说明组件
const RulesDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">占卦规则说明</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">一、硬币摇卦法说明</h3>
              <p>1、一背面两字面：少阳🌱</p>
              <p>2、两背面一字面：少阴🍃</p>
              <p>3、三个字面：老阴🌺（变爻）</p>
              <p>4、三个背面：老阳☀️（变爻）</p>
              <div className="flex items-center space-x-2 mt-2">
                <img src={COIN_YANG} alt="正面" className="w-6 h-6" />
                <img src={RIGHT_ALLOW} alt="右" className="w-6 h-6" />
                <span>正面</span>
                <img src={COIN_YIN} alt="反面" className="w-6 h-6" />
                <img src={RIGHT_ALLOW} alt="右" className="w-6 h-6" />
                <span>反面</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">二、可测内容</h3>
              <div>大象、运势、事业、经商、求名、婚恋、决策、时运、财运、家宅、身体、疾病、胎孕、家运、子女、周转、买卖、等人、寻人、失物、外出、考试、诉讼、求事、改行、开业</div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">三、周易五不测</h3>
              <div className="space-y-2">
                <p>1、不动不测。万物变动兆于机，事物变化之前都有先兆，能够把握就占得先机；事物未动则不需要占，如一场体育比赛，时间、地点、参加人员都还没有确定，不用预测</p>
                <p>2、不诚不测。以现代话说，易经反映出整体论、系统论、全息论的特色，万物生命是一个整体，特别是测的人与被占者的心理有直接的关系，常言心诚则灵，念力，意念发动有力，也是信息的发射，感应自然万物接收。心不诚，念不纯，影响信息的准确性</p>
                <p>3、不正不测。违背良知之事，非法之事，自然不应。道德二字，现在变成一个词，变成说教。其实不是，道德，大道为先，德行居后，合与道才有德，有德方合于道。所谓无道无良，无法无天，如一些腐败分子害怕东窗事发，烧香求佑，最后锒铛入狱，徒增笑柄</p>
                <p>4、重卦不测。比如测事情，已经占得了一卦，又想再起一卦看是否相符，不能保证预测的准确性</p>
                <p>5、没事不测。没有事情，不用测，吃饭时占一卦看吃几碗饭能饱，头脑心理都有病；抱着玩玩看的心理，也不要测，测也不准</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Liuyao() {
  const [yao, setYao] = useState<YaoType[]>(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
  const [throwResults, setThrowResults] = useState<ThrowResult[]>([])
  const [currentThrow, setCurrentThrow] = useState(0)
  const [result, setResult] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [showRules, setShowRules] = useState(false);

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
      const { no, name, pinyin, qian, original, meaning, description } = hexagramInfo[fullHexagram]
      interpretation += `第${no}卦\n\n`
      interpretation += `卦名：${name}【${pinyin}】\n\n`
      interpretation += `原文：${original}\n\n`
      interpretation += `吉凶：${qian}\n\n`
      // interpretation += `卦象：${description}\n\n`
      interpretation += `解释：${meaning}\n\n`
    } else {
      interpretation += `未找到对应的卦象解释（二进制码：${fullHexagram}）\n\n`
    }

    interpretation += '爻位解释：\n\n'
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

    interpretation += '卦象解释：\n\n'
    interpretation += `下卦${lowerGua}：${Object.entries(baguaInfo[lowerGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n\n`
    interpretation += `上卦${upperGua}：${Object.entries(baguaInfo[upperGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n\n`

    setResult(interpretation)
  }

  return (
    <div className="relative">
      {/* GitHub 链接 */}
      <a
        href="https://github.com/SmallTeddyGames/divination-liuyao"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 z-10"
        title="View on GitHub"
      >
        <GitHubIcon />
      </a>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-bold">六爻卜卦</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowRules(true)}
              className="text-sm"
            >
              查看规则说明
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 mb-4">
            ‌六爻卜卦‌是一种起源于周朝时期的占卜方法，主要基于易经的原理。六爻卜卦通过掷铜钱六次来形成卦象，每次掷出的结果（正面或反面）决定了一个爻是阳爻（正面）还是阴爻（反面）。六个爻组合在一起形成一个完整的卦象，称为六爻卦‌。<br />
          </div>
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
                  <span className="text-gray-500">
                    <img src={RIGHT_ALLOW} alt="右" className="w-6 h-6" />
                  </span>
                  <span className="text-gray-600">
                    {result.coins.map(isYang => isYang ? '正' : '反').join('')}
                  </span>
                  <span className="text-gray-500">
                    <img src={RIGHT_ALLOW} alt="右" className="w-6 h-6" />
                  </span>
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

      <RulesDialog
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  )
}
