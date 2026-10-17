// 仅连接本机 Chrome。逐页连接，避免整浏览器自动附加到所有日常标签。
export async function connectCdp(url, timeout = 10000) {
  if (typeof WebSocket !== "function") throw new Error("Chrome读取需要Windows Node 22以上的WebSocket支持");
  const ws = new WebSocket(url), pending = new Map(), listeners = new Map();
  let sequence = 0;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { ws.close(); reject(new Error('Chrome CDP连接超时')); }, timeout);
    ws.onopen = () => { clearTimeout(timer); resolve(); };
    ws.onerror = () => { clearTimeout(timer); reject(new Error('Chrome CDP连接失败')); };
  });
  ws.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const job = pending.get(data.id); pending.delete(data.id); clearTimeout(job.timer);
      if (data.error) job.reject(new Error(data.error.message)); else job.resolve(data.result);
    }
    for (const listener of listeners.get(data.method) || []) listener(data.params);
  };
  ws.onclose = () => { for (const job of pending.values()) { clearTimeout(job.timer); job.reject(new Error('Chrome CDP连接关闭')); } pending.clear(); };
  return {
    send(method, params = {}, timeoutMs = 15000) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Chrome ${method}超时`)); }, timeoutMs);
        pending.set(id, { resolve, reject, timer }); ws.send(JSON.stringify({ id, method, params }));
      });
    },
    on(method, callback) { if (!listeners.has(method)) listeners.set(method, new Set()); listeners.get(method).add(callback); },
    off(method, callback) { listeners.get(method)?.delete(callback); },
    close() { ws.close(); },
  };
}

export async function connectChromePages(endpoint) {
  if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(endpoint)) throw new Error('Chrome仅允许本机调试端口');
  const version = await (await fetch(`${endpoint}/json/version`, {signal:AbortSignal.timeout(5000)})).json();
  const browser = await connectCdp(version.webSocketDebuggerUrl);
  async function newPage() {
    const {targetId} = await browser.send('Target.createTarget', {url:'about:blank'});
    const targets = await (await fetch(`${endpoint}/json/list`, {signal:AbortSignal.timeout(5000)})).json();
    const target = targets.find(item => item.id === targetId);
    if (!target) throw new Error('未找到新建页面');
    const cdp = await connectCdp(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');
    let currentUrl = 'about:blank', documentStatus;
    const responseCallbacks = [];
    cdp.on('Network.responseReceived', event => {
      if(event.type==='Document') documentStatus=event.response.status;
      for(const callback of responseCallbacks) callback({url:()=>event.response.url,status:()=>event.response.status});
    });
    async function evaluate(fn, arg, timeoutMs) {
      const expression = `(${fn.toString()})(${arg === undefined ? '' : JSON.stringify(arg)})`;
      const result = await cdp.send('Runtime.evaluate', {expression,awaitPromise:true,returnByValue:true}, timeoutMs);
      if(result.exceptionDetails) throw new Error('Chrome页面求值失败：'+(result.exceptionDetails.exception?.description || result.exceptionDetails.text || '').split('\n')[0]);
      return result.result.value;
    }
    return {
      async addInitScript(fn) {await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:`(${fn.toString()})()`});},
      on(event, callback) {if(event==='response') responseCallbacks.push(callback);},
      async goto(url,{timeout=45000}={}) {
        currentUrl=url;
        let callback, timer;
        const loaded=new Promise((resolve,reject)=>{
          callback=()=>{clearTimeout(timer);cdp.off('Page.domContentEventFired',callback);resolve();};
          timer=setTimeout(()=>{cdp.off('Page.domContentEventFired',callback);reject(new Error('Chrome页面加载超时'));},timeout);
          cdp.on('Page.domContentEventFired',callback);
        });
        try {
          const result=await cdp.send('Page.navigate',{url});
          if(result.errorText) throw new Error('Chrome导航失败：'+result.errorText);
          await loaded;
        } finally {clearTimeout(timer);cdp.off('Page.domContentEventFired',callback);}
        return {status:()=>documentStatus};
      },
      waitForTimeout(ms) {return new Promise(resolve=>setTimeout(resolve,ms));},
      locator(selector) {if(selector!=='body') throw new Error('仅支持公开正文');return {innerText:()=>evaluate(()=>document.body?.innerText || '')};},
      evaluate,
      mouse: {
        async wheel(deltaX, deltaY) {
          await cdp.send('Page.bringToFront');
          await cdp.send('Input.dispatchMouseEvent', {type:'mouseWheel',x:500,y:500,deltaX,deltaY});
        },
      },
      async screenshot({path}) {const {data}=await cdp.send('Page.captureScreenshot');(await import('node:fs')).writeFileSync(path,Buffer.from(data,'base64'));},
      title() {return evaluate(()=>document.title);},
      url() {return currentUrl;},
      async close() {try {await browser.send('Target.closeTarget',{targetId});} finally {cdp.close();}},
    };
  }
  return {contexts:()=>[{newPage}],async close(){browser.close();}};
}
