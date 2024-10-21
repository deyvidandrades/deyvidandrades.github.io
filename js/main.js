fetch("/data/data.json").then(response => response.json()).then(json => init(json));

function criarCardProjeto(projeto) {
    let tags = projeto["tags"]
    let dom_tags = ""

    //if (projeto["wip"]) if (!tags.includes("Em desenvolvimento")) tags.push("Em desenvolvimento")
    //if (projeto["arquivado"]) tags.push("Arquivado")

    tags.sort()
    tags.forEach((tag) => {
        dom_tags += `<div class="tag px-2 rounded-2">${tag}</div>`
    })

    return `
    <!--${projeto["nome"]}-->
    <div class="col p-2">
        <div class="card-projetos h-100 d-flex flex-column justify-content-between">
            <img class="img img-fluid center-crop rounded-5-top" src="${projeto["url_capa"]}" alt="Capa do projeto ${projeto["nome"]}">
            <div class="card-body p-4">
                ${projeto["url"] !== "" ? '<a class="me-3" href="' + projeto["url"] + '" target="_blank"><i class="bi bi-fw bi-globe2"></i></a>' : ''}
                ${projeto["url_google_play"] !== "" ? '<a class="me-3" href="' + projeto["url_google_play"] + '" target="_blank"><i class="bi bi-fw bi-google-play"></i></a>' : ""}
                ${projeto["url_github"] !== "" ? '<a class="" href="' + projeto["url_github"] + '" target="_blank"><i class="bi bi-fw bi-github"></i></a>' : ""}
                <p class="fw-bold mt-4 mb-2">${projeto["nome"]}</p>
                <p class="mb-0">${projeto["descricao"]}</p>
            </div>
            <div class="card-footer px-4 pb-4">
                <div class="d-flex flex-wrap-reverse gap-2">${dom_tags}</div>
                ${(projeto["wip"] ? '<div class="gap-2"><div class="tag px-2 rounded-2 mt-2 text-center">Em desenvolvimento</div></div>' : "")}
                ${(projeto["arquivado"] ? '<div class="gap-2"><div class="tag px-2 rounded-2 mt-2 text-center">Descontinuado</div></div>' : "")}
            </div>
        </div>
    </div>
    `
}

function criarExperiencias(experiencia, is_ultimo) {
    return `
    <li class="list-group-item p-0 ${is_ultimo ? "" : "mb-4"}">
        <p class="mb-0 text-primary">${experiencia["titulo"]}</p>
        <p class="mb-0 fw-bold">(${experiencia["periodo"]}) ${experiencia["instituicao"]}</p>
        <p class="mb-0 mt-2"><small>${experiencia["descricao"]}</small></p>
    </li>
    `
}

function criarTreinamentos(treinamento) {
    return `
    <li class="list-group-item p-0 mt-4">
        <div class="lead fw-bold"><i class="bi-book"></i> ${treinamento["titulo"]}</div>
        <p><span class="text-primary">(${treinamento["periodo"]})</span> ${treinamento["descricao"]}</p>
    </li>
    `
}

function criarConquistas(conquista) {
    return `
    <li class="list-group-item p-0 mt-4">
        <div class="lead fw-bold"><i class="bi-trophy"> </i>${conquista["titulo"]}</div>
        <p class="light"><span class="text-primary">(${conquista["periodo"]})</span> ${conquista["descricao"]}</p>
    </li>
    `
}

function criarBlogPosts(post) {
    let tags = post["tags"]
    let dom_tags = ""
    let data = new Date(post["data"])
    let formattedDate = data.toLocaleDateString('pt-BR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    tags.sort()
    tags.forEach((tag) => {
        dom_tags += `<div class="tag px-2 rounded-2">${tag}</div>`
    })

    return `
    <a href="blog/?p=${post["id"]}" class="card-blog d-flex justify-content-between rounded-3 p-3">
        <div class="w-100 pe-2">
            <div class="d-flex justify-content-between">
                <p class="fw-bold mb-1">${post["titulo"]}</p>
                <div class="d-flex flex-wrap-reverse gap-2 me-2">${dom_tags}</div>
            </div>

            <p class="mb-0"><small>${formattedDate}</small></p>
        </div>

        <i class="bi bi-arrow-up-right my-auto"></i>
    </a>
    `
}

function init(data) {
    let projetosDestaque = document.getElementById("projetosDestaque")
    let listaTecnologias = document.getElementById("listaTecnologias")
    let listaExperiencias = document.getElementById("listaExperiencias")
    let listaTreinamentos = document.getElementById("listaTreinamentos")
    let listaConquistas = document.getElementById("listaConquistas")
    let listaPosts = document.getElementById("listaPosts")

    let projetosApps = document.getElementById("projetosApps")
    let projetosWeb = document.getElementById("projetosWeb")
    let projetosOutros = document.getElementById("projetosOutros")

    let arrayProjetos = data["projetos"].sort((a, b) => a["data"] > b["data"] ? -1 : 1)
    let arrayPosts = data["blog"].sort((a, b) => a["data"] > b["data"] ? -1 : 1)

    let arrayExperiencias = data["experiencias"].sort((a, b) => a["periodo"].split("-")[0] > b["periodo"].split("-")[0] ? -1 : 1)
    let arrayCapacitacoes = data["capacitacoes"].sort((a, b) => a["periodo"].split("-")[0] > b["periodo"].split("/")[0] ? -1 : 1)

    let arrayConquistas = data["conquistas"].sort()
    let arrayTecnologias = data["tecnologias"].sort()

    arrayProjetos.forEach((item, index) => {
        //Destaques
        if (index < 3) projetosDestaque.innerHTML += criarCardProjeto(item)

        if (item["tags"].includes("App") && item["publicado"]) projetosApps.innerHTML += criarCardProjeto(item)
        if (item["tags"].includes("Web") && item["publicado"]) projetosWeb.innerHTML += criarCardProjeto(item)
        if (!(item["tags"].includes("App") && item["publicado"]) && !(item["tags"].includes("Web") && item["publicado"])) projetosOutros.innerHTML += criarCardProjeto(item)
    })

    arrayTecnologias.forEach((item) => {
        listaTecnologias.innerHTML += `<div class="tag p-1 rounded">${item}</div>`
    })

    arrayExperiencias.forEach((item, index) => {
        listaExperiencias.innerHTML += criarExperiencias(item, index === arrayExperiencias.length - 1)
    })

    arrayCapacitacoes.forEach((item) => {
        listaTreinamentos.innerHTML += criarTreinamentos(item)
    })

    arrayConquistas.forEach((item) => {
        listaConquistas.innerHTML += criarConquistas(item)
    })

    arrayPosts.forEach((item) => {
        listaPosts.innerHTML += criarBlogPosts(item)
    })
}
