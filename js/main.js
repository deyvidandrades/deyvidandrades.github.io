let DATA = {}

fetch("data/data.json")
.then(response => response.json())
.then(json => init(json));

function criarCard(projeto){
  let wip = `<div class="d-flex mt-2"><div class="border px-2 me-2 rounded">${projeto.tipo}</div><div class="border px-2 rounded">${projeto.tecnologia}</div></div>`
  let links = ``

  if (projeto.wip){
    wip += `<div class="d-flex mt-2"><div class="border px-2 rounded">Em Desenvolvimento</div></div>`
  }

  if (projeto.url != ""){
    links += `<a class="link-light me-3" href="${projeto.url}" target="_blank"><i class="bi bi-fw bi-globe2"></i></a>`
  }

  if (projeto.url_github != ""){
    links += `<a class="link-light" href="${projeto.url_github}" target="_blank"><i class="bi bi-fw bi-github"></i></a>`
  }

  let html = `
  <!--${projeto.nome}-->
  <div class="col p-2">
  <div class="bg-dark rounded shadow p-0 projeto h-100">
  <img class="img img-fluid center-crop rounded-5-top" src="${projeto.url_capa}" alt="Capa do projeto ${projeto.nome}">
  <div class="card-body p-4">
  ${links}
  <p class="fw-bold my-2">${projeto.nome}</p>
  <p>${projeto.descricao}</p>
  ${wip}
  </div>
  </div>
  </div>
  `

  return html
}

function init(data){
  let projetosAndroidPublicados = document.getElementById("projetosAndroidPublicados")
  let projetosWebPublicados = document.getElementById("projetosWebPublicados")
  let projetosDestaque = document.getElementById("projetosDestaque")
  let diretorioProjetos = document.getElementById("diretorioProjetos")

  data.projetos.forEach((item, i) => {
    //CARREGAR PROEJTOS PUBLICADOS
    if (item.publicado){
      if (item.tipo == "app") {
        projetosAndroidPublicados.innerHTML += criarCard(item)
      }

      if (item.tipo == "web") {
        projetosWebPublicados.innerHTML += criarCard(item)
      }

      if (item.destaque){
        projetosDestaque.innerHTML += criarCard(item)
      }
    }else{
      diretorioProjetos.innerHTML += criarCard(item)

    }

  });
}
