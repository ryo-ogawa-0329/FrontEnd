const date_fr = document.getElementById("date-fr");
const date_to = document.getElementById("date-to");
const btnSave = document.getElementById("btnSave");
const btnAdd = document.getElementById("btnAdd");
const btnDel = document.getElementById("menuDelete");
const btnCopy = document.getElementById("menuCopy");
const container = document.querySelector(".container");
const menu = document.getElementById("menu");

let currentItem = null;
let currentDiv = null;
let dragDiv = null;

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
    // データを参照できるように
    div.dataset.id = item.id;
    div.addEventListener("drop",(e)=>{
        // drop先の短径領域を取得
        const rect = div.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        if(e.clientY <= centerY){
            div.before(dragDiv);
            //console.log("before");
        }else{
            div.after(dragDiv);
            //console.log("after");
        }
        updateOrder();
    });
    div.addEventListener("dragover",(e)=>{
        e.preventDefault();
    });
    // ::
    const span = document.createElement("span");
    span.classList.add("handle");
    span.textContent = "::";
    span.draggable = true;
    span.addEventListener("click",(e)=>{
        e.stopPropagation();
        currentItem = item;
        currentDiv = div;
        const rect = span.getBoundingClientRect();
        menu.style.left = rect.left + window.scrollX + "px";
        menu.style.top = rect.bottom + window.scrollY + "px";
        menu.hidden = false;
    });
    span.addEventListener("dragstart",(e)=>{
        dragDiv = div;
    });
    // CheckBox
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = item.status === "finished";
    input.addEventListener("change",(e)=>{
        item.status = input.checked ? "finished" : "unfinidhed";
        save();
        renderAll();
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

const todoList = JSON.parse(localStorage.getItem("todoList")) ?? [];

// 配列を取得
function renderAll(){
    container.innerHTML = "";
    const FinishedList = todoList.filter((item)=>item.status==="finished")
                                 .sort((a,b)=>a.order-b.order);
    const UnFinishedList = todoList.filter((item)=>item.status==="unfinished")
                                   .sort((a,b)=>a.order-b.order);

    const sortedList = [...UnFinishedList,...FinishedList];
    sortedList.forEach(item => render(item));
}

function save(){
    localStorage.setItem("todoList",JSON.stringify(todoList));
}

btnAdd.addEventListener('click',(e)=>{
    console.log(createId());
    const item = {id: createId(),
                  date: getToday(), 
                  todo: "", 
                  status: "unfinished",
                  order: todoList.length+1};
    todoList.push(item);
    save();
    renderAll();
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
    currentDiv.remove();
    updateOrder();
    menu.hidden = true;
});

btnCopy.addEventListener("click",(e)=>{
    // オブジェクトが複製されるので、idを上書き
    const newItem = {...currentItem, id: createId(), order: todoList.length+1};
    todoList.push(newItem);
    save();
    renderAll();
    menu.hidden = true;
});

// crypto.randomUUID()が使えなかった代替
function createId(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

window.addEventListener("click",()=>{
    menu.hidden = true;
})

function updateOrder(){
    const divList = Array.from(document.querySelectorAll(".container .todo-item"));
    divList.forEach((div, i) =>{
        const item = todoList.find(list => list.id === div.dataset.id);
        item.order = i+1;
        console.log(item);
    });
    save();
}
// 表示する
renderAll();