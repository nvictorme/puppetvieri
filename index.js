const puppeteer = require('puppeteer');
const fs = require('fs');
const { findListings } = require('./helpers');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://exchangemarketplace.com/');
  const listings = await findListings(page);
  await browser.close();
  fs.writeFileSync(`listings_${Date.now()}.json`, JSON.stringify(listings));
})();