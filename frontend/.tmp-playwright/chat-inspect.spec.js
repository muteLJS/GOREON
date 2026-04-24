const { test } = require('@playwright/test');
for (const cfg of [
  { name:'desktop', width:1440, height:1200 },
  { name:'tablet', width:834, height:1112 },
  { name:'mobile', width:390, height:844 },
]) {
  test(cfg.name, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: cfg.width, height: cfg.height } });
    await page.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(800);
    const result = await page.evaluate(() => {
      const trigger = document.querySelector('.chat-widget__trigger');
      const scroll = document.querySelector('.chat-widget__scroll-top.scroll-top-button');
      const triggerRect = trigger?.getBoundingClientRect();
      const scrollRect = scroll?.getBoundingClientRect();
      return {
        trigger: triggerRect && { width: triggerRect.width, height: triggerRect.height },
        scroll: scrollRect && { width: scrollRect.width, height: scrollRect.height },
      };
    });
    console.log(cfg.name + ' ' + JSON.stringify(result));
    await page.screenshot({ path: `/tmp/${cfg.name}-chat.png` });
    await page.close();
  });
}
