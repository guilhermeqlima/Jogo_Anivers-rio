const palavrasCruzadas = [
  {
    palavra: "POLLY",
    direcao: "horizontal",
    inicio: { linha: 10, coluna: 1 },
    dica: "Ela veio até você em uma caixa de sapato",
    numero: 1,
  },
  {
    palavra: "LACO",
    direcao: "vertical",
    inicio: { linha: 7, coluna: 2 },
    dica: "O item que você mais gosta de usar no cabelo",
    numero: 2,
  },
  {
    palavra: "LIVROS",
    direcao: "horizontal",
    inicio: { linha: 1, coluna: 2 },
    dica: "Uma presença especial que marca a históriaS",
    numero: 3,
  },
  {
    palavra: "SUELLEN",
    direcao: "vertical",
    inicio: { linha: 1, coluna: 7 },
    dica: "Sua melhor amiga e a pessoa que te criou",
    numero: 4,
  },
  {
    palavra: "LEANDRO",
    direcao: "horizontal",
    inicio: { linha: 4, coluna: 7 },
    dica: "A pessoa que vive falando 'segue o mestre'",
    numero: 5,
  },
  {
    palavra: "FRANCINY",
    direcao: "vertical",
    inicio: { linha: 3, coluna: 5
     },
    dica: "Sua marca de gloss favorita",
    numero: 6,
  },
  {
    palavra: "BRUNOMARS",
    direcao: "vertical",
    inicio: { linha: 3, coluna: 12 },
    dica: "Nome do cantor do nosso primeiro show internacional juntos",
    numero: 7,
  },
  {
    palavra: "BELAEAFERA",
    direcao: "horizontal",
    inicio: { linha: 12, coluna: 1 },
    dica: "Nome do seu filme favorito",
    numero: 8,
  },
  {
    palavra: "CLARICE",
    direcao: "vertical",
    inicio: { linha: 3, coluna: 9 },
    dica: "O primeiro nome da mãe de todas as mulheres",
    numero: 9,
  },
];

const gradeEl = document.getElementById("grade");
const listaHorizontaisEl = document.getElementById("lista-horizontais");
const listaVerticaisEl = document.getElementById("lista-verticais");
const textoProgressoEl = document.getElementById("texto-progresso");
const percentualProgressoEl = document.getElementById("percentual-progresso");
const barraInternaEl = document.getElementById("barra-interna");
const inputPalavraEl = document.getElementById("input-palavra");
const botaoValidarPalavraEl = document.getElementById("btn-validar-palavra");
const botaoConcluir = document.getElementById("btn-concluir");
const statusEl = document.getElementById("status");

const mapaCelulas = new Map();
const palavrasProcessadas = palavrasCruzadas.map((item, index) => ({
  ...item,
  numero: index + 1,
  letras: normalizarTexto(item.palavra).split(""),
  posicoes: [],
  concluida: false,
}));

let celulasCorretas = 0;
let palavraAtivaNumero = null;
let totalColunasGrade = 0;

document.addEventListener("DOMContentLoaded", iniciarFase5);

function iniciarFase5() {
  montarEstruturaDaGrade();
  renderizarGrade();
  renderizarDicas();
  atualizarProgresso();

  botaoValidarPalavraEl.addEventListener("click", validarPalavraDigitada);
  inputPalavraEl.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      validarPalavraDigitada();
    }
  });

  botaoConcluir.addEventListener("click", concluirFase5);

  selecionarPrimeiraPendente();

  window.addEventListener("resize", () => {
    ajustarTamanhoDasCelulas(totalColunasGrade);
  });
}

function montarEstruturaDaGrade() {
  palavrasProcessadas.forEach((item) => {
    item.letras.forEach((letra, deslocamento) => {
      const linha = item.inicio.linha + (item.direcao === "vertical" ? deslocamento : 0);
      const coluna = item.inicio.coluna + (item.direcao === "horizontal" ? deslocamento : 0);
      const chave = `${linha},${coluna}`;

      if (!mapaCelulas.has(chave)) {
        mapaCelulas.set(chave, {
          linha,
          coluna,
          letra,
          entradas: [],
          inicioDe: [],
          letraEl: null,
          elemento: null,
        });
      } else {
        const existente = mapaCelulas.get(chave);
        if (existente.letra !== letra) {
          console.warn(`Conflito na celula ${chave}: ${existente.letra} x ${letra}`);
        }
      }

      const celula = mapaCelulas.get(chave);
      celula.entradas.push(item.numero);
      if (deslocamento === 0) {
        celula.inicioDe.push(item.numero);
      }

      item.posicoes.push(chave);
    });
  });
}

function renderizarGrade() {
  const linhas = [...mapaCelulas.values()].map((c) => c.linha);
  const colunas = [...mapaCelulas.values()].map((c) => c.coluna);

  const menorLinha = Math.min(...linhas);
  const maiorLinha = Math.max(...linhas);
  const menorColuna = Math.min(...colunas);
  const maiorColuna = Math.max(...colunas);

  const totalLinhas = maiorLinha - menorLinha + 1;
  const totalColunas = maiorColuna - menorColuna + 1;
  totalColunasGrade = totalColunas;

  gradeEl.style.gridTemplateColumns = `repeat(${totalColunas}, var(--tamanho-celula))`;
  ajustarTamanhoDasCelulas(totalColunas);
  gradeEl.innerHTML = "";

  for (let linha = menorLinha; linha <= maiorLinha; linha += 1) {
    for (let coluna = menorColuna; coluna <= maiorColuna; coluna += 1) {
      const chave = `${linha},${coluna}`;
      const celula = mapaCelulas.get(chave);

      if (!celula) {
        const vazio = document.createElement("div");
        vazio.style.width = "var(--tamanho-celula)";
        vazio.style.height = "var(--tamanho-celula)";
        gradeEl.appendChild(vazio);
        continue;
      }

      const celulaEl = document.createElement("div");
      celulaEl.className = "celula";
      celulaEl.dataset.chave = chave;

      if (celula.inicioDe.length) {
        const numeroEl = document.createElement("span");
        numeroEl.className = "celula-numero";
        numeroEl.textContent = String(Math.min(...celula.inicioDe));
        celulaEl.appendChild(numeroEl);
      }

      const letraEl = document.createElement("span");
      letraEl.className = "celula-letra";
      letraEl.textContent = "";

      celula.letraEl = letraEl;
      celula.elemento = celulaEl;
      celulaEl.appendChild(letraEl);
      gradeEl.appendChild(celulaEl);
    }
  }
}

function ajustarTamanhoDasCelulas(totalColunas) {
  if (!totalColunas) return;

  const painel = document.getElementById("painel-tabuleiro");
  if (!painel) return;

  const larguraDisponivel = painel.clientWidth - 16;
  const tamanho = Math.max(20, Math.min(34, Math.floor(larguraDisponivel / totalColunas)));
  gradeEl.style.setProperty("--tamanho-celula", `${tamanho}px`);
}

function renderizarDicas() {
  listaHorizontaisEl.innerHTML = "";
  listaVerticaisEl.innerHTML = "";

  palavrasProcessadas.forEach((item) => {
    const dicaEl = document.createElement("div");
    dicaEl.className = "dica-item";
    dicaEl.id = `dica-${item.numero}`;

    dicaEl.innerHTML = `
      <span class="dica-numero">${item.numero}</span>
      <span>${item.dica}</span>
    `;

    dicaEl.addEventListener("click", () => selecionarPalavra(item.numero));

    if (item.direcao === "horizontal") {
      listaHorizontaisEl.appendChild(dicaEl);
    } else {
      listaVerticaisEl.appendChild(dicaEl);
    }
  });
}

function atualizarProgresso() {
  celulasCorretas = 0;

  palavrasProcessadas.forEach((item) => {
    const estaCorreta = item.concluida === true;

    const dicaEl = document.getElementById(`dica-${item.numero}`);
    if (dicaEl) {
      dicaEl.classList.toggle("concluida", estaCorreta);
    }

    if (estaCorreta) {
      celulasCorretas += 1;
    }
  });

  const total = palavrasProcessadas.length;
  const percentual = Math.round((celulasCorretas / total) * 100);
  const horizontaisPendentes = palavrasProcessadas.filter((item) => item.direcao === "horizontal" && !item.concluida).length;
  const verticaisPendentes = palavrasProcessadas.filter((item) => item.direcao === "vertical" && !item.concluida).length;

  textoProgressoEl.textContent = `Progresso: ${celulasCorretas} / ${total} palavras | H: ${horizontaisPendentes} | V: ${verticaisPendentes}`;
  percentualProgressoEl.textContent = `${percentual}%`;
  barraInternaEl.style.width = `${percentual}%`;

  const completo = celulasCorretas === total;
  botaoConcluir.disabled = !completo;
  botaoConcluir.textContent = completo ? "✅ Concluir Fase 5" : "🔒 Complete todas as palavras";

  statusEl.textContent = completo
    ? "Tudo certo! Agora voce ja pode concluir a fase."
    : "Clique em uma dica, digite a palavra e valide para preencher.";

  if (completo) {
    inputPalavraEl.disabled = true;
    botaoValidarPalavraEl.disabled = true;
  }
}

function validarPalavraDigitada() {
  const tentativa = normalizarTexto(inputPalavraEl.value);

  if (!tentativa) {
    statusEl.textContent = "Digite uma palavra antes de validar.";
    return;
  }

  // Procura a palavra digitada em TODAS as palavras pendentes
  const palavraEncontrada = palavrasProcessadas.find((item) => 
    !item.concluida && tentativa === normalizarTexto(item.palavra)
  );

  if (!palavraEncontrada) {
    inputPalavraEl.classList.add("input-erro");
    setTimeout(() => inputPalavraEl.classList.remove("input-erro"), 500);
    statusEl.textContent = "Essa palavra não está entre as pendentes. Tente outra.";
    inputPalavraEl.select();
    return;
  }

  preencherPalavraNoTabuleiro(palavraEncontrada);
  palavraEncontrada.concluida = true;
  inputPalavraEl.value = "";
  atualizarProgresso();
  statusEl.textContent = `Boa! A palavra ${palavraEncontrada.palavra} foi preenchida.`;

  selecionarPrimeiraPendente();
}

function preencherPalavraNoTabuleiro(item) {
  item.posicoes.forEach((chave, indice) => {
    const celula = mapaCelulas.get(chave);
    const celulaEl = gradeEl.querySelector(`[data-chave="${chave}"]`);

    if (celula?.letraEl) {
      celula.letraEl.textContent = item.letras[indice];
    }

    if (celulaEl) {
      celulaEl.classList.add("preenchida");
      // Se for espaço na palavra original, marca como bloqueado (preto)
      if (item.palavra[indice] === " ") {
        celulaEl.classList.add("espaco-bloqueado");
      }
    }
  });
}

function selecionarPalavra(numero) {
  palavraAtivaNumero = numero;

  palavrasProcessadas.forEach((item) => {
    const dicaEl = document.getElementById(`dica-${item.numero}`);
    if (dicaEl) {
      dicaEl.classList.toggle("ativa", item.numero === numero);
    }

    item.posicoes.forEach((chave) => {
      const celula = mapaCelulas.get(chave);
      if (celula?.elemento) {
        celula.elemento.classList.toggle("ativa", item.numero === numero);
      }
    });
  });

  const itemAtivo = palavrasProcessadas.find((item) => item.numero === numero);
  if (itemAtivo) {
    inputPalavraEl.placeholder = `Dica ${itemAtivo.numero}: digite a palavra`;
    inputPalavraEl.focus();
  }
}

function selecionarPrimeiraPendente() {
  const proxima = palavrasProcessadas.find((item) => !item.concluida);

  if (proxima) {
    selecionarPalavra(proxima.numero);
    return;
  }

  palavraAtivaNumero = null;
}

async function concluirFase5() {
  if (celulasCorretas !== palavrasProcessadas.length) {
    await mostrarAviso("Ainda faltam palavras para completar corretamente.");
    return;
  }

  const usuario = carregarInformacoesDoUsuarioLogado();
  botaoConcluir.disabled = true;
  statusEl.textContent = "Concluindo fase...";

  try {
    await fetchPost(`/api/fases/${encodeURIComponent(usuario.email)}/concluir`, {
      numeroFase: 5,
    });

    registrarConclusaoDeFase(5, usuario.email);
    await celebrarConclusaoDaFase(5);
    window.location.href = "../mapa/mapa.html";
  } catch (erro) {
    statusEl.textContent = "Nao foi possivel concluir agora.";
    botaoConcluir.disabled = false;
  }
}

function normalizarTexto(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}
