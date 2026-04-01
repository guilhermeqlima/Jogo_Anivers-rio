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


function carregarInformacoesDoUsuarioLogado(){
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if(!usuarioLogado){
    mostrarAviso("Nenhum usuário logado. Redirecionando para a tela de login.");
    window.location.href = "/telas/login/login.html";
  }

  return usuarioLogado
}


