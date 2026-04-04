function voltarMapa() {
  window.location.href = "/telas/mapa/mapa.html";
}

function exibirModal(icon, title, text) {
  if (window.Swal) {
    return window.Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#ff3c8c",
    });
  }

  alert(text || title);
  return Promise.resolve();
}

function mostrarSucesso(mensagem, titulo = "Sucesso") {
  return exibirModal("success", titulo, mensagem);
}

function mostrarErro(mensagem, titulo = "Ops") {
  return exibirModal("error", titulo, mensagem);
}

function mostrarAviso(mensagem, titulo = "Atenção") {
  return exibirModal("warning", titulo, mensagem);
}

const MEDALHAS_POR_FASE = [
  { numero: 1, icone: "\ud83d\udd10", nome: "Chave do Coracao" },
  { numero: 2, icone: "\ud83c\udf39", nome: "Rosa da Fase 2" },
  { numero: 3, icone: "\ud83e\udd1d", nome: "Laco da Amizade" },
  { numero: 4, icone: "\ud83d\udcda", nome: "Livro das Memorias" },
  { numero: 5, icone: "\ud83e\udde9", nome: "Quebra-cabeca do Amor" },
  { numero: 6, icone: "\ud83c\udf82", nome: "Aniversario Perfeito" },
  { numero: 7, icone: "\ud83d\udc51", nome: "Tesouro Final" },
];

function obterConfiguracaoMedalhas() {
  return MEDALHAS_POR_FASE.slice();
}

function obterChaveMedalhas(email) {
  const emailNormalizado = String(email || "").trim().toLowerCase();
  return `medalhasConquistadas:${emailNormalizado}`;
}

function listarMedalhasConquistadas(email) {
  const chave = obterChaveMedalhas(email);
  const valorSalvo = localStorage.getItem(chave);

  if (!valorSalvo) {
    return [];
  }

  try {
    const lista = JSON.parse(valorSalvo);
    if (!Array.isArray(lista)) {
      return [];
    }

    return lista
      .map((numero) => Number(numero))
      .filter((numero) => Number.isInteger(numero) && numero >= 1);
  } catch (erro) {
    console.warn("Nao foi possivel ler medalhas salvas:", erro);
    return [];
  }
}

function registrarConclusaoDeFase(numeroFase, email) {
  const faseNumero = Number(numeroFase);

  if (!Number.isInteger(faseNumero) || faseNumero < 1) {
    return;
  }

  const usuarioAtual = email
    ? { email }
    : JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  if (!usuarioAtual?.email) {
    return;
  }

  const medalhas = new Set(listarMedalhasConquistadas(usuarioAtual.email));
  medalhas.add(faseNumero);
  localStorage.setItem(obterChaveMedalhas(usuarioAtual.email), JSON.stringify([...medalhas].sort((a, b) => a - b)));
}

async function celebrarConclusaoDaFase(numeroFase) {
  const faseNumero = Number(numeroFase);
  const medalha = MEDALHAS_POR_FASE.find((item) => item.numero === faseNumero);
  const iconeMedalha = medalha?.icone || "\ud83c\udf96\ufe0f";
  const nomeMedalha = medalha?.nome || `Medalha da Fase ${faseNumero}`;

  if (window.Swal) {
    return window.Swal.fire({
      icon: "success",
      title: `Fase ${faseNumero} concluida!`,
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div style="font-size:48px;line-height:1;">${iconeMedalha}</div>
          <div>Voce conquistou a medalha <b>${nomeMedalha}</b>.</div>
          <div style="font-size:13px;color:#666;">Ela ja esta aparecendo no topo do mapa.</div>
        </div>
      `,
      confirmButtonText: "Ver no mapa",
      confirmButtonColor: "#ff3c8c",
      allowOutsideClick: false,
    });
  }

  alert(`Parabens! Fase ${faseNumero} concluida. Medalha: ${nomeMedalha}`);
  return Promise.resolve();
}

async function confirmarAcao(mensagem, titulo = "Confirmação") {
  if (window.Swal) {
    const resposta = await window.Swal.fire({
      icon: "question",
      title: titulo,
      text: mensagem,
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      confirmButtonColor: "#ff3c8c",
      cancelButtonColor: "#888",
    });

    return resposta.isConfirmed;
  }

  return confirm(mensagem);
}

window.mostrarSucesso = mostrarSucesso;
window.mostrarErro = mostrarErro;
window.mostrarAviso = mostrarAviso;
window.confirmarAcao = confirmarAcao;
window.obterConfiguracaoMedalhas = obterConfiguracaoMedalhas;
window.listarMedalhasConquistadas = listarMedalhasConquistadas;
window.registrarConclusaoDeFase = registrarConclusaoDeFase;
window.celebrarConclusaoDaFase = celebrarConclusaoDaFase;


function carregarInformacoesDoUsuarioLogado(){
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if(!usuarioLogado){
    mostrarAviso("Nenhum usuário logado. Redirecionando para a tela de login.");
    window.location.href = "/telas/login/login.html";
  }

  return usuarioLogado
}


