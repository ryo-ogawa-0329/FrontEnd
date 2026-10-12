const date_fr = document.getElementById("date-fr");
const date_to = document.getElementById("date-to");
const btnSave = document.getElementById("btnSave");
const btnAdd = document.getElementById("btnAdd");
const btnDel = document.getElementById("menuDelete");
const container = document.querySelector(".container");
let currentItem = null;
let currentDiv = null;

function getToday(format = false){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    if(!format){
        return `${year}-${month}-${day}`;
    }else{
        return `${year}${month}${day}`;
    }
}

date_fr.value = getToday();
date_to.value = getToday();
                
function render(item){
    const div = document.createElement("div");
    div.classList.add("todo-item");
    div.classList.add(item.status);
    // ::
    const span = document.createElement("span");
    span.classList.add("handle");
    span.textContent = "::";
    span.addEventListener("click",(e)=>{
        e.stopPropagation();
        currentItem = item;
        currentDiv = div;
        const rect = span.getBoundingClientRect();
        menu.style.left = rect.left + window.scrollX + "px";
        menu.style.top = rect.bottom + window.scrollY + "px";
        menu.hidden = false;
    });

    const input = document.createElement("input");
    input.type = "checkbox";
    input.addEventListener("change",(e)=>{
        edit.classList.toggle("finished");
        if(edit.classList.contains("finished")){
            item.status = "finished";
        }else{
            item.status = "unfinished";
        }
        save();
    });
    const edit = document.createElement("div");
    edit.classList.add("content");
    if(item.status === "finished"){
        edit.classList.add("finished");
    }
    edit.contentEditable = true;
    edit.textContent = item.todo;
    edit.addEventListener("input",(e)=>{
        item.todo = edit.textContent;
        save();
    });

    div.append(span,input,edit);
    container.appendChild(div);
}

// 配列を取得
const todoList = JSON.parse(localStorage.getItem("todoList")) ?? [];
todoList.forEach(item => render(item));

function save(){
    localStorage.setItem("todoList",JSON.stringify(todoList));
}

btnAdd.addEventListener('click',(e)=>{
    console.log(createId());
    const item = {id: createId(),date: getToday(), todo: "", status: "unfinished"};
    todoList.push(item);
    save();
    render(item);
});

btnSave.addEventListener('click',(e)=>{
    save();
});

// 理解メモ用
// 配列からcurrentItemを探して取り除く
// 保存する
// 画面からdivのtodoItemを削除
// menuボタンを隠す
btnDel.addEventListener("click",(e)=>{
    const index = todoList.indexOf(currentItem);
    todoList.splice(index,1);
    save();
    currentDiv.remove();
    menu.hidden = false;
});

// crypto.randomUUID()が使えなかった代替
function createId(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

window.addEventListener("click",()=>{
    menu.hidden = true;
})