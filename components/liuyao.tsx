'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { baguaInfo } from '@/lib/constants/bagua'
import { hexagramInfo } from '@/lib/constants/hexagram'
import { yaoBodyParts, yaoFengShui, yaoFamilyMembers } from '@/lib/constants/yao'
import { buildAiAnswer } from '@/lib/utils/analyze'

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

type Phase = 'idle' | 'throwing' | 'interpreting'

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

// 爻位可视化：阳爻为一长横，阴爻为两短横；变爻高亮
const YaoLine = ({ yao }: { yao: YaoType }) => {
  const base = "h-3 rounded-sm"
  const color = yao.changing ? "bg-red-500" : "bg-gray-800"
  if (yao.value === 'yang') {
    return <div className={`w-full ${base} ${color}`} />
  }
  return (
    <div className="w-full flex gap-4">
      <div className={`flex-1 ${base} ${color}`} />
      <div className={`flex-1 ${base} ${color}`} />
    </div>
  )
}

export function Liuyao() {
  const [question, setQuestion] = useState('')
  const [yao, setYao] = useState<YaoType[]>(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
  const [currentThrow, setCurrentThrow] = useState(0)
  const [result, setResult] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null)
  const [flippingCoins, setFlippingCoins] = useState<boolean[]>([false, false, false])
  const [showRules, setShowRules] = useState(false)

  const throwTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const throwIntervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const interpretTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 清理所有未完成的定时器，避免组件卸载或重新开始时残留
  const clearAllTimers = useCallback(() => {
    throwTimersRef.current.forEach(t => clearTimeout(t))
    throwTimersRef.current = []
    throwIntervalsRef.current.forEach(t => clearInterval(t))
    throwIntervalsRef.current = []
    if (interpretTimerRef.current) {
      clearTimeout(interpretTimerRef.current)
      interpretTimerRef.current = null
    }
  }, [])

  useEffect(() => () => clearAllTimers(), [clearAllTimers])

  const resetDivination = useCallback(() => {
    clearAllTimers()
    setYao(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
    setCurrentThrow(0)
    setResult('')
    setAiResult('')
    setPhase('idle')
    setFlippingIndex(null)
  }, [clearAllTimers])

  // 自动连续掷卦 6 次，每次之间留出动画时间
  const autoThrowAll = useCallback(() => {
    if (!question.trim()) return
    // 重置状态，准备重新卜卦
    clearAllTimers()
    setYao(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
    setResult('')
    setAiResult('')
    setCurrentThrow(0)
    setPhase('throwing')

    const newYao: YaoType[] = Array(6).fill({ value: 'yang', changing: false, name: '少阳' })

    // 每次掷卦 900ms：前 500ms 翻动，后 400ms 停留
    const STEP = 900
    for (let i = 0; i < 6; i++) {
      // 开始翻动：随机硬币面，并在翻动期间持续刷新
      const tStart = setTimeout(() => {
        setFlippingIndex(i)
        setFlippingCoins([Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5])
      }, i * STEP)
      throwTimersRef.current.push(tStart)

      // 翻动中持续刷新硬币面，制造翻面效果
      const intervalId = setInterval(() => {
        setFlippingCoins([Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5])
      }, 120)
      throwIntervalsRef.current.push(intervalId)

      // 落定：写入该爻结果，结束翻动
      const tEnd = setTimeout(() => {
        clearInterval(intervalId)
        const tr = throwCoins()
        newYao[i] = tr.yao
        setYao(newYao.map(y => ({ ...y })))
        setCurrentThrow(i + 1)
        setFlippingIndex(null)
      }, i * STEP + 500)
      throwTimersRef.current.push(tEnd)
    }

    // 6 次完成后进入解卦阶段
    const tInterpret = setTimeout(() => {
      setPhase('interpreting')
      interpretTimerRef.current = setTimeout(() => {
        interpretYao(newYao, question.trim())
        setPhase('idle')
      }, 600)
    }, 6 * STEP)
    throwTimersRef.current.push(tInterpret)
  }, [question, clearAllTimers])

  // 根据最终卦象与用户问题生成解读
  const interpretYao = (yaoArr: YaoType[], questionText: string) => {
    const lowerTrigram = yaoArr.slice(0, 3).map(y => y.value === 'yang' ? '1' : '0').join('')
    const upperTrigram = yaoArr.slice(3).map(y => y.value === 'yang' ? '1' : '0').join('')
    const fullHexagram = yaoArr.map(y => y.value === 'yang' ? '1' : '0').join('')

    const trigramMap: { [key: string]: string } = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤'
    }

    const lowerGua = trigramMap[lowerTrigram]
    const upperGua = trigramMap[upperTrigram]

    let interpretation = `下卦为${lowerGua}，上卦为${upperGua}。\n\n`

    if (hexagramInfo[fullHexagram]) {
      const { no, name, pinyin, qian, original, meaning } = hexagramInfo[fullHexagram]
      interpretation += `第${no}卦\n\n`
      interpretation += `卦名：${name}【${pinyin}】\n\n`
      interpretation += `原文：${original}\n\n`
      interpretation += `吉凶：${qian}\n\n`
      interpretation += `解释：${meaning}\n\n`

      // 针对用户问题的 AI 分析（传入卦象与变爻信息）
      setAiResult(questionText ? buildAiAnswer(questionText, hexagramInfo[fullHexagram], yaoArr) : '')
    } else {
      interpretation += `未找到对应的卦象解释（二进制码：${fullHexagram}）\n\n`
      setAiResult('')
    }

    interpretation += '爻位解释：\n\n'
    yaoArr.forEach((y, index) => {
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

  const canStart = question.trim().length > 0 && phase === 'idle'
  const isBusy = phase === 'throwing' || phase === 'interpreting'

  return (
    <div className="relative min-h-screen py-8 px-4 bg-gradient-to-b from-amber-50 via-white to-stone-100">
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

      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-800">六爻卜卦</h1>
          <p className="text-sm text-stone-500 mt-2">
            诚心静气，默念所问之事，输入问题后系统自动起卦解卦
          </p>
        </header>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">卜卦</CardTitle>
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

            {/* 问题输入区 */}
            <div className="mb-6 p-4 rounded-lg bg-amber-50/60 border border-amber-200">
              <label htmlFor="question" className="block text-sm font-medium text-stone-700 mb-2">
                请输入您要卜问之事
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：我近期的事业前景如何？这段感情是否值得继续？"
                rows={3}
                disabled={isBusy}
                className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault()
                    if (canStart) autoThrowAll()
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2 text-xs text-stone-500">
                <span>提示：心诚则灵，一事不重卦（⌘/Ctrl + Enter 快速起卦）</span>
                <span>{question.length}/100</span>
              </div>
            </div>

            {/* 卦象可视化：自下而上排列 6 爻 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">卦象</span>
                <span className="text-xs text-stone-500">
                  {currentThrow < 6 ? `已掷 ${currentThrow} / 6 爻` : '六爻已成，可解卦'}
                </span>
              </div>
              <div className="flex flex-col-reverse gap-3 p-4 rounded-lg bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-200">
                {yao.map((y, index) => {
                  const isFlipping = flippingIndex === index
                  const isDone = index < currentThrow
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-stone-500 w-12 shrink-0">第{index + 1}爻</span>
                      <div className="flex-1 min-w-0 flex items-center justify-center">
                        {isFlipping ? (
                          // 翻动中：显示三枚硬币翻转动画
                          <div className="flex gap-2 justify-center animate-flip">
                            {flippingCoins.map((isYang, coinIndex) => (
                              <img
                                key={coinIndex}
                                src={isYang ? COIN_YANG : COIN_YIN}
                                alt={isYang ? '正面' : '反面'}
                                className="h-6 w-6"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={`transition-all duration-300 ${isDone ? 'opacity-100' : 'opacity-25'}`}>
                            <YaoLine yao={y} />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 w-16 text-right shrink-0">
                        {isDone ? y.name : isFlipping ? '起卦中…' : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              {canStart || isBusy ? (
                <Button
                  onClick={autoThrowAll}
                  className="flex-1"
                  disabled={isBusy}
                  title={canStart ? '输入问题后自动起卦' : ''}
                >
                  {phase === 'throwing'
                    ? '正在起卦…'
                    : phase === 'interpreting'
                      ? '正在解卦…'
                      : currentThrow === 6
                        ? '重新起卦'
                        : '开始起卦'}
                </Button>
              ) : null}
              {currentThrow === 6 && phase === 'idle' && (
                <Button onClick={resetDivination} className="flex-1" variant="outline">
                  清空重来
                </Button>
              )}
            </div>

            {/* 起卦进度提示 */}
            {phase === 'throwing' && (
              <div className="mt-4 text-sm text-amber-700 animate-pulse">
                诚心默念所问之事，铜钱翻转中…
              </div>
            )}
            {phase === 'interpreting' && (
              <div className="mt-4 text-sm text-stone-600 animate-pulse">
                卦象已成，正在为您解析…
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI 针对性解读 */}
        {aiResult && (
          <Card className="w-full mt-6 shadow-sm border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-amber-800">
                AI 针对性解读
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-stone-700 leading-relaxed">{aiResult}</pre>
            </CardContent>
          </Card>
        )}

        {/* 传统详细解读 */}
        {result && (
          <Card className="w-full mt-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">详细卦象解读</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-stone-700 leading-relaxed">{result}</pre>
            </CardContent>
          </Card>
        )}
      </div>

      <RulesDialog
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  )
}
