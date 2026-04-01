const amigas = [
  {
    nome: "Bruna",
    imagem: "https://i.pinimg.com/236x/d8/ba/8a/d8ba8a1b747682d7a91a76fedf7660b0.jpg",
  },
  {
    nome: "Esther",
    imagem: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Nina",
    imagem: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=400&q=80",
  },
  {
    nome: "Maita",
    imagem: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
];

const historias = [
  {
    titulo: "A Companheira dos Momentos Loucos",
    texto: "Quem sempre te faz rir até a barriga doer e transforma qualquer dia comum em aventura?",
    respostaCorreta: "Bruna",
    videoUrl: "/assets/videos/fase3/bruna.mp4",
  },
  {
    titulo: "A Conselheira de Coração Gigante",
    texto: "Quem sempre te escuta com carinho e te dá os melhores conselhos quando você mais precisa?",
    respostaCorreta: "Esther",
    videoUrl: "/assets/videos/fase3/esther.mp4",
  },
  {
    titulo: "A Amiga das Memórias Inesquecíveis",
    texto: "Quem esteve em momentos especiais e sempre deixa tudo mais leve e divertido?",
    respostaCorreta: "Nina",
    videoUrl: "/assets/videos/fase3/nina.mp4",
  },
  {
    titulo: "A Presença que Aquece o Dia",
    texto: "Quem com um abraço ou uma mensagem já consegue melhorar seu dia na hora?",
    respostaCorreta: "Maita",
    videoUrl: "/assets/videos/fase3/maita.mp4",
  },
];

const barraPreenchida = document.querySelector(".preenchido");
const textoProgresso = document.querySelector("#progresso p");
const tituloPergunta = document.querySelector("#pergunta h2");
const descricaoPergunta = document.querySelector("#pergunta p");
const areaOpcoes = document.getElementById("opcoes");

let indicePerguntaAtual = 0;
let processandoResposta = false;

function atualizarProgresso() {
  const total = historias.length;
  const respondidas = indicePerguntaAtual;
  const percentual = (respondidas / total) * 100;

  barraPreenchida.style.width = `${percentual}%`;
  textoProgresso.innerText = `${respondidas} de ${total}`;
}

function renderizarPerguntaAtual() {
  const perguntaAtual = historias[indicePerguntaAtual];

  tituloPergunta.innerText = perguntaAtual.titulo;
  descricaoPergunta.innerText = perguntaAtual.texto;
  areaOpcoes.innerHTML = "";

  amigas.forEach((amiga) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.nome = amiga.nome;

    const imagem = document.createElement("img");
    imagem.src = amiga.imagem;
    imagem.alt = amiga.nome;

    const nome = document.createElement("p");
    nome.innerText = amiga.nome;

    card.appendChild(imagem);
    card.appendChild(nome);

    card.addEventListener("click", () => conferirResposta(amiga.nome));
    areaOpcoes.appendChild(card);
  });
}

async function mostrarVideoDaAmiga(nomeAmiga, videoUrl) {
  if (!window.Swal) {
    return;
  }

  await window.Swal.fire({
    title: `💖 Mensagem da ${nomeAmiga}`,
    html: `
      <video controls autoplay style="width: 100%; max-height: 420px; border-radius: 12px; background: #000;">
        <source src="${videoUrl}" type="video/mp4">
        Seu navegador não suporta vídeo.
      </video>
    `,
    width: 700,
    confirmButtonText: "Continuar",
    confirmButtonColor: "#ff3c8c",
    allowOutsideClick: false,
  });
}

async function concluirFase3() {
  const usuarioLogado = carregarInformacoesDoUsuarioLogado();

  await fetchPost(`/api/fases/${encodeURIComponent(usuarioLogado.email)}/concluir`, {
    numeroFase: 3,
  });
}

async function conferirResposta(respostaSelecionada) {
  if (processandoResposta) {
    return;
  }

  const perguntaAtual = historias[indicePerguntaAtual];

  if (respostaSelecionada !== perguntaAtual.respostaCorreta) {
    await mostrarErro("Resposta incorreta. Tente novamente 💛", "Resposta incorreta");
    return;
  }

  processandoResposta = true;

  try {
    await mostrarVideoDaAmiga(perguntaAtual.respostaCorreta, perguntaAtual.videoUrl);

    indicePerguntaAtual += 1;
    atualizarProgresso();

    if (indicePerguntaAtual >= historias.length) {
      await concluirFase3();
      barraPreenchida.style.width = "100%";
      textoProgresso.innerText = `${historias.length} de ${historias.length}`;
      await mostrarSucesso("Fase 3 concluída com sucesso! 🎉", "Parabéns");
      window.location.href = "../mapa/mapa.html";
      return;
    }

    renderizarPerguntaAtual();
  } catch (erro) {
    await mostrarErro("Não foi possível avançar agora. Tente novamente.");
  } finally {
    processandoResposta = false;
  }
}

atualizarProgresso();
renderizarPerguntaAtual();
