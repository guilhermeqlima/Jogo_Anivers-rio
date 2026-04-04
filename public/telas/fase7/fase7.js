const botaoConcluir = document.getElementById("btn-concluir");
const status = document.getElementById("status");

botaoConcluir.addEventListener("click", async () => {
  const usuario = carregarInformacoesDoUsuarioLogado();

  botaoConcluir.disabled = true;
  status.textContent = "Concluindo fase...";

  try {
    await fetchPost(`/api/fases/${encodeURIComponent(usuario.email)}/concluir`, {
      numeroFase: 7,
    });

    registrarConclusaoDeFase(7, usuario.email);
    status.textContent = "Fase 7 concluida com sucesso!";
    await celebrarConclusaoDaFase(7);
    window.location.href = "../mapa/mapa.html";
  } catch (erro) {
    status.textContent = "Nao foi possivel concluir agora.";
    botaoConcluir.disabled = false;
  }
});
