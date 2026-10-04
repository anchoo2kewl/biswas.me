const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { chromium } = require('/tmp/portfolio-ui-test/node_modules/playwright');
const { PDFDocument } = require('/tmp/portfolio-ui-test/node_modules/pdf-lib');

(async () => {
  fs.mkdirSync('portfolio-review', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/api/posts**', (route) => route.fulfill({ json: [] }));
  await page.route('https://www.google.com/recaptcha/**', (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  const base = 'http://localhost:3017';
  const result = { checks: [], widths: [375,390,768,1280,1440] };
  const check = (name) => { result.checks.push(name); console.log('PASS:', name); };
  for (const width of result.widths) {
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.t-card').count(), 7);
    assert.equal(await page.locator('.p-gallery .p-project').count(), 25);
    assert.equal(await page.locator('.p-leadership').count(), 0);
    assert.doesNotMatch(await page.locator('main').innerText(), /~(?:15|40|70)/);
    assert(await page.locator('.p-portrait img').evaluate((img) => img.complete && img.naturalWidth > 0));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Homepage overflow ${width}`);
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: `portfolio-review/home-${width}.png`, animations: 'disabled' });
      await page.locator('#work').screenshot({ path: `portfolio-review/timeline-${width}.png`, animations: 'disabled' });
    }
    check(`Homepage ${width}px: portrait, 7 chapters, 25 illustrated projects, no headcounts/overflow`);
  }
  await page.getByRole('button', { name: 'Explore Veeva Systems', exact: true }).click();
  let dialog = page.locator('dialog[open]');
  await dialog.waitFor({ state: 'visible' });
  assert.match(await dialog.innerText(), /Built the team from the ground up/);
  assert.match(await dialog.innerText(), /Elastio/);
  await dialog.screenshot({ path: 'portfolio-review/veeva-detail.png', animations: 'disabled' });
  for (let n = 0; n < 12; n++) {
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => document.querySelector('dialog[open]').contains(document.activeElement)), 'Focus escaped dialog');
  }
  await dialog.getByRole('button', { name: 'Earlier chapter' }).click();
  assert.equal(await dialog.getByRole('heading', { level: 2 }).innerText(), 'IBM Turbonomic');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert(await page.getByRole('button', { name: 'Explore Veeva Systems', exact: true }).evaluate((el) => el === document.activeElement));
  check('Career dialog: hiring story, navigation, keyboard focus containment, Escape, and focus restoration');
  await page.getByRole('button', { name: 'Preview FlagTGL', exact: true }).click();
  await page.locator('dialog[open]').waitFor({ state: 'visible' });
  assert.match(await page.locator('dialog[open]').innerText(), /multiple paying customers/);
  const svgIds = await page.locator('svg linearGradient[id]').evaluateAll((nodes) => nodes.map((n) => n.id));
  assert.equal(new Set(svgIds).size, svgIds.length, 'Duplicate SVG IDs');
  await page.keyboard.press('Escape');
  check('Restored illustrated project previews open and close, with unique SVG gradients');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.p-mobile-nav summary').click();
  await page.locator('.p-mobile-nav a[href="#work"]').click();
  assert.equal(await page.locator('.p-mobile-nav[open]').count(), 0);
  await page.getByRole('button', { name: 'Explore Veeva Systems', exact: true }).click();
  await page.locator('dialog[open]').waitFor({ state: 'visible' });
  assert(await page.locator('dialog[open]').evaluate((el) => el.scrollWidth <= el.clientWidth + 1));
  await page.keyboard.press('Escape');
  check('Mobile navigation closes on selection; career dialog fits mobile');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.p-builder-intro').evaluate((el) => getComputedStyle(el).animationName), 'none');
  check('Reduced-motion preference disables decorative animation');
  for (const path of ['/resume', '/resume.html']) {
    for (const width of [390,768,1280]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(base + path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.match(await page.locator('body').innerText(), /from scratch, hiring/);
      assert.match(await page.locator('body').innerText(), /hire and develop teams/);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Resume overflow ${path} ${width}`);
    }
    const printed = await page.pdf({ format: 'Letter', printBackground: true, preferCSSPageSize: true });
    assert.equal((await PDFDocument.load(printed)).getPageCount(), 1, `Print pagination: ${path}`);
    if (path === '/resume') await page.screenshot({ path: 'portfolio-review/resume-desktop.png', fullPage: true });
    check(`${path}: Veeva and Elastio hiring, responsive layout, one-page print`);
  }
  const download = await page.request.get(base + '/AnshumanBiswas.pdf');
  assert.equal(download.status(), 200);
  const pdf = await download.body();
  assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1);
  assert(pdf.equals(fs.readFileSync('public/AnshumanBiswas.pdf')));
  result.pdfSHA256 = crypto.createHash('sha256').update(pdf).digest('hex');
  assert.equal(errors.length, 0, JSON.stringify(errors));
  check('One-page downloadable PDF matches generated file; no browser runtime errors');
  fs.copyFileSync('public/AnshumanBiswas.pdf', 'portfolio-review/Anshuman_Biswas_Resume.pdf');
  fs.copyFileSync('public/resume.html', 'portfolio-review/Anshuman_Biswas_Resume.html');
  result.checkedCommit = require('node:child_process').execFileSync('git', ['rev-parse','HEAD'], { encoding: 'utf8' }).trim();
  fs.writeFileSync('portfolio-review/checks.json', JSON.stringify(result, null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
