class BaseGuaClass {
  gua = '' // 卦
  direction = '' // 方位
  nature = '' // 自然
  body = ''   // 人体
  animal = '' // 动物
  family = '' // 家人
  sound = ''  // 声音
  building = '' // 建筑
  fairy = ''   // 八仙
  side = ''    // 偏旁

  constructor(data: Partial<BaseGuaClass> = {}) {
    Object.assign(this, data);
  }
}

// 乾
export const qianGua = new BaseGuaClass({
  gua: '111',
  direction: '南',
  nature: '天',
  body: '头',
  animal: '马',
  family: '父亲',
  sound: '金属声',
  building: '京都',
  fairy: '吕洞宾',
  side: '金字旁',
})

// 兑
export const duiGua = new BaseGuaClass({
  gua: '110',
  direction: '东南',
  nature: '泽',
  body: '口',
  animal: '羊',
  family: '少女',
  sound: '说话吼叫声',
  building: '井',
  fairy: '张果老',
  side: '口字旁',
})

// 离
export const liGua = new BaseGuaClass({
  gua: '101',
  direction: '东',
  nature: '火',
  body: '眼',
  animal: '凤',
  family: '中女',
  sound: '燃烧声',
  building: '炉灶',
  fairy: '汉钟离',
  side: '火字旁',
})

// 震
export const zhenGua = new BaseGuaClass({
  gua: '100',
  direction: '东北',
  nature: '雷',
  body: '足',
  animal: '龙',
  family: '长男',
  sound: '擂鼓声',
  building: '门市',
  fairy: '曹国舅',
  side: '木字旁',
})

// 巽
export const xunGua = new BaseGuaClass({
  gua: '110',
  direction: '西南',
  nature: '风',
  body: '腿',
  animal: '鸡',
  family: '长女',
  sound: '风声',
  building: '园艺',
  fairy: '韩湘子',
  side: '草字头',
})

// 坎
export const kanGua = new BaseGuaClass({
  gua: '010',
  direction: '西',
  nature: '水',
  body: '耳',
  animal: '鲤鱼',
  family: '中男',
  sound: '水流声',
  building: '厕所',
  fairy: '铁拐李',
  side: '三点水',
})

// 艮
export const genGua = new BaseGuaClass({
  gua: '001',
  direction: '西北',
  nature: '山',
  body: '手',
  animal: '狗',
  family: '少男',
  sound: '山石声',
  building: '门墙',
  fairy: '蓝采和',
  side: '山字旁',
})

// 坤
export const kunGua = new BaseGuaClass({
  gua: '000',
  direction: '北',
  nature: '地',
  body: '腹',
  animal: '牛',
  family: '母亲',
  sound: '动土声',
  building: '城市',
  fairy: '仙姑',
  side: '土字旁',
})
