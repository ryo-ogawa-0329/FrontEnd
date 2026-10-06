const button = document.getElementById("searchBtn");
button.addEventListener('click', async()=>{
    try{
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!res.ok){
        throw new Error(`レスポンスステータス',${res.status}`);
    }
    const data = await res.json();
    MakeList(data);
    }catch(e){
        console.error(e.message);
    }
});

function MakeList(array, filter=false){
    const list = document.getElementById("list");
    let input = document.getElementById("keyword");
    input = input.value.trim();
    list.innerHTML = '';
    filter = input !== '';
    array.forEach(item => {
        if(!filter){    
            const li = document.createElement("li");
            li.textContent = item.name;
            list.appendChild(li);
        }else if(item.name.includes(input)){
            const li = document.createElement("li");
            li.textContent = item.name;
            list.appendChild(li);
        };
    });
}