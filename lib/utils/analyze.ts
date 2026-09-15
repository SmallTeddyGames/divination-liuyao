import { HexagramInfoType } from "@types"

// 六爻卜卦：6 爻位含义（自下而上：初爻=index 0，上爻=index 5）
// 变爻所在爻位，提示事情变化发生在哪个阶段
const YAO_POSITIONS: { name: string; stage: string }[] = [
  { name: '初爻', stage: '事情初始、根基阶段' },
  { name: '二爻', stage: '内部基础、低位阶段' },
  { name: '三爻', stage: '中间过渡、转折阶段' },
  { name: '四爻', stage: '外部介入、上升阶段' },
  { name: '五爻', stage: '核心地位、主事阶段' },
  { name: '上爻', stage: '结局收尾、终极阶段' },
]

// 问题分类：每个分类对应一组带权重的关键词
// 长词/具体词权重高，单字短词权重低，避免误匹配
type Category = {
  section: string          // 卦象 meaning 中【xxx】章节标题
  label: string            // 分类显示名
  keywords: { word: string; weight: number }[]
}

const CATEGORIES: Category[] = [
  // 疾病健康 - 单字"病/疾"权重低，长词权重高
  {
    section: '疾病', label: '疾病健康',
    keywords: [
      { word: '病情', weight: 6 }, { word: '疾病', weight: 6 }, { word: '治病', weight: 6 },
      { word: '康复', weight: 5 }, { word: '痊愈', weight: 6 }, { word: '调养', weight: 5 },
      { word: '病变', weight: 6 }, { word: '癌症', weight: 6 }, { word: '肿瘤', weight: 6 },
      { word: '手术', weight: 5 }, { word: '住院', weight: 5 }, { word: '诊断', weight: 5 },
      { word: '病', weight: 3 }, { word: '疾', weight: 3 },
    ],
  },
  {
    section: '胎孕', label: '胎孕生育',
    keywords: [
      { word: '怀孕', weight: 6 }, { word: '备孕', weight: 6 }, { word: '胎孕', weight: 6 },
      { word: '生子', weight: 6 }, { word: '生女', weight: 6 }, { word: '流产', weight: 6 },
      { word: '安胎', weight: 5 }, { word: '胎儿', weight: 6 }, { word: '孕', weight: 4 },
    ],
  },
  {
    section: '子女', label: '子女晚辈',
    keywords: [
      { word: '子女', weight: 6 }, { word: '孩子', weight: 6 }, { word: '儿女', weight: 6 },
      { word: '子孙', weight: 6 }, { word: '晚辈', weight: 6 }, { word: '后代', weight: 6 },
    ],
  },
  // 婚恋感情：多用复合词，避免"情""爱"等单字误匹配（如"心情""爱好"）
  {
    section: '婚恋', label: '婚姻感情',
    keywords: [
      { word: '结婚', weight: 6 }, { word: '离婚', weight: 6 }, { word: '婚姻', weight: 6 },
      { word: '恋爱', weight: 6 }, { word: '感情', weight: 6 }, { word: '情侣', weight: 6 },
      { word: '复合', weight: 6 }, { word: '表白', weight: 6 }, { word: '姻缘', weight: 6 },
      { word: '桃花', weight: 6 }, { word: '脱单', weight: 6 }, { word: '单身', weight: 5 },
      { word: '男友', weight: 6 }, { word: '女友', weight: 6 }, { word: '男朋友', weight: 6 },
      { word: '女朋友', weight: 6 }, { word: '夫妻', weight: 6 }, { word: '配偶', weight: 6 },
      { word: '对象', weight: 5 }, { word: '回心转意', weight: 6 },
    ],
  },
  {
    section: '考试', label: '考试考证',
    keywords: [
      { word: '考试', weight: 6 }, { word: '考公', weight: 6 }, { word: '考研', weight: 6 },
      { word: '高考', weight: 6 }, { word: '中考', weight: 6 }, { word: '考级', weight: 6 },
      { word: '面试', weight: 6 }, { word: '资格证', weight: 6 }, { word: '资格', weight: 5 },
    ],
  },
  {
    section: '诉讼', label: '官司纠纷',
    keywords: [
      { word: '官司', weight: 6 }, { word: '诉讼', weight: 6 }, { word: '纠纷', weight: 6 },
      { word: '仲裁', weight: 6 }, { word: '维权', weight: 6 }, { word: '起诉', weight: 6 },
      { word: '被告', weight: 5 }, { word: '原告', weight: 5 },
    ],
  },
  {
    section: '寻人', label: '寻人访友',
    keywords: [
      { word: '寻人', weight: 6 }, { word: '找人', weight: 6 }, { word: '走失', weight: 6 },
      { word: '失踪', weight: 6 }, { word: '访友', weight: 6 },
    ],
  },
  {
    section: '等人', label: '等人赴约',
    keywords: [
      { word: '等人', weight: 6 }, { word: '赴约', weight: 6 }, { word: '相聚', weight: 6 },
      { word: '来不来', weight: 6 }, { word: '会不会来', weight: 6 }, { word: '见面', weight: 5 },
      { word: '等', weight: 2 },
    ],
  },
  {
    section: '失物', label: '寻物失物',
    keywords: [
      { word: '失物', weight: 6 }, { word: '遗失', weight: 6 }, { word: '找东西', weight: 6 },
      { word: '丢了', weight: 6 }, { word: '失而复得', weight: 6 }, { word: '丢失', weight: 6 },
    ],
  },
  {
    section: '外出', label: '出行外出',
    keywords: [
      { word: '外出', weight: 6 }, { word: '出行', weight: 6 }, { word: '出差', weight: 6 },
      { word: '远行', weight: 6 }, { word: '迁徙', weight: 6 }, { word: '旅游', weight: 6 },
      { word: '旅行', weight: 6 }, { word: '出国', weight: 6 },
    ],
  },
  {
    section: '改行', label: '转行跳槽',
    keywords: [
      { word: '改行', weight: 6 }, { word: '转行', weight: 6 }, { word: '跳槽', weight: 6 },
      { word: '换工作', weight: 6 }, { word: '转型', weight: 6 },
    ],
  },
  {
    section: '开业', label: '开业开张',
    keywords: [
      { word: '开业', weight: 6 }, { word: '开张', weight: 6 }, { word: '开店', weight: 6 },
      { word: '开公司', weight: 6 }, { word: '创立', weight: 5 },
    ],
  },
  {
    section: '经商', label: '经商生意',
    keywords: [
      { word: '经商', weight: 6 }, { word: '生意', weight: 6 }, { word: '合伙人', weight: 6 },
      { word: '投资', weight: 6 }, { word: '店铺', weight: 5 }, { word: '商业', weight: 5 },
      { word: '商', weight: 2 },
    ],
  },
  {
    section: '买卖', label: '买卖交易',
    keywords: [
      { word: '买卖', weight: 6 }, { word: '置办', weight: 6 }, { word: '购置', weight: 6 },
      { word: '出售', weight: 6 }, { word: '买进', weight: 6 }, { word: '卖出', weight: 6 },
    ],
  },
  {
    section: '周转', label: '资金周转',
    keywords: [
      { word: '周转', weight: 6 }, { word: '借款', weight: 6 }, { word: '贷款', weight: 6 },
      { word: '欠债', weight: 6 }, { word: '还钱', weight: 6 }, { word: '融资', weight: 6 },
      { word: '债务', weight: 6 },
    ],
  },
  {
    section: '财运', label: '财运求财',
    keywords: [
      { word: '财运', weight: 6 }, { word: '求财', weight: 6 }, { word: '进财', weight: 6 },
      { word: '破财', weight: 6 }, { word: '赚钱', weight: 6 }, { word: '亏钱', weight: 6 },
      { word: '收益', weight: 5 }, { word: '发财', weight: 6 }, { word: '财富', weight: 6 },
    ],
  },
  {
    section: '求事', label: '求职求事',
    keywords: [
      { word: '求职', weight: 6 }, { word: '找工作', weight: 6 }, { word: '求事', weight: 6 },
      { word: '应聘', weight: 6 }, { word: '入职', weight: 6 },
    ],
  },
  {
    section: '事业', label: '事业工作',
    keywords: [
      { word: '事业', weight: 6 }, { word: '工作', weight: 6 }, { word: '前途', weight: 6 },
      { word: '前程', weight: 6 }, { word: '升职', weight: 6 }, { word: '晋升', weight: 6 },
      { word: '创业', weight: 6 }, { word: '职场', weight: 6 }, { word: '发展', weight: 4 },
    ],
  },
  {
    section: '求名', label: '名声名望',
    keywords: [
      { word: '求名', weight: 6 }, { word: '名声', weight: 6 }, { word: '声望', weight: 6 },
      { word: '名誉', weight: 6 }, { word: '成名', weight: 6 }, { word: '出名', weight: 6 },
      { word: '品牌', weight: 5 },
    ],
  },
  {
    section: '家运', label: '家运家事',
    keywords: [
      { word: '家运', weight: 6 }, { word: '家事', weight: 6 }, { word: '家庭', weight: 6 },
      { word: '家中', weight: 5 }, { word: '家里', weight: 5 },
    ],
  },
  {
    section: '家宅', label: '宅居风水',
    keywords: [
      { word: '家宅', weight: 6 }, { word: '风水', weight: 6 }, { word: '装修', weight: 6 },
      { word: '买房', weight: 6 }, { word: '住房', weight: 6 }, { word: '宅居', weight: 6 },
    ],
  },
  {
    section: '身体', label: '身体保健',
    keywords: [
      { word: '身体', weight: 6 }, { word: '健康', weight: 6 }, { word: '保健', weight: 6 },
      { word: '养生', weight: 6 }, { word: '体能', weight: 5 },
    ],
  },
  {
    section: '决策', label: '决策抉择',
    keywords: [
      { word: '决策', weight: 6 }, { word: '决定', weight: 6 }, { word: '抉择', weight: 6 },
      { word: '选择', weight: 6 }, { word: '要不要', weight: 6 }, { word: '该不该', weight: 6 },
      { word: '能不能', weight: 5 }, { word: '可以吗', weight: 5 }, { word: '是否', weight: 5 },
    ],
  },
  {
    section: '运势', label: '总体运势',
    keywords: [
      { word: '运势', weight: 6 }, { word: '运气', weight: 6 }, { word: '流年', weight: 6 },
      { word: '今年', weight: 5 }, { word: '近期', weight: 5 }, { word: '本月', weight: 5 },
      { word: '本年', weight: 5 },
    ],
  },
  {
    section: '时运', label: '时运时机',
    keywords: [
      { word: '时运', weight: 6 }, { word: '时机', weight: 6 }, { word: '机会', weight: 5 },
      { word: '机遇', weight: 5 },
    ],
  },
]

// 从 meaning 文本中提取指定章节的内容
// meaning 章节格式为「【章节名】内容」，内容直到下一个【或字符串末尾
export function extractSection(meaning: string, section: string): string | null {
  if (!meaning || !section) return null
  const startIdx = meaning.indexOf(`【${section}】`)
  if (startIdx === -1) return null
  const contentStart = startIdx + section.length + 2 // 跳过 【section】
  const nextSectionIdx = meaning.indexOf('【', contentStart)
  const content = nextSectionIdx === -1
    ? meaning.slice(contentStart)
    : meaning.slice(contentStart, nextSectionIdx)
  return content.trim().replace(/^[,，。、\s]+/, '').trim()
}

// 提取卦象的"叙事前言"：meaning 中第一个【之前的整段文字
// 这段话阐述该卦的整体象征与精神内核
export function extractIntro(meaning: string): string {
  if (!meaning) return ''
  const firstSection = meaning.indexOf('【')
  const intro = firstSection === -1 ? meaning : meaning.slice(0, firstSection)
  return intro.trim().replace(/\s+/g, ' ')
}

// 爻类型（避免与组件内部类型耦合，此处独立定义）
export type YaoLike = {
  value: 'yin' | 'yang'
  changing: boolean
  name: string
}

export type AnalysisResult = {
  matchedCategory: Category | null
  matchedSection: string | null
  hasSection: boolean
  fallbackSections: { section: string; content: string }[]
  intro: string
}

// 基于用户问题，按关键词评分匹配最相关的卦象章节
export function analyzeQuestion(question: string, hexagram: HexagramInfoType): AnalysisResult {
  const q = (question || '').trim()

  // 兜底章节：始终包含【运势】【大象】【决策】，按命中优先级排序
  const fallbackKeys = ['运势', '大象', '决策', '时运']
  const fallbackSections: { section: string; content: string }[] = []
  for (const sec of fallbackKeys) {
    const content = extractSection(hexagram.meaning, sec)
    if (content) fallbackSections.push({ section: sec, content })
  }

  const intro = extractIntro(hexagram.meaning)

  if (!q) {
    return { matchedCategory: null, matchedSection: null, hasSection: false, fallbackSections, intro }
  }

  // 评分匹配：每个分类累计其命中的关键词权重
  const scored = CATEGORIES.map(cat => {
    let score = 0
    for (const kw of cat.keywords) {
      if (q.includes(kw.word)) score += kw.weight
    }
    return { category: cat, score }
  }).filter(s => s.score > 0)

  if (scored.length === 0) {
    return { matchedCategory: null, matchedSection: null, hasSection: false, fallbackSections, intro }
  }

  // 取分数最高的分类（同分时按 CATEGORIES 顺序优先）
  scored.sort((a, b) => b.score - a.score)
  const matched = scored[0].category
  const sectionContent = extractSection(hexagram.meaning, matched.section)

  return {
    matchedCategory: matched,
    matchedSection: sectionContent,
    hasSection: !!sectionContent,
    fallbackSections,
    intro,
  }
}

// 生成针对用户问题的 AI 风格解读
// yaoArr 用于识别变爻，是六爻卜卦最关键的判断依据
export function buildAiAnswer(
  question: string,
  hexagram: HexagramInfoType,
  yaoArr: YaoLike[] = [],
): string {
  const q = (question || '').trim()
  if (!q) return ''

  const analysis = analyzeQuestion(question, hexagram)
  const changingIndices: number[] = []
  yaoArr.forEach((y, i) => {
    if (y.changing) changingIndices.push(i)
  })

  const lines: string[] = []

  // 1. 针对您的问题
  lines.push('【针对您的问题】')
  lines.push(`您所问：「${q}」`)
  if (analysis.matchedCategory) {
    lines.push(`此问主要关乎「${analysis.matchedCategory.label}」一事。`)
  } else {
    lines.push(`此问未直接对应传统专章，将从卦象总体格局为您分析。`)
  }
  lines.push('')

  // 2. 卦象总览（含叙事前言）
  lines.push('【卦象总览】')
  lines.push(`所占得：${hexagram.name}`)
  lines.push(`吉凶等级：${hexagram.qian}`)
  if (analysis.intro) {
    lines.push(`卦象精神：${analysis.intro}`)
  }
  // 大象总论：卦象的精神内核
  const daxiang = analysis.fallbackSections.find(s => s.section === '大象')
  if (daxiang) {
    lines.push(`大象总论：${daxiang.content}`)
  }
  lines.push('')

  // 3. 变爻分析：六爻卜卦的核心
  lines.push('【变爻分析】')
  if (changingIndices.length === 0) {
    lines.push('本卦无变爻，以卦辞总论为主，看整体格局而不拘于单爻之变。')
    lines.push('此情形下，所问之事当依卦象整体大象与吉凶综合判断。')
  } else if (changingIndices.length === 1) {
    const idx = changingIndices[0]
    const pos = YAO_POSITIONS[idx]
    lines.push(`本卦第 ${idx + 1} 爻（${pos.name}）为变爻，事情变化发生在${pos.stage}。`)
    lines.push('六爻卜卦中，独爻变则该爻为动爻，所问之事的关键转折即在此爻所示之位。')
  } else {
    const descs = changingIndices.map(i => `第 ${i + 1} 爻（${YAO_POSITIONS[i].name}）`).join('、')
    lines.push(`本卦有多处变爻：${descs}。`)
    lines.push('多变爻之卦，事态复杂、变化多端，宜综合卦辞与各变爻之位综合参断。')
  }
  lines.push('')

  // 4. 专项解读（命中的主章节）
  if (analysis.matchedCategory && analysis.hasSection && analysis.matchedSection) {
    lines.push(`【${analysis.matchedCategory.label}专项解读】`)
    lines.push(analysis.matchedSection)
    lines.push('')
  } else if (analysis.matchedCategory && !analysis.hasSection) {
    lines.push(`【${analysis.matchedCategory.label}参考】`)
    lines.push(`此卦中未直接列出「${analysis.matchedCategory.label}」专章，下面以总体运势与时运为参考：`)
    lines.push('')
    const yunshi = analysis.fallbackSections.find(s => s.section === '运势')
    if (yunshi) {
      lines.push(`总体运势：${yunshi.content}`)
      lines.push('')
    }
  }

  // 5. 多角度参考：除主章节外的辅助章节
  lines.push('【多角度参考】')
  const auxSections = ['时运', '运势', '决策']
  let auxAdded = 0
  for (const sec of auxSections) {
    if (sec === analysis.matchedCategory?.section) continue // 跳过已是主章节的
    const content = extractSection(hexagram.meaning, sec)
    if (content) {
      lines.push(`${sec}：${content}`)
      auxAdded++
      if (auxAdded >= 2) break // 至多 2 条辅助参考，避免冗长
    }
  }
  if (auxAdded === 0) {
    lines.push('（卦象中无可供多角度参考的辅助章节，请以专项解读与综合分析为准。）')
  }
  lines.push('')

  // 6. AI 综合分析：真正合成式建议
  lines.push('【AI 综合分析】')
  lines.push(synthesizeAdvice(q, hexagram, analysis, changingIndices))

  return lines.join('\n')
}

// 合成式建议：结合卦象、吉凶、变爻、命中的章节内容，给出针对性的综合建议
// 不再是按吉凶等级的模板话术
function synthesizeAdvice(
  question: string,
  hexagram: HexagramInfoType,
  analysis: AnalysisResult,
  changingIndices: number[],
): string {
  const qianLevel = parseQianLevel(hexagram.qian)
  const hexagramShortName = extractShortName(hexagram.name)

  const parts: string[] = []

  // 开篇：定位卦象格局与所问之事的关系
  parts.push(`综合「${hexagramShortName} · ${hexagram.qian}」的整体格局来看，您所问之事`)
  if (analysis.matchedCategory) {
    parts.push(`在「${analysis.matchedCategory.label}」上`)
  }
  parts.push(`呈现出${qianLevel.tone}的基本态势。`)

  // 中段：依据吉凶等级，给出方向性判断（结合变爻）
  parts.push(qianLevel.guidance)
  if (changingIndices.length === 1) {
    parts.push(`本卦独 ${YAO_POSITIONS[changingIndices[0]].name} 为动爻，提示变化的关键转折点已现，宜顺势而谋、不可执意强求。`)
  } else if (changingIndices.length > 1) {
    parts.push(`本卦多处变爻，事态变化多端，宜稳中观变、谋定后动。`)
  } else {
    parts.push(`本卦无变爻，整体格局稳定，所问之事当以大象与吉凶为主轴判断。`)
  }

  // 中段：引用主章节内容的关键片段，体现"针对性"
  if (analysis.matchedSection) {
    const keyPhrase = pickKeyPhrase(analysis.matchedSection)
    if (keyPhrase) {
      parts.push(`卦象在「${analysis.matchedCategory?.label}」一事上明示：${keyPhrase}。`)
    }
  } else if (analysis.matchedCategory) {
    // 命中分类但卦象无对应章节
    const yunshi = analysis.fallbackSections.find(s => s.section === '运势')
    if (yunshi) {
      const keyPhrase = pickKeyPhrase(yunshi.content)
      if (keyPhrase) {
        parts.push(`虽此卦未列「${analysis.matchedCategory.label}」专章，但总体运势所示：${keyPhrase}。`)
      }
    }
  }

  // 结尾：连接用户问题，给出收敛性建议
  parts.push('综上，宜以诚敬之心待人接物、以审慎之态处事谋事，顺天时、尽人事，方能使卦象所示之吉向稳固、凶向转化。')

  return parts.join('')
}

// 解析吉凶等级，返回对应的"基调描述"与"方向性指导"
function parseQianLevel(qian: string): { tone: string; guidance: string } {
  if (qian.includes('上上')) {
    return {
      tone: '极为顺遂、吉上加吉',
      guidance: '卦象大吉，所问之事整体势头强旺，宜把握良机、顺势而为，不必过度犹豫迟疑。',
    }
  }
  if (qian.includes('中上') || qian.includes('上卦')) {
    return {
      tone: '偏向顺遂、势头向好',
      guidance: '卦象偏吉，所问之事势头向好，宜积极进取、把握时机；惟须防盛极而衰、戒骄戒躁，方能使吉象稳固。',
    }
  }
  if (qian.includes('下下')) {
    return {
      tone: '颇为艰难、势头偏弱',
      guidance: '卦象偏凶，所问之事当下势头偏弱，不宜急进、不宜强求，宜暂缓行动、静观待时，借卦警醒、修德改过，化凶为吉。',
    }
  }
  if (qian.includes('中下')) {
    return {
      tone: '稍显艰难、需防阻力',
      guidance: '卦象偏弱，所问之事稍显艰难，宜谨慎而行、谋定后动，遇阻不馁、见机而作，待时势转机再图后计。',
    }
  }
  // 中中、中平 等
  return {
    tone: '中平、吉凶参半',
    guidance: '卦象中平，所问之事势头中正，吉凶参半，宜稳中求进、谨慎而行，既不冒进亦不退缩，凡事谋定而后动。',
  }
}

// 从章节内容中提取一句关键短语作为"卦象明示"
// 优先取第一句（一般是该章节的核心论断）
function pickKeyPhrase(content: string): string {
  if (!content) return ''
  // 按句号、分号、逗号分割，取第一句作为核心论断
  const firstSentence = content.split(/[。；]/)[0].trim()
  // 控制长度，避免过长
  if (firstSentence.length > 80) {
    return firstSentence.slice(0, 80) + '…'
  }
  return firstSentence
}

// 从卦象 name 中提取短名（如 "上乾下乾 乾为天（乾卦）自强不息" → "乾卦"）
function extractShortName(name: string): string {
  // 优先取括号内的内容
  const parenMatch = name.match(/[（(]([^）)]+)[）)]/)
  if (parenMatch) return parenMatch[1]
  // 退而取第一段
  return name.split(/\s+/)[0] || name
}
