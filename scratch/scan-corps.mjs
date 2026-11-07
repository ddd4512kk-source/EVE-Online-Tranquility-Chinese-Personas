import fs from 'node:fs';
import path from 'node:path';

const corpsDir = 'src/corps';
const entries = fs.readdirSync(corpsDir, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const dir = path.join(corpsDir, entry.name);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const sentences = text.split(/[。\n\r]/);
    for (const s of sentences) {
      const clean = s.trim();
      if (!clean) continue;
      const hasBuild = /(?:造|搓|生产|制造|产出|出产|订单|批发|下水|交付|流水线|工程|作业|蓝图|BPC)/.test(clean);
      const hasBigShip = /(?:泰坦|超旗|旗舰|大航|超母|神使|俄洛巴斯|拉格纳洛克|勒维亚坦|万古|归一|夜神|天灾|飞龙|赫尔|萨拉希尔|小金鱼|大鲸鱼|长须鲸|索迪约)/.test(clean);
      if (hasBuild && hasBigShip) {
        if (/击毁|击沉|KM|被摧毁|损失报告/.test(clean) && !/(?:造|搓|生产|制造|订单|作业|下水|交付)/.test(clean)) continue;
        console.log(`[${entry.name}] ${clean.slice(0, 120)}`);
      }
    }
  }
}
