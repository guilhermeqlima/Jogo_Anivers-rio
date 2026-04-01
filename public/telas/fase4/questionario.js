// Edite este array livremente para trocar perguntas, alternativas e resposta correta.
const perguntasQuizLivros = [
  {
    pergunta: "Em qual obra Machado de Assis criou a personagem Capitu?",
    alternativas: ["Memorias Postumas de Bras Cubas", "Dom Casmurro", "Quincas Borba", "Esau e Jaco"],
    respostaCorreta: 1,
  },
  {
    pergunta: "Quem escreveu Orgulho e Preconceito?",
    alternativas: ["Jane Austen", "Emily Bronte", "Virginia Woolf", "Louisa May Alcott"],
    respostaCorreta: 0,
  },
  {
    pergunta: "Qual destes livros tem como protagonista a personagem Anne Shirley?",
    alternativas: ["O Jardim Secreto", "Mulherzinhas", "Anne de Green Gables", "A Menina que Roubava Livros"],
    respostaCorreta: 2,
  },
  {
    pergunta: "Quem e o autor de 1984?",
    alternativas: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H. G. Wells"],
    respostaCorreta: 0,
  },
  {
    pergunta: "Qual livro comeca com a frase Era uma vez em um lugar muito distante...?",
    alternativas: ["O Hobbit", "As Cronicas de Narnia", "Cem Anos de Solidao", "O Pequeno Principe"],
    respostaCorreta: 1,
  },
  {
    pergunta: "Em O Pequeno Principe, o que e essencial?",
    alternativas: ["O que os olhos veem", "O que e invisivel aos olhos", "A riqueza material", "A distancia entre planetas"],
    respostaCorreta: 1,
  },
];

const minimoDeAcertosParaConcluir = 5;
const marcadoresAlternativas = ["A", "B", "C", "D"];

let indicePerguntaAtual = 0;
let indicesRespostasSelecionadas = [];
let totalDeAcertos = 0;

const elementoPergunta = document.getElementById("pergunta");
const elementoOpcoes = document.getElementById("opcoes");
const elementoTextoProgresso = document.getElementById("texto-progresso");
const elementoPercentual = document.getElementById("percentual-progresso");
const elementoBarra = document.getElementById("barra-progresso");
const elementoStatus = document.getElementById("status");
const botaoAnterior = document.getElementById("btn-anterior");
const botaoProxima = document.getElementById("btn-proxima");

document.addEventListener("DOMContentLoaded", iniciarQuizLivros);

function iniciarQuizLivros() {
  indicesRespostasSelecionadas = new Array(perguntasQuizLivros.length).fill(null);
  indicePerguntaAtual = 0;
  totalDeAcertos = 0;

  botaoAnterior.addEventListener("click", irParaPerguntaAnterior);
  botaoProxima.addEventListener("click", irParaProximaPergunta);

  renderizarPerguntaAtual();
}

function renderizarPerguntaAtual() {
  const perguntaAtual = perguntasQuizLivros[indicePerguntaAtual];
  const respostaJaSelecionada = indicesRespostasSelecionadas[indicePerguntaAtual];

  elementoPergunta.textContent = perguntaAtual.pergunta;
  elementoOpcoes.innerHTML = "";

  perguntaAtual.alternativas.forEach((alternativa, indiceAlternativa) => {
    const botaoOpcao = document.createElement("button");
    botaoOpcao.className = "opcao";
    botaoOpcao.type = "button";

    const marcador = document.createElement("span");
    marcador.className = "opcao-marcador";
    marcador.textContent = marcadoresAlternativas[indiceAlternativa] || "?";

    const texto = document.createElement("span");
    texto.textContent = alternativa;

    botaoOpcao.appendChild(marcador);
    botaoOpcao.appendChild(texto);

    if (respostaJaSelecionada === indiceAlternativa) {
      botaoOpcao.classList.add("selecionada");
    }

    botaoOpcao.addEventListener("click", () => selecionarResposta(indiceAlternativa));
    elementoOpcoes.appendChild(botaoOpcao);
  });

  atualizarStatusVisual();
}

function selecionarResposta(indiceAlternativa) {
  indicesRespostasSelecionadas[indicePerguntaAtual] = indiceAlternativa;
  recalcularAcertos();
  renderizarPerguntaAtual();
}

function irParaPerguntaAnterior() {
  if (indicePerguntaAtual === 0) {
    return;
  }

  indicePerguntaAtual -= 1;
  renderizarPerguntaAtual();
}

async function irParaProximaPergunta() {
  if (indicesRespostasSelecionadas[indicePerguntaAtual] === null) {
    await mostrarAviso("Escolha uma alternativa antes de continuar.");
    return;
  }

  if (indicePerguntaAtual < perguntasQuizLivros.length - 1) {
    indicePerguntaAtual += 1;
    renderizarPerguntaAtual();
    return;
  }

  await finalizarQuiz();
}

function atualizarStatusVisual() {
  const percentual = Math.round(((indicePerguntaAtual + 1) / perguntasQuizLivros.length) * 100);
  elementoTextoProgresso.textContent = `Pergunta ${indicePerguntaAtual + 1} de ${perguntasQuizLivros.length}`;
  elementoPercentual.textContent = `${percentual}%`;
  elementoBarra.style.width = `${percentual}%`;

  const respondidas = indicesRespostasSelecionadas.filter((resposta) => resposta !== null).length;
  elementoStatus.textContent = `Respondidas: ${respondidas}/${perguntasQuizLivros.length}`;

  botaoAnterior.disabled = indicePerguntaAtual === 0;
  botaoProxima.textContent = indicePerguntaAtual === perguntasQuizLivros.length - 1 ? "Finalizar" : "Proxima";
}

function recalcularAcertos() {
  totalDeAcertos = indicesRespostasSelecionadas.reduce((acumulado, respostaSelecionada, indicePergunta) => {
    if (respostaSelecionada === null) {
      return acumulado;
    }

    if (respostaSelecionada === perguntasQuizLivros[indicePergunta].respostaCorreta) {
      return acumulado + 1;
    }

    return acumulado;
  }, 0);
}

async function finalizarQuiz() {
  const indiceNaoRespondida = indicesRespostasSelecionadas.findIndex((resposta) => resposta === null);

  if (indiceNaoRespondida !== -1) {
    indicePerguntaAtual = indiceNaoRespondida;
    renderizarPerguntaAtual();
    await mostrarAviso("Responda todas as perguntas antes de finalizar.");
    return;
  }

  recalcularAcertos();

  if (totalDeAcertos >= minimoDeAcertosParaConcluir) {
    await concluirFase4NoServidor();
    await mostrarSucesso(
      `Voce acertou ${totalDeAcertos}/${perguntasQuizLivros.length} e concluiu a Fase 4!`,
      "Parabens"
    );
    window.location.href = "../mapa/mapa.html";
    return;
  }

  const desejaTentarNovamente = await confirmarAcao(
    `Voce acertou ${totalDeAcertos}/${perguntasQuizLivros.length}. Sao necessarios ${minimoDeAcertosParaConcluir} acertos para concluir. Deseja tentar novamente?`
  );

  if (desejaTentarNovamente) {
    reiniciarQuiz();
  }
}

function reiniciarQuiz() {
  indicesRespostasSelecionadas = new Array(perguntasQuizLivros.length).fill(null);
  indicePerguntaAtual = 0;
  totalDeAcertos = 0;
  renderizarPerguntaAtual();
}

async function concluirFase4NoServidor() {
  const usuario = carregarInformacoesDoUsuarioLogado();

  try {
    await fetchPost(`/api/fases/${encodeURIComponent(usuario.email)}/concluir`, {
      numeroFase: 4,
    });
  } catch (erro) {
    console.error("Erro ao concluir fase 4:", erro);
    throw erro;
  }
}
