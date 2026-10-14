import fs from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join(import.meta.dirname,'data','AccountBookmarks');
const result = JSON.parse(await fs.readFile(filePath,'utf-8'));

// console.log(Object.keys(result));
// console.log(data.roots);

// 普段表示されている部分まで整形する
const rootData = result.roots.bookmark_bar;
// console.log(result.roots);
// console.log(rootData.slice(0,5));

function flatedData(node,data,folder){
    if(node.type === 'url'){
        data.push({folder, name: node.name, url: node.url});
        return;    
    }
    const folderNm = folder + '/' + node.name;
    for(const child of node.children){
        flatedData(child,data,folderNm);
    }
}

const flatData = [];
// データを階層なしで整形する
flatedData(rootData,flatData,'');
// console.log(flatData.length);
const groups = [];
const newGroups = [];
for(let i = 0; i < flatData.length/2; i += 10){
    groups.push(flatData.slice(i,i+10));
}

for(const group of groups){
    newGroups.push(
        await Promise.all(
            group.map(async g => ({ ...g, ...(await checkUrl(g.url))}))
        )
    );
}
/*
const newGroups = await groups.map(group=>async () => {
    const results = await Promise.all(
        group.map(g=>checkUrl(g.url))
    );
    return results;
})
*/
console.log(newGroups);
async function checkUrl(url){
    try{        
        const res = await fetch(url,{
            method: 'HEAD',
            signal: AbortSignal.timeout(10000)
        });

        let msg = '';
        if(res.status === 404 || res.status === 410){
            msg = 'リンク切れ';
        }else if(res.redirected){
            msg = 'リダイレクト';
        }else if(res.status >= 300){
            msg = '要確認';
        }else if(res.status >= 200){
            msg = 'OK';
        }
        return {status:res.status,result: msg};
    }catch(e){
       return {status: null,result: 'ERROR'}
    }
}

// console.log(await checkUrl('https://qutes.toscrape.com'));
// console.log(await checkUrl('http://github.com'));