const API_URL = "https://zipcloud.ibsnet.co.jp/api/search?zipcode=";

const inputZip = document.getElementById("zipCode");
const inputAdd1 = document.getElementById("address1");
const inputAdd2 = document.getElementById("address2");
const select = document.getElementById("candidates");

let list = [];
select.addEventListener("change",(e)=>{
            const i = e.target.selectedIndex;
            inputAdd1.value = list[i]["address1"];
            inputAdd2.value = list[i]["address2"] + list[i]["address3"];

            select.hidden = true;
        });

async function getAddress(zipcode){
    const url = API_URL + zipcode;
    try{
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`レスポンスエラー: ${res.status}`);
        }        
        return await res.json();        
    }catch(err){
        console.error(err);
        return null;
    }
} 

inputZip.addEventListener("keydown", async (e)=>{
    if(e.key !== "Enter"){
        return;    
    }
    // ハイフン入力を整形
    const zipcode = removeHaihun(inputZip.value);
    // 数字7桁かどうか
    if(!/^\d{7}$/.test(zipcode))return;
    e.preventDefault();
    
    const result = await getAddress(zipcode);
    if(!result)return;

    list = result.results;
    if(list === null){
        inputZip.focus();
        inputZip.select();
        return;
    }else if(list.length === 1){
        inputAdd1.value = list[0]["address1"];
        inputAdd2.value = list[0]["address2"] + list[0]["address3"];
    }else{                
        select.innerHTML = "";        
        select.hidden = false;
        list.forEach((item,i)=>{
            const option = document.createElement("option");
            option.value = i;
            option.textContent= item["address1"] + ' ' + item["address2"] + ' ' + item["address3"];
            select.appendChild(option);
        });
    }
});

function removeHaihun(text){
    return text.replace(/[-ー]/,"");
}