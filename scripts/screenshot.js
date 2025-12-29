import puppeteer from 'puppeteer';

console.log('Taking screenshot of http://localhost:5175/ at 1024x768');
const browser = await puppeteer.launch();
console.log('Browser launched', browser.isConnected() ? 'connected' : 'not connected');
const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 768 });
await page.goto("http://localhost:5175/sales-list", { waitUntil: 'domcontentloaded', timeout: 60000 });
// give app a moment to hydrate and load assets
await page.screenshot({ path: 'screenshot-1024x768.png', fullPage: true });
console.log('Saved', 'screenshot-1024x768.png');
await browser.close();

