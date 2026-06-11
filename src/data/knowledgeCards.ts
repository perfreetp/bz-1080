import { KnowledgeCard } from '../types';

export const knowledgeCards: KnowledgeCard[] = [
  {
    id: 'k1',
    monthMin: 0,
    monthMax: 1,
    title: '新生儿喂养要点',
    content: '新生儿胃容量小，出生第1天约玻璃弹珠大小，第3天约乒乓球大小，第10天约鸡蛋大小。按需喂养，每天8-12次，每次10-30分钟。注意观察宝宝的饥饿信号：张嘴、舔嘴唇、吸手指等。',
    category: 'feeding',
  },
  {
    id: 'k2',
    monthMin: 0,
    monthMax: 3,
    title: '拍嗝正确姿势',
    content: '喂奶后及时拍嗝可以减少吐奶。常用姿势：1. 肩上拍嗝：宝宝趴在肩上，手托住臀部，空心掌轻拍背部；2. 坐姿拍嗝：宝宝坐在腿上，手托住下巴和胸部，前倾轻拍；3. 趴腿拍嗝：宝宝趴在腿上，头略高于胸。每次拍嗝5-10分钟。',
    category: 'feeding',
  },
  {
    id: 'k3',
    monthMin: 0,
    monthMax: 2,
    title: '新生儿睡眠特点',
    content: '新生儿每天需要睡16-17小时，不分昼夜。睡眠周期短，约45分钟一个周期。浅睡眠多，容易惊醒。建议：保持卧室温度22-26℃，湿度50-60%，采用仰卧睡姿，避免床上放置松软物品。',
    category: 'sleep',
  },
  {
    id: 'k4',
    monthMin: 0,
    monthMax: 1,
    title: '脐带护理方法',
    content: '脐带残端一般在出生后7-14天脱落。护理要点：1. 保持干燥，洗澡后用棉签吸干水分；2. 避免摩擦，纸尿裤前端往下折；3. 观察有无红肿、渗液、异味；4. 不要用手去抠。如有异常及时就医。',
    category: 'care',
  },
  {
    id: 'k5',
    monthMin: 1,
    monthMax: 3,
    title: '宝宝抚触益处多',
    content: '婴儿抚触可以促进生长发育、增强免疫力、改善睡眠、增进亲子感情。最佳时间：洗澡后或喂奶后1小时。准备：室温26℃以上，双手温暖，涂润肤油。手法轻柔，从脸部、胸部、腹部、四肢到背部，每次5-15分钟。',
    category: 'care',
  },
  {
    id: 'k6',
    monthMin: 2,
    monthMax: 4,
    title: '抬头练习很重要',
    content: '满月后可以开始练习抬头。每天1-2次，每次1-2分钟，逐渐延长。让宝宝俯卧，用玩具在前方逗引。注意：在宝宝清醒、状态好时练习；旁边要有成人看护；不要在刚吃完奶时练习。3个月左右能稳定抬头45°-90°。',
    category: 'development',
  },
  {
    id: 'k7',
    monthMin: 4,
    monthMax: 6,
    title: '辅食添加信号',
    content: '辅食添加一般在6个月左右，最早不早于4个月。添加信号：1. 能稳定抬头，颈部有力量；2. 对大人吃饭感兴趣；3. 挺舌反射消失；4. 体重达到出生时的2倍以上，且大于6.5kg。首推高铁米粉。',
    category: 'feeding',
  },
  {
    id: 'k8',
    monthMin: 4,
    monthMax: 6,
    title: '睡眠规律培养',
    content: '4-6个月是培养睡眠规律的黄金期。建议：1. 建立固定的睡前仪式（洗澡、抚触、讲故事）；2. 白天小睡2-3次；3. 区分昼夜，白天拉窗帘但不要全黑；4. 逐步戒夜奶；5. 睡前不要过度逗引。',
    category: 'sleep',
  },
  {
    id: 'k9',
    monthMin: 6,
    monthMax: 9,
    title: '辅食添加原则',
    content: '辅食添加要遵循由少到多、由稀到稠、由细到粗、由一种到多种的原则。每次只添加一种新食物，观察3-5天，无过敏反应再添加下一种。辅食种类：米粉 → 蔬菜泥 → 水果泥 → 肉泥 → 蛋黄。1岁内不加盐和糖。',
    category: 'feeding',
  },
  {
    id: 'k10',
    monthMin: 6,
    monthMax: 8,
    title: '宝宝出牙护理',
    content: '宝宝一般在6个月左右开始出牙。出牙期表现：流口水、爱咬东西、烦躁、睡眠不好、轻微发烧。护理方法：1. 用牙胶或磨牙棒缓解不适；2. 用干净手指按摩牙龈；3. 及时擦口水防口水疹；4. 出牙后开始刷牙。',
    category: 'care',
  },
  {
    id: 'k11',
    monthMin: 7,
    monthMax: 9,
    title: '爬行好处多',
    content: '爬行是宝宝成长的重要里程碑，能锻炼四肢协调能力、促进大脑发育、增强体质。多给宝宝爬行机会：1. 准备安全的爬行空间；2. 用玩具逗引；3. 爸爸妈妈可以一起爬；4. 每次15-30分钟。一般8-9个月会爬。',
    category: 'development',
  },
  {
    id: 'k12',
    monthMin: 9,
    monthMax: 12,
    title: '手指食物引入',
    content: '8-9个月可以开始尝试手指食物，锻炼手眼协调和自主进食能力。适合的手指食物：软煮的蔬菜条、水果条、磨牙饼干、小面包块。注意：1. 切成条状或小块；2. 大人要在旁边看护；3. 避免坚果、葡萄等易噎食物。',
    category: 'feeding',
  },
  {
    id: 'k13',
    monthMin: 10,
    monthMax: 14,
    title: '学步期护理',
    content: '宝宝一般10-14个月开始学走路。学步期注意：1. 不要用学步车，弊大于利；2. 给宝宝准备舒适的学步鞋，鞋底要软；3. 做好安全防护，包好桌角、装好门栏；4. 多鼓励，少扶抱，让宝宝自己探索。',
    category: 'development',
  },
  {
    id: 'k14',
    monthMin: 12,
    monthMax: 18,
    title: '一岁宝宝饮食',
    content: '1岁后宝宝可以和大人一起吃饭，但要单独做，少盐少油。每天奶量300-500ml，三餐两点。食物多样化：谷类、蔬菜、水果、肉蛋、奶制品都要有。鼓励自主进食，允许用手抓，培养吃饭的兴趣。',
    category: 'feeding',
  },
  {
    id: 'k15',
    monthMin: 12,
    monthMax: 24,
    title: '语言发育引导',
    content: '1-2岁是语言发展关键期。促进语言发育的方法：1. 多和宝宝说话，描述正在做的事；2. 读绘本，每天坚持；3. 唱儿歌，有韵律的语言更容易学；4. 鼓励宝宝表达，不要抢答；5. 少看电子屏幕。',
    category: 'development',
  },
  {
    id: 'k16',
    monthMin: 18,
    monthMax: 36,
    title: '自主进食培养',
    content: '1岁半后可以培养宝宝自己吃饭。准备：儿童餐椅、吸盘碗、宝宝餐具、围兜。方法：1. 固定吃饭时间和地点；2. 给宝宝一把勺子，大人也喂；3. 允许弄脏，不催促；4. 20-30分钟结束；5. 不吃就收走，不要追喂。',
    category: 'feeding',
  },
  {
    id: 'k17',
    monthMin: 24,
    monthMax: 36,
    title: '两岁叛逆期',
    content: '2岁左右宝宝进入第一反抗期，自我意识增强，常说"不"。应对方法：1. 给有限选择，让宝宝有掌控感；2. 立规矩，温柔而坚定；3. 转移注意力；4. 理解和接纳情绪；5. 多用正面语言，少用"不要"。',
    category: 'development',
  },
  {
    id: 'k18',
    monthMin: 0,
    monthMax: 36,
    title: '疫苗接种须知',
    content: '接种前：确认宝宝健康状态，准备接种本，穿宽松衣服。接种后：1. 留观30分钟；2. 当天不要洗澡；3. 多喝水，多休息；4. 轻微发热、红肿是正常反应；5. 高热超过38.5℃或严重反应要及时就医。',
    category: 'care',
  },
];

export const getCardsByMonth = (month: number): KnowledgeCard[] => {
  return knowledgeCards.filter(
    (card) => month >= card.monthMin && month <= card.monthMax
  );
};

export const getCardById = (id: string): KnowledgeCard | undefined => {
  return knowledgeCards.find((card) => card.id === id);
};
