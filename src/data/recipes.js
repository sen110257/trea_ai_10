export const lowCalRecipes = [
  {
    id: 1,
    name: '鸡胸肉沙拉',
    icon: '🥗',
    color: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)',
    calories: 280,
    description: '高蛋白低脂肪，减脂必备',
    ingredients: '鸡胸肉150g、生菜100g、番茄50g、黄瓜50g、橄榄油5g',
    tips: '鸡胸肉水煮后撕成丝，搭配低卡沙拉酱'
  },
  {
    id: 2,
    name: '西兰花炒虾仁',
    icon: '🦐',
    color: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
    calories: 180,
    description: '低卡高蛋白，营养丰富',
    ingredients: '西兰花200g、虾仁100g、蒜末5g、生抽5g',
    tips: '西兰花焯水后快速翻炒，保持脆嫩口感'
  },
  {
    id: 3,
    name: '燕麦水果粥',
    icon: '🥣',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    calories: 250,
    description: '高纤维饱腹感强，早餐首选',
    ingredients: '燕麦片50g、牛奶200ml、香蕉50g、草莓30g',
    tips: '燕麦用温水泡软，加入水果拌匀即可'
  },
  {
    id: 4,
    name: '清蒸鲈鱼',
    icon: '🐟',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    calories: 150,
    description: '优质蛋白质，脂肪含量极低',
    ingredients: '鲈鱼300g、姜片10g、葱段10g、蒸鱼豉油10g',
    tips: '水开后蒸8-10分钟，鱼肉鲜嫩不腥'
  },
  {
    id: 5,
    name: '番茄鸡蛋汤',
    icon: '🍅',
    color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    calories: 80,
    description: '低卡开胃，营养均衡',
    ingredients: '番茄150g、鸡蛋1个、葱花5g、香油3g',
    tips: '番茄炒软出汁，加水烧开后淋入蛋液'
  },
  {
    id: 6,
    name: '烤红薯',
    icon: '🍠',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    calories: 120,
    description: '天然甜味，高纤维低GI',
    ingredients: '红薯200g',
    tips: '烤箱200度烤45分钟，或微波炉高火8分钟'
  },
  {
    id: 7,
    name: '菠菜鸡蛋饼',
    icon: '🥬',
    color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    calories: 180,
    description: '营养均衡，简单易做',
    ingredients: '菠菜100g、鸡蛋2个、面粉30g、盐少许',
    tips: '菠菜焯水切碎，加入鸡蛋面粉调成糊状煎制'
  },
  {
    id: 8,
    name: '凉拌黄瓜',
    icon: '🥒',
    color: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)',
    calories: 45,
    description: '清爽开胃，几乎零负担',
    ingredients: '黄瓜200g、蒜末5g、生抽10g、醋5g、香油3g',
    tips: '黄瓜拍碎切块，加入调料拌匀即可'
  }
]

export const lowCalIngredients = [
  {
    category: '肉类',
    icon: '🍖',
    items: [
      { name: '鸡胸肉', calories: 165, reason: '高蛋白低脂肪，减脂首选' },
      { name: '瘦牛肉', calories: 125, reason: '铁含量丰富，补血养颜' },
      { name: '虾仁', calories: 93, reason: '低热量高蛋白质，易吸收' },
      { name: '三文鱼', calories: 208, reason: '富含Omega-3，健康脂肪' }
    ]
  },
  {
    category: '蔬菜类',
    icon: '🥬',
    items: [
      { name: '西兰花', calories: 34, reason: '高纤维，饱腹感强' },
      { name: '生菜', calories: 15, reason: '超低卡，沙拉必备' },
      { name: '番茄', calories: 18, reason: '富含番茄红素，抗氧化' },
      { name: '黄瓜', calories: 16, reason: '补水消肿，清爽低脂' },
      { name: '菠菜', calories: 23, reason: '高铁高钙，营养丰富' },
      { name: '芹菜', calories: 14, reason: '膳食纤维丰富，促消化' }
    ]
  },
  {
    category: '主食类',
    icon: '🍚',
    items: [
      { name: '燕麦', calories: 389, reason: '高纤维，缓释碳水' },
      { name: '红薯', calories: 86, reason: '低GI，饱腹感强' },
      { name: '玉米', calories: 112, reason: '粗粮，富含膳食纤维' },
      { name: '紫薯', calories: 106, reason: '富含花青素，抗氧化' }
    ]
  },
  {
    category: '水果类',
    icon: '🍎',
    items: [
      { name: '苹果', calories: 52, reason: '果胶丰富，促消化' },
      { name: '草莓', calories: 32, reason: '低卡高维C，美白养颜' },
      { name: '柚子', calories: 42, reason: '低GI，控糖首选' },
      { name: '猕猴桃', calories: 61, reason: '维生素C之王' }
    ]
  }
]
