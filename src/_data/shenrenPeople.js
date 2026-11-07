import fs from 'node:fs';
import path from 'node:path';

// 神人名单：人物短名 → 一句出格事迹，公开显示在神人徽记与“状态”一栏。
const SHENREN = {
  'focalors-servant': '入团十八天从口角一路升级到扬言开盒、悬赏两百万买命。',
  yilifaer: '在华人联盟嫌中文预警“丢人现眼”强推英语，转头又参选 CSM 称代表中文玩家。',
  silvitni: '二十五份脑浆捐助写成色情谍战长文，跳货被袭拟加税 35% 还要求团员捐炸鸡钱做精神治疗。',
  'governor-lee': '高安两万七千人联盟推行“Ave”罗马礼、按国籍把人口分三等，外服论坛群嘲其纳粹角色扮演。',
  'magicfai-rynew': '零击杀立五条游戏宪法，索要战列舰不给就威胁退游，被商人群专门建团关在笼子里演“鸟门的世界”。',
  weiyunzhao: '自封“神圣魏凤皇庭女帝”，跨阵营连续闹翻，搬家索要 ACL 放话“不然下注进攻铁壁保我的 50b 资产”。',
  'power-yyn': '因被怀疑是间谍，在 4-HWWF 亲手开审判者把自家 1599 亿神使级泰坦打爆“自证清白”。',
  terranangel: '入坑连开十帖向全吧索要五亿买“万宝王海军”，声明“这不是讨饭，这是要”，被杀后挂一亿找雇佣兵。',
  mordiggianking: '自认到处乞讨要饭、搜集尸体，负气清空墨者新手团机库留二百五十万当“礼物”，回头写八楼长文自曝。',
  'koko1-k': '自封“咪将军”兼“AVR 医院院长”，到处下将军令收编 PH、策反 DC，发起封禁投票反被百票罢免小吧主。',
  sirses: '带声望开价一千五百亿、拖欠打手四十亿工资，追着汤圆纠缠两年，放话“生活中欺负我的，死的死，残的残，病的病”。',
  haixing: '出钱租机找人开脚本搞 RMT，合作受阻扬言报警维权，互撕被指卖金反以“大哥说二哥”自曝全套产业链。',
  'longgo-china': '远征频道挂识别脚本秒回“1”搞垄断，暴雷自曝骗两百 B 后换号秽土转生再暴雷，欠款百亿回一句“不受威胁，不还”。',
  domityphoon: '当吧主删帖被警告后反手用小吧号删了百度官方帖，把 186 名团员电话贴论坛让大家“速度骚扰”。',
  qihei: '盗号把怯薛 39 座建筑转进“N老板毁了怯薛”空壳团，逼联盟六百人自拆两千亿星城并删号退团。',
};

export default function () {
  const root = path.resolve(import.meta.dirname, '../people');
  const missing = Object.keys(SHENREN).filter(slug => !fs.existsSync(path.join(root, slug, `${slug}.md`)));
  if (missing.length) throw new Error(`神人名单里的短名没有对应列传，改名后须同步 shenrenPeople.js：${missing.join('、')}`);
  return SHENREN;
}
