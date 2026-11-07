import fs from 'node:fs';
import path from 'node:path';

// 大亨名单：人物短名 → 一句工商事迹，公开显示在铜钱徽章与“状态”一栏。
const TYCOONS = {
  'alero-araragiero': '紫竹梅重工工业核心，经营“大A超市”化矿与快递，开发开源工业算账系统 Kahuna。',
  'aniki-s': '开办“兄贵重工”，十二开矿队与大鱼生产。',
  'ariel-queen': '混沌仲裁者月矿管理员，起草寂静谷月矿条例并统筹引爆与矿石回购。',
  'bingxuan-123': '星尘守护（SGCN）CEO，欧服大型制造商，手搓战备旗舰，军团出资出产天使泰坦。',
  'black-gregory': '滑稽联盟一代目，早年经营四族贸易中心连锁，参股近三十家公司并购置星域。',
  'black-kingbar': '黑皇杖 CEO，运营联盟满加成矿队、工业部门与 24 小时快递并在多星系铺货。',
  bluemelon: '常年在官方论坛大宗买卖 AT 赛船、超旗与官员装备，人称“赛船二道贩子”。',
  'bunny225-lu': '兔子工业集团当家，以巨额个人投资入主游骑兵（RR）任 CEO。',
  'cheryl-astelir': '星尘守护旗舰制造商、首批萨拉希尔级建造者，在团内开办计息军团银行。',
  'clzd-miss-nerc': '游骑兵（RR）联盟指定超旗制造商，长期包办联盟泰坦生产。',
  'dudu-li': '采星者盟主，以工业产能、星城铁壁与庞大月矿堡群撑起联盟税收与矿物供给。',
  'dy-heii-k': '采星者 CEO，简介常年承接泰坦制造生意。',
  'garveen-airuta': '伏羲军团元老，参与泰坦等旗舰制造并长期组织大规模采矿。',
  'greed-jf-cyno': '掌管 FRT 联盟建筑、跳桥燃料与月矿，参与泰坦制造与大规模采矿，小号任熊猫债券投资团 CEO。',
  'hurric-lightstorm': '在吉他旁立工业堡做科研制造，撰写《科研制造骨折玩法》详述工业流水线。',
  'jc-alba': '创世倾域掌事人，管理六只跳货的吉他物流线，论坛单笔上千张蓝图大宗交易。',
  'jolange-joestar': 'FRT 联盟总监，分管联盟工业体系与熊猫债券。',
  'joy-chong': '叶落星海牌子收购商，月收六千亿，高单价牌子占吉他日交易量一半。',
  'longgo-china': '寂静谷长期收购死亡产出与合约、提供免费快递，兼营远征买卖与回收。',
  'mr-diao': '编写大量行星开发与工业教程，制作或参与开发联盟制造计算工具 Builder Helper。',
  mrpro: '六开工业号自造二十万架武士补吉他缺货，换出首批天使泰坦蓝图拍出 1.1 万亿。',
  'nanhua-college': '灵魂守望盟主，2018 年下水服役联盟首艘泰坦驻防 46DP，发布《特里菲斯46DP大工业时代》并众筹铆钉欧服华人首座星城。',
  'ozen-wand': '运营“古法代驾”与“飞翔的熊猫人代驾工作室”多年，承接旗舰、大鱼与跳货代驾。',
  'rebirth-eve': '吃瓜军团一代目，自建旗舰制造线与跳货专线，成批以军团内部价供应长须鲸、四族航母与四族无畏。',
  'titan-acrad': '叶落星海总监，在索迪约工程复合体排单手搓神使级泰坦，倒计时二十五天、单次作业费逾六十亿。',
  undead0027: '浮岳重工五年 CEO，带领生产大户制造 T2 与旗舰，囤积数亿立方旗舰组件与矿石。',
  'wednesday-girl': '九十号多开挖矿生产，以“47 秒压缩 90 号矿”闻名的超大规模矿业玩家。',
  weiyang: 'FRT 职业卡商与超网商人，长期经营月卡买卖及赛船、泰坦超网订单。',
};

export default function () {
  const root = path.resolve(import.meta.dirname, '../people');
  const missing = Object.keys(TYCOONS).filter(slug => !fs.existsSync(path.join(root, slug, `${slug}.md`)));
  if (missing.length) throw new Error(`大亨名单里的短名没有对应列传，改名后须同步 tycoonPeople.js：${missing.join('、')}`);
  return TYCOONS;
}
