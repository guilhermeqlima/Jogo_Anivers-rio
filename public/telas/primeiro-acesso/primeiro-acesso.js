const botaoContinuar = document.getElementById("botaoContinuar");
const statusPrimeiroAcesso = document.getElementById("statusPrimeiroAcesso");
const videoPrimeiroAcesso = document.getElementById("videoPrimeiroAcesso");
const avisoVideo = document.getElementById("avisoVideo");

function redirecionarParaMapa() {
  window.location.href = "/telas/mapa/mapa.html";
}

function obterUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
}

function prepararTela() {
  const usuario = obterUsuarioLogado();

  if (!usuario?.email) {
    window.location.href = "/telas/login/login.html";
    return;
  }

  if (!usuario.primeiro_acesso) {
    redirecionarParaMapa();
    return;
  }

  if (videoPrimeiroAcesso) {
    videoPrimeiroAcesso.addEventListener("error", () => {
      avisoVideo.hidden = false;
    });
  }
}

async function concluirPrimeiroAcesso() {
  const usuario = obterUsuarioLogado();

  if (!usuario?.email) {
    window.location.href = "/telas/login/login.html";
    return;
  }

  botaoContinuar.disabled = true;
  statusPrimeiroAcesso.textContent = "Preparando o mapa...";

  try {
    await fetchPost(`/api/usuarios/${encodeURIComponent(usuario.email)}/primeiro-acesso/concluir`, {});

    const usuarioAtualizado = {
      ...usuario,
      primeiro_acesso: false,
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
    redirecionarParaMapa();
  } catch (erro) {
    console.error("Erro ao concluir primeiro acesso:", erro);
    statusPrimeiroAcesso.textContent = "Nao foi possivel concluir agora. Tente novamente.";
    botaoContinuar.disabled = false;
  }
}

botaoContinuar.addEventListener("click", concluirPrimeiroAcesso);
document.addEventListener("DOMContentLoaded", prepararTela);
