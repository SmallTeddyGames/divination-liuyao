import { HexagramInfoType } from "@types"

// 问题分类：每个分类对应一组关键词和卦象 meaning 中的章节标题
// 顺序很重要：更具体的分类放前面，避免被宽泛分类先匹配走
type Category = {
  // 章节标题（在 hexagramInfo[...].meaning 中以【xxx】形式出现）
  section: string
  // 用户问题中可能出现的关键词
  keywords: string[]
  // 分类显示名
  label: string
}

const CATEGORIES: Category[] = [
  { section: '疾病', label: '疾病健康', keywords: ['病', '疾', '症', '患', '癌', '痛', '伤', '愈', '医', '药', '治'] },
  { section: '胎孕', label: '胎孕生育', keywords: ['孕', '胎', '怀孕', '生子', '生女', '生育', '备孕', '流产'] },
  { section: '子女', label: '子女晚辈', keywords: ['子', '女', '孩子', '儿女', '子女', '子孙', '晚辈'] },
  { section: '婚恋', label: '婚姻感情', keywords: ['婚', '恋', '爱', '情', '姻', '缘', '对象', '男友', '女友', '男朋', '女朋', '夫妻', '配偶', '复合', '表白', '结婚', '离婚', '单身', '脱单', '桃花'] },
  { section: '考试', label: '考试考证', keywords: ['考', '试', '证', '资格', '考公', '考研', '考级', '高考', '中考', '测评'] },
  { section: '诉讼', label: '官司纠纷', keywords: ['讼', '诉', '官司', '纠纷', '告', '仲裁', '维权', '起诉'] },
  { section: '寻人', label: '寻人访友', keywords: ['寻人', '找人', '走失', '失踪', '访友', '找人'] },
  { section: '等人', label: '等人赴约', keywords: ['等人', '等', '来不来', '赴约', '相聚', '见面', '会不会来'] },
  { section: '失物', label: '寻物失物', keywords: ['失物', '丢', '遗失', '找东西', '丢了', '失而复得'] },
  { section: '外出', label: '出行外出', keywords: ['外出', '出行', '出', '行', '旅', '游', '出差', '远行', '迁徙', '搬家', '出国'] },
  { section: '改行', label: '转行跳槽', keywords: ['改行', '转行', '跳槽', '换工作', '转型'] },
  { section: '开业', label: '开业开张', keywords: ['开业', '开张', '开店', '开公司', '创立'] },
  { section: '经商', label: '经商生意', keywords: ['经商', '商', '生意', '买卖', '交易', '合作', '投资', '合伙人', '店铺', '开店'] },
  { section: '买卖', label: '买卖交易', keywords: ['买', '卖', '置办', '购置', '出售'] },
  { section: '周转', label: '资金周转', keywords: ['周转', '借', '贷', '欠', '债', '还钱', '融资'] },
  { section: '财运', label: '财运求财', keywords: ['财', '钱', '富', '贫', '穷', '收益', '亏', '赚', '破财', '进财'] },
  { section: '求事', label: '求职求事', keywords: ['求职', '找工作', '求事', '应聘', '面试', '入职'] },
  { section: '事业', label: '事业工作', keywords: ['事业', '工作', '职', '升', '官', '岗', '前途', '发展', '创业', '前程'] },
  { section: '求名', label: '名声名望', keywords: ['求名', '名声', '声望', '名誉', '名', '品牌', '成名', '出名'] },
  { section: '家运', label: '家运家事', keywords: ['家运', '家事', '家中', '家庭', '家里'] },
  { section: '家宅', label: '宅居风水', keywords: ['宅', '房', '屋', '居', '住', '搬', '迁', '家居', '装修', '风水'] },
  { section: '身体', label: '身体保健', keywords: ['身体', '健康', '保健', '养生', '体能'] },
  { section: '决策', label: '决策抉择', keywords: ['决策', '决定', '抉择', '选择', '要不要', '是否', '能不能', '可以吗', '该不该'] },
  { section: '运势', label: '总体运势', keywords: ['运势', '运气', '运', '势', '今年', '今年运', '流年', '近期'] },
  { section: '时运', label: '时运时机', keywords: ['时运', '时机', '时', '机会', '机遇'] },
  { section: '大象', label: '大象总论', keywords: ['大象', '总体', '整体', '总运', '总论'] },
]

// 从 meaning 文本中提取指定章节的内容
// meaning 中章节格式为「【章节名】内容」，内容直到下一个【或字符串末尾
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

export type AnalysisResult = {
  // 匹配到的分类
  matchedCategory: string | null
  // 该分类对应的章节内容
  matchedSection: string | null
  // 该分类在 meaning 中是否存在
  hasSection: boolean
  // 推荐的备选分类章节（当主分类未命中时，给出最相关的备选）
  fallbackSections: { section: string; content: string }[]
}

// 基于用户问题，匹配最相关的卦象章节
export function analyzeQuestion(question: string, hexagram: HexagramInfoType): AnalysisResult {
  const q = (question || '').trim()
  if (!q) {
    return { matchedCategory: null, matchedSection: null, hasSection: false, fallbackSections: [] }
  }

  // 找出所有命中分类（按 CATEGORIES 顺序，第一个命中的即最具体的）
  const matched = CATEGORIES.find(c => c.keywords.some(kw => q.includes(kw)))

  // 备选：始终包含【运势】【大象】【决策】作为兜底，按命中优先级排序
  const fallbackKeys = ['运势', '大象', '决策', '时运']
  const fallbackSections: { section: string; content: string }[] = []
  for (const sec of fallbackKeys) {
    const content = extractSection(hexagram.meaning, sec)
    if (content) fallbackSections.push({ section: sec, content })
  }

  if (!matched) {
    return { matchedCategory: null, matchedSection: null, hasSection: false, fallbackSections }
  }

  const sectionContent = extractSection(hexagram.meaning, matched.section)
  return {
    matchedCategory: matched.label,
    matchedSection: sectionContent,
    hasSection: !!sectionContent,
    fallbackSections,
  }
}

// 生成针对用户问题的 AI 风格解读
export function buildAiAnswer(question: string, hexagram: HexagramInfoType): string {
  const q = (question || '').trim()
  if (!q) return ''

  const analysis = analyzeQuestion(question, hexagram)
  const lines: string[] = []

  lines.push(`【针对您的问题】`)
  lines.push(`您所问：「${q}」`)
  lines.push('')

  // 卦象吉凶概览
  lines.push(`【卦象概览】`)
  lines.push(`所占得：${hexagram.name}`)
  lines.push(`卦象吉凶：${hexagram.qian}`)
  lines.push('')

  // 针对性分析
  if (analysis.matchedCategory && analysis.hasSection && analysis.matchedSection) {
    lines.push(`【${analysis.matchedCategory}专项分析】`)
    lines.push(analysis.matchedSection)
    lines.push('')
    lines.push(`【AI 综合建议】`)
    lines.push(composeAdvice(hexagram.qian, analysis.matchedCategory, analysis.matchedSection, q))
  } else if (analysis.matchedCategory && !analysis.hasSection) {
    // 命中了分类但卦象 meaning 没有对应章节
    lines.push(`【${analysis.matchedCategory}分析】`)
    lines.push(`此卦中未直接列出「${analysis.matchedCategory}」专章，以下从总体运势与决策角度为您参考：`)
    lines.push('')
    // 取运势和大象作为兜底
    const yunshi = analysis.fallbackSections.find(s => s.section === '运势')
    const daxiang = analysis.fallbackSections.find(s => s.section === '大象')
    if (daxiang) {
      lines.push(`【大象总论】`)
      lines.push(daxiang.content)
      lines.push('')
    }
    if (yunshi) {
      lines.push(`【总体运势】`)
      lines.push(yunshi.content)
      lines.push('')
    }
    lines.push(`【AI 综合建议】`)
    lines.push(composeAdvice(hexagram.qian, analysis.matchedCategory, null, q))
  } else {
    // 未命中任何分类，给出通用解读
    lines.push(`【总体解读】`)
    lines.push('您所问之事未在传统章节中直接对应，以下从总体运势与大象总论为您提供参考：')
    lines.push('')
    const daxiang = analysis.fallbackSections.find(s => s.section === '大象')
    const yunshi = analysis.fallbackSections.find(s => s.section === '运势')
    if (daxiang) {
      lines.push(`【大象总论】`)
      lines.push(daxiang.content)
      lines.push('')
    }
    if (yunshi) {
      lines.push(`【总体运势】`)
      lines.push(yunshi.content)
      lines.push('')
    }
    lines.push(`【AI 综合建议】`)
    lines.push(composeAdvice(hexagram.qian, null, null, q))
  }

  return lines.join('\n')
}

// 基于吉凶等级和命中的分类，给出一段综合建议
function composeAdvice(
  qian: string,
  category: string | null,
  sectionContent: string | null,
  question: string,
): string {
  const isGood = qian.includes('上上') || qian.includes('中上') || qian.includes('上卦')
  const isBad = qian.includes('下下') || qian.includes('中下')
  const isMid = !isGood && !isBad

  let advice = ''

  if (isGood) {
    advice = `综合卦象「${qian}」来看，您所问之事整体势头向好。`
    if (category) {
      advice += `针对「${category}」一事，宜把握时机、顺势而为，不必过度犹豫。`
    } else {
      advice += `宜顺势而为、把握良机。`
    }
    advice += `卦象虽吉，仍须以诚敬之心待人接物，方能使吉象稳固。`
  } else if (isBad) {
    advice = `综合卦象「${qian}」来看，您所问之事当下势头偏弱。`
    if (category) {
      advice += `针对「${category}」一事，不宜急进、不宜强求，宜暂缓行动、静观其变，待时势转机再图后计。`
    } else {
      advice += `宜暂缓行动、静观其变。`
    }
    advice += `凶卦并非定论，重在借卦警醒、修德改过，化凶为吉。`
  } else {
    advice = `综合卦象「${qian}」来看，您所问之事势头中平，吉凶参半。`
    if (category) {
      advice += `针对「${category}」一事，宜谨慎而行、稳中求进，既不冒进亦不退缩，凡事谋定而后动。`
    } else {
      advice += `宜稳中求进、谋定而后动。`
    }
    advice += `中平之卦最考验行事者的智慧与定力，慎之则吉。`
  }

  if (sectionContent && sectionContent.length > 0) {
    advice += `上文专项分析所言，可作为行事之参考。`
  }

  return advice
}
