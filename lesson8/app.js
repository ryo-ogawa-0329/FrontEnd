const date_fr = document.getElementById("date-fr");
const date_to = document.getElementById("date-to");

function getToday(){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}

console.log(getToday());

date_fr.value = getToday();
date_to.value = getToday();

const json = localStorage.getItem("json");

