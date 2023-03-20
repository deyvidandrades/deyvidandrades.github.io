let DATA_HOJE = ''

function _carregarTarefas() {
  let dados = JSON.parse(localStorage.getItem("tarefas"))
  return dados? dados: JSON.parse(`{"${DATA_HOJE}": []}`)
}

function _salvarTarefas(dados) {
  localStorage.setItem("tarefas", JSON.stringify(dados))

  atualizarUI()
}

function adicionarTarefa(titulo){
  let tarefas = _carregarTarefas()

  tarefas[DATA_HOJE].push({
    "titulo": titulo,
    "data": Math.floor(Date.now() / 1000),
    "status": false
  })

  _salvarTarefas(tarefas)
}

function removerTarefa(id){
  var tarefas = _carregarTarefas()

  let array = []
  for(dia in tarefas){
    for (var i in tarefas[dia]){
      if (tarefas[dia][i].data != id)
      array.push(tarefas[dia][i])
    }
  }

  tarefas[dia] = array

  _salvarTarefas(tarefas)
}

function getTarefasHoje() {
  if (_carregarTarefas()[DATA_HOJE]) {
    return _carregarTarefas()[DATA_HOJE].sort((a,b) => a.status - b.status)
  }else{
    return []
  }
}

function getTarefasDia(dia) {
  if (_carregarTarefas()[dia]) {
    return _carregarTarefas()[dia].sort((a,b) => a.status - b.status)
  }else{
    return []
  }
}

function getDays() {
  let arrayDias = []
  for (var dia in _carregarTarefas()) {
    arrayDias.push(dia)
  }
  return arrayDias.sort()
}

function mudarStatus(id){
  let tarefas = _carregarTarefas()

  for (dia in tarefas){
    let tarefa = tarefas[dia]

    for (i in tarefa){
      if(tarefa[i].data == id){
        tarefas[dia][i].status = tarefas[dia][i].status? false: true
      }
    }
  }

  _salvarTarefas(tarefas)
}

function mudarData(sinal){
  let dia_index = 0
  let dias = getDays()
  console.log(dias);

  dias.forEach((item, i) => {
    if (item == DATA_HOJE) {
      dia_index = i
    }
  });

  console.log(dia_index);

  if (sinal == '+'){
    DATA_HOJE = dias[dia_index < dias.length-1? dia_index + 1 : 0]
  }else{
    DATA_HOJE = dias[dia_index > 0? dia_index - 1 : dias.length -1]
  }

  console.log(DATA_HOJE);
  atualizarUI()
}

function atualizarUI() {
  let tarefas = document.getElementById("tarefas");
  tarefas.innerHTML = ''

  getTarefasDia(DATA_HOJE).forEach((item, i) => {
    tarefas.innerHTML+= `
    <div class="px-3 py-2 bg-dark shadow-sm rounded-3 d-flex mt-2 justify-content-between">
    <div class="" role="button" onClick="mudarStatus(${item.data});">
    <i class="bi bi-${item.status?'check-square text-muted': 'square'} me-2 my-auto"></i>
    <span class="text-light m-0 fs-5 text-capitalize ${item.status? 'text-decoration-line-through text-muted': ''}" id="tarefa-${item.data}" value="">${item.titulo}</span>
    </div>
    <div class="my-auto">
    <i role="button" class="bi bi-x-lg ${item.status? 'text-muted': ''}" onClick="removerTarefa(${item.data})"></i>
    </div>
    </div>`
  });


  document.getElementById('count').innerHTML = getTarefasHoje().length >=1? `Você tem só mais ${getTarefasHoje().length} tarefas para terminar 🚀` : ''

  let nova_data = DATA_HOJE.split('-')
  let arrayMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  document.getElementById('data').innerHTML = `${nova_data[0]} de ${arrayMes[nova_data[1] - 1]} de ${nova_data[2]}`
}

function exportar() {
  let tarefas = _carregarTarefas()
  console.log(tarefas);
  let markdown = ``

  for (dia in tarefas){
    markdown += `#${dia}\n## Tarefas \n`

    for(i in tarefas[dia]){
      let tarefa = tarefas[dia][i]

      markdown += `- [${tarefa.status? 'x': ' '}] ${tarefa.titulo.charAt(0).toUpperCase() + tarefa.titulo.slice(1)}\n`
    }
    markdown += `\n`

    tarefas[dia]
  }

  let a = document.createElement('a');
  a.href = "data:application/octet-stream,"+encodeURIComponent(markdown);
  a.download = `backup-tarefas-${DATA_HOJE}.md`;
  a.click();
}


window.onload = (event) => {
  DATA_HOJE = new Date().toLocaleString().split(',')[0].replaceAll("/", '-')
  atualizarUI()
  document.getElementById("addTarefa").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();

      if(this.value.length > 3){
        adicionarTarefa(this.value)
        this.value = ""
      }
    }
  });

  //
  // let data = encrypt(JSON.stringify({"player":carregarDados()}));
  //
  //     let a = document.createElement('a');
  //     a.href = "data:application/octet-stream,"+encodeURIComponent(data);
  //     a.download = 'nomees_dia-'+STATS.dia+'.save';
  //     a.click();
};
//addTarefa("teste")
//removerTarefa("20-03-2023",1679323550)
