fetch("/data/data.json")
    .then(response => response.json())
    .then(json => init(json));

function criarCard(projeto) {
    let wip = `<div class="d-flex"><div class="border px-2 me-2 rounded title">${projeto["tipo"]}</div><div class="border px-2 rounded">${projeto["tecnologia"]}</div></div>`
    let links = ``
    let arquivado = ``

    if (projeto["wip"]) {
        wip += `<div class="mt-3 text-center"><div class="border px-2 rounded">Em Desenvolvimento</div></div>`
    }

    if (projeto["url"] !== "") {
        links += `<a class="link-light me-3" href="${projeto["url"]}" target="_blank"><i class="bi bi-fw bi-globe2"></i></a>`
    }

    if (projeto["url_google_play"] !== "") {
        links += `<a class="link-light me-3" href="${projeto["url_google_play"]}" target="_blank"><i class="bi bi-fw bi-google-play"></i></a>`
    }

    if (projeto["url_github"] !== "") {
        links += `<a class="link-light" href="${projeto["url_github"]}" target="_blank"><i class="bi bi-fw bi-github"></i></a>`
    }

    if(projeto["arquivado"]){
        arquivado = `<div class="border px-2 mt-3 rounded text-center">Projeto descontinuado</div>`
    }

    return `
  <!--${projeto["nome"]}-->
  <div class="col p-2">
  <div class="card bg-dark rounded shadow p-0 projeto h-100">
  <img class="img img-fluid center-crop rounded-5-top" src="${projeto["url_capa"]}" alt="Capa do projeto ${projeto["nome"]}">
  <div class="card-body p-4">
  ${links}
  <p class="fw-bold my-2">${projeto["nome"]}</p>
  <p class="mb-0">${projeto["descricao"]}</p>
  </div>
  <div class="card-footer p-3">
  ${wip}
  ${arquivado}
  </div>
  </div>
  </div>
  `
}

function criarExperiencia(experiencia) {
    return `
    <li class="list-group-item bg-escuro p-0 text-light border-0">
        <div class="text-primary">${experiencia["titulo"]} - ${experiencia["instituicao"]}</div>
        <p class="light">(${experiencia["periodo"]}) ${experiencia["descricao"]}</p>
    </li>
    `
}

function criarHabilidades(habilidade) {
    return `<div class="border px-2 py-1 rounded">${habilidade["titulo"]}</div>`
}

function criarCapacitacoes(capacitacao) {
    return `
    <li class="list-group-item bg-escuro p-0 text-light mt-3 border-0">
        <div class="lead fw-bold">
            <i class="bi-book"></i>
            ${capacitacao["titulo"]}
        </div>
        <p class="light">
            <span class="text-primary">(${capacitacao["periodo"]})</span>
            ${capacitacao["descricao"]}
        </p>
   </li>`
}

function criarConquistas(conquista) {
    return `
    <li class="list-group-item bg-escuro p-0 text-light mt-3 border-0">
        <div class="lead fw-bold">
            <i class="bi-trophy"></i>
            ${conquista["titulo"]}
        </div>
        <p class="light">
            <span class="text-primary">(${conquista["periodo"]})</span>
            ${conquista["descricao"]}
        </p>
   </li>`
}

function criarEducacao(educacao) {
    let data = `
    <li class="list-group-item bg-escuro p-0 text-light mt-3 border-0">
        <div class="lead fw-bold">
            <i class="bi bi-mortarboard"></i>
            ${educacao["instituicao"]}
        </div>
        <ul><li>
        <div class="lead fw-bold">
            <span class="text-primary">(${educacao["periodo"]})</span>
            ${educacao["titulo"]}
        </div>
        <ul class="">
    `
    for (let i in educacao["topicos"]) {
        let topico = educacao["topicos"][i]
        data += `<li class="bg-escuro p-0 text-light mt-3 border-0">${topico}</li>`
    }
    data += `</ul></li></ul></li>`

    return data
}

function init(data) {
    let projetosAndroidPublicados = document.getElementById("projetosAndroidPublicados")
    let projetosWebPublicados = document.getElementById("projetosWebPublicados")
    let projetosDestaque = document.getElementById("projetosDestaque")
    let diretorioProjetos = document.getElementById("diretorioProjetos")

    let listaExperiencias = document.getElementById("listaExperiencias")
    let listaHabilidades = document.getElementById("listaHabilidades")
    let listaCapacitacoes = document.getElementById("listaCapacitacoes")
    let listaConquistas = document.getElementById("listaConquistas")
    let listaEducacao = document.getElementById("listaEducacao")

    data["projetos"].sort((a, b) => a["data"] > b["data"] ? -1 : 1)
    let array_obsoleto = []
    let array_projetos = []

    for (let i in data["projetos"]) {
        let item = data["projetos"][i]
        if (item["arquivado"])
            array_obsoleto.push(item)
        else
            array_projetos.push(item)
    }

    array_obsoleto.forEach((item) => {
        array_projetos.push(item)
    })

    array_projetos.forEach((item, i) => {
        if (item["destaque"]) {
            projetosDestaque.innerHTML += criarCard(item)
        }

        if (item["publicado"]) {
            if (item["tipo"] === "app") {
                projetosAndroidPublicados.innerHTML += criarCard(item)
            }

            if (item["tipo"] === "web") {
                projetosWebPublicados.innerHTML += criarCard(item)
            }
        }

        diretorioProjetos.innerHTML += criarCard(item)
    })

    data["experiencias"].forEach((item, i) => {
        listaExperiencias.innerHTML += criarExperiencia(item)
    })

    data["habilidades"].forEach((item, i) => {
        if (item["tecnologia"] || item["softSkill"])
            listaHabilidades.innerHTML += criarHabilidades(item)
    })

    data["capacitacoes"].forEach((item, i) => {
        listaCapacitacoes.innerHTML += criarCapacitacoes(item)
    })

    data["conquistas"].forEach((item, i) => {
        listaConquistas.innerHTML += criarConquistas(item)
    })

    data["educacao"].forEach((item, i) => {
        listaEducacao.innerHTML += criarEducacao(item)
    })
}
