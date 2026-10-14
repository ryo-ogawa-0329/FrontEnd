import { chromium } from 'playwright';
import  fs  from 'node:fs/promises';
import path from 'node:path';

// console.log(chromium);

const today = new Date().toISOString().slice(0,10);
// const destDir = path.join(import.meta.dirname,'output',today);
// const destPath = path.join()
const browser = await chromium.launch({headless: true, slowMo: 500});

try{
    const page =  await browser.newPage();
    await page.goto("https://quotes.toscrape.com");
    // console.log(await page.content());

    const title = await page.title();
    const texts = await page.locator('.quote .text').allTextContents();
    const quoteEls = await page.locator('.quote').all();
    const quotes = [];

    for(const el of quoteEls){
        const text = await el.locator('.text').textContent();
        const author = await el.locator('.author').textContent();
        // const e = await el.locator('.tags').all();
        // console.log(tags);
        const tags = [];
        for(const t of await el.locator('.tag').all()){
            const tag = await t.textContent();
            tags.push(tag);
        }        
        // 配列
        quotes.push({text,author,tags});
    }
    // データの整形
    const escDq = (t) => `"${String(t).replaceAll('"','""')}"`;
    // console.log(escDq("\"Hi I'm Ryo"));
    const csvData = quotes.map(q => `${escDq(q.text)},${escDq(q.author)},${escDq(q.tags.join("|"))}`);
    const headers = 'text,author,tags';

    const destDir = path.join(import.meta.dirname,'output',today);
    await fs.mkdir(destDir,{recursive: true},(err)=>{
        if(err){
            console.error(err);
        }
        console.log('create Directory Success!!');
    });
    await fs.writeFile(path.join(destDir,'quotes.csv'),[headers,...csvData].join('\n'),'utf-8');

    // await fs.writeFile(path.join(destDir));
    // console.log(quotes);
    // await fs.mkdir(destDir,{recursive: true});
    // await fs.writeFile(path.join(destDir,'quotes.json'),
                    // JSON.stringify(quotes),'utf-8');
    // console.log();
}finally{
    await browser.close();
    console.log("ブラウザを閉じました");
}