const puppeteer = require('puppeteer');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 45678;
const buildDir = path.join(__dirname, 'build');
const app = express();
app.use(express.static(buildDir));
app.use((req, res) => res.sendFile(path.join(buildDir, 'index.html')));

const routes = [
  '/',
  '/jobs',
  '/companies',
  '/jobs/delhi',
  '/jobs/mumbai',
  '/jobs/remote',
  '/jobs/marketing'
];

const server = app.listen(PORT, async () => {
  console.log('Starting prerender process...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });
      
      // Allow extra time for React router and any async data to render
      await new Promise(r => setTimeout(r, 2000));
      
      let html = await page.content();
      
      // Determine file path
      let outPath;
      if (route === '/') {
        outPath = path.join(buildDir, 'index.html');
      } else {
        // Create directory structure
        outPath = path.join(buildDir, route, 'index.html');
        const dir = path.dirname(outPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outPath, html);
      console.log(`✅ Prerendered: ${route} -> ${outPath.replace(__dirname, '')}`);
    } catch (e) {
      console.error(`❌ Failed to prerender: ${route}`, e);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log('Prerendering complete!');
});
