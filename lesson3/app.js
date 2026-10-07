const btnSel = document.getElementById("btnSel");
const inputFile = document.getElementById("selectFile");

let selectFiles = [];

function isExcel(file){
  const fileVal = file.toLowerCase();
  return fileVal.endsWith(".xlsx") || fileVal.endsWith(".xls");
}

btnSel.addEventListener("click",()=>{
    inputFile.click();
});


inputFile.addEventListener("change",(e)=>{
  const list = document.getElementById("fileList");
  list.textContent = "";
  selectFiles = [];
  let files = e.target.files;
  for(const file of files){
    if(isExcel(file.name)){
        selectFiles.push(file);
        const li = document.createElement("li");
        li.textContent = file.name;
        list.appendChild(li);
    };
  }
  e.target.value = "";
});

const form = document.querySelector("form");
form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    if(selectFiles.length === 0)return;
    
    const formData = new FormData;
    for(const item of selectFiles){
        formData.append("files[]",item);
    };
    try{
        const res = await fetch("upload.php",{
            method:"POST",
            body: formData
        });
        if(!res.ok){
            throw new Error(`レスポンスエラー: ${res.status}`);
        };

        const result = await res.json();
        console.log(result); 
    }catch(e){
        console.error(e.message);
    }
});
