// const e = require("express");

let send = document.getElementById("send");
let content = document.getElementById("content");
let list = document.getElementById("list");

send.addEventListener("click", (e) => {
  let str = content.value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/addTodo");
  xhr.setRequestHeader("Content-type", "application/json");
  let todo = JSON.stringify({ content: str });
  xhr.send(todo);
  xhr.onload = function () {
    let originData = JSON.parse(xhr.responseText);
    console.log(originData);
    if (originData === false) {
      alert(originData.message);
      return;
    }
    let data = originData.result;
    let str = "";
    for (item in data) {
      str += `<li>${data[item].content}<input type="button" value="delete" data-id=${item}></input></li>`;
      list.innerHTML = str;
    }
  };
});

list.addEventListener("click", (e) => {
  if (e.target.nodeName !== "INPUT") {
    return;
  }
  let id = e.target.dataset.id;
  let xhr = new XMLHttpRequest();
  xhr.open("post", "/removeTodo");
  xhr.setRequestHeader("Content-type", "application/json");
  let removeTodo = JSON.stringify({ id: id });
  console.log(removeTodo);
  xhr.send(removeTodo);
  xhr.onload = function () {
    let orginData = JSON.parse(xhr.responseText);
    let data = orginData.result;
    console.log(data);
    let str = "";
    for (item in data) {
      str += `<li>${data[item].content}<input type="button" value="delete" data-id=${item}></input></li>`;
      list.innerHTML = str;
    }
  };
});
