import {marked} from "../libs/markedjs/marked.esm.js"

const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.get("p")) location.href = "/";

fetch("../data/data.json").then(response => response.json()).then(json => init(json));

function init(data) {
    data["blog"].forEach((item) => {
        if (item["id"] === urlParams.get("p"))
            fetch(`posts/${item["id"]}.md`).then(response => response.text()).then(md => carregarPost(md, item))
    })
}

function carregarPost(markdown, post) {
    let data = new Date(post["data"])

    let formattedDate = data.toLocaleDateString('pt-BR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    document.title = post["titulo"]

    document.getElementById('post').innerHTML = `
    <h1 class="text-light display-5 mt-0">${post["titulo"]}</h1>
    <p class="text-light mb-3"><small>${formattedDate}</small></p>

    <div class="row">
        <div class="col-1">
            <img class="img img-fluid rounded-circle" src="https://avatars3.githubusercontent.com/u/25033828?s=460&amp;u=5ed9d631b850a87b81ca67b7eada00550d942d84&amp;v=4" alt="" >
        </div>
        <div class="col ps-0 d-flex">
        <small class="fw-bold my-auto">@deyvidandrades</small>
        </div>
    </div>

    <div class="gradiente rounded-5 my-5"></div>

    <div>${marked.parse(markdown)}</div>
    `
}
